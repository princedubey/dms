// src/app/upload/route.js
import awsS3 from "../../../../utils/awsS3";

export async function POST(req) {
  const file = await req.formData();
  const fileEntry = file.get("file");

  if (!fileEntry) {
    return new Response(JSON.stringify({ error: "No file uploaded." }), {
      status: 400,
    });
  }

  try {
    const data = await awsS3(fileEntry); // Pass the file to the upload function
    return new Response(
      JSON.stringify({
        success: true,
        message: "File uploaded successfully",
        url: data,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
