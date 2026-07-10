import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import {
  adminSecretsEqual,
  signAdminSession,
  ADMIN_ACCESS_COOKIE_NAME,
} from "@/lib/admin-access-cookie"

export async function POST(request: NextRequest) {
  try {
    const { id, password } = await request.json()

    if (typeof id !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid payload" },
        { status: 400 }
      )
    }

    const expectedId = process.env.ADMIN_ACCESS_ID || ""
    const expectedPassword = process.env.ADMIN_ACCESS_PASSWORD || ""

    if (
      adminSecretsEqual(id, expectedId) &&
      adminSecretsEqual(password, expectedPassword)
    ) {
      const token = signAdminSession()
      const cookieStore = await cookies()

      cookieStore.set(ADMIN_ACCESS_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      })

      return NextResponse.json({ success: true, message: "Authenticated successfully" })
    }

    return NextResponse.json(
      { success: false, message: "Invalid ID or Password" },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.set(ADMIN_ACCESS_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })

    return NextResponse.json({ success: true, message: "Logged out successfully" })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
