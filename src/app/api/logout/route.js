import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
export const dynamic = "force-dynamic";
export async function GET(request) {
  try {
    await dbConnect();
    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.set("token", "", { maxAge: -1 });
    return response;
  } catch (e) {
    console.log("Error while logging out", e);
    return NextResponse.json(
      {
        message: "Error while logging out",
      },
      {
        status: 500,
      }
    );
  }
}
