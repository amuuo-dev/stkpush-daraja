/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

let callbackResult: any = null;

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("callback received", body);

  callbackResult = body;

  return NextResponse.json({ message: "callback received" });
}

export async function GET() {
  return NextResponse.json(callbackResult || { status: "pending" });
}
