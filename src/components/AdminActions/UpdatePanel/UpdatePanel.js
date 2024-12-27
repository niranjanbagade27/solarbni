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
import { panelQuestionType } from "@/constants/panelQuestion";
import { toast } from "react-toastify";

export default function UpdatePanel() {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [questionType, setQuestionType] = useState(panelQuestionType.DEFAULT);
  const [isLoading, setIsLoading] = useState(false);
  const [quesSrNo, setQuesSrNo] = useState("");
  const [quesTitleDefault, setQuesTitleDefault] = useState("");
  const [quesTextAllowedDefault, setQuesTextAllowedDefault] = useState(false);
  const [quesPhotoAllowedDefault, setQuesPhotoAllowedDefault] = useState(false);

  const [quesChild, setQuesChild] = useState([]);
  const [quesDropdownLimit, setQuesDropdownLimit] = useState();
  const [quesDropdownText, setDropdownText] = useState("");
  const [quesUniqueDropdownCount, setQuesUniqueDropdownCount] = useState([]);
  const [questionSection, setQuestionSection] = useState(1);
  const [panelQuestion, setPanelQuestion] = useState([]);
  const [isQuestionLoading, setIsQuestionLoading] = useState(true);
  const [showDropwdownEditQuesModal, setShowDropwdownEditQuesModal] =
    useState(false);
  const [dropdownEditModalData, setDropdownEditModalData] = useState({});
  const [newDropdownEntry, setNewDropdownEntry] = useState({
    question: "",
    textAllowed: false,
    photoAllowed: false,
  });

  const handleAddQuestion = async () => {
    try {
      setIsLoading(true);
      const quespayload = {};
      if (questionType === panelQuestionType.DEFAULT) {
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
        quespayload.questionSection = questionSection;
      } else {
        quespayload.maxDropdownElements = quesDropdownLimit;
        quespayload.srNo = sanatizeHtml(quesSrNo);
        quespayload.question = sanatizeHtml(quesDropdownText);
        quespayload.questionChild = quesChild;
        quespayload.questionSection = questionSection;
      }
      const response = await axios.post("/api/panelfaultquestions", {
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

  const fetchPanelQuestions = async () => {
    try {
      setIsQuestionLoading(true);
      const result = await axios.get("/api/panelfaultquestions");
      setPanelQuestion(result.data.questions);
      setIsQuestionLoading(false);
    } catch (e) {
      toast(e.response.data.message);
    }
  };

  useEffect(() => {
    fetchPanelQuestions();
  }, []);

  const handleUpdateQuestionSrNo = (id, value) => {
    const newPanelQuestion = panelQuestion.map((question) => {
      if (question._id === id) {
        return {
          ...question,
          srNo: sanatizeHtml(value),
        };
      }
      return question;
    });
    setPanelQuestion(newPanelQuestion);
  };

  const handleUpdateQuestionSection = (id, value) => {
    const newPanelQuestion = panelQuestion.map((question) => {
      if (question._id === id) {
        return {
          ...question,
          questionSection: sanatizeHtml(value),
        };
      }
      return question;
    });
    setPanelQuestion(newPanelQuestion);
  };

  const handleUpdateQuestionTextDefault = (id, value) => {
    const newPanelQuestion = panelQuestion.map((question) => {
      if (question._id === id) {
        return {
          ...question,
          questionChild: [
            {
              ...question.questionChild[0],
              question: sanatizeHtml(value),
            },
          ],
        };
      }
      return question;
    });
    setPanelQuestion(newPanelQuestion);
  };

  const handleShowDropdownQuesModal = (question) => {
    setShowDropwdownEditQuesModal(true);
    setDropdownEditModalData(question);
  };

  const handleAddNewDropdownQuestion = () => {
    const newQuesChild = [...dropdownEditModalData.questionChild];
    newQuesChild.push(newDropdownEntry);
    setDropdownEditModalData({
      ...dropdownEditModalData,
      questionChild: newQuesChild,
    });
    setNewDropdownEntry({
      question: "",
      textAllowed: false,
      photoAllowed: false,
    });
  };

  const handleDeleteDropdownEntry = (child) => {
    const newQuesChild = dropdownEditModalData.questionChild.filter(
      (ques) => ques !== child
    );
    setDropdownEditModalData({
      ...dropdownEditModalData,
      questionChild: newQuesChild,
    });
  };

  const handleUpdateQuestion = async (newPanelQuestion) => {
    try {
      setIsLoading(true);
      const updatedQuestionList = newPanelQuestion
        ? newPanelQuestion
        : panelQuestion;
      const quesPayload = updatedQuestionList.map((question) => {
        return {
          id: question._id,
          srNo: question.srNo,
          questionSection: question.questionSection,
          question: question.question,
          questionChild: question.questionChild,
        };
      });
      const response = await axios.post("/api/panelfaultquestions/update", {
        questions: quesPayload,
      });
      toast("Questions Updated successfully");
      fetchPanelQuestions();
      setIsLoading(false);
    } catch (e) {
      toast(e.response.data.message);
      setIsLoading(false);
    }
  };

  const getQuestionTypeForm = (questionType) => {
    switch (questionType) {
      case panelQuestionType.DEFAULT:
        return (
          <div>
            <Form className="w-full text-black">
              <Row>
                <Col md={6} className="mt-4 sm:mt-0">
                  <FormGroup>
                    <Label for="email">Question Serial Number</Label>
                    <Input
                      id="srno"
                      name="srno"
                      placeholder="Enter panel question serial number"
                      type="number"
                      onChange={(e) =>
                        setQuesSrNo(sanatizeHtml(e.target.value))
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="h-full flex flex-col sm:flex-row justify-center items-start sm:items-center gap-3 sm:gap-5">
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
                <Col md={12} className="mt-4 sm:mt-0">
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
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="quesHalf" className="font-medium">
                      Question Group Section
                    </Label>
                    <Input
                      type="select"
                      name="quesHalf"
                      id="quesHalf"
                      onChange={(e) => {
                        setQuestionSection(parseInt(e.target.value));
                      }}
                      required
                    >
                      <option value="">Select</option>
                      <option key={0} value={1}>
                        1
                      </option>
                      <option key={1} value={2}>
                        2
                      </option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </div>
        );
      case panelQuestionType.DROPDOWN:
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
                      placeholder="Enter panel question serial number"
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
                      placeholder="Enter panel question dropdown limit"
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
                          placeholder="Enter panel dropdown question"
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
      case panelQuestionType.DELETE:
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
                      placeholder="Enter panel question serial number"
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
      case panelQuestionType.REARRANGE:
        return (
          <div>
            {!isQuestionLoading &&
              panelQuestion.map((question, index) => (
                <div key={index}>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center items-start mt-4 gap-3 sm:gap-0">
                    <div className="w-[50%]">
                      Question Text
                      {question.question === "" && (
                        <div className="flex flex-col gap-2">
                          <div>
                            <Input
                              type="text"
                              value={question.questionChild[0].question}
                              onChange={(e) =>
                                handleUpdateQuestionTextDefault(
                                  question._id,
                                  sanatizeHtml(e.target.value)
                                )
                              }
                            />
                          </div>
                          <div className="flex flex-row gap-5">
                            <div>
                              <span className="pr-4">Text Allowed ?</span>
                              <Input
                                type="checkbox"
                                checked={question.questionChild[0].textAllowed}
                                onChange={() => {
                                  let newQuesChild = [
                                    ...dropdownEditModalData.questionChild,
                                  ];
                                  newQuesChild[0] = {
                                    ...newQuesChild[0],
                                    textAllowed:
                                      !question.questionChild[0].textAllowed,
                                  };
                                  setDropdownEditModalData({
                                    ...dropdownEditModalData,
                                    questionChild: newQuesChild,
                                  });
                                }}
                              />
                            </div>
                            <div>
                              <span className="pr-4">Photo Allowed ?</span>
                              <Input
                                type="checkbox"
                                checked={question.questionChild[0].photoAllowed}
                                onChange={() => {
                                  let newQuesChild = [
                                    ...dropdownEditModalData.questionChild,
                                  ];
                                  newQuesChild[0] = {
                                    ...newQuesChild[0],
                                    photoAllowed:
                                      !question.questionChild[0].photoAllowed,
                                  };
                                  setDropdownEditModalData({
                                    ...dropdownEditModalData,
                                    questionChild: newQuesChild,
                                  });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      {question.question !== "" && (
                        <div className="flex flex-row gap-5">
                          <div className="text-black text-md mt-1">
                            {question.question}
                          </div>
                          <div>
                            <Button
                              color="warning"
                              onClick={() =>
                                handleShowDropdownQuesModal(question)
                              }
                            >
                              Expand
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-row gap-2 sm:w-[40%] ">
                      <div className="w-[50%]">
                        Sr.No :{" "}
                        <Input
                          type="text"
                          value={question.srNo}
                          onChange={(e) =>
                            handleUpdateQuestionSrNo(
                              question._id,
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="w-[50%]">
                        Section :{" "}
                        <Input
                          type="select"
                          value={question.questionSection}
                          onChange={(e) =>
                            handleUpdateQuestionSection(
                              question._id,
                              e.target.value
                            )
                          }
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                        </Input>
                      </div>
                    </div>
                  </div>
                  <hr></hr>
                </div>
              ))}
            <Modal
              isOpen={showDropwdownEditQuesModal}
              toggle={() => setShowDropwdownEditQuesModal(false)}
              size="lg"
            >
              <ModalHeader toggle={() => setShowDropwdownEditQuesModal(false)}>
                Edit Dropdown Question
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-6">
                  <div>
                    <i>Main Question Text</i>
                    <Input
                      type="text"
                      value={dropdownEditModalData.question}
                      onChange={(e) => {
                        setDropdownEditModalData({
                          ...dropdownEditModalData,
                          question: sanatizeHtml(e.target.value),
                        });
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <i>Dropdown Questions</i>
                    {dropdownEditModalData &&
                      dropdownEditModalData?.questionChild &&
                      dropdownEditModalData?.questionChild.map(
                        (child, index) => (
                          <div key={index} className="flex flex-row gap-2">
                            <div className="w-[80%] flex flex-col gap-2">
                              <div>
                                <Input
                                  type="text"
                                  value={child.question}
                                  onChange={(e) => {
                                    let newQuesChild = [
                                      ...dropdownEditModalData.questionChild,
                                    ];
                                    newQuesChild[index] = {
                                      ...newQuesChild[index],
                                      question: sanatizeHtml(e.target.value),
                                    };
                                    setDropdownEditModalData({
                                      ...dropdownEditModalData,
                                      questionChild: newQuesChild,
                                    });
                                  }}
                                />
                              </div>
                              <div className="flex flex-row gap-5">
                                <div>
                                  <span className="pr-4">Text Allowed ?</span>
                                  <Input
                                    type="checkbox"
                                    checked={child.textAllowed}
                                    onChange={() => {
                                      let newQuesChild = [
                                        ...dropdownEditModalData.questionChild,
                                      ];
                                      newQuesChild[index] = {
                                        ...newQuesChild[index],
                                        textAllowed: !child.textAllowed,
                                      };
                                      setDropdownEditModalData({
                                        ...dropdownEditModalData,
                                        questionChild: newQuesChild,
                                      });
                                    }}
                                  />
                                </div>
                                <div>
                                  <span className="pr-4">Photo Allowed ?</span>
                                  <Input
                                    type="checkbox"
                                    checked={child.photoAllowed}
                                    onChange={() => {
                                      let newQuesChild = [
                                        ...dropdownEditModalData.questionChild,
                                      ];
                                      newQuesChild[index] = {
                                        ...newQuesChild[index],
                                        photoAllowed: !child.photoAllowed,
                                      };
                                      setDropdownEditModalData({
                                        ...dropdownEditModalData,
                                        questionChild: newQuesChild,
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="w-[10%]">
                              <Input
                                type="number"
                                value={
                                  dropdownEditModalData.questionChild.indexOf(
                                    child
                                  ) + 1
                                }
                                onChange={(e) => {
                                  let newQuesChild = [
                                    ...dropdownEditModalData.questionChild,
                                  ];
                                  const [movedElement] = newQuesChild.splice(
                                    index,
                                    1
                                  );
                                  newQuesChild.splice(
                                    parseInt(e.target.value) - 1,
                                    0,
                                    movedElement
                                  );
                                  setDropdownEditModalData({
                                    ...dropdownEditModalData,
                                    questionChild: newQuesChild,
                                  });
                                }}
                              />
                            </div>
                            <div>
                              <Button
                                color="danger"
                                onClick={() => handleDeleteDropdownEntry(child)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        )
                      )}
                  </div>
                  <hr></hr>
                  <div className="flex flex-row gap-3">
                    <div className="w-[80%] flex flex-col gap-2">
                      <div>
                        <Input
                          type="text"
                          placeholder="Add new dropdown entry"
                          value={newDropdownEntry.question}
                          onChange={(e) => {
                            setNewDropdownEntry({
                              ...newDropdownEntry,
                              question: sanatizeHtml(e.target.value),
                            });
                          }}
                        />
                      </div>
                      <div className="flex flex-row gap-5">
                        <div>
                          <span className="pr-4">Text Allowed ?</span>
                          <Input
                            type="checkbox"
                            checked={newDropdownEntry.textAllowed}
                            onChange={() => {
                              setNewDropdownEntry({
                                ...newDropdownEntry,
                                textAllowed: !newDropdownEntry.textAllowed,
                              });
                            }}
                          />
                        </div>
                        <div>
                          <span className="pr-4">Photo Allowed ?</span>
                          <Input
                            type="checkbox"
                            checked={newDropdownEntry.photoAllowed}
                            onChange={() => {
                              setNewDropdownEntry({
                                ...newDropdownEntry,
                                photoAllowed: !newDropdownEntry.photoAllowed,
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Button
                        color="warning"
                        onClick={() => handleAddNewDropdownQuestion()}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="warning"
                  onClick={() => {
                    const newPanelQuestion = panelQuestion.map((ques) => {
                      if (ques._id === dropdownEditModalData._id) {
                        return dropdownEditModalData;
                      }
                      return ques;
                    });
                    setPanelQuestion(newPanelQuestion);
                    handleUpdateQuestion(newPanelQuestion);
                    setShowDropwdownEditQuesModal(false);
                    setDropdownEditModalData({});
                  }}
                >
                  Update
                </Button>{" "}
              </ModalFooter>
            </Modal>
            {isQuestionLoading && <BounceLoader color={spinnerColor} />}
          </div>
        );
      default:
        return null;
    }
  };

  const handleDeleteSingleQuestion = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put("/api/panelfaultquestions", {
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
      const response = await axios.delete("/api/panelfaultquestions");
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
          <div className="grid grid-flow-col grid-rows-5 sm:grid-flow-row sm:grid-cols-5 gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
            <div>
              <span
                href="#"
                className={`inline-flex items-center sm:px-4 py-3 rounded-lg w-full h-[5vh] text-black text-xl`}
              >
                Question Type :
              </span>
            </div>
            <div onClick={() => setQuestionType(panelQuestionType.DEFAULT)}>
              <span
                href="#"
                className={`inline-flex items-center px-4 py-3 cursor-pointer rounded-lg ${
                  questionType === panelQuestionType.DEFAULT
                    ? "text-white bg-blue-700 dark:bg-blue-600"
                    : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                } w-full h-[5vh]`}
              >
                {panelQuestionType.DEFAULT}
              </span>
            </div>
            <div onClick={() => setQuestionType(panelQuestionType.DROPDOWN)}>
              <span
                href="#"
                className={`inline-flex items-center px-4 py-3 cursor-pointer rounded-lg ${
                  questionType === panelQuestionType.DROPDOWN
                    ? "text-white bg-blue-700 dark:bg-blue-600"
                    : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                } w-full h-[5vh]`}
              >
                {panelQuestionType.DROPDOWN}
              </span>
            </div>
            <div onClick={() => setQuestionType(panelQuestionType.REARRANGE)}>
              <span
                href="#"
                className={`inline-flex items-center px-4 py-3 cursor-pointer rounded-lg ${
                  questionType === panelQuestionType.REARRANGE
                    ? "text-white bg-blue-700 dark:bg-blue-600"
                    : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                } w-full h-[5vh]`}
              >
                {panelQuestionType.REARRANGE}
              </span>
            </div>
            <div onClick={() => setQuestionType(panelQuestionType.DELETE)}>
              <span
                href="#"
                className={`inline-flex items-center px-4 py-3 cursor-pointer rounded-lg text-white bg-red-600 dark:bg-red-600 w-full h-[5vh]`}
              >
                DELETE QUESTIONS
              </span>
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6 bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full sm:min-h-[80vh] sm:mt-[-12%]">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 h-[5%]">
            {questionType}{" "}
            {questionType === panelQuestionType.DELETE ? "" : "Question Type"}
          </h3>
          <div>{getQuestionTypeForm(questionType)}</div>
          <div>
            {!isLoading && (
              <>
                {questionType === panelQuestionType.REARRANGE && (
                  <Button
                    color="warning"
                    className="mt-4"
                    onClick={() => handleUpdateQuestion()}
                  >
                    Update and Refresh
                  </Button>
                )}
                {questionType === panelQuestionType.DELETE && (
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
                {questionType !== panelQuestionType.DELETE &&
                  questionType !== panelQuestionType.REARRANGE && (
                    <Button
                      color="warning"
                      className="mt-4"
                      onClick={() => handleAddQuestion()}
                    >
                      Add Question
                    </Button>
                  )}
              </>
            )}
            {isLoading && <BounceLoader color={spinnerColor} />}
            <Modal isOpen={modal} toggle={toggle}>
              <ModalHeader toggle={toggle}>
                Delete All Panel Questions ?
              </ModalHeader>
              <ModalBody>
                Are you sure to delete all panel questions ?
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
