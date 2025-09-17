import { NextRequest, NextResponse } from 'next/server'

// Mock data - in production, you'd use a database
const mockTodos = [
  { id: "1", userId: "1", title: "Deploy to Vercel", completed: true, createdAt: "2024-01-01" },
  { id: "2", userId: "1", title: "Add authentication", completed: false, createdAt: "2024-01-02" },
  { id: "3", userId: "2", title: "Setup database", completed: false, createdAt: "2024-01-03" },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const completed = searchParams.get('completed')
    
    let filteredTodos = mockTodos
    
    if (userId) {
      filteredTodos = filteredTodos.filter(t => t.userId === userId)
    }
    
    if (completed !== null) {
      filteredTodos = filteredTodos.filter(t => t.completed === (completed === 'true'))
    }
    
    return NextResponse.json(
      { todos: filteredTodos },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=60',
        },
      }
    )
  } catch (error) {
    console.error('Todos GET error:', error)
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
    if (!body.title || !body.userId) {
      return NextResponse.json(
        { error: 'Title and userId are required' },
        { status: 400 }
      )
    }
    
    const newTodo = {
      id: String(mockTodos.length + 1),
      userId: body.userId,
      title: body.title,
      completed: body.completed || false,
      createdAt: new Date().toISOString(),
    }
    
    // In production, you'd save to database here
    mockTodos.push(newTodo)
    
    return NextResponse.json(
      { todo: newTodo },
      { 
        status: 201,
        headers: {
          'Cache-Control': 'no-cache',
        },
      }
    )
  } catch (error) {
    console.error('Todos POST error:', error)
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