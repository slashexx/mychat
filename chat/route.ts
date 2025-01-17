import { NextResponse } from 'next/server';

const PYTHON_SERVER_URL = process.env.PYTHON_SERVER_URL || 'http://localhost:5000'; // Python API URL

// export const runtime = 'edge';
// Use edge runtime for faster responses

export async function POST(req: Request) {
  console.log('API Route: POST /api/chat');
  try {
    // Parse the user's message from the request body
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Prepare the payload to send to the Python backend
    const payload = { message };

    // Call the Python server
    const pythonResponse = await fetch(PYTHON_SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Handle Python server response
    if (!pythonResponse.ok) {
      const errorText = await pythonResponse.text();
      console.error('Python Server Error:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch response from Python server.' },
        { status: pythonResponse.status }
      );
    }

    const pythonData = await pythonResponse.json();
    const botReply = pythonData.response || 'No response from Python server.';

    // Return the response from the Python server
    console.log("Request payload:", payload);
    console.log("Response status:", pythonResponse.status);
    console.log("Response body:", await pythonResponse.text());

    return NextResponse.json({ response: botReply });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
