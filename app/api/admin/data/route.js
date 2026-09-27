import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db.js";
import LoginData from "../../../../lib/model.js";

function getSession(request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = {};
  cookieHeader.split(";").forEach((cookie) => {
    const trimmed = cookie.trim();
    if (!trimmed) return;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      cookies[trimmed] = "";
      return;
    }
    const key = trimmed.slice(0, separatorIndex);
    const value = trimmed.slice(separatorIndex + 1);
    cookies[key] = value;
  });

  return cookies.admin_session;
}

export async function GET(request) {
  const session = getSession(request);
  if (session !== "authenticated") {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    await connectDB();
    const data = await LoginData.find().sort({ timestamp: -1 });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = getSession(request);
  if (session !== "authenticated") {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, message: "Missing record id" }, { status: 400 });
    }

    await connectDB();
    await LoginData.deleteOne({ _id: id });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete record" }, { status: 500 });
  }
}

export async function PATCH(request) {
  const session = getSession(request);
  if (session !== "authenticated") {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const { id, favorite } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, message: "Missing record id" }, { status: 400 });
    }

    await connectDB();
    const updated = await LoginData.findByIdAndUpdate(
      id,
      { favorite: Boolean(favorite) },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Favorite update error:", error);
    return NextResponse.json({ success: false, message: "Failed to update favorite" }, { status: 500 });
  }
}
