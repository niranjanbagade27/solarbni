"use client";
import axios from "axios";
import { useState, useEffect } from "react";
export function InverterTicketDetails({
  pdfUrl,
  customerDetail,
  contractorDetail,
}) {
  const getTicketEmailContent = () => {
    return `
    <div>
        <h1>Dear ${contractorDetail.fullName},</h1>
        <p>
            A new ticket has been raised for the customer ${customerDetail.custName} with the following details:
        </p>
        <ul>
            <li>Customer Name: ${customerDetail.custName}</li>
            <li>Customer Email: ${customerDetail.custEmail}</li>
            <li>Customer Phone: ${customerDetail.custPhone}</li>
            <li>Customer Address: ${customerDetail.custAddress}</li>
            <li>Customer Capacity: ${customerDetail.custSysCapacity}</li>
            <li>Installed Inverter Company: ${customerDetail.custInstalledInverterCompany}</li>
            <li>Installed Inverter Model: ${customerDetail.custInstalledInverterModel}</li>
        </ul>
        <p>
            Please find the attached PDF for more details.
            Also, the pdf link is ${pdfUrl}
        </p>
        <p>
            Regards,
            <br />
            Solar Connect
        </p>
    </div>
    `;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`/api/raiseticket`, {
          contractorName: contractorDetail.fullName,
          contactorComapny: contractorDetail.company,
          contractorEmail: contractorDetail.email,
          ticketType: "Inverter",
          customerName: customerDetail.custName,
          customerEmail: customerDetail.custEmail,
          customerPhone: customerDetail.custPhone,
          customerAddress: customerDetail.custAddress,
          customerCapacity: customerDetail.custSysCapacity,
          installedInverterCompany: customerDetail.custInstalledInverterCompany,
          installedInverterModel: customerDetail.custInstalledInverterModel,
          pdfUrl: pdfUrl,
          ticketStatus: "open",
          ticketCreatedDate: new Date().toISOString(),
          ticketEmailContent: getTicketEmailContent(),
        });
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <div>Inverter Ticket Details :</div>
      <div>Customer Name: {customerDetail.custName}</div>
      <div>Customer Email: {customerDetail.custEmail}</div>
      <div>Customer Phone: {customerDetail.custPhone}</div>
      <div>Customer Address: {customerDetail.custAddress}</div>
      <div>Customer Capacity: {customerDetail.custSysCapacity}</div>
      <div>
        Installed Inverter Company:{" "}
        {customerDetail.custInstalledInverterCompany}
      </div>
      <div>
        Installed Inverter Model: {customerDetail.custInstalledInverterModel}
      </div>
      <div>{getTicketEmailContent()}</div>
      <div>PDF URL : {pdfUrl}</div>
      <div>PDF:</div>
      <div className="h-[70vh]">
        <iframe
          src={pdfUrl}
          width="100%"
          height="100%"
          title="Inverter Ticket"
        />
      </div>
    </div>
  );
}
