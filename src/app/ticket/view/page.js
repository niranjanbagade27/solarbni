"use client";
import { useEffect, useState } from "react";
import { Button, Col, Form, Input, Row } from "reactstrap";
import sanatizeHtml from "sanitize-html";
import useVerifyUser from "@/hooks/verifyUser";

export default function TicketPage() {
  const [ticketName, setTicketName] = useState();
  const [errorMsg, setErrorMsg] = useState(null);

  const { isVerified, verifyingUser, error } = useVerifyUser();
  useEffect(() => {
    if (!verifyingUser && isVerified === false) {
      window.location.href = "/login";
    }
  }, [isVerified, verifyingUser, error]);

  useEffect(() => {
    if (ticketName) {
      setErrorMsg(null);
    }
  }, [ticketName]);

  const handleSubmit = () => {
    if (!ticketName) {
      setErrorMsg("Please enter a ticket name");
      return;
    }
    window.location.href = `/ticket/view/${ticketName}`;
  };

  return (
    <div className="mt-24 sm:mt-6 flex justify-center items-center h-full flex-col gap-10">
      <div className="w-[80%] font-medium text-4xl">View a specific ticket</div>
      <div className="w-[80%]">
        <Form>
          <Row>
            <Col md={12}>
              <Input
                type="text"
                name="Ticket Name"
                placeholder="Ticket Name"
                required
                onChange={(e) => setTicketName(sanatizeHtml(e.target.value))}
              />
            </Col>
          </Row>
          <br></br>
          <Row>
            <Col md={12}>
              <Button color="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </Col>
          </Row>
          <br></br>
          <Row>
            <Col md={12}>
              {errorMsg && <div className="text-red-500 italic">{errorMsg}</div>}
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}
