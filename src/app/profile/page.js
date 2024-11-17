"use client";
import useVerifyUser from "@/hooks/verifyUser";
import { useEffect } from "react";
import BounceLoader from "react-spinners/BounceLoader";
import { spinnerColor } from "@/constants/colors";
export default function ProfilePage() {
  const { isVerified, verifyingUser, error } = useVerifyUser();
  useEffect(() => {
    if (!verifyingUser && isVerified === false) {
      window.location.href = "/login";
    }
  }, [isVerified, verifyingUser, error]);
  return (
    <div className="h-screen">
      {verifyingUser && (
        <div className="flex justify-center items-center h-full">
          <BounceLoader color={spinnerColor} />
        </div>
      )}
      {!verifyingUser && isVerified._id && (
        <div>
          <h1>Welcome {isVerified.email}</h1>
        </div>
      )}
    </div>
  );
}
