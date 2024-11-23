"use client";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import BounceLoader from "react-spinners/BounceLoader";
import { spinnerColor } from "@/constants/colors";
export default function LoginComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = async () => {
    setIsLoading(true);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_VERCEL_BASE_PATH}/api/login`,
      loginData
    );
    toast("Login Successful");
    setIsLoading(false);
    setTimeout(() => {
      window.location.href = "/profile";
    }, 2000);
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
