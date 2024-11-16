"use client";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import axios from "axios";
import { useState } from "react";
export default function LoginComponent() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = async () => {
    const response = await axios.post("/api/login", loginData);
    console.log(response);
  };

  const handleRegister = async () => {
    const response = await axios.post("/api/register", loginData);
    console.log(response);
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
      <Button onClick={() => handleRegister()}>Register</Button>
    </Form>
  );
}