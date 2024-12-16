"use client";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Button, Table } from "reactstrap";
export function GeneratedTicketDetails({
  pdfUrl,
  customerDetail = {
    custName: "Test Customer",
    custEmail: "abc@gmail.com",
    custPhone: "1234567890",
    custAddress: "Test Address",
    custSysCapacity: "5KW",
    custInstalledPanelCompany: "Test Panel Company",
    custInstalledPanelModel: "Test Panel Model",
    custInstalledPanelCapacity: "5KW",
    custInstalledInverterCompany: "Test Inverter Company",
    custInstalledInverterModel: "Test Inverter Model",
    sollarInstallerServicePerson: "ABC",
    sollarInstallerServicePersonPhone: "1234567890",
    custSysAge: "5 years",
    custInverterCapacity: "5KW",
    custThreeOrSinglePhase: "Single Phase",
    custInstalledInverterSingleOrThreePhase: "Single Phase",
    custPanelType: "Test Panel Type",
    custDcrOrNonDcr: "DCR",
    custPanelWattage: "5KW",
    custRemoteMonitoringUserId: "Test User",
    custRemoteMonitoringPassword: "Test Password",
  },
  contractorDetail,
  ticketType = "Panel",
}) {
  const ticketName = useRef(
    `SOLARBNI_${ticketType}_${new Date().getDate()}${new Date().getMonth()}${new Date().getFullYear()}_${new Date().getHours()}${new Date().getMinutes()}`
  );
  const getTicketEmailContent = () => {
    return `Respected ${
      ticketType === "Panel"
        ? customerDetail.custInstalledPanelCompany
        : customerDetail.custInstalledInverterCompany
    } representative,,

We require service support with ${
      ticketType === "Panel"
        ? customerDetail.custInstalledPanelModel
        : customerDetail.custInstalledInverterModel
    } installed at ${customerDetail.custAddress} with ${
      customerDetail.custSysCapacity
    }kW. 
This report has been generated to provide you all necessary parameters required for site assessment.

Please find the attached PDF for more information.

Thank you,
${contractorDetail.fullName}
${contractorDetail.company}
`;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`/api/raiseticket`, {
          ticketName: ticketName.current,
          contractorName: contractorDetail.fullName,
          contactorComapny: contractorDetail.company,
          contractorEmail: contractorDetail.email,
          ticketType,
          customerName: customerDetail.custName,
          customerEmail: customerDetail.custEmail,
          customerPhone: customerDetail.custPhone,
          customerAddress: customerDetail.custAddress,
          customerCapacity: customerDetail.custSysCapacity,
          customerPincode: customerDetail.custPincode,
          installedInverterCompany: customerDetail.custInstalledInverterCompany,
          installedInverterModel: customerDetail.custInstalledInverterModel,
          installedPanelCompany: customerDetail.custInstalledPanelCompany,
          installedPanelModel: customerDetail.custInstalledPanelModel,
          pdfUrl: pdfUrl,
          ticketStatus: "open",
          ticketCreatedDate: new Date().toISOString(),
          ticketEmailContent: getTicketEmailContent(),
          sollarInstallerServicePerson:
            customerDetail.sollarInstallerServicePerson,
          sollarInstallerServicePersonPhone:
            customerDetail.sollarInstallerServicePersonPhone,
        });
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    // fetchData();
  }, []);

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    toast.success("Content copied to clipboard");
  };

  return (
    <div>
      <div className="text-3xl font-semimedium">
        Ticket Created Successfully{" "}
      </div>
      <br></br>
      <div className="italic text-sm text-rose-500">
        Note : Please copy the email content below and confirm after it is done.
      </div>
      <br></br>
      <div className="w-full grid grid-cols-2 gap-4">
        <div className="font-semibold">Ticket ID</div>
        <div className="flex flex-col gap-3">
          <div className="w-[100%]">{ticketName.current}</div>
          <div>
            <Button
              size="sm"
              color="success"
              onClick={() => copyToClipboard(ticketName.current)}
            >
              Click to copy{" "}
            </Button>
          </div>
        </div>
        <div className="font-semibold">Email Subject</div>
        <div className="flex flex-col gap-3">
          <div className="w-[100%] break-words">
            Subject: Request for service support for Solar PV system
          </div>
          <div>
            <Button
              size="sm"
              color="success"
              onClick={() =>
                copyToClipboard(
                  `Subject: Request for service support for Solar PV system`
                )
              }
            >
              Click to copy{" "}
            </Button>
          </div>
        </div>
        <div className="font-semibold">Email Content</div>
        <div>
          <pre>{getTicketEmailContent()}</pre>
          <div>
            <Button
              size="sm"
              color="success"
              onClick={() => copyToClipboard(getTicketEmailContent())}
            >
              {" "}
              Click to copy{" "}
            </Button>
          </div>
        </div>
      </div>

      {/* <div className="h-[70vh]">
        <iframe
          src={pdfUrl}
          width="100%"
          height="100%"
          title="Inverter Ticket"
        />
      </div> */}
    </div>
  );
}
