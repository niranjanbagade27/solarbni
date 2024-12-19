"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BounceLoader from "react-spinners/BounceLoader";
import { spinnerColor } from "@/constants/colors";
import { Button } from "reactstrap";

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
      setErrorMsg(null);
      setIsLoading(false);
      setTicketData(ticketData);
    } catch (err) {
      setTicketData(null);
      console.log(err);
      toast(err.response.data.message);
      setErrorMsg(err.response.data.message);
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchDetails();
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
    <div className="mt-6">
      {isLoading && (
        <div className="flex justify-center items-center h-full">
          <BounceLoader color={spinnerColor} />
        </div>
      )}
      {errorMsg && !isLoading && (
        <div className="font-bold text-4xl">{errorMsg}</div>
      )}
      {!errorMsg && !isLoading && (
        <>
          <div className="text-3xl font-semimedium">
            Ticket Details for{" "}
            <span className="italic bg-yellow-300 px-2">{ticketName}</span>{" "}
          </div>
          <br></br>
          <div className="flex flex-col gap-8">
            <div className="flex flex-row gap-10 justify-start items-start w-full">
              <div className="font-semibold min-w-[10vw]">Email Subject</div>
              <div className="w-[70vw]">
                Subject: Request for service support for Solar PV system
              </div>
              <div className="flex justify-end w-[20vw]">
                {copyClipBoardBtn(
                  "Subject: Request for service support for Solar PV system"
                )}
              </div>
            </div>
            <div className="flex flex-row gap-10 justify-start items-start w-full">
              <div className="font-semibold min-w-[10vw]">Email Content</div>
              <div className="w-[70vw]">
                <pre>{ticketData.ticketEmailContent}</pre>
              </div>
              <div className="flex justify-end w-[20vw]">
                {copyClipBoardBtn(ticketData.ticketEmailContent)}
              </div>
            </div>
            <div className="flex flex-row gap-10 justify-start items-start w-full">
              <div className="font-semibold min-w-[10vw]">PDF Url</div>
              <div className="w-[70vw]">
                <pre>{ticketData.pdfUrl}</pre>
              </div>
              <div className="flex justify-end w-[20vw]">
                {copyClipBoardBtn(ticketData.pdfUrl)}
              </div>
            </div>
            <div className="flex flex-row gap-10 justify-start items-start w-full">
              <div className="font-semibold min-w-[10vw]">PDF Preview</div>
              <div className={`w-[70vw]`}>
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
              <div className="flex justify-end w-[20vw]">
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
            {/* <div className="flex flex-row gap-10 justify-start items-start w-full">
              <div className="font-semibold min-w-[10vw]">PDF Url</div>
              <div className="w-[70vw]">
                <pre>{ticketData.pdfUrl}</pre>
              </div>
              <div className="flex justify-end w-[20vw]">
                {copyClipBoardBtn(ticketData.pdfUrl)}
              </div>
            </div> */}
          </div>
          <div className="mt-16 italic font-semibold"></div>
        </>
      )}
    </div>
  );
}
