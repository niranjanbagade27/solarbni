import { NextResponse } from "next/server";
import FormNote from "@/Models/formNotes";
import dbConnect from "@/lib/mongodb";
export const dynamic = "force-dynamic";
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { formNote } = body;
    const newFormNote = new FormNote({
      notes: formNote,
    });
    const savedFormNote = await newFormNote.save();
    return NextResponse.json(savedFormNote, { status: 200 });
  } catch (e) {
    console.log("Error while saving form note", e);
    return NextResponse.json(
      {
        message: "Error saving form note",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request) {
  try {
    await dbConnect();
    const formNotes = await FormNote.find();
    return NextResponse.json(formNotes, { status: 200 });
  } catch (e) {
    console.log("Error while getting form notes", e);
    return NextResponse.json(
      {
        message: "Error fetching form notes",
      },
      {
        status: 500,
      }
    );
  }
}
