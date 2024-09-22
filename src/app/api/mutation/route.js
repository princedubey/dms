export async function POST(req) {
  try {
    return new Response(
      JSON.stringify({
        success: true,
        message: "File sent successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
