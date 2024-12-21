"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react";
import useVerifyUser from "@/hooks/verifyUser";
import axios from "axios";
import { toast } from "react-toastify";
const Navbar = () => {
  const { isVerified, verifyingUser, error } = useVerifyUser();
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  return (
    <nav className="bg-gray-800 fixed w-full top-0 z-50 pb-12 sm:pb-0">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => {
                setShowMobileMenu(!showMobileMenu);
              }}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
              <svg
                className="hidden h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div
              className="flex-shrink-0 text-white flex justify-center items-center font-bold cursor-pointer -ml-56 sm:-ml-0"
              onClick={() => (window.location.href = "/")}
            >
              SOLAR BNI
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <a
                  href="/profile"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium no-underline"
                >
                  Profile
                </a>
                <a
                  href="/ticket/raise"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium no-underline"
                >
                  Tickets
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium no-underline"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 mt-20 sm:mt-0">
            {!isVerified && (
              <>
                <button
                  className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium"
                  onClick={() => (window.location.href = "/login")}
                >
                  Solar Installer log in
                </button>
                <button
                  className="ml-4 bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium"
                  onClick={() => (window.location.href = "/register")}
                >
                  Solar Installer sign up
                </button>
              </>
            )}
            {isVerified && (
              <>
                <span className="text-white italic">
                  Welcome, {isVerified.fullName}
                </span>
                <button
                  className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium"
                  onClick={async () => {
                    await axios.get("/api/logout");
                    toast("Logout Successful");
                    setTimeout(() => {
                      window.location.href = "/";
                    }, 2000);
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {showMobileMenu && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-12">
            <a
              href="/profile"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium no-underline"
            >
              Profile
            </a>
            <a
              href="/ticket/raise"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium no-underline"
            >
              Tickets
            </a>
            <a
              href="#"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium no-underline"
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
