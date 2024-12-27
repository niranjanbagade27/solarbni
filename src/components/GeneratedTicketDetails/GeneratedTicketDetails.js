"use client";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
export function GeneratedTicketDetails({
  pdfUrl,
  customerDetail,
  contractorDetail,
  ticketType,
  questionArray,
}) {
  useEffect(() => {
    console.log(questionArray);
  }, []);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  const ticketName = useRef(
    `SOLARBNI_${ticketType}_${
      customerDetail.custSysCapacity
    }_${new Date().getDate()}${new Date().getMonth()}${new Date().getFullYear()}_${new Date().getHours()}${new Date().getMinutes()}`
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
    } panel installed at ${customerDetail.custAddress}, ${
      customerDetail.custPincode
    } with plant capacity ${customerDetail.custSysCapacity}kW. 
This report has been generated to provide you all necessary parameters required for site assessment.

Looking forward to your positive feedback.

Thanks, and regards,
  Customer Name : ${customerDetail.custName}
  Customer Phone : ${customerDetail.custPhone}

Project installed by,
  Contractor Name : ${contractorDetail.fullName}
  Contractor Company : ${contractorDetail.companyName}
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
        questions: questionArray,
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
          <div className="font-semibold min-w-[10vw] text-2xl">Ticket ID</div>
          <div className="sm:w-[70vw]">{ticketName.current}</div>
          <div className="flex justify-end sm:w-[20vw]">
            {copyClipBoardBtn(ticketName.current)}
          </div>
        </div>
        <hr></hr>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-10 justify-start items-start w-full">
          <div className="font-semibold min-w-[10vw] text-2xl">
            Email Subject
          </div>
          <div className="sm:w-[70vw] w-[95%]">
            {`Subject: Request for service support for ${
              customerDetail.custSysCapacity
            }kW Solar PV system installed at ${customerDetail.custPincode} : ${
              ticketType === "Panel" ? "Panel" : "Inverter"
            }`}
          </div>
          <div className="flex justify-end sm:w-[20vw]">
            {copyClipBoardBtn(
              "Subject: Request for service support for Solar PV system"
            )}
          </div>
        </div>
        <hr></hr>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-10 justify-start items-start w-full">
          <div className="font-semibold min-w-[10vw] text-2xl">
            Email Content
          </div>
          <div>
            <div className="font-medium text-md italic text-rose-600">
              Please add infosolarbni@gmail.com in CC while raising a ticket to
              the manufacturer for efficient communication.
            </div>
            <div className="sm:w-[70vw] w-[95%] mt-8">
              <pre>{getTicketEmailContent()}</pre>
            </div>
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
