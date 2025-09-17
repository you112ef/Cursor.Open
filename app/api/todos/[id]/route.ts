import { NextRequest, NextResponse } from 'next/server'

// Mock data - in production, you'd use a database
const mockTodos = [
  { id: "1", userId: "1", title: "Deploy to Vercel", completed: true, createdAt: "2024-01-01" },
  { id: "2", userId: "1", title: "Add authentication", completed: false, createdAt: "2024-01-02" },
  { id: "3", userId: "2", title: "Setup database", completed: false, createdAt: "2024-01-03" },
]

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const todoId = params.id
    const todo = mockTodos.find(t => t.id === todoId)
    
    if (!todo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { todo },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=300',
        },
      }
    )
  } catch (error) {
    console.error('Todo GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const todoId = params.id
    const body = await request.json()
    
    const todoIndex = mockTodos.findIndex(t => t.id === todoId)
    if (todoIndex === -1) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }
    
    // Update todo
    mockTodos[todoIndex] = { ...mockTodos[todoIndex], ...body }
    
    return NextResponse.json(
      { todo: mockTodos[todoIndex] },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache',
        },
      }
    )
  } catch (error) {
    console.error('Todo PUT error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const todoId = params.id
    const todoIndex = mockTodos.findIndex(t => t.id === todoId)
    
    if (todoIndex === -1) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }
    
    // Remove todo
    const deletedTodo = mockTodos.splice(todoIndex, 1)[0]
    
    return NextResponse.json(
      { todo: deletedTodo },
      { status: 200 }
    )
  } catch (error) {
    console.error('Todo DELETE error:', error)
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
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}