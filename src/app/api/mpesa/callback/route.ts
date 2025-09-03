import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("callback received", body);

  return NextResponse.json({ message: "callback received" });
}
