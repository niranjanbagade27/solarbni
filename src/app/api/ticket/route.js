import { NextResponse } from "next/server";
import Ticket from "@/Models/ticket";
import dbConnect from "@/lib/mongodb";
export const dynamic = "force-dynamic";
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { ticketName } = body;
    console.log("###", ticketName);
    const ticketData = await Ticket.findOne({ ticketName });
    if (ticketData) {
      return NextResponse.json({ ticketData });
    } else {
      return NextResponse.json(
        {
          message: "No ticket exist with this ticket number",
        },
        {
          status: 500,
        }
      );
    }
  } catch (e) {
    return NextResponse.json(
      {
        message: "Error while fetching ticket",
      },
      {
        status: 500,
      }
    );
  }
}
