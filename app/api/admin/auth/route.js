import { NextResponse } from "next/server";

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
  if (session === "authenticated") {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
