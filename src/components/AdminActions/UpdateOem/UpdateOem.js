/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import BounceLoader from "react-spinners/BounceLoader";
import { spinnerColor } from "@/constants/colors";
import sanatizeHtml from "sanitize-html";
import { Form, FormGroup, Label, Input, Button, Row, Col, FormFeedback } from "reactstrap";
import { userRoles } from "@/constants/role";
import { toast } from "react-toastify";

export default function UpdateOem() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [newOemData, setNewOemData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    password: "",
    gstNumber: "",
    phone: "",
    role: userRoles.OEM,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [searchOemEmail, setSearchOemEmail] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [toEditOem, setToEditOem] = useState(false);
  const [errors, setErrors] = useState({
    fullNameError: '',
    emailError: '',
    gstError: '',
    phoneNumberError: '',
    companyNameError: '',
    passwordError: ''
  });
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setSearchOemEmail("");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_VERCEL_BASE_PATH}/api/register`,
        newOemData
      );
      console.log(response);
      toast("OEM added successfully");
      setIsLoading(false);
      setNewOemData({
        fullName: "",
        companyName: "",
        email: "",
        password: "",
        gstNumber: "",
        phone: "",
        role: userRoles.OEM,
      });
      setConfirmPassword("");
    } catch (e) {
      setIsLoading(false);
      toast("Error while adding OEM");
      setNewOemData({
        fullName: "",
        companyName: "",
        email: "",
        password: "",
        gstNumber: "",
        phone: "",
        role: userRoles.OEM,
      });
      setConfirmPassword("");
    }
  };

  const handleSearchOem = async () => {
    try {
      setIsSearchLoading(true);
      setToEditOem(false);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_VERCEL_BASE_PATH}/api/oem/searchoem`,
        { email: searchOemEmail }
      );
      console.log(response);
      toast("OEM found");
      setIsSearchLoading(false);
      setNewOemData({
        fullName: "",
        companyName: "",
        email: "",
        password: "",
        gstNumber: "",
        phone: "",
        role: userRoles.OEM,
      });
      setSearchResult([response.data.user]);
    } catch (e) {
      setIsSearchLoading(false);
      setSearchResult([]);
      toast("Error while searching OEM");
    }
  };

  const handleGetAllOem = async () => {
    try {
      setIsSearchLoading(true);
      setToEditOem(false);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_VERCEL_BASE_PATH}/api/oem/getalloem`
      );
      console.log(response);
      setSearchResult(response.data.users);
      toast("Got all OEM");
      setIsSearchLoading(false);
      setNewOemData({
        fullName: "",
        companyName: "",
        email: "",
        password: "",
        gstNumber: "",
        phone: "",
        role: userRoles.OEM,
      });
    } catch (e) {
      setIsSearchLoading(false);
      toast("Error while getting all OEM");
    }
  };

  const handleEditOem = (user) => {
    setToEditOem(true);
    setSearchOemEmail("");
    setNewOemData({
      fullName: user.fullName,
      companyName: user.companyName,
      email: user.email,
      password: user.password,
      gstNumber: user.gstnumber,
      phone: user.phone,
    });
  };

  const handleSubmitEditOem = async () => {
    try {
      setIsLoading(true);
      setSearchResult([]);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_VERCEL_BASE_PATH}/api/oem/editoem`,
        newOemData
      );
      console.log(response);
      toast("OEM edited successfully");
      setIsLoading(false);
      setNewOemData({
        fullName: "",
        companyName: "",
        email: "",
        password: "",
        gstNumber: "",
        phone: "",
        role: userRoles.OEM,
      });
      setConfirmPassword("");
    } catch (e) {
      setIsLoading(false);
      toast("Error while editing OEM");
      setNewOemData({
        fullName: "",
        companyName: "",
        email: "",
        password: "",
        gstNumber: "",
        phone: "",
        role: userRoles.OEM,
      });
      setConfirmPassword("");
    }
  };

  const handleDeleteOem = async (email) => {
    try {
      setIsSearchLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_VERCEL_BASE_PATH}/api/oem/deleteoem`,
        { email: sanatizeHtml(email) }
      );
      console.log(response);
      toast("OEM deleted successfully");
      setIsSearchLoading(false);
      setSearchResult([]);
    } catch (e) {
      setIsSearchLoading(false);
      toast("Error while deleting OEM");
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
            <div className="font-bold text-xl text-black">Add new OEM : </div>
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
                        invalid={!!errors.fullNameError}
                        value={newOemData.fullName}
                        onChange={(e) => {
                          setNewOemData({
                            ...newOemData,
                            fullName: sanatizeHtml(e.target.value),
                          })
                          if (e.target.value.length < 5 || e.target.value.length > 50) {
                            setErrors({ ...errors, fullNameError: 'Full name length must be between 5 to 50' })
                          } else {
                            setErrors({ ...errors, fullNameError: '' })
                          }
                        }}
                      />
                      {errors.fullNameError && <FormFeedback>{errors.fullNameError}</FormFeedback>}

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
                        invalid={!!errors.companyNameError}
                        value={newOemData.companyName}
                        onChange={(e) => {
                          setNewOemData({
                            ...newOemData,
                            companyName: sanatizeHtml(e.target.value),
                          })
                          if (e.target.value.length < 5 || e.target.value.length > 50) {
                            setErrors({ ...errors, companyNameError: 'Company name length must be between 5 to 50' })
                          } else {
                            setErrors({ ...errors, companyNameError: '' })
                          }
                        }}
                      />
                      {errors.companyNameError && <FormFeedback>{errors.companyNameError}</FormFeedback>}

                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={newOemData.phone}
                        placeholder="Enter phone number"
                        type="text"
                        invalid={!!errors.phoneNumberError}
                        onChange={(e) => {
                          setNewOemData({
                            ...newOemData,
                            phone: sanatizeHtml(e.target.value),
                          })
                          const phoneRegex = /^[0-9]{10}$/;
                          const test = phoneRegex.test(e.target.value);
                          if (!test) {
                            setErrors({ ...errors, phoneNumberError: 'Phone number length should be 10' })
                          } else {
                            setErrors({ ...errors, phoneNumberError: '' })
                          }
                        }}
                      />
                      {errors.phoneNumberError && <FormFeedback>{errors.phoneNumberError}</FormFeedback>}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="email">Email</Label>
                      <Input
                        id="email"
                        value={newOemData.email}
                        name="email"
                        placeholder="Enter email"
                        type="email"
                        invalid={!!errors.emailError}
                        onChange={(e) => {
                          setNewOemData({
                            ...newOemData,
                            email: sanatizeHtml(e.target.value),
                          })
                          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                          const test = emailRegex.test(e.target.value);
                          if (!test) {
                            setErrors({ ...errors, emailError: 'Invalid Email' })
                          } else {
                            setErrors({ ...errors, emailError: '' })
                          }
                        }
                        }
                      />
                      {errors.emailError && <FormFeedback>{errors.emailError}</FormFeedback>}

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
                        invalid={!!errors.gstError}

                        value={newOemData.gstNumber}
                        onChange={(e) => {
                          setNewOemData({
                            ...newOemData,
                            gstNumber: sanatizeHtml(e.target.value),
                          })
                          const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}$/;
                          const test = gstRegex.test(e.target.value);
                          if (!test) {
                            if (e.target.value.length > 0) {
                              setErrors({ ...errors, gstError: 'Invalid GST number' })
                            } else {
                              setErrors({ ...errors, gstError: '' })
                            }
                          } else {
                            setErrors({ ...errors, gstError: '' })
                          }
                        }
                        }
                      />
                      {errors.gstError && <FormFeedback>{errors.gstError}</FormFeedback>}

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
                        invalid={!!errors.passwordError}
                        onChange={(e) => {
                          setNewOemData({
                            ...newOemData,
                            password: sanatizeHtml(e.target.value),
                          })
                          if (e.target.value.length < 6) {
                            setErrors({ ...errors, passwordError: 'Minimum password length should be 6' })
                          } else {
                            setErrors({ ...errors, passwordError: '' })
                          }
                        }
                        }
                      />
                      {errors.passwordError && <FormFeedback>{errors.passwordError}</FormFeedback>}

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
                        newOemData.password === confirmPassword && (
                          <span className="italic text-sm text-green-500">
                            Password Matched
                          </span>
                        )}
                      {confirmPassword !== "" &&
                        newOemData.password !== confirmPassword && (
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
                    disabled={Object.values(errors).some((error) => error !== '') || newOemData.password !== confirmPassword}
                    onClick={() => {
                      if (toEditOem) {
                        handleSubmitEditOem();
                      } else {
                        handleSubmit();
                      }
                    }}
                  >
                    {toEditOem ? "Edit OEM" : "Add OEM"}
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
                placeholder="Enter OEM email"
                onChange={(e) =>
                  setSearchOemEmail(sanatizeHtml(e.target.value))
                }
              />
            </div>
            {!isSearchLoading && (
              <>
                <div
                  className={`flex flex-row gap-2 justify-center items-center p-1 rounded-lg border-2 border-green-500 hover:bg-green-300 bg-green-400 w-[30%] ${searchOemEmail === ""
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                    }`}
                  onClick={() => searchOemEmail !== "" && handleSearchOem()}
                >
                  <div className="text-md text-black ">Search OEM</div>
                  <div className="w-[10%] p-1">
                    <img src="/images/search.svg" alt="add icon" />
                  </div>
                </div>
                <div
                  className={`flex flex-row gap-2 justify-center items-center p-1 rounded-lg border-2 border-green-500 hover:bg-green-300 bg-yellow-400 w-[30%] ${searchOemEmail === ""
                    ? "cursor-pointer"
                    : "cursor-not-allowed"
                    }`}
                  onClick={() => {
                    searchOemEmail === "" && handleGetAllOem();
                  }}
                >
                  <div className="text-md text-black ">Get All OEM</div>
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
              <div className="text-2xl text-black">Found OEM :</div>
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
                        onClick={() => handleEditOem(user)}
                        className="cursor-pointer"
                      >
                        <img src="/images/edit.svg" alt="edit icon" />
                      </div>
                      <div
                        onClick={() => handleDeleteOem(user.email)}
                        className="cursor-pointer"
                      >
                        <img src="/images/delete.svg" alt="edit icon" />
                      </div>
                    </div>
                  </div>
                ))}
                {searchResult.length === 0 && (
                  <div className="text-black text-lg">No OEM found</div>
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
