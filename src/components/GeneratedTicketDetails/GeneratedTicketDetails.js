"use client";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
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
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  const ticketName = useRef(
    `SOLARBNI_${ticketType}_${new Date().getDate()}${new Date().getMonth()}${new Date().getFullYear()}_${new Date().getHours()}${new Date().getMinutes()}`
  );
  const getTicketEmailContent = () => {
    return `Respected ${
      ticketType === "Panel"
        ? customerDetail.custInstalledPanelCompany
        : customerDetail.custInstalledInverterCompany
    } representative,

We require service support with ${
      ticketType === "Panel"
        ? customerDetail.custInstalledPanelModel
        : customerDetail.custInstalledInverterModel
    } panel installed at ${customerDetail.custAddress} with plant capacity ${
      customerDetail.custSysCapacity
    }kW. 
This report has been generated to provide you all necessary parameters required for site assessment.

PDF with all details : ${pdfUrl}

Looking forward to your positive feedback.

Thanks, and regards,
  ${customerDetail.custName}
  ${customerDetail.custPhone}

Project installed by,
  ${contractorDetail.fullName}
  ${contractorDetail.companyName}
  Service person : ${customerDetail.sollarInstallerServicePerson}
  Service person contact number : ${
    customerDetail.sollarInstallerServicePersonPhone
  }
  `;
  };
  const fetchData = async () => {
    try {
      const response = await axios.post(`/api/raiseticket`, {
        ticketName: ticketName.current,
        contractorName: contractorDetail.fullName,
        contactorComapny: contractorDetail.companyName,
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
        ticketCreationDate: new Date().toISOString(),
        ticketEmailContent: getTicketEmailContent(),
        sollarInstallerServicePerson:
          customerDetail.sollarInstallerServicePerson,
        sollarInstallerServicePersonPhone:
          customerDetail.sollarInstallerServicePersonPhone,
      });
      toast("Ticket Saved to DB");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      toast("Error while saving ticket. Check logs");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    toast.success("Content copied to clipboard");
  };

  const copyClipBoardBtn = (data) => {
    return (
      <Button size="sm" color="success" onClick={() => copyToClipboard(data)}>
        Click to copy
      </Button>
    );
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
      <div className="flex flex-col sm:gap-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-10 justify-start items-start w-full">
          <div className="font-semibold min-w-[10vw] text-2xl text-2xl">Ticket ID</div>
          <div className="sm:w-[70vw]">{ticketName.current}</div>
          <div className="flex justify-end sm:w-[20vw]">
            {copyClipBoardBtn(ticketName.current)}
          </div>
        </div>
        <hr></hr>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-10 justify-start items-start w-full">
          <div className="font-semibold min-w-[10vw] text-2xl">Email Subject</div>
          <div className="sm:w-[70vw] w-[95%]">
            Subject: Request for service support for Solar PV system
          </div>
          <div className="flex justify-end sm:w-[20vw]">
            {copyClipBoardBtn(
              "Subject: Request for service support for Solar PV system"
            )}
          </div>
        </div>
        <hr></hr>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-10 justify-start items-start w-full">
          <div className="font-semibold min-w-[10vw] text-2xl">Email Content</div>
          <div className="sm:w-[70vw] w-[95%]">
            <pre>{getTicketEmailContent()}</pre>
          </div>
          <div className="flex justify-end sm:w-[20vw]">
            {copyClipBoardBtn(getTicketEmailContent())}
          </div>
        </div>
        <hr></hr>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-10 justify-start items-start w-full">
          <div className="font-semibold min-w-[10vw] text-2xl">PDF Url</div>
          <div className="sm:w-[70vw] w-[95%]">
            <pre>{pdfUrl}</pre>
          </div>
          <div className="flex justify-end sm:w-[20vw]">
            {copyClipBoardBtn(pdfUrl)}
          </div>
        </div>
        <hr></hr>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-10 justify-start items-start w-full">
          <div className="font-semibold min-w-[10vw] text-2xl">PDF Preview</div>
          <div className={`sm:w-[70vw] w-[95%]`}>
            {!showPdfPreview && (
              <Button
                size="sm"
                color="success"
                onClick={() => setShowPdfPreview(!showPdfPreview)}
              >
                Preview
              </Button>
            )}
            {showPdfPreview && (
              <div className="h-[60vh]">
                <iframe src={pdfUrl} width="100%" height="100%" />
              </div>
            )}
          </div>
          <div className="flex justify-end sm:w-[20vw]">
            {showPdfPreview && (
              <Button
                size="sm"
                color="success"
                onClick={() => setShowPdfPreview(!showPdfPreview)}
              >
                CLose Preview
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="mt-16 italic font-semibold">
        <Button
          size="sm"
          color="success"
          onClick={() => (window.location.href = "/ticket/raise")}
        >
          All done, Raise anaother ticket ?
        </Button>
      </div>
    </div>
  );
}
