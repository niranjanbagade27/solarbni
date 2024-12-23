import { NextResponse } from "next/server";
import Ticket from "@/Models/ticket";
import dbConnect from "@/lib/mongodb";
export const dynamic = "force-dynamic";
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const {
      ticketName,
      contractorName,
      contactorComapny,
      contractorEmail,
      ticketType,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCapacity,
      customerPincode,
      installedPanelCompany,
      installedInverterCompany,
      installedPanelModel,
      installedInverterModel,
      pdfUrl,
      ticketStatus,
      ticketCreationDate,
      ticketEmailContent,
      sollarInstallerServicePerson,
      sollarInstallerServicePersonPhone,
      questions,
    } = body;
    const isTicketExist = await Ticket.findOne({ ticketName });
    if (isTicketExist) {
      return NextResponse.json(
        {
          message: "Ticket with same name alreasy exisit",
        },
        {
          status: 500,
        }
      );
    }
    const ticket = new Ticket({
      ticketName,
      contractorName,
      contactorComapny,
      contractorEmail,
      ticketType,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCapacity,
      customerPincode,
      installedPanelCompany,
      installedInverterCompany,
      installedPanelModel,
      installedInverterModel,
      pdfUrl,
      ticketStatus,
      ticketCreationDate,
      ticketEmailContent,
      sollarInstallerServicePerson,
      sollarInstallerServicePersonPhone,
      questions,
    });
    await ticket.save();
    return NextResponse.json({ ticket });
  } catch (e) {
    return NextResponse.json(
      {
        message: "Error while creating ticket",
      },
      {
        status: 500,
      }
    );
  }
}
