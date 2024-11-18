"use client";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
export default function LoginComponent() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = async () => {
    console.log("vercel base path", rocess.env.VERCEL_BASE_PATH);
    const response = await axios.post(
      `${process.env.VERCEL_BASE_PATH}/api/login`,
      loginData
    );
    toast("Login Successful");
    setTimeout(() => {
      window.location.href = "/profile";
    }, 3000);
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
      <Button onClick={() => handleSubmit()}>Submit</Button>
    </Form>
  );
}
