import { NextResponse } from "next/server";
import Ticket from "@/Models/ticket";
import dbConnect from "@/lib/mongodb";
export const dynamic = "force-dynamic";
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { ticketName } = body;
    const originalTicketName = ticketName.split("%20").join(" ");
    const ticketData = await Ticket.findOne({ ticketName: originalTicketName });
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
    console.log("Error while fetching ticket", e);
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

export async function GET(request) {
  try {
    await dbConnect();
    const ticketData = await Ticket.find();
    if (ticketData) {
      return NextResponse.json({ ticketData });
    } else {
      return NextResponse.json(
        {
          message: "No ticket raised yet",
        },
        {
          status: 500,
        }
      );
    }
  } catch (e) {
    console.log("Error while fetching ticket details", e);
    return NextResponse.json(
      {
        message: "Error while fetching ticket details",
      },
      {
        status: 500,
      }
    );
  }
}
