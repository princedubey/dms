// src/app/api/extraction/route.js
import { extractionValidationSchema } from "@/validations/validation";
import connectDB from "../../../../utils/db";
import Extraction from "../../../models/Extraction";

// Handle GET request to fetch all extractions
export async function GET(req) {
  await connectDB();

  try {
    const extractions = await Extraction.find()
      .sort({ createdAt: -1 })
      .limit(1);
    return new Response(
      JSON.stringify({
        success: true,
        message: "Data fetched successfully",
        data: extractions,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
    });
  }
}

// Handle PUT request to update extraction by ID
export async function PUT(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id"); // Extract the ID from the query parameters
  const updateData = await req.json(); // Extract the update data from the request body

  // Validate incoming data
  const { error } = extractionValidationSchema.validate(updateData);
  if (error) {
    return new Response(
      JSON.stringify({
        error: error.details[0].message,
      }),
      { status: 400 }
    );
  }

  try {
    const updatedExtraction = await Extraction.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedExtraction) {
      return new Response(JSON.stringify({ error: "Extraction not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Data updated successfully",
        data: updatedExtraction,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update data" }), {
      status: 500,
    });
  }
}

// Handle POST request to save new extraction
export async function POST(req) {
  await connectDB();

  const newExtractionData = await req.json(); // Extract the new extraction data from the request body

  // Validate incoming data
  const { error } = extractionValidationSchema.validate(newExtractionData);
  if (error) {
    return new Response(
      JSON.stringify({
        error: error.details[0].message, // Return the first validation error message
      }),
      { status: 400 }
    );
  }

  try {
    const newExtraction = new Extraction(newExtractionData); // Create a new instance of the Extraction model
    await newExtraction.save(); // Save it to the database

    return new Response(
      JSON.stringify({
        success: true,
        message: "Data saved successfully",
        data: newExtraction,
      }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to save data" }), {
      status: 500,
    });
  }
}
