import { useState, useEffect } from "react";
import axios from "axios";
import BounceLoader from "react-spinners/BounceLoader";
import { spinnerColor } from "@/constants/colors";
import sanatizeHtml from "sanitize-html";
import { Form, FormGroup, Label, Input, Button, Row, Col, FormFeedback } from "reactstrap";
import { userRoles } from "@/constants/role";
import { toast } from "react-toastify";

export default function AdminProfilePage({ loggedInUser }) {
  const [isLoading, setIsLoading] = useState(false);
  const [resetPasswordData, setResetPassword] = useState({
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({
    passwordError: ''
  });
  const handleSubmit = async () => {
    setIsLoading(true);
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_VERCEL_BASE_PATH}/api/resetadminpassword`,
      { password: resetPasswordData.password }
    );
    if(response){
      toast("Reset Password Successful");
    }
    setIsLoading(false);
    setTimeout(() => {
      window.location.href = "/profile";
    }, 2000);
  };
  return (
    <>
      <div>
        <h1>
          Admin Profile Page, {loggedInUser.fullName} - {loggedInUser.companyName}
        </h1>
      </div>
      <div>
        <Form style={{ width: "100%" }}>
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
                    setResetPassword({
                      ...resetPasswordData,
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
                    setResetPassword({
                      ...resetPasswordData,
                      confirmPassword: sanatizeHtml(e.target.value),
                    })}
                />
                {resetPasswordData.confirmPassword !== "" &&
                  resetPasswordData.password === resetPasswordData.confirmPassword && (
                    <span className="italic text-sm text-green-500">
                      Password Matched
                    </span>
                  )}
                {resetPasswordData !== "" &&
                  resetPasswordData.password !== resetPasswordData.confirmPassword && (
                    <span className="italic text-sm text-rose-500">
                      Password Not Matched
                    </span>
                  )}
              </FormGroup>
            </Col>
          </Row>
          {!isLoading && (
            <Button color="primary" 
            disabled={Object.values(errors).some((error) => error !== '') || resetPasswordData.password !== resetPasswordData.confirmPassword}
            onClick={() => handleSubmit()}>
              Reset
            </Button>
          )}
          {isLoading && <BounceLoader color={spinnerColor} />}
        </Form>
      </div>
    </>
  );
}
