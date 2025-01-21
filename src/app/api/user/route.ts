import { NextResponse } from "next/server"

export async function GET() {
  // Simulating user data
  const user = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
  }

  return NextResponse.json(user)
}