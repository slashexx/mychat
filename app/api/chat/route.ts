import { log } from 'console';
import { NextResponse } from 'next/server';

const PYTHON_SERVER_URL = process.env.PYTHON_SERVER_URL || 'http://127.0.0.1:5000/chat'; // Python API URL

export const runtime = 'edge';
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
      console.log("Sending request to Python server:", payload);
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

    // Read the response body as text first for logging purposes
    const responseBody = await pythonResponse.text();
    console.log("Response body:", responseBody);

    // Now parse the response as JSON
    const pythonData = JSON.parse(responseBody);  // You already have the response body as text
    const botReply = pythonData.response || 'No response from Python server.';

    // Return the response from the Python server
    return NextResponse.json({ response: botReply });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
