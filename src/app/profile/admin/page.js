"use client";
import { useState, useEffect } from "react";
import useVerifyUser from "@/hooks/verifyUser";
import BounceLoader from "react-spinners/BounceLoader";
import { spinnerColor } from "@/constants/colors";
import { userRoles } from "@/constants/role";
import { adminProfileTabs } from "@/constants/adminProfileTabs";
import UpdatePanel from "@/components/AdminActions/UpdatePanel/UpdatePanel";
import UpdateInverter from "@/components/AdminActions/UpdateInverter/UpdateInverter";
import UpdateOEM from "@/components/AdminActions/UpdateOem/UpdateOem";
import UpdateContractor from "@/components/AdminActions/UpdateContractor/UpdateContractor";
import AdminProfile from "@/components/AdminActions/AdminProfile/AdminProfile";
export default function AdminProfilePage() {
  const { isVerified, verifyingUser, error } = useVerifyUser();
  const [currentTab, setCurrentTab] = useState(adminProfileTabs.OEM);
  useEffect(() => {
    if (!verifyingUser && isVerified === false) {
      window.location.href = "/login";
    } else if (!verifyingUser && isVerified.role !== userRoles.ADMIN) {
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

  const getTabComponent = (tab) => {
    switch (tab) {
      case adminProfileTabs.PROFILE:
        return <AdminProfile loggedInUser={isVerified} />;
      case adminProfileTabs.PANEL:
        return <UpdatePanel loggedInUser={isVerified} />;
      case adminProfileTabs.INVERTER:
        return <UpdateInverter loggedInUser={isVerified} />;
      case adminProfileTabs.OEM:
        return <UpdateOEM loggedInUser={isVerified} />;
      case adminProfileTabs.CONTRACTOR:
        return <UpdateContractor loggedInUser={isVerified} />;
      default:
        return <AdminProfile loggedInUser={isVerified} />;
    }
  };

  return (
    <div>
      {verifyingUser && (
        <div className="flex justify-center items-center h-full">
          <BounceLoader color={spinnerColor} />
        </div>
      )}
      {!verifyingUser && isVerified._id && (
        <div className="my-6">
          <div className="flex flex-col">
            <div className="grid grid-flow-row grid-cols-5 gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
              <div onClick={() => setCurrentTab(adminProfileTabs.PROFILE)}>
                <span
                  href="#"
                  className={`inline-flex items-center px-4 py-3 cursor-pointer rounded-lg ${
                    currentTab === adminProfileTabs.PROFILE
                      ? "text-white bg-blue-700 dark:bg-blue-600"
                      : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                  } w-full h-[5vh]`}
                  aria-current="page"
                >
                  {adminProfileTabs.PROFILE}
                </span>
              </div>
              <div onClick={() => setCurrentTab(adminProfileTabs.PANEL)}>
                <span
                  href="#"
                  className={`inline-flex items-center px-4 py-3 cursor-pointer rounded-lg ${
                    currentTab === adminProfileTabs.PANEL
                      ? "text-white bg-blue-700 dark:bg-blue-600"
                      : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                  } w-full h-[5vh]`}
                  aria-current="page"
                >
                  {adminProfileTabs.PANEL}
                </span>
              </div>
              <div onClick={() => setCurrentTab(adminProfileTabs.INVERTER)}>
                <span
                  href="#"
                  className={`inline-flex items-center px-4 py-3 cursor-pointer rounded-lg ${
                    currentTab === adminProfileTabs.INVERTER
                      ? "text-white bg-blue-700 dark:bg-blue-600"
                      : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                  } w-full h-[5vh]`}
                  aria-current="page"
                >
                  {adminProfileTabs.INVERTER}
                </span>
              </div>
              <div onClick={() => setCurrentTab(adminProfileTabs.OEM)}>
                <span
                  href="#"
                  className={`inline-flex items-center px-4 py-3 cursor-pointer rounded-lg ${
                    currentTab === adminProfileTabs.OEM
                      ? "text-white bg-blue-700 dark:bg-blue-600"
                      : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                  } w-full h-[5vh]`}
                  aria-current="page"
                >
                  {adminProfileTabs.OEM}
                </span>
              </div>
              <div onClick={() => setCurrentTab(adminProfileTabs.CONTRACTOR)}>
                <span
                  href="#"
                  className={`inline-flex items-center px-4 py-3 cursor-pointer rounded-lg ${
                    currentTab === adminProfileTabs.CONTRACTOR
                      ? "text-white bg-blue-700 dark:bg-blue-600"
                      : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                  } w-full h-[5vh]`}
                  aria-current="page"
                >
                  {adminProfileTabs.CONTRACTOR}
                </span>
              </div>
            </div>
            <div className="p-6 bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full min-h-[80vh]">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 h-[5%]">
                {currentTab} Tab
              </h3>
              <div>{getTabComponent(currentTab)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
