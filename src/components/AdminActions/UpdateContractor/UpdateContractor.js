/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import BounceLoader from "react-spinners/BounceLoader";
import { spinnerColor } from "@/constants/colors";
import sanatizeHtml from "sanitize-html";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  FormFeedback,
} from "reactstrap";
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
    officeAddress: "",
    pincode: "",
  });
  const [errors, setErrors] = useState({
    fullNameError: "",
    emailError: "",
    gstError: "",
    phoneNumberError: "",
    companyNameError: "",
    passwordError: "",
    officeAddressError: "",
    pincodeError: "",
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
        officeAddress: "",
        pincode: "",
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
        officeAddress: "",
        pincode: "",
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
        officeAddress: "",
        pincode: "",
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
        officeAddress: "",
        pincode: "",
      });
    } catch (e) {
      setIsSearchLoading(false);
      toast("Error while getting all CONTRACTOR");
    }
  };

  const handleVerifiedContractors = async () => {
    try {
      setIsSearchLoading(true);
      setToEditContractor(false);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_VERCEL_BASE_PATH}/api/contractor/getverifiedcontractors`
      );
      console.log(response);
      setSearchResult(response.data.users);
      toast("Got Verified CONTRACTOR");
      setIsSearchLoading(false);
      setNewContractorData({
        fullName: "",
        companyName: "",
        email: "",
        password: "",
        gstNumber: "",
        phone: "",
        role: userRoles.CONTRACTOR,
        officeAddress: "",
        pincode: "",
      });
    } catch (e) {
      setIsSearchLoading(false);
      toast("Error while getting verified CONTRACTOR");
    }
  };

  const handleUnverifiedContractors = async () => {
    try {
      setIsSearchLoading(true);
      setToEditContractor(false);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_VERCEL_BASE_PATH}/api/contractor/getunverifiedcontractors`
      );
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

  const handleResetPassword = async (currEmail) => {
    try {
      console.log("searching pwd for ", currEmail);
      setIsSearchLoading(true);
      setToEditContractor(false);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_VERCEL_BASE_PATH}/api/contractor/resetpassword`,
        { email: currEmail }
      );
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
      officeAddress: user.officeAddress,
      pincode: user.pincode,
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

  const handleVerifyContractor = async (email) => {
    try {
      setIsSearchLoading(true);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_VERCEL_BASE_PATH}/api/contractor/verifycontractor`,
        { email }
      );
      console.log(response);
      toast("CONTRACTOR verified successfully");
      setIsSearchLoading(false);
      setSearchResult([]);
    } catch (e) {
      setIsSearchLoading(false);
      toast("Error while verifying CONTRACTOR");
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
            {/* <div className="font-bold text-xl text-black">Add new CONTRACTOR : </div> */}
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
                        value={newContractorData.fullName}
                        onChange={(e) => {
                          setNewContractorData({
                            ...newContractorData,
                            fullName: sanatizeHtml(e.target.value),
                          });
                          if (
                            e.target.value.length < 5 ||
                            e.target.value.length > 50
                          ) {
                            setErrors({
                              ...errors,
                              fullNameError:
                                "Full name length must be between 5 to 50",
                            });
                          } else {
                            setErrors({ ...errors, fullNameError: "" });
                          }
                        }}
                      />
                      {errors.fullNameError && (
                        <FormFeedback>{errors.fullNameError}</FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="companyName">
                        Installation Comapany Name
                      </Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        placeholder="Enter Company Name"
                        type="text"
                        invalid={!!errors.companyNameError}
                        value={newContractorData.companyName}
                        onChange={(e) => {
                          setNewContractorData({
                            ...newContractorData,
                            companyName: sanatizeHtml(e.target.value),
                          });
                          if (
                            e.target.value.length < 5 ||
                            e.target.value.length > 50
                          ) {
                            setErrors({
                              ...errors,
                              companyNameError:
                                "Company name length must be between 5 to 50",
                            });
                          } else {
                            setErrors({ ...errors, companyNameError: "" });
                          }
                        }}
                      />
                      {errors.companyNameError && (
                        <FormFeedback>{errors.companyNameError}</FormFeedback>
                      )}
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
                        invalid={!!errors.phoneNumberError}
                        onChange={(e) => {
                          setNewContractorData({
                            ...newContractorData,
                            phone: sanatizeHtml(e.target.value),
                          });
                          const phoneRegex = /^[0-9]{10}$/;
                          const test = phoneRegex.test(e.target.value);
                          if (!test) {
                            setErrors({
                              ...errors,
                              phoneNumberError:
                                "Phone number length should be 10",
                            });
                          } else {
                            setErrors({ ...errors, phoneNumberError: "" });
                          }
                        }}
                      />
                      {errors.phoneNumberError && (
                        <FormFeedback>{errors.phoneNumberError}</FormFeedback>
                      )}
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
                        invalid={!!errors.emailError}
                        onChange={(e) => {
                          setNewContractorData({
                            ...newContractorData,
                            email: sanatizeHtml(e.target.value),
                          });
                          const emailRegex =
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                          const test = emailRegex.test(e.target.value);
                          if (!test) {
                            setErrors({
                              ...errors,
                              emailError: "Invalid Email",
                            });
                          } else {
                            setErrors({ ...errors, emailError: "" });
                          }
                        }}
                      />
                      {errors.emailError && (
                        <FormFeedback>{errors.emailError}</FormFeedback>
                      )}
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
                        value={newContractorData.gstNumber}
                        onChange={(e) => {
                          setNewContractorData({
                            ...newContractorData,
                            gstNumber: sanatizeHtml(e.target.value),
                          });
                          const gstRegex =
                            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}$/;
                          const test = gstRegex.test(e.target.value);
                          if (!test) {
                            if (e.target.value.length > 0) {
                              setErrors({
                                ...errors,
                                gstError: "Invalid GST number",
                              });
                            } else {
                              setErrors({ ...errors, gstError: "" });
                            }
                          } else {
                            setErrors({ ...errors, gstError: "" });
                          }
                        }}
                      />
                      {errors.gstError && (
                        <FormFeedback>{errors.gstError}</FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="officeAddress">Office Address</Label>
                      <Input
                        id="officeAddress"
                        value={newContractorData.officeAddress}
                        name="officeAddress"
                        placeholder="Enter office address"
                        type="text"
                        invalid={!!errors.officeAddressError}
                        onChange={(e) => {
                          setNewContractorData({
                            ...newContractorData,
                            officeAddress: sanatizeHtml(e.target.value),
                          });
                          if (
                            e.target.value.length < 5 ||
                            e.target.value.length > 50
                          ) {
                            setErrors({
                              ...errors,
                              officeAddressError: "Invalid office address",
                            });
                          } else {
                            setErrors({ ...errors, officeAddressError: "" });
                          }
                        }}
                      />
                      {errors.officeAddressError && (
                        <FormFeedback>{errors.officeAddressError}</FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        placeholder="Enter pincode number"
                        type="text"
                        invalid={!!errors.pincodeError}
                        value={newContractorData.pincode}
                        onChange={(e) => {
                          setNewContractorData({
                            ...newContractorData,
                            pincode: sanatizeHtml(e.target.value),
                          });
                          if (e.target.value.length !== 6) {
                            setErrors({
                              ...errors,
                              pincodeError: "Invalid pincode number",
                            });
                          } else {
                            setErrors({ ...errors, pincodeError: "" });
                          }
                        }}
                      />
                      {errors.pincodeError && (
                        <FormFeedback>{errors.pincodeError}</FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="password">
                        Password (Fill only if you wish to reset the password)
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        placeholder="Enter password"
                        type="password"
                        invalid={!!errors.passwordError}
                        onChange={(e) => {
                          setNewContractorData({
                            ...newContractorData,
                            password: sanatizeHtml(e.target.value),
                          });
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="confirmPassword">
                        Confirm Password (Fill only if you wish to reset the
                        password)
                      </Label>
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
                    color="warning"
                    disabled={
                      Object.values(errors).some((error) => error !== "") ||
                      (newContractorData.password &&
                        confirmPassword &&
                        newContractorData.password !== confirmPassword)
                    }
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
          <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center gap-2 mt-8">
            <div className="w-[90%] sm:w-[50%]">
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
                  className={`flex flex-row gap-2 justify-center items-center p-1 rounded-lg border-2 border-green-500 hover:bg-green-300 bg-green-400 w-[80%] sm:w-[30%] ${
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
              </>
            )}

            {isSearchLoading && (
              <div className="flex justify-center items-center">
                <BounceLoader color={spinnerColor} />
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row justify-left mt-6 gap-2">
            <div
              className={`flex flex-row gap-2 justify-center items-center p-1 rounded-lg border-2 border-green-500 hover:bg-green-300 bg-yellow-400 w-[85%] sm:w-[30%] ${
                searchContractorEmail === ""
                  ? "cursor-pointer"
                  : "cursor-not-allowed"
              }`}
              onClick={() => {
                searchContractorEmail === "" && handleVerifiedContractors();
              }}
            >
              <div className="text-md text-black ">
                Get Verified CONTRACTORS
              </div>
              <div className="w-[10%] p-1">
                <img src="/images/search.svg" alt="add icon" />
              </div>
            </div>
            <div
              className={`flex flex-row gap-2 justify-center items-center p-1 rounded-lg border-2 border-green-500 hover:bg-green-300 bg-yellow-400 w-[85%] sm:w-[30%] ${
                searchContractorEmail === ""
                  ? "cursor-pointer"
                  : "cursor-not-allowed"
              }`}
              onClick={() => {
                searchContractorEmail === "" && handleUnverifiedContractors();
              }}
            >
              <div className="text-md text-black ">
                Get Unverified CONTRACTORS
              </div>
              <div className="w-[10%] p-1">
                <img src="/images/search.svg" alt="add icon" />
              </div>
            </div>
          </div>
          {!isSearchLoading && (
            <div className="mt-10">
              <div className="text-2xl text-black">List of CONTRACTORS :</div>
              <div className="mt-6 overflow-y-scroll max-h-[61vh] sm:max-w-[50%] max-w-[90%]">
                {searchResult.map((user, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row justify-between items-center gap-2 p-2 rounded-lg border-2 border-gray-300 mt-2 bg-white"
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
                      <div className="text-base text-black ml-6">
                        Office Address: {user.officeAddress}
                      </div>
                      <div className="text-base text-black ml-6">
                        Pincode: {user.pincode}
                      </div>
                    </div>
                    {!user.verified && (
                      <div className="hidden sm:block h-[100px] w-[1px] border-2 border-gray-600"></div>
                    )}
                    <div className="flex flex-row gap-4 mr-10">
                      <div
                        onClick={() => handleVerifyContractor(user.email)}
                        className="cursor-pointer max-h-[20px] max-w-[20px]"
                      >
                        {!user.verified && (
                          <img src="/images/verify.svg" alt="verify icon" />
                        )}
                        {user.verified && (
                          <img src="/images/block.svg" alt="block icon" />
                        )}
                      </div>
                      <div
                        onClick={() => handleEditContractor(user)}
                        className="cursor-pointer max-h-[20px] max-w-[20px]"
                      >
                        <img src="/images/edit.svg" alt="edit icon" />
                      </div>
                      {/* <div
                        onClick={() => handleResetPassword(user.email)}
                        className="cursor-pointer max-h-[20px] max-w-[20px]"
                      >
                        <img
                          src="/images/reset-password.svg"
                          alt="delete icon"
                        />
                      </div> */}
                      <div
                        onClick={() => handleDeleteContractor(user.email)}
                        className="cursor-pointer max-h-[20px] max-w-[20px]"
                      >
                        <img src="/images/delete.svg" alt="delete icon" />
                      </div>
                    </div>
                  </div>
                ))}
                {searchResult.length === 0 && (
                  <div className="text-black text-lg">No Result</div>
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
