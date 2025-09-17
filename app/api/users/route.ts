import { NextRequest, NextResponse } from 'next/server'

// Mock data - in production, you'd use a database
const mockUsers = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", createdAt: "2024-01-01" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", createdAt: "2024-01-02" },
]

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(
      { users: mockUsers },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=60',
        },
      }
    )
  } catch (error) {
    console.error('Users GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    const newUser = {
      id: String(mockUsers.length + 1),
      name: body.name,
      email: body.email,
      createdAt: new Date().toISOString(),
    }

    // In production, you'd save to database here
    mockUsers.push(newUser)

    return NextResponse.json(
      { user: newUser },
      { 
        status: 201,
        headers: {
          'Cache-Control': 'no-cache',
        },
      }
    )
  } catch (error) {
    console.error('Users POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}