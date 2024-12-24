import { NextResponse } from "next/server";
import FormNote from "@/Models/formNotes";
import dbConnect from "@/lib/mongodb";
export const dynamic = "force-dynamic";
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id } = body;
    console.log(id);
    const deletedFormNote = await FormNote.findByIdAndDelete(id);
    return NextResponse.json(deletedFormNote, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      {
        message: "Error deleting form note",
      },
      {
        status: 500,
      }
    );
  }
}
