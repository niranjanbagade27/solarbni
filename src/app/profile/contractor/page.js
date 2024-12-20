"use client";
import useVerifyUser from "@/hooks/verifyUser";
import { userRoles } from "@/constants/role";
import { useEffect, useState } from "react";
import BounceLoader from "react-spinners/BounceLoader";
import { spinnerColor } from "@/constants/colors";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "reactstrap";

export default function ContractorProfilePage() {
  const { isVerified, verifyingUser, error } = useVerifyUser();
  const [isLoading, setIsLoading] = useState(true);
  const [ticketData, setTicketData] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!verifyingUser && isVerified === false) {
      window.location.href = "/login";
    } else if (!verifyingUser && isVerified.role !== userRoles.CONTRACTOR) {
      let redirectRole = "";
      switch (isVerified.role) {
        case "admin":
          redirectRole = "admin";
          break;
        case "contractor":
          redirectRole = "contractor";
          break;
        case "oem":
          redirectRole = "oem";
          break;
        default:
          break;
      }
      window.location.href = `/profile/${redirectRole}`;
    } else if (!verifyingUser && isVerified.role === userRoles.CONTRACTOR) {
      fetchRaisedTickets();
    }
  }, [isVerified, verifyingUser, error]);

  async function fetchRaisedTickets() {
    try {
      const {
        data: { ticketData },
      } = await axios.post("/api/ticket/contractor", {
        contractorEmail: isVerified.email,
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
  return (
    <div>
      {verifyingUser && (
        <div className="flex justify-center items-center h-full">
          <BounceLoader color={spinnerColor} />
        </div>
      )}
      {!verifyingUser && (
        <div className="mt-24 sm:mt-6 flex flex-col justify-center items-start gap-6">
          <div className="text-3xl">Hi, {isVerified.fullName}</div>
          <div className="text-lg">
            Your Raised Tickets{" "}
            {ticketData.length > 0 ? `( ${ticketData.length} )` : ""}:{" "}
          </div>
          {isLoading && (
            <div className="flex justify-center items-center h-full">
              <BounceLoader color={spinnerColor} />
            </div>
          )}
          {!isLoading && !errorMsg && ticketData && (
            <div>
              {ticketData.map((ticket, index) => (
                <div key={index}>
                  <div className="flex flex-col gap-2">
                    <div className="font-medium text-lg">
                      {ticket.ticketName}
                    </div>
                    <div className="pl-6">Customer : {ticket.customerName}</div>
                    <div className="pl-6">
                      Date raised : {ticket.ticketCreationDate}
                    </div>
                    <div className="pl-6">
                      <Button
                        color="primary"
                        onClick={() => {
                          window.location.href = `/ticket/view/${ticket.ticketName}`;
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                  <hr></hr>
                </div>
              ))}
            </div>
          )}
          {errorMsg && <div className="font-bold text-4xl">{errorMsg}</div>}
        </div>
      )}
    </div>
  );
}
