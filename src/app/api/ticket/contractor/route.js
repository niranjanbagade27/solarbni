import { NextResponse } from "next/server";
import Ticket from "@/Models/ticket";
import dbConnect from "@/lib/mongodb";
export const dynamic = "force-dynamic";
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { contractorEmail } = body;
    console.log(contractorEmail);
    const ticketData = await Ticket.find({ contractorEmail });
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
    return NextResponse.json(
      {
        message: "Error while fetching ticket details by this contractor",
      },
      {
        status: 500,
      }
    );
  }
}
