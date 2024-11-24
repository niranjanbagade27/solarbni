"use client";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import axios from "axios";
import { useState } from "react";
import { userRoles } from "@/constants/role";
import { toast } from "react-toastify";
export default function LoginComponent() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const handleRegister = async () => {
    const response = await axios.post("/api/register", {
      ...loginData,
      fullName: "Anuj",
      companyName: "Singh",
      role: userRoles.ADMIN,
    });
    toast("Register Successful");
    setTimeout(() => {
      window.location.href = "/login";
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
      <Button onClick={() => handleRegister()}>Register</Button>
    </Form>
  );
}
