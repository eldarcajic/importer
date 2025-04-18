import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const jsonData = await request.json();
    const response = await axios.post(
      'http://localhost:5000/validate',
      { tables: jsonData },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('API Error:', message);
    return NextResponse.json(
      { error: `Failed to validate data: ${message}` },
      { status: 500 },
    );
  }
}
