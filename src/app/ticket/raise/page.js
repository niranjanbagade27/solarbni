"use client";
import useVerifyUser from "@/hooks/verifyUser";
import { userRoles } from "@/constants/role";
import BounceLoader from "react-spinners/BounceLoader";
import { spinnerColor } from "@/constants/colors";
import { useEffect, useState } from "react";
import axios from "axios";
export default function TicketRaisePage() {
  const { isVerified, verifyingUser, error } = useVerifyUser();
  const [isLoading, setIsLoading] = useState(true);
  const [formNotes, setFormNotes] = useState([]);
  useEffect(() => {
    if (!verifyingUser && isVerified === false) {
      window.location.href = "/login";
    } else if (!verifyingUser && isVerified.role === userRoles.OEM) {
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
    } else {
      fetchFormNotes();
    }
  }, [isVerified, verifyingUser, error]);

  async function fetchFormNotes() {
    try {
      const response = await axios.get("/api/formnotes");
      setFormNotes(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex sm:-mt-4 mt-20 justify-center items-center">
      {verifyingUser && (
        <div className="flex justify-center items-center h-full">
          <BounceLoader color={spinnerColor} />
        </div>
      )}
      {!verifyingUser && isVerified._id && (
        <div className="flex justify-center items-center flex-col mt-4 gap-10">
          <div className="text-3xl">Hi, {isVerified.fullName}</div>
          <div className="flex flex-col sm:flex-row gap-10 sm:gap-20">
            <div
              className="border-2 border-black p-12 rounded-lg cursor-pointer text-xl hover:bg-slate-200"
              onClick={() => (window.location.href = "/ticket/raise/inverter")}
            >
              Raise Inverter Ticket
            </div>
            <div
              className="border-2 border-black p-12 rounded-lg cursor-pointer text-xl hover:bg-slate-200"
              onClick={() => (window.location.href = "/ticket/raise/panel")}
            >
              Raise Panel Ticket
            </div>
          </div>
          <div className="flex flex-col w-full gap-3">
            <div className="text-2xl font-bold">Form Instructions : </div>
            <div className="flex flex-col gap-2">
              {isLoading && (
                <div className="flex justify-center items-center">
                  <BounceLoader color={spinnerColor} />
                </div>
              )}
              {!isLoading &&
                formNotes.map((note, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 w-full"
                  >
                    <div>
                      {index + 1} - {note.notes}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
