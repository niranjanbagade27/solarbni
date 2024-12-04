"use client";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import BounceLoader from "react-spinners/BounceLoader";
import { spinnerColor } from "@/constants/colors";
import { userRoles } from "@/constants/role";
export default function LoginComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_VERCEL_BASE_PATH}/api/login`,
        loginData
      );
      toast("Login Successful");
      setIsLoading(false);
      setTimeout(() => {
        if (response.data.user.role === userRoles.ADMIN) {
          window.location.href = "/profile";
        }
        if (response.data.user.role === userRoles.CONTRACTOR) {
          window.location.href = "/ticket/raise";
        }
      }, 2000);
    } catch (error) {
      // Handle errors here
      console.error("Login Error:", error); // Example: log the error to console
      setIsLoading(false); // Assuming you want to stop loading animation on error
      toast("Login Failed: " + error.response.data.message); // Example: display error message
    } finally {
      // Code to always run (optional)
    }
  };
  return (
    <Form style={{ width: "100%" }}>
      <FormGroup floating>
        <Input
          id="exampleEmail"
          name="email"
          placeholder="Email"
          type="email"
          style={{ width: "100%" }}
          onChange={(e) =>
            setLoginData({ ...loginData, email: e.target.value })
          }
        />
        <Label for="exampleEmail">Email</Label>
      </FormGroup>{" "}
      <FormGroup floating>
        <Input
          id="examplePassword"
          name="password"
          placeholder="Password"
          type="password"
          onChange={(e) =>
            setLoginData({ ...loginData, password: e.target.value })
          }
        />
        <Label for="examplePassword">Password</Label>
      </FormGroup>{" "}
      {!isLoading && (
        <Button color="primary" onClick={() => handleSubmit()}>
          Submit
        </Button>
      )}
      {isLoading && <BounceLoader color={spinnerColor} />}
    </Form>
  );
}
