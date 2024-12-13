import { NextResponse } from "next/server";
import Ticket from "@/Models/ticket";
import dbConnect from "@/lib/mongodb";
export const dynamic = "force-dynamic";
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const {
      contractorName,
      contactorComapny,
      contractorEmail,
      ticketType,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCapacity,
      installedPanelCompany,
      installedInverterCompany,
      installedPanelModel,
      installedInverterModel,
      pdfUrl,
      ticketStatus,
      ticketCreatedDate,
      ticketEmailContent,
    } = body;
    // console.log(customerName, customerEmail, customerPhone, customerAddress);
    // console.log(installedPanelCompany, installedPanelModel);
    // console.log(installedInverterCompany, installedInverterModel);
    // console.log(pdfUrl);
    // console.log(ticketStatus, ticketCreatedDate, ticketEmailContent);
    const ticket = new Ticket({
      contractorName,
      contactorComapny,
      contractorEmail,
      ticketType,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCapacity,
      installedInverterCompany,
      installedInverterModel,
      pdfUrl,
      ticketStatus,
      ticketCreatedDate,
      ticketEmailContent,
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
