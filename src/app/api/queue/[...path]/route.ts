// src/app/api/queue/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";

const EC2_URL = process.env.EC2_BASE_URL || "http://13.233.45.167:5000";

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join("/");
    const body = await request.text();
    const token = request.headers.get("authorization");

    console.log(`🔄 Proxying POST /queue/${path} to EC2`);

    const response = await fetch(`${EC2_URL}/queue/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }),
      },
      body,
    });

    const data = await response.text();
    
    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("❌ Proxy error:", error);
    return NextResponse.json(
      { error: error.message || "Proxy request failed" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join("/");
    const token = request.headers.get("authorization");

    console.log(`🔄 Proxying GET /queue/${path} to EC2`);

    const response = await fetch(`${EC2_URL}/queue/${path}`, {
      method: "GET",
      headers: {
        ...(token && { Authorization: token }),
      },
    });

    const data = await response.text();
    
    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("❌ Proxy error:", error);
    return NextResponse.json(
      { error: error.message || "Proxy request failed" },
      { status: 500 }
    );
  }
}