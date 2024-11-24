/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import BounceLoader from "react-spinners/BounceLoader";
import { spinnerColor } from "@/constants/colors";
import sanatizeHtml from "sanitize-html";
import { Form, FormGroup, Label, Input, Button, Row, Col } from "reactstrap";
import { userRoles } from "@/constants/role";
import { toast } from "react-toastify";

export default function UpdateContractor() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [newContractorData, setNewContractorData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    password: "",
    gstNumber: "",
    phone: "",
    role: userRoles.CONTRACTOR,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [searchContractorEmail, setSearchContractorEmail] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [toEditContractor, setToEditContractor] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setSearchContractorEmail("");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_VERCEL_BASE_PATH}/api/register`,
        newContractorData
      );
      console.log(response);
      toast("CONTRACTOR added successfully");
      setIsLoading(false);
      setNewContractorData({
        fullName: "",
        companyName: "",
        email: "",
        password: "",
        gstNumber: "",
        phone: "",
        role: userRoles.CONTRACTOR,
      });
      setConfirmPassword("");
    } catch (e) {
      setIsLoading(false);
      toast("Error while adding CONTRACTOR");
      setNewContractorData({
        fullName: "",
        companyName: "",
        email: "",
        password: "",
        gstNumber: "",
        phone: "",
        role: userRoles.CONTRACTOR,
      });
      setConfirmPassword("");
    }
  };

  const handleSearchContractor = async () => {
    try {
      setIsSearchLoading(true);
      setToEditContractor(false);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_VERCEL_BASE_PATH}/api/contractor/searchcontractor`,
        { email: searchContractorEmail }
      );
      console.log(response);
      toast("CONTRACTOR found");
      setIsSearchLoading(false);
      setNewContractorData({
        fullName: "",
        companyName: "",
        email: "",
        password: "",
        gstNumber: "",
        phone: "",
        role: userRoles.CONTRACTOR,
      });
      setSearchResult([response.data.user]);
    } catch (e) {
      setIsSearchLoading(false);
      setSearchResult([]);
      toast("Error while searching CONTRACTOR");
    }
  };

  const handleGetAllContractor = async () => {
    try {
      setIsSearchLoading(true);
      setToEditContractor(false);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_VERCEL_BASE_PATH}/api/contractor/getallcontractor`
      );
      console.log(response);
      setSearchResult(response.data.users);
      toast("Got all CONTRACTOR");
      setIsSearchLoading(false);
      setNewContractorData({
        fullName: "",
        companyName: "",
        email: "",
        password: "",
        gstNumber: "",
        phone: "",
        role: userRoles.CONTRACTOR,
      });
    } catch (e) {
      setIsSearchLoading(false);
      toast("Error while getting all CONTRACTOR");
    }
  };

  const handleEditContractor = (user) => {
    setToEditContractor(true);
    setSearchContractorEmail("");
    setNewContractorData({
      fullName: user.fullName,
      companyName: user.companyName,
      email: user.email,
      password: user.password,
      gstNumber: user.gstnumber,
      phone: user.phone,
    });
  };

  const handleSubmitEditContractor = async () => {
    try {
      setIsLoading(true);
      setSearchResult([]);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_VERCEL_BASE_PATH}/api/contractor/editcontractor`,
        newContractorData
      );
      console.log(response);
      toast("CONTRACTOR edited successfully");
      setIsLoading(false);
      setNewContractorData({
        fullName: "",
        companyName: "",
        email: "",
        password: "",
        gstNumber: "",
        phone: "",
        role: userRoles.CONTRACTOR,
      });
      setConfirmPassword("");
    } catch (e) {
      setIsLoading(false);
      toast("Error while editing CONTRACTOR");
      setNewContractorData({
        fullName: "",
        companyName: "",
        email: "",
        password: "",
        gstNumber: "",
        phone: "",
        role: userRoles.CONTRACTOR,
      });
      setConfirmPassword("");
    }
  };

  const handleDeleteContractor = async (email) => {
    try {
      setIsSearchLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_VERCEL_BASE_PATH}/api/contractor/deletecontractor`,
        { email: sanatizeHtml(email) }
      );
      console.log(response);
      toast("CONTRACTOR deleted successfully");
      setIsSearchLoading(false);
      setSearchResult([]);
    } catch (e) {
      setIsSearchLoading(false);
      toast("Error while deleting CONTRACTOR");
    }
  };

  return (
    <div className="h-full">
      {isLoading && (
        <div className="flex justify-center items-center h-full">
          <BounceLoader color={spinnerColor} />
        </div>
      )}
      {!isLoading && (
        <>
          <div className="flex gap-3 flex-col">
            <div className="font-bold text-xl text-black">Add new CONTRACTOR : </div>
            <div>
              <Form style={{ width: "100%" }}>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="Enter Full Name"
                        type="text"
                        value={newContractorData.fullName}
                        onChange={(e) =>
                          setNewContractorData({
                            ...newContractorData,
                            fullName: sanatizeHtml(e.target.value),
                          })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        placeholder="Enter Company Name"
                        type="text"
                        value={newContractorData.companyName}
                        onChange={(e) =>
                          setNewContractorData({
                            ...newContractorData,
                            companyName: sanatizeHtml(e.target.value),
                          })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={newContractorData.phone}
                        placeholder="Enter phone number"
                        type="text"
                        onChange={(e) =>
                          setNewContractorData({
                            ...newContractorData,
                            phone: sanatizeHtml(e.target.value),
                          })
                        }
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="email">Email</Label>
                      <Input
                        id="email"
                        value={newContractorData.email}
                        name="email"
                        placeholder="Enter email"
                        type="email"
                        onChange={(e) =>
                          setNewContractorData({
                            ...newContractorData,
                            email: sanatizeHtml(e.target.value),
                          })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="gst">GST (optional)</Label>
                      <Input
                        id="gst"
                        name="gst"
                        placeholder="Enter GST number"
                        type="text"
                        value={newContractorData.gstNumber}
                        onChange={(e) =>
                          setNewContractorData({
                            ...newContractorData,
                            gstNumber: sanatizeHtml(e.target.value),
                          })
                        }
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        placeholder="Enter password"
                        type="password"
                        onChange={(e) =>
                          setNewContractorData({
                            ...newContractorData,
                            password: sanatizeHtml(e.target.value),
                          })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        name="password"
                        placeholder="Confirm password"
                        type="password"
                        onChange={(e) =>
                          setConfirmPassword(sanatizeHtml(e.target.value))
                        }
                      />
                      {confirmPassword !== "" &&
                        newContractorData.password === confirmPassword && (
                          <span className="italic text-sm text-green-500">
                            Password Matched
                          </span>
                        )}
                      {confirmPassword !== "" &&
                        newContractorData.password !== confirmPassword && (
                          <span className="italic text-sm text-rose-500">
                            Password Not Matched
                          </span>
                        )}
                    </FormGroup>
                  </Col>
                </Row>
                {!isLoading && (
                  <Button
                    color="primary"
                    onClick={() => {
                      if (toEditContractor) {
                        handleSubmitEditContractor();
                      } else {
                        handleSubmit();
                      }
                    }}
                  >
                    {toEditContractor ? "Edit CONTRACTOR" : "Add CONTRACTOR"}
                  </Button>
                )}
                {isLoading && <BounceLoader color={spinnerColor} />}
              </Form>
            </div>
          </div>
          <div className="flex flex-row justify-center items-center gap-2 mt-8">
            <div className="w-[70%]">
              <input
                type="text"
                id="panelCategory"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter CONTRACTOR email"
                onChange={(e) =>
                  setSearchContractorEmail(sanatizeHtml(e.target.value))
                }
              />
            </div>
            {!isSearchLoading && (
              <>
                <div
                  className={`flex flex-row gap-2 justify-center items-center p-1 rounded-lg border-2 border-green-500 hover:bg-green-300 bg-green-400 w-[30%] ${
                    searchContractorEmail === ""
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  onClick={() =>
                    searchContractorEmail !== "" && handleSearchContractor()
                  }
                >
                  <div className="text-md text-black ">Search CONTRACTOR</div>
                  <div className="w-[10%] p-1">
                    <img src="/images/search.svg" alt="add icon" />
                  </div>
                </div>
                <div
                  className={`flex flex-row gap-2 justify-center items-center p-1 rounded-lg border-2 border-green-500 hover:bg-green-300 bg-yellow-400 w-[30%] ${
                    searchContractorEmail === ""
                      ? "cursor-pointer"
                      : "cursor-not-allowed"
                  }`}
                  onClick={() => {
                    searchContractorEmail === "" && handleGetAllContractor();
                  }}
                >
                  <div className="text-md text-black ">Get All CONTRACTOR</div>
                  <div className="w-[10%] p-1">
                    <img src="/images/search.svg" alt="add icon" />
                  </div>
                </div>
              </>
            )}
            {isSearchLoading && (
              <div className="flex justify-center items-center">
                <BounceLoader color={spinnerColor} />
              </div>
            )}
          </div>
          {!isSearchLoading && (
            <div className="mt-10">
              <div className="text-2xl text-black">Found CONTRACTOR :</div>
              <div className="mt-6 overflow-y-scroll max-h-[61vh]">
                {searchResult.map((user, index) => (
                  <div
                    key={index}
                    className="flex flex-row justify-between items-center gap-2 p-2 rounded-lg border-2 border-gray-300 mt-2 hover:bg-gray-200"
                  >
                    <div className="p-2">
                      <div className="flex flex-row gap-2 text-black font-medium">
                        <div>{user.fullName}</div>
                      </div>
                      <div className="text-base text-black ml-6">
                        Company : {user.companyName}
                      </div>
                      <div className="text-base text-black ml-6">
                        Email : {user.email}
                      </div>
                      <div className="text-base text-black ml-6">
                        Phone: {user.phone}
                      </div>
                      <div className="text-base text-black ml-6">
                        Gst: {user.gstnumber}
                      </div>
                    </div>
                    <div className="w-[8%] flex flex-row gap-6">
                      <div
                        onClick={() => handleEditContractor(user)}
                        className="cursor-pointer"
                      >
                        <img src="/images/edit.svg" alt="edit icon" />
                      </div>
                      <div
                        onClick={() => handleDeleteContractor(user.email)}
                        className="cursor-pointer"
                      >
                        <img src="/images/delete.svg" alt="edit icon" />
                      </div>
                    </div>
                  </div>
                ))}
                {searchResult.length === 0 && (
                  <div className="text-black text-lg">No CONTRACTOR found</div>
                )}
              </div>
            </div>
          )}
          {isSearchLoading && (
            <div className="flex justify-center items-center">
              <BounceLoader color={spinnerColor} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
