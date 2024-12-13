"use client";
import useVerifyUser from "@/hooks/verifyUser";
import { userRoles } from "@/constants/role";
import BounceLoader from "react-spinners/BounceLoader";
import { spinnerColor } from "@/constants/colors";
import { useEffect, useState } from "react";
export default function TicketRaisePage() {
  const { isVerified, verifyingUser, error } = useVerifyUser();
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
    }
  }, [isVerified, verifyingUser, error]);
  return (
    <div>
      {verifyingUser && (
        <div className="flex justify-center items-center h-full">
          <BounceLoader color={spinnerColor} />
        </div>
      )}
      {!verifyingUser &&
        isVerified._id && (
          <div className="flex justify-center items-center h-screen flex-col gap-16 bg-[#efd9b4]">
            <div className="text-3xl">Hi, {isVerified.fullName}</div>
            <div className="flex flex-col sm:flex-row gap-20">
              <div
                className="border-2 border-black p-12 rounded-lg cursor-pointer text-xl hover:bg-slate-200"
                onClick={() =>
                  (window.location.href = "/ticket/raise/inverter")
                }
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
          </div>
        )}
    </div>
  );
}
