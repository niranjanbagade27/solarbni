"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BounceLoader from "react-spinners/BounceLoader";
import { spinnerColor } from "@/constants/colors";
import { Button } from "reactstrap";
import useVerifyUser from "@/hooks/verifyUser";
import { userRoles } from "@/constants/role";

export default function TicketView({ ticketName }) {
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ticketData, setTicketData] = useState();
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  async function fetchDetails() {
    try {
      const {
        data: { ticketData },
      } = await axios.post("/api/ticket", {
        ticketName,
      });
      if (
        ticketData.contractorEmail === isVerified.email ||
        isVerified.role === userRoles.ADMIN
      ) {
        setErrorMsg(null);
        setIsLoading(false);
        setTicketData(ticketData);
      } else {
        setTicketData(null);
        setErrorMsg("You are not authorized to view this ticket");
        setIsLoading(false);
      }
    } catch (err) {
      setTicketData(null);
      console.log(err);
      toast(err.response.data.message);
      setErrorMsg(err.response.data.message);
      setIsLoading(false);
    }
  }
  const { isVerified, verifyingUser, error } = useVerifyUser();
  useEffect(() => {
    if (!verifyingUser && isVerified === false) {
      window.location.href = "/login";
    } else {
      fetchDetails();
    }
  }, [isVerified, verifyingUser, error]);

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

  const exportTicketData = (data) => {
    const excludedKeys = ["ticketEmailContent", "_v"]; // Add keys to exclude
    const headers = Object.keys(data[0])
      .filter((key) => !excludedKeys.includes(key))
      .join(",");
    const csvContent = [
      headers,
      ...data.map((ticket) => {
        return Object.keys(ticket)
          .filter((key) => !excludedKeys.includes(key))
          .map((key) => ticket[key])
          .join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "tickets.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-24 sm:mt-6">
      {(isLoading || verifyingUser) && (
        <div className="flex justify-center items-center h-full">
          <BounceLoader color={spinnerColor} />
        </div>
      )}
      {errorMsg && !isLoading && isVerified._id && (
        <div className="font-bold text-4xl">{errorMsg}</div>
      )}
      {!errorMsg && !isLoading && isVerified._id && (
        <>
          <div className="text-2xl sm:text-3xl font-semimedium break-words">
            Ticket Details for{" "}
            <span className="italic bg-yellow-300 px-2">{ticketName}</span>{" "}
          </div>
          <br></br>
          <div className="flex flex-col sm:gap-8">
            <div className="flex flex-col gap-3 sm:gap-10 justify-start items-start w-full">
              <div className="font-semibold min-w-[10vw] text-2xl">
                Ticket Information
              </div>
              <div className="sm:w-[70vw] w-[95%] pl-6">
                <div className="flex flex-col gap-2">
                  <div>
                    Status :{" "}
                    <strong>{ticketData.ticketStatus.toUpperCase()}</strong>
                  </div>
                  <div>
                    Type : <strong>{ticketData.ticketType}</strong>
                  </div>
                  <div>Created on : {ticketData.ticketCreationDate}</div>
                </div>
              </div>
            </div>
            <hr></hr>
            <div className="flex flex-col gap-3 sm:gap-10 justify-start items-start w-full">
              <div className="font-semibold min-w-[10vw] text-2xl">
                Ticket Raised by
              </div>
              <div className="sm:w-[70vw] w-[95%] pl-6">
                <div className="flex flex-col gap-2">
                  <div>Name : {ticketData.contractorName}</div>
                  <div>Company : {ticketData.contactorComapny}</div>
                  <div>Email : {ticketData.contractorEmail}</div>
                  <div>
                    Service Person : {ticketData.sollarInstallerServicePerson}
                  </div>
                  <div>
                    Service Person Contact :{" "}
                    {ticketData.sollarInstallerServicePersonPhone}
                  </div>
                </div>
              </div>
            </div>
            <hr></hr>
            <div className="flex flex-col gap-3 sm:gap-10 justify-start items-start w-full">
              <div className="font-semibold min-w-[10vw] text-2xl">
                Customer Information
              </div>
              <div className="sm:w-[70vw] w-[95%] pl-6">
                <div className="flex flex-col gap-2 break-words">
                  <div>Name : {ticketData.customerName}</div>
                  <div>Email : {ticketData.customerEmail}</div>
                  <div>Phone : {ticketData.customerPhone}</div>
                  <div>Address : {ticketData.customerAddress}</div>
                  <div>Pincode : {ticketData.customerPincode}</div>
                  <div>Capacity : {ticketData.customerCapacity}</div>
                  <div>Panel Company : {ticketData.installedPanelCompany}</div>
                  <div>Panel Model : {ticketData.installedPanelModel}</div>
                  <div>
                    Inverter Company : {ticketData.installedInverterCompany}
                  </div>
                  <div>
                    Inverter Model : {ticketData.installedInverterModel}
                  </div>
                </div>
              </div>
            </div>
            <hr></hr>
            <div className="flex flex-col gap-3 sm:gap-10 justify-start items-start w-full">
              <div className="font-semibold min-w-[10vw] text-2xl">
                Email Subject
              </div>
              <div className="sm:w-[70vw] w-[95%] pl-6">
                Subject: Request for service support for Solar PV system
              </div>
              <div className="flex justify-end sm:justify-start sm:w-[20vw]">
                {copyClipBoardBtn(
                  "Subject: Request for service support for Solar PV system"
                )}
              </div>
            </div>
            <hr></hr>
            <div className="flex flex-col gap-3 sm:gap-10 justify-start items-start w-full">
              <div className="font-semibold min-w-[10vw] text-2xl">
                Email Content
              </div>
              <div className="sm:w-[70vw] w-[95%] pl-6">
                <pre>{ticketData.ticketEmailContent}</pre>
              </div>
              <div className="flex justify-end sm:justify-start sm:w-[20vw]">
                {copyClipBoardBtn(ticketData.ticketEmailContent)}
              </div>
            </div>
            <hr></hr>
            <div className="flex flex-col gap-3 sm:gap-10 justify-start items-start w-full">
              <div className="font-semibold min-w-[10vw] text-2xl">PDF Url</div>
              <div className="sm:w-[70vw] w-[95%] pl-6">
                <pre>{ticketData.pdfUrl}</pre>
              </div>
              <div className="flex justify-end sm:justify-start sm:w-[20vw]">
                {copyClipBoardBtn(ticketData.pdfUrl)}
              </div>
            </div>
            <hr></hr>
            <div className="flex flex-col gap-3 sm:gap-10 justify-start items-start w-full">
              <div className="font-semibold min-w-[10vw] text-2xl">
                PDF Preview
              </div>
              <div className={`sm:w-[70vw] w-[95%] pl-6`}>
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
                    <iframe
                      src={ticketData.pdfUrl}
                      width="100%"
                      height="100%"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end sm:justify-start sm:w-[20vw]">
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
            <hr></hr>
            <div className="flex flex-col gap-3 sm:gap-10 justify-start items-start w-full">
              <div className="font-semibold min-w-[10vw] text-2xl">
                Export Ticket Data
              </div>
              <div className="flex justify-end sm:justify-start sm:w-[20vw]">
                <Button
                  size="sm"
                  color="success"
                  onClick={() => exportTicketData(ticketData)}
                >
                  Export to CSV
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
