import { NextRequest, NextResponse } from "next/server";
import { grenerateUploadURL } from "./s3";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const fileName = searchParams.get("fileName");

  if (fileName) {
    try {
      const url = await grenerateUploadURL(fileName);
      return NextResponse.json({ url });
    } catch (err) {
      console.log(err);
      return NextResponse.json(
        { error: "Internal Sever Error" },
        { status: 500 },
      );
    }
  }
}
