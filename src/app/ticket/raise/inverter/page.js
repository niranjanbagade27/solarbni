"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import useVerifyUser from "@/hooks/verifyUser";
import { userRoles } from "@/constants/role";
import { Form, FormGroup, Label, Input, Row, Col, Button } from "reactstrap";
import CustomerDetailForm from "@/components/CustomerDetailForm/CustomerDetailForm";
import sanatizeHtml from "sanitize-html";
import { jsPDF } from "jspdf";
import BounceLoader from "react-spinners/BounceLoader";
import { spinnerColor } from "@/constants/colors";
import { threePhaseQuestions } from "@/constants/threePhaseQuestions";
import { singlePhaseQuestions } from "@/constants/singlePhaseQuestions";

export default function RaiseInverterTicketPage() {
  const { isVerified, verifyingUser, error } = useVerifyUser();
  useEffect(() => {
    if (!verifyingUser && isVerified === false) {
      window.location.href = "/login";
    } else if (!verifyingUser && isVerified.role !== userRoles.CONTRACTOR) {
      let redirectRole = "";
      switch (isVerified.role) {
        case "admin":
          redirectRole = "admin";
          break;
        case "contractor":
          redirectRole = "contractor";
          break;
        case "oem":
          redirectRole = "oem";
          break;
        default:
          break;
      }
      window.location.href = `/profile/${redirectRole}`;
    }
  }, [isVerified, verifyingUser, error]);
  const [inverterQuestionData, setInverterQuestionData] = useState([]);
  const [inverterAnswers, setInverterAnswers] = useState({});
  const [quesDropdownLimit, setQuesDropdownLimit] = useState({});
  const [customerDetail, setCustomerDetail] = useState({
    custName: "",
    custEmail: "",
    custPhone: "",
    custAddress: "",
    custSysCapacity: "",
    custInstalledInverterCompany: "",
    custInstalledInverterModel: "",
    custSysAge: "",
  });
  const [singleOrThreePhase, setSingleOrThreePhase] = useState([]);
  const [singlePhaseAnswers, setSinglePhaseAnswers] =
    useState(singlePhaseQuestions);
  const [threePhaseAnswers, setThreePhaseAnswers] =
    useState(threePhaseQuestions);

  let pdfQuesNo = 1;

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("/api/inverterfaultquestions");
      setInverterQuestionData(result.data.questions);
    };
    fetchData();
  }, []);

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
              onChange={(e) =>
                setInverterAnswers({
                  ...inverterAnswers,
                  [question.srNo]: {
                    ...inverterAnswers[question.srNo],
                    question: ques.question,
                    answer: sanatizeHtml(e.target.value),
                  },
                })
              }
            />
          )}
          {ques.photoAllowed && (
            <Input
              type="file"
              name="inverterQuestion"
              id="inverterQuestion"
              placeholder="Upload photo"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setInverterAnswers({
                      ...inverterAnswers,
                      [question.srNo]: {
                        ...inverterAnswers[question.srNo],
                        question: ques.question,
                        photo: event.target.result,
                      },
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          )}
        </FormGroup>
      </Col>
    );
  };

  const getDropdownInverterForm = (question) => {
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
              onChange={(e) => {
                handleInverterDropdownLimit(question.srNo, e.target.value);
                const updatedAnswers = { ...inverterAnswers };
                Object.keys(updatedAnswers).forEach((key) => {
                  if (key.startsWith(`${question.srNo}-`)) {
                    delete updatedAnswers[key];
                  }
                });
                setInverterAnswers(updatedAnswers);
              }}
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
                        onChange={(e) =>
                          setInverterAnswers({
                            ...inverterAnswers,
                            [`${question.srNo}-${i}-${index}`]: {
                              ...inverterAnswers[
                                `${question.srNo}-${i}-${index}`
                              ],
                              question: `${ques.question}-${i + 1}`,
                              answer: sanatizeHtml(e.target.value),
                            },
                          })
                        }
                      />
                    )}
                    {ques.photoAllowed && (
                      <Input
                        type="file"
                        name={`inverterQuestion-${i}-${index}`}
                        id={`inverterQuestion-${i}-${index}`}
                        placeholder="Upload photo"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setInverterAnswers({
                                ...inverterAnswers,
                                [`${question.srNo}-${i}-${index}`]: {
                                  ...inverterAnswers[
                                    `${question.srNo}-${i}-${index}`
                                  ],
                                  question: `${ques.question}-${i + 1}`,
                                  photo: event.target.result,
                                },
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
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

  const addHeader = (pdf) => {
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(isVerified.companyName, 20, 8);
    pdf.text(customerDetail.custAddress, 20, 13);
    pdf.text(`${customerDetail.custSysCapacity} kW`, 20, 18);
  };

  const addFooter = (pdf, currPage, totalPages) => {
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Page ${currPage} of ${totalPages}`, 260, 200);
    pdf.addImage("/images/solarbni_logo.png", "JPEG", 20, 193, 30, 15);
    pdf.page = pdf.page + 1;
  };

  const addNewPage = async ({ pdf, question, answer, photo }) => {
    pdf.addPage();
    addHeader(pdf);
    pdf.setFontSize(20);
    pdf.text(`${pdfQuesNo} - ${question}`, 20, 35);
    if (answer) {
      pdf.setFontSize(15);
      const splitText = pdf.splitTextToSize(`Answer: ${answer}`, 250);
      pdf.text(splitText, 20, 50);
    }
    if (photo) {
      pdf.addImage(photo, "PNG", 45, 70, 212, 120);
    } else {
      pdf.addImage("/images/no_photo.jpg", "JPEG", 100, 80, 100, 100);
    }
    pdfQuesNo = pdfQuesNo + 1;
  };

  const generatePdf = () => {
    console.log("submitting ticket");
    console.log(customerDetail);
    console.log(singlePhaseAnswers);
    console.log(threePhaseAnswers);
    console.log(inverterAnswers);
    const pageWidth = 297;
    const pageHeight = 210;
    const pdf = new jsPDF("landscape", "mm", "a4");
    pdf.page = 1;
    pdf.addImage("/images/pdf_bg.png", "JPEG", 0, 0, 297, 210);
    const bottomHeight = pageHeight * 0.2;
    pdf.setFillColor(0, 0, 0, 250);
    pdf.rect(0, pageHeight - bottomHeight, pageWidth, bottomHeight, "F");
    pdf.addImage("/images/solarbni_logo.png", "JPEG", 30, 180, 50, 25);
    pdf.addImage("/images/white_bg.jpg", "JPEG", 117, 20, 140, 150);
    pdf.setFontSize(30);
    pdf.setTextColor(150, 75, 0);
    pdf.text("SOLAR PV SYSTEM", 140, 35);
    pdf.text("HEALTH PARAMETERS", 130, 50);
    pdf.text("REPORT", 168, 65);
    pdf.setLineWidth(1.5);
    pdf.setDrawColor(150, 75, 0);
    pdf.line(125, 70, 250, 70);
    pdf.setFontSize(15);
    pdf.text(customerDetail.custName, 155, 90);
    pdf.text(`${customerDetail.custSysCapacity} kW`, 155, 100);
    pdf.text(customerDetail.custAddress, 155, 110);
    pdf.text("Installed by,", 155, 130);
    pdf.text(isVerified.companyName, 155, 140);
    pdf.text(new Date().toDateString(), 155, 150);
    pdf.addPage();
    pdf.setTextColor(0, 0, 0);
    addHeader(pdf);
    pdf.setFontSize(25);
    pdf.text(`Project Brief`, 20, 35);
    pdf.setFontSize(15);
    pdf.text(`Customer Name - ${customerDetail.custName}`, 20, 50);
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(0, 0, 0);
    pdf.line(20, 55, 290, 55);
    pdf.text(`Customer Address - ${customerDetail.custAddress}`, 20, 64); //+10
    pdf.setLineWidth(0.5);
    pdf.line(20, 69, 290, 69); //+5
    pdf.text(
      `System Capacity (kW) - ${customerDetail.custSysCapacity}`,
      20,
      79
    );
    pdf.setLineWidth(0.5);
    pdf.line(20, 84, 290, 84);
    pdf.text(`System age (Years) - ${customerDetail.custSysAge}`, 20, 94);
    pdf.setLineWidth(0.5);
    pdf.line(20, 99, 290, 99);
    pdf.text(`Contractor Company name - ${isVerified.companyName}`, 20, 109);
    pdf.setLineWidth(0.5);
    pdf.line(20, 114, 290, 114);
    pdf.text(`Contractor address - Not Found`, 20, 124);
    pdf.setLineWidth(0.5);
    pdf.line(20, 129, 290, 129);
    pdf.text(`GST number (if any) - ${isVerified.gstnumber}`, 20, 139);
    pdf.setLineWidth(0.5);
    pdf.line(20, 144, 290, 144);
    pdf.text(
      `Contracting company representative - ${isVerified.fullName}`,
      20,
      154
    );
    pdf.setLineWidth(0.5);
    pdf.line(20, 159, 290, 159);
    pdf.text(
      `Company representative contact no - ${isVerified.phone}`,
      20,
      169
    );
    pdf.setLineWidth(0.5);
    pdf.line(20, 174, 290, 174);
    if (singleOrThreePhase.length === 1) {
      Object.keys(singlePhaseAnswers).forEach((key) => {
        addNewPage({
          pdf,
          question: singlePhaseAnswers[key].question,
          answer: singlePhaseAnswers[key]?.answer,
          photo: singlePhaseAnswers[key]?.photo,
        });
      });
    }
    if (singleOrThreePhase.length === 3) {
      Object.keys(threePhaseAnswers).forEach((key) => {
        addNewPage({
          pdf,
          question: threePhaseAnswers[key].question,
          answer: threePhaseAnswers[key]?.answer,
          photo: threePhaseAnswers[key]?.photo,
        });
      });
    }
    Object.keys(inverterAnswers).forEach((key) => {
      addNewPage({
        pdf,
        question: inverterAnswers[key].question,
        answer: inverterAnswers[key]?.answer,
        photo: inverterAnswers[key]?.photo,
      });
    });
    const totalPages = pdf.internal.getNumberOfPages();
    for (let currPage = 2; currPage <= totalPages; currPage++) {
      pdf.setPage(currPage);
      addFooter(pdf, currPage, totalPages);
    }
    pdf.save("inverter-ticket.pdf");
  };

  const getSinglePhaseForm = () => {
    return (
      <>
        <Col md={12}>
          <FormGroup>
            <Label for="singlePhaseQues1" className="font-medium">
              Phase to neutral voltage (For single phase only, Write 0
              otherwise)
            </Label>
            <Input
              type="text"
              name="singlePhaseQues1"
              id="singlePhaseQues1"
              placeholder="Enter answer"
              onChange={(e) =>
                setSinglePhaseAnswers({
                  ...singlePhaseAnswers,
                  singlePhaseQues1: {
                    ...singlePhaseAnswers.singlePhaseQues1,
                    answer: sanatizeHtml(e.target.value),
                  },
                })
              }
            />
            <br />
            <Input
              type="file"
              name="singlePhaseQues1"
              id="singlePhaseQues1"
              placeholder="Enter answer"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setSinglePhaseAnswers({
                      ...singlePhaseAnswers,
                      singlePhaseQues1: {
                        ...singlePhaseAnswers.singlePhaseQues1,
                        photo: event.target.result,
                      },
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </FormGroup>
        </Col>
        <Col md={12}>
          <FormGroup>
            <Label for="singlePhaseQues2" className="font-medium">
              Phase to earth voltage (For single phase only, Write 0 otherwise)
            </Label>
            <Input
              type="text"
              name="singlePhaseQues2"
              id="singlePhaseQues2"
              placeholder="Enter answer"
              onChange={(e) =>
                setSinglePhaseAnswers({
                  ...singlePhaseAnswers,
                  singlePhaseQues2: {
                    ...singlePhaseAnswers.singlePhaseQues2,
                    answer: sanatizeHtml(e.target.value),
                  },
                })
              }
            />
            <br />
            <Input
              type="file"
              name={`singlePhaseQues2`}
              id={`singlePhaseQues2`}
              placeholder="Upload photo"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setSinglePhaseAnswers({
                      ...singlePhaseAnswers,
                      singlePhaseQues2: {
                        ...singlePhaseAnswers.singlePhaseQues2,
                        photo: event.target.result,
                      },
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </FormGroup>
        </Col>
      </>
    );
  };

  const getThreePhaseForm = () => {
    return (
      <>
        <Col md={12}>
          <FormGroup>
            <Label for="threePhaseQues1" className="font-medium">
              Red phase and Yellow phase voltage
            </Label>
            <Input
              type="text"
              name="threePhaseQues1"
              id="threePhaseQues1"
              placeholder="Enter answer"
              onChange={(e) =>
                setThreePhaseAnswers({
                  ...threePhaseAnswers,
                  threePhaseQues1: {
                    ...threePhaseAnswers.threePhaseQues1,
                    answer: sanatizeHtml(e.target.value),
                  },
                })
              }
            />
            <br />
            <Input
              type="file"
              name={`threePhaseQues1`}
              id={`threePhaseQues1`}
              placeholder="Upload photo"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setThreePhaseAnswers({
                      ...threePhaseAnswers,
                      threePhaseQues1: {
                        ...threePhaseAnswers.threePhaseQues1,
                        photo: event.target.result,
                      },
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </FormGroup>
        </Col>
        <Col md={12}>
          <FormGroup>
            <Label for="threePhaseQues2" className="font-medium">
              Yellow phase and Blue phase voltage
            </Label>
            <Input
              type="text"
              name="threePhaseQues2"
              id="threePhaseQues2"
              placeholder="Enter answer"
              onChange={(e) =>
                setThreePhaseAnswers({
                  ...threePhaseAnswers,
                  threePhaseQues2: {
                    ...threePhaseAnswers.threePhaseQues2,
                    answer: sanatizeHtml(e.target.value),
                  },
                })
              }
            />
            <br />
            <Input
              type="file"
              name={`threePhaseQues2`}
              id={`threePhaseQues2`}
              placeholder="Upload photo"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setThreePhaseAnswers({
                      ...threePhaseAnswers,
                      threePhaseQues2: {
                        ...threePhaseAnswers.threePhaseQues2,
                        photo: event.target.result,
                      },
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </FormGroup>
        </Col>
        <Col md={12}>
          <FormGroup>
            <Label for="threePhaseQues3" className="font-medium">
              Red phase and Blue phase voltage
            </Label>
            <Input
              type="text"
              name="threePhaseQues3"
              id="threePhaseQues3"
              placeholder="Enter answer"
              onChange={(e) =>
                setThreePhaseAnswers({
                  ...threePhaseAnswers,
                  threePhaseQues3: {
                    ...threePhaseAnswers.threePhaseQues3,
                    answer: sanatizeHtml(e.target.value),
                  },
                })
              }
            />
            <br />
            <Input
              type="file"
              name={`threePhaseQues3`}
              id={`threePhaseQues3`}
              placeholder="Upload photo"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setThreePhaseAnswers({
                      ...threePhaseAnswers,
                      threePhaseQues3: {
                        ...threePhaseAnswers.threePhaseQues3,
                        photo: event.target.result,
                      },
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </FormGroup>
        </Col>
        <Col md={12}>
          <FormGroup>
            <Label for="threePhaseQues4" className="font-medium">
              Red phase to neutral voltage
            </Label>
            <Input
              type="text"
              name="threePhaseQues4"
              id="threePhaseQues4"
              placeholder="Enter answer"
              onChange={(e) =>
                setThreePhaseAnswers({
                  ...threePhaseAnswers,
                  threePhaseQues4: {
                    ...threePhaseAnswers.threePhaseQues4,
                    answer: sanatizeHtml(e.target.value),
                  },
                })
              }
            />
            <br />
            <Input
              type="file"
              name={`threePhaseQues4`}
              id={`threePhaseQues4`}
              placeholder="Upload photo"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setThreePhaseAnswers({
                      ...threePhaseAnswers,
                      threePhaseQues4: {
                        ...threePhaseAnswers.threePhaseQues4,
                        photo: event.target.result,
                      },
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </FormGroup>
        </Col>
        <Col md={12}>
          <FormGroup>
            <Label for="threePhaseQues5" className="font-medium">
              Yellow phase and neutral voltage
            </Label>
            <Input
              type="text"
              name="threePhaseQues5"
              id="threePhaseQues5"
              placeholder="Enter answer"
              onChange={(e) =>
                setThreePhaseAnswers({
                  ...threePhaseAnswers,
                  threePhaseQues5: {
                    ...threePhaseAnswers.threePhaseQues5,
                    answer: sanatizeHtml(e.target.value),
                  },
                })
              }
            />
            <br />
            <Input
              type="file"
              name={`threePhaseQues5`}
              id={`threePhaseQues5`}
              placeholder="Upload photo"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setThreePhaseAnswers({
                      ...threePhaseAnswers,
                      threePhaseQues5: {
                        ...threePhaseAnswers.threePhaseQues5,
                        photo: event.target.result,
                      },
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </FormGroup>
        </Col>
        <Col md={12}>
          <FormGroup>
            <Label for="threePhaseQues6" className="font-medium">
              Blue phase and neutral voltage
            </Label>
            <Input
              type="text"
              name="threePhaseQues6"
              id="threePhaseQues6"
              placeholder="Enter answer"
              onChange={(e) =>
                setThreePhaseAnswers({
                  ...threePhaseAnswers,
                  threePhaseQues6: {
                    ...threePhaseAnswers.threePhaseQues6,
                    answer: sanatizeHtml(e.target.value),
                  },
                })
              }
            />
            <br />
            <Input
              type="file"
              name={`threePhaseQues6`}
              id={`threePhaseQues6`}
              placeholder="Upload photo"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setThreePhaseAnswers({
                      ...threePhaseAnswers,
                      threePhaseQues6: {
                        ...threePhaseAnswers.threePhaseQues6,
                        photo: event.target.result,
                      },
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </FormGroup>
        </Col>
        <Col md={12}>
          <FormGroup>
            <Label for="threePhaseQues7" className="font-medium">
              Red phase to earth voltage
            </Label>
            <Input
              type="text"
              name="threePhaseQues7"
              id="threePhaseQues7"
              placeholder="Enter answer"
              onChange={(e) =>
                setThreePhaseAnswers({
                  ...threePhaseAnswers,
                  threePhaseQues7: {
                    ...threePhaseAnswers.threePhaseQues7,
                    answer: sanatizeHtml(e.target.value),
                  },
                })
              }
            />
            <br />
            <Input
              type="file"
              name={`threePhaseQues7`}
              id={`threePhaseQues7`}
              placeholder="Upload photo"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setThreePhaseAnswers({
                      ...threePhaseAnswers,
                      threePhaseQues7: {
                        ...threePhaseAnswers.threePhaseQues7,
                        photo: event.target.result,
                      },
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </FormGroup>
        </Col>
        <Col md={12}>
          <FormGroup>
            <Label for="threePhaseQues8" className="font-medium">
              Yellow phase to earth voltage
            </Label>
            <Input
              type="text"
              name="threePhaseQues8"
              id="threePhaseQues8"
              placeholder="Enter answer"
              onChange={(e) =>
                setThreePhaseAnswers({
                  ...threePhaseAnswers,
                  threePhaseQues8: {
                    ...threePhaseAnswers.threePhaseQues8,
                    answer: sanatizeHtml(e.target.value),
                  },
                })
              }
            />
            <br />
            <Input
              type="file"
              name={`threePhaseQues8`}
              id={`threePhaseQues8`}
              placeholder="Upload photo"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setThreePhaseAnswers({
                      ...threePhaseAnswers,
                      threePhaseQues8: {
                        ...threePhaseAnswers.threePhaseQues8,
                        photo: event.target.result,
                      },
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </FormGroup>
        </Col>
        <Col md={12}>
          <FormGroup>
            <Label for="threePhaseQues9" className="font-medium">
              Blue phase to earth voltage
            </Label>
            <Input
              type="text"
              name="threePhaseQues9"
              id="threePhaseQues9"
              placeholder="Enter answer"
              onChange={(e) =>
                setThreePhaseAnswers({
                  ...threePhaseAnswers,
                  threePhaseQues9: {
                    ...threePhaseAnswers.threePhaseQues9,
                    answer: sanatizeHtml(e.target.value),
                  },
                })
              }
            />
            <br />
            <Input
              type="file"
              name={`threePhaseQues9`}
              id={`threePhaseQues9`}
              placeholder="Upload photo"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setThreePhaseAnswers({
                      ...threePhaseAnswers,
                      threePhaseQues9: {
                        ...threePhaseAnswers.threePhaseQues9,
                        photo: event.target.result,
                      },
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </FormGroup>
        </Col>
      </>
    );
  };

  const handleSubmitInverterTicket = () => {
    generatePdf();
  };

  return (
    <div className="bg-[#efd9b4]">
      {verifyingUser && (
        <div className="flex justify-center items-center h-full">
          <BounceLoader color={spinnerColor} />
        </div>
      )}
      {!verifyingUser && isVerified._id && (
        <div>
          <h1>Raise Inverter Ticket</h1>
          <br></br>
          <Form>
            <CustomerDetailForm
              handleCustomerDetailForm={setCustomerDetail}
              customerDetail={customerDetail}
            />
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="installedInverterComapny" className="font-medium">
                    Name of inverter manufacturer
                  </Label>
                  <Input
                    type="text"
                    name="installedInverterComapny"
                    id="installedInverterComapny"
                    placeholder="Enter name of inverter manufacturer"
                    onChange={(e) =>
                      setCustomerDetail({
                        ...customerDetail,
                        custInstalledInverterCompany: sanatizeHtml(
                          e.target.value
                        ),
                      })
                    }
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="installedInverterModel" className="font-medium">
                    Inverter model name
                  </Label>
                  <Input
                    type="text"
                    name="installedInverterModel"
                    id="installedInverterModel"
                    placeholder="Enter name of inverter model"
                    onChange={(e) =>
                      setCustomerDetail({
                        ...customerDetail,
                        custInstalledInverterModel: sanatizeHtml(
                          e.target.value
                        ),
                      })
                    }
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label for="singleOrThreePhase" className="font-medium">
                    Phase (Single phase or three phase)
                  </Label>
                  <Input
                    type="select"
                    name="singleOrThreePhase"
                    id="singleOrThreePhase"
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setSingleOrThreePhase([]);
                      } else {
                        setSingleOrThreePhase(
                          new Array(parseInt(e.target.value)).fill(0)
                        );
                        if (e.target.value === "1") {
                          setThreePhaseAnswers(threePhaseQuestions);
                        }
                        if (e.target.value === "3") {
                          setSinglePhaseAnswers(singlePhaseQuestions);
                        }
                      }
                    }}
                  >
                    <option value="">Select</option>
                    <option key={0} value={1}>
                      1
                    </option>
                    <option key={1} value={3}>
                      3
                    </option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            {singleOrThreePhase.length === 1 && (
              <>
                <Row>{getSinglePhaseForm()}</Row>
              </>
            )}
            {singleOrThreePhase.length === 3 && (
              <>
                <Row>{getThreePhaseForm()}</Row>
              </>
            )}
            {inverterQuestionData.map((question) => (
              <Row key={question._id}>
                {question.maxDropdownElements === 1
                  ? getDefaultInverterQuestionForm(question)
                  : getDropdownInverterForm(question)}
              </Row>
            ))}
            <Button
              color="primary"
              onClick={() => handleSubmitInverterTicket()}
            >
              Submit
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
}
