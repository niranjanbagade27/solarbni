"use client";
import { Form, FormGroup, Label, Input, Button, Select } from "reactstrap";
import axios from "axios";
import { useState } from "react";
import { roles } from "@/constants/dataconstants"
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default function LoginComponent({ onChange, defaultValue = roles[1]  }) {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: defaultValue
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(defaultValue);

  const handleSubmit = async () => {
    const response = await axios.post("/api/login", loginData);
    console.log(response);
  };

  const handleRegister = async () => {
    const response = await axios.post("/api/register", loginData);
    console.log(response);
  };

  const toggle = () => setDropdownOpen(!dropdownOpen);
  
  const handleSelect = (role) => {
    setSelectedRole(role);
    if (onChange) {
      onChange(role); // Notify parent about the role change
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
      <FormGroup floating>
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle caret>{selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</DropdownToggle>
        <DropdownMenu>
          {roles.map((currRole) => (
            <DropdownItem key={currRole} onClick={() => {setLoginData({...loginData, role: currRole})
            handleSelect(currRole)}}>
              {currRole.charAt(0).toUpperCase() + currRole.slice(1)} {/* Capitalize the first letter */}
            </DropdownItem> 
          ))}
        </DropdownMenu>
      </Dropdown>
      </FormGroup>
      <Button onClick={() => handleSubmit()}>Submit</Button>
      <Button onClick={() => handleRegister()}>Register</Button>
    </Form>
  );
}
