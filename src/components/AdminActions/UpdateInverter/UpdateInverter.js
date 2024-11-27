/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import axios from "axios";
import BounceLoader from "react-spinners/BounceLoader";
import { spinnerColor } from "@/constants/colors";
import sanatizeHtml from "sanitize-html";
import { inverterQuestionType } from "@/constants/inverterQuestion";
import { toast } from "react-toastify";

export default function UpdateInverter() {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [questionType, setQuestionType] = useState(
    inverterQuestionType.DEFAULT
  );
  const [isLoading, setIsLoading] = useState(false);
  const [quesSrNo, setQuesSrNo] = useState("");
  const [quesTitleDefault, setQuesTitleDefault] = useState("");
  const [quesTextAllowedDefault, setQuesTextAllowedDefault] = useState(false);
  const [quesPhotoAllowedDefault, setQuesPhotoAllowedDefault] = useState(false);

  const [quesChild, setQuesChild] = useState([]);
  const [quesDropdownLimit, setQuesDropdownLimit] = useState();
  const [quesDropdownText, setDropdownText] = useState("");
  const [quesUniqueDropdownCount, setQuesUniqueDropdownCount] = useState([]);

  const handleAddQuestion = async () => {
    try {
      setIsLoading(true);
      const quespayload = {};
      if (questionType === inverterQuestionType.DEFAULT) {
        quespayload.maxDropdownElements = 1;
        quespayload.srNo = sanatizeHtml(quesSrNo);
        quespayload.question = "";
        quespayload.questionChild = [
          {
            question: sanatizeHtml(quesTitleDefault),
            textAllowed: quesTextAllowedDefault,
            photoAllowed: quesPhotoAllowedDefault,
          },
        ];
      } else {
        quespayload.maxDropdownElements = quesDropdownLimit;
        quespayload.srNo = sanatizeHtml(quesSrNo);
        quespayload.question = sanatizeHtml(quesDropdownText);
        quespayload.questionChild = quesChild;
      }
      console.log("quespayload", quespayload);
      const response = await axios.post("/api/inverterfaultquestions", {
        ...quespayload,
      });
      console.log("response", response);
      toast("Question Added successfully");
      setIsLoading(false);
    } catch (e) {
      toast(e.response.data.message);
      setIsLoading(false);
    }
  };

  const getQuestionTypeForm = (questionType) => {
    switch (questionType) {
      case inverterQuestionType.DEFAULT:
        return (
          <div>
            <Form className="w-full text-black">
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="email">Question Serial Number</Label>
                    <Input
                      id="srno"
                      name="srno"
                      placeholder="Enter inverter question serial number"
                      type="number"
                      onChange={(e) =>
                        setQuesSrNo(sanatizeHtml(e.target.value))
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="h-full flex justify-center items-center gap-5">
                    <FormGroup check inline>
                      <Input
                        checked={quesTextAllowedDefault}
                        type="checkbox"
                        onChange={() =>
                          setQuesTextAllowedDefault(!quesTextAllowedDefault)
                        }
                      />
                      <Label check className="text-black">
                        Text allowed ?
                      </Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Input
                        checked={quesPhotoAllowedDefault}
                        type="checkbox"
                        onChange={() =>
                          setQuesPhotoAllowedDefault(!quesPhotoAllowedDefault)
                        }
                      />
                      <Label check className="text-black">
                        Photo Allowed ?
                      </Label>
                    </FormGroup>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label for="question">Question</Label>
                    <Input
                      id="question"
                      name="question"
                      placeholder="Enter question"
                      type="textarea"
                      onChange={(e) =>
                        setQuesTitleDefault(sanatizeHtml(e.target.value))
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </div>
        );
      case inverterQuestionType.DROPDOWN:
        return (
          <div>
            <Form className="w-full text-black">
              <Row>
                <Col md={4}>
                  <FormGroup>
                    <Label for="email">Question Serial Number</Label>
                    <Input
                      id="srno"
                      name="srno"
                      placeholder="Enter inverter question serial number"
                      type="number"
                      onChange={(e) =>
                        setQuesSrNo(sanatizeHtml(e.target.value))
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="dropdownUnique">
                      Dropdown Unique Question Count
                    </Label>
                    <Input
                      id="dropdownUnique"
                      name="dropdownUnique"
                      placeholder="Enter dropdown unique question count"
                      type="text"
                      onChange={(e) => {
                        if (e.target.value === "") {
                          setQuesUniqueDropdownCount([]);
                          setQuesChild([]);
                        } else {
                          setQuesUniqueDropdownCount(
                            new Array(
                              parseInt(sanatizeHtml(e.target.value))
                            ).fill(0)
                          );
                          setQuesChild(
                            new Array(
                              parseInt(sanatizeHtml(e.target.value))
                            ).fill({
                              question: "",
                              textAllowed: false,
                              photoAllowed: false,
                            })
                          );
                        }
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="dropdownLimit">Question Dropdown Limit</Label>
                    <Input
                      id="dropdownLimit"
                      name="dropdownLimit"
                      placeholder="Enter inverter question dropdown limit"
                      type="number"
                      onChange={(e) => {
                        if (e.target.value === "") {
                          setQuesDropdownLimit(1);
                        } else {
                          setQuesDropdownLimit(
                            parseInt(sanatizeHtml(e.target.value))
                          );
                        }
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label for="question">Dropdown text</Label>
                    <Input
                      id="dropquestion"
                      name="dropquestion"
                      placeholder="Enter dropdown text"
                      type="text"
                      onChange={(e) =>
                        setDropdownText(sanatizeHtml(e.target.value))
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
              {quesUniqueDropdownCount.map((ele, index) => (
                <div key={index}>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="email">
                          Question Dropdown Text {index + 1}
                        </Label>
                        <Input
                          id="srno"
                          name="srno"
                          placeholder="Enter inverter dropdown question"
                          type="text"
                          onChange={(e) => {
                            let newQuesChild = [...quesChild];
                            newQuesChild[index] = {
                              ...newQuesChild[index],
                              question: sanatizeHtml(e.target.value),
                            };
                            setQuesChild(newQuesChild);
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup className="h-full flex justify-center items-center gap-5">
                        <FormGroup check inline>
                          <Input
                            checked={quesChild[index].textAllowed}
                            type="checkbox"
                            onChange={() => {
                              let newQuesChild = [...quesChild];
                              newQuesChild[index] = {
                                ...newQuesChild[index],
                                textAllowed: !quesChild[index].textAllowed,
                              };
                              setQuesChild(newQuesChild);
                            }}
                          />
                          <Label check className="text-black">
                            Text allowed ?
                          </Label>
                        </FormGroup>
                        <FormGroup check inline>
                          <Input
                            checked={quesChild[index].photoAllowed}
                            type="checkbox"
                            onChange={() => {
                              let newQuesChild = [...quesChild];
                              newQuesChild[index] = {
                                ...newQuesChild[index],
                                photoAllowed: !quesChild[index].photoAllowed,
                              };
                              setQuesChild(newQuesChild);
                            }}
                          />
                          <Label check className="text-black">
                            Photo Allowed ?
                          </Label>
                        </FormGroup>
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
              ))}
            </Form>
          </div>
        );
      case inverterQuestionType.DELETE:
        return (
          <div>
            <Form className="w-full text-black">
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="email">Question Serial Number</Label>
                    <Input
                      id="srno"
                      name="srno"
                      placeholder="Enter inverter question serial number"
                      type="number"
                      onChange={(e) =>
                        setQuesSrNo(sanatizeHtml(e.target.value))
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </div>
        );
      default:
        return null;
    }
  };

  const handleDeleteSingleQuestion = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put("/api/inverterfaultquestions", {
        srNo: quesSrNo,
      });
      console.log("response", response);
      toast("Question Deleted successfully");
      setIsLoading(false);
    } catch (e) {
      toast(e.response.data.message);
      setIsLoading(false);
    }
  };

  const handleDeleteAllQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete("/api/inverterfaultquestions");
      console.log("response", response);
      toast("All Questions Deleted successfully");
      setIsLoading(false);
    } catch (e) {
      toast(e.response.data.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex flex-col">
        <div className="flex flex-row items-center">
          <div className="grid grid-flow-row grid-cols-5 gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
            <div>
              <span
                href="#"
                className={`inline-flex items-center px-4 py-3 rounded-lg w-full h-[5vh] text-black text-xl`}
              >
                Question Type :
              </span>
            </div>
            <div onClick={() => setQuestionType(inverterQuestionType.DEFAULT)}>
              <span
                href="#"
                className={`inline-flex items-center px-4 py-3 cursor-pointer rounded-lg ${
                  questionType === inverterQuestionType.DEFAULT
                    ? "text-white bg-blue-700 dark:bg-blue-600"
                    : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                } w-full h-[5vh]`}
              >
                {inverterQuestionType.DEFAULT}
              </span>
            </div>
            <div onClick={() => setQuestionType(inverterQuestionType.DROPDOWN)}>
              <span
                href="#"
                className={`inline-flex items-center px-4 py-3 cursor-pointer rounded-lg ${
                  questionType === inverterQuestionType.DROPDOWN
                    ? "text-white bg-blue-700 dark:bg-blue-600"
                    : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                } w-full h-[5vh]`}
              >
                {inverterQuestionType.DROPDOWN}
              </span>
            </div>
            <div onClick={() => setQuestionType(inverterQuestionType.DELETE)}>
              <span
                href="#"
                className={`inline-flex items-center px-4 py-3 cursor-pointer rounded-lg text-white bg-red-600 dark:bg-red-600 w-full h-[5vh]`}
              >
                DELETE QUESTIONS
              </span>
            </div>
          </div>
        </div>
        <div className="p-6 bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full min-h-[80vh]">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 h-[5%]">
            {questionType}{" "}
            {questionType === inverterQuestionType.DELETE
              ? ""
              : "Question Type"}
          </h3>
          <div>{getQuestionTypeForm(questionType)}</div>
          <div>
            {!isLoading && (
              <>
                {questionType !== inverterQuestionType.DELETE && (
                  <Button
                    color="primary"
                    className="mt-4"
                    onClick={() => handleAddQuestion()}
                  >
                    Add Question
                  </Button>
                )}
                {questionType === inverterQuestionType.DELETE && (
                  <div className="flex gap-5">
                    <Button
                      color="danger"
                      className="mt-4"
                      onClick={() => handleDeleteSingleQuestion()}
                    >
                      Delete Questions
                    </Button>
                    <Button
                      color="danger"
                      className="mt-4"
                      onClick={() => toggle()}
                    >
                      Delete All Questions
                    </Button>
                  </div>
                )}
              </>
            )}
            {isLoading && <BounceLoader color={spinnerColor} />}
            <Modal isOpen={modal} toggle={toggle}>
              <ModalHeader toggle={toggle}>
                Delete All Inverter Questions ?
              </ModalHeader>
              <ModalBody>
                Are you sure to delete all inverter questions ?
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  onClick={() => {
                    handleDeleteAllQuestions();
                    toggle();
                  }}
                >
                  Yes, Delete
                </Button>{" "}
                <Button color="secondary" onClick={toggle}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}
