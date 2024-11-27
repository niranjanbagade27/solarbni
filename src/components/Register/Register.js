"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import BounceLoader from "react-spinners/BounceLoader";
import { spinnerColor } from "@/constants/colors";
import sanatizeHtml from "sanitize-html";
import { Form, FormGroup, Label, Input, Button, Row, Col, FormFeedback } from "reactstrap";
import { userRoles } from "@/constants/role";
import { toast } from "react-toastify";


export default function LoginComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    fullNameError: '',
    emailError: '',
    gstError: '',
    phoneNumberError: '',
    companyNameError: '',
    passwordError: ''
  });
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

  useEffect(() => {
    console.log(errors)
  }, [errors])

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      console.log("saving info ", newContractorData);
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
      console.log(e);
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

  return (
    <div className="h-[50%]">
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
                invalid={!!errors.fullNameError}
                onChange={(e) => {
                  setNewContractorData({
                    ...newContractorData,
                    fullName: sanatizeHtml(e.target.value),
                  })
                  if (e.target.value.length < 5 || e.target.value.length > 50) {
                    setErrors({ ...errors, fullNameError: 'Full name length must be between 5 to 50' })
                  } else {
                    setErrors({ ...errors, fullNameError: '' })
                  }
                }
                }
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
                value={newContractorData.companyName}
                invalid={!!errors.companyNameError}
                onChange={(e) => {
                  setNewContractorData({
                    ...newContractorData,
                    companyName: sanatizeHtml(e.target.value),
                  })
                  if (e.target.value.length < 5 || e.target.value.length > 50) {
                    setErrors({ ...errors, companyNameError: 'Company name length must be between 5 to 50' })
                  } else {
                    setErrors({ ...errors, companyNameError: '' })
                  }
                }
                }
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
                value={newContractorData.phone}
                placeholder="Enter phone number"
                type="text"
                invalid={!!errors.phoneNumberError}
                onChange={(e) => {
                  setNewContractorData({
                    ...newContractorData,
                    phone: sanatizeHtml(e.target.value),
                  })
                  const phoneRegex = /^[0-9]{10}$/;

                  const test = phoneRegex.test(e.target.value);
                  if (!test) {
                    setErrors({ ...errors, phoneNumberError: 'Phone number length should be 10' })
                  } else {
                    setErrors({ ...errors, phoneNumberError: '' })
                  }
                }
                }
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
                value={newContractorData.email}
                name="email"
                placeholder="Enter email"
                type="email"
                invalid={!!errors.emailError}
                onChange={(e) => {
                  setNewContractorData({
                    ...newContractorData,
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
                value={newContractorData.gstNumber}
                invalid={!!errors.gstError}
                onChange={(e) => {
                  setNewContractorData({
                    ...newContractorData,
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
                  setNewContractorData({
                    ...newContractorData,
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
            disabled={Object.values(errors).some((error) => error !== '')}
            onClick={() => {
              handleSubmit();
            }}
          >
            Register
          </Button>
        )}
        {isLoading && <BounceLoader color={spinnerColor} />}
      </Form>
    </div>
  );
}
