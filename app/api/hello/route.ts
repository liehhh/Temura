// This file creates the API endpoint: GET http://localhost:3000/api/hello

export async function GET() {
  return Response.json({
    message: "Hello from the API!",
    timestamp: new Date().toISOString()
  });
}

// You can also handle POST requests
export async function POST(request: Request) {
  const body = await request.json();

  return Response.json({
    message: "Data received!",
    data: body
  });
}
