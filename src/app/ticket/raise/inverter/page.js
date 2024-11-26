"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Form, FormGroup, Label, Input, Row, Col } from "reactstrap";

export default function RaiseInverterTicketPage() {
  const [inverterQuestionData, setInverterQuestionData] = useState([]);
  const [inverterAnswers, setInverterAnswers] = useState([]);
  const [quesDropdownLimit, setQuesDropdownLimit] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("/api/inverterfaultquestions");
      setInverterQuestionData(result.data.questions);
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("####", quesDropdownLimit);
  }, [quesDropdownLimit]);

  const handleInverterDropdownLimit = (srNo, value) => {
    setQuesDropdownLimit({ ...quesDropdownLimit, [srNo]: parseInt(value) });
  };

  const getDefaultInverterQuestionForm = (question) => {
    const ques = question.questionChild[0];
    return (
      <Col>
        <FormGroup className="flex flex-col gap-2">
          <Label for="inverterQuestion" className="font-medium">
            {ques.question}
          </Label>
          {ques.textAllowed && (
            <Input
              type="text"
              name="inverterQuestion"
              id="inverterQuestion"
              placeholder="Enter your answer"
            />
          )}
          {ques.photoAllowed && (
            <Input
              type="file"
              name="inverterQuestion"
              id="inverterQuestion"
              placeholder="Upload photo"
            />
          )}
        </FormGroup>
      </Col>
    );
  };

  const getDropdownInterventionForm = (question) => {
    return (
      <>
        <Col>
          <FormGroup>
            <Label for="intervention" className="font-medium">
              {question.question}
            </Label>
            <Input
              type="select"
              name="intervention"
              id="intervention"
              onChange={(e) =>
                handleInverterDropdownLimit(question.srNo, e.target.value)
              }
            >
              <option value="">Select</option>
              {new Array(question.maxDropdownElements)
                .fill(0)
                .map((opt, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
            </Input>
          </FormGroup>
        </Col>
        <div className="flex flex-col">
          {Array.from({ length: quesDropdownLimit[question.srNo] }).map(
            (_, i) =>
              question.questionChild.map((ques, index) => (
                <Col key={`${i}-${index}`}>
                  <FormGroup className="flex flex-col gap-2">
                    <Label
                      for={`inverterQuestion-${i}-${index}`}
                      className="font-medium"
                    >
                      {ques.question} - {i + 1}
                    </Label>
                    {ques.textAllowed && (
                      <Input
                        type="text"
                        name={`inverterQuestion-${i}-${index}`}
                        id={`inverterQuestion-${i}-${index}`}
                        placeholder="Enter your answer"
                      />
                    )}
                    {ques.photoAllowed && (
                      <Input
                        type="file"
                        name={`inverterQuestion-${i}-${index}`}
                        id={`inverterQuestion-${i}-${index}`}
                        placeholder="Upload photo"
                      />
                    )}
                  </FormGroup>
                </Col>
              ))
          )}
        </div>
      </>
    );
  };

  return (
    <div>
      <h1>Raise Inverter Ticket</h1>
      <Form>
        {inverterQuestionData.map((question) => (
          <Row key={question._id}>
            {question.maxDropdownElements === 1
              ? getDefaultInverterQuestionForm(question)
              : getDropdownInterventionForm(question)}
          </Row>
        ))}
      </Form>
    </div>
  );
}
