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

export default function RaisePanelTicketPage() {
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
  const [panelQuestionData, setPanelQuestionData] = useState([]);
  const [panelAnswers, setPanelAnswers] = useState({});
  const [quesDropdownLimit, setQuesDropdownLimit] = useState({});
  const [customerDetail, setCustomerDetail] = useState({
    custName: "",
    custEmail: "",
    custPhone: "",
    custAddress: "",
    custSysCapacity: "",
    custInstalledPanelCompany: "",
    custInstalledPanelModel: "",
    custSysAge: "",
  });
  const [panelExtraQuestions, setPanelExtraQuestions] = useState({
    dcrOrNoDcr: "",
    panelType: "",
    panelWattage: "",
  });
  const [numberOfAffectedPanels, setNumberOfAffectedPanels] = useState([]);
  let pdfQuesNo = 1;

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("/api/panelfaultquestions");
      setPanelQuestionData(result.data.questions);
    };
    fetchData();
  }, []);

  const handlePanelDropdownLimit = (srNo, value) => {
    setQuesDropdownLimit({ ...quesDropdownLimit, [srNo]: parseInt(value) });
  };

  const getDefaultPanelQuestionForm = (question, index) => {
    const ques = question.questionChild[0];
    return (
      <Col>
        <FormGroup className="flex flex-col gap-2">
          <Label for="panelQuestion" className="font-medium">
            {ques.question}
          </Label>
          {ques.textAllowed && (
            <Input
              type="text"
              name="panelQuestion"
              id="panelQuestion"
              placeholder="Enter your answer"
              onChange={(e) =>
                setPanelAnswers({
                  ...panelAnswers,
                  [`${question.srNo}-${index}`]: {
                    ...panelAnswers[`${question.srNo}-${index}`],
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
              name="panelQuestion"
              id="panelQuestion"
              placeholder="Upload photo"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setPanelAnswers({
                      ...panelAnswers,
                      [`${question.srNo}-${index}`]: {
                        ...panelAnswers[`${question.srNo}-${index}`],
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

  const getDropdownPanelForm = (question, parIndex) => {
    return (
      <>
        <Col>
          <FormGroup>
            <Label for="panelDropdown" className="font-medium">
              {question.question}
            </Label>
            <Input
              type="select"
              name="panelDropdown"
              id="panelDropdown"
              onChange={(e) => {
                handlePanelDropdownLimit(question.srNo, e.target.value);
                const updatedAnswers = { ...panelAnswers };
                Object.keys(updatedAnswers).forEach((key) => {
                  if (key.startsWith(`${question.srNo}-${parIndex}-`)) {
                    delete updatedAnswers[key];
                  }
                });
                setPanelAnswers(updatedAnswers);
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
                      for={`panelQuestion-${i}-${index}-${parIndex}`}
                      className="font-medium"
                    >
                      {ques.question} - {parIndex + 1} - {i + 1}
                    </Label>
                    {ques.textAllowed && (
                      <Input
                        type="text"
                        name={`panelQuestion-${i}-${index}-${parIndex}`}
                        id={`panelQuestion-${i}-${index}-${parIndex}`}
                        placeholder="Enter your answer"
                        onChange={(e) =>
                          setPanelAnswers({
                            ...panelAnswers,
                            [`${question.srNo}-${i}-${index}-${parIndex}`]: {
                              ...panelAnswers[
                                `${question.srNo}-${i}-${index}-${parIndex}`
                              ],
                              question: `${ques.question}-${i + 1}-${parIndex}`,
                              answer: sanatizeHtml(e.target.value),
                            },
                          })
                        }
                      />
                    )}
                    {ques.photoAllowed && (
                      <Input
                        type="file"
                        name={`panelQuestion-${i}-${index}`}
                        id={`panelQuestion-${i}-${index}`}
                        placeholder="Upload photo"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setPanelAnswers({
                                ...panelAnswers,
                                [`${question.srNo}-${i}-${index}`]: {
                                  ...panelAnswers[
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
    console.log(panelAnswers);
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
    Object.keys(panelAnswers).forEach((key) => {
      addNewPage({
        pdf,
        question: panelAnswers[key].question,
        answer: panelAnswers[key]?.answer,
        photo: panelAnswers[key]?.photo,
      });
    });
    const totalPages = pdf.internal.getNumberOfPages();
    for (let currPage = 2; currPage <= totalPages; currPage++) {
      pdf.setPage(currPage);
      addFooter(pdf, currPage, totalPages);
    }
    pdf.save("panel-ticket.pdf");
  };

  const handleSubmitPanelTicket = () => {
    // generatePdf();
    console.log(panelAnswers);
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
          <h1>Raise Panel Ticket</h1>
          <br></br>
          <Form>
            <CustomerDetailForm
              handleCustomerDetailForm={setCustomerDetail}
              customerDetail={customerDetail}
            />
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="installedPanelComapny" className="font-medium">
                    Name of panel manufacturer
                  </Label>
                  <Input
                    type="text"
                    name="installedPanelComapny"
                    id="installedPanelComapny"
                    placeholder="Enter name of panel manufacturer"
                    onChange={(e) =>
                      setCustomerDetail({
                        ...customerDetail,
                        custInstalledPanelCompany: sanatizeHtml(e.target.value),
                      })
                    }
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="installedPanelModel" className="font-medium">
                    Panel model name
                  </Label>
                  <Input
                    type="text"
                    name="installedPanelModel"
                    id="installedPanelModel"
                    placeholder="Enter name of panel model"
                    onChange={(e) =>
                      setCustomerDetail({
                        ...customerDetail,
                        custInstalledPanelModel: sanatizeHtml(e.target.value),
                      })
                    }
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="dcrOrNoDcr" className="font-medium">
                    DCR or Non DCR
                  </Label>
                  <Input
                    type="text"
                    name="dcrOrNoDcr"
                    id="dcrOrNoDcr"
                    placeholder="Enter answer"
                    onChange={(e) =>
                      setPanelExtraQuestions({
                        ...panelExtraQuestions,
                        dcrOrNoDcr: sanatizeHtml(e.target.value),
                      })
                    }
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="panelType" className="font-medium">
                    Panel type (Poly, Mono, other)
                  </Label>
                  <Input
                    type="text"
                    name="panelType"
                    id="panelType"
                    placeholder="Enter answer"
                    onChange={(e) =>
                      setPanelExtraQuestions({
                        ...panelExtraQuestions,
                        panelType: sanatizeHtml(e.target.value),
                      })
                    }
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="panelWattage" className="font-medium">
                    Panel wattage
                  </Label>
                  <Input
                    type="text"
                    name="panelWattage"
                    id="panelWattage"
                    placeholder="Enter answer"
                    onChange={(e) =>
                      setPanelExtraQuestions({
                        ...panelExtraQuestions,
                        panelWattage: sanatizeHtml(e.target.value),
                      })
                    }
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="noAffectedPanel" className="font-medium">
                    Number of visually affected panels
                  </Label>
                  <Input
                    type="select"
                    name="noAffectedPanel"
                    id="noAffectedPanel"
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setNumberOfAffectedPanels([]);
                      } else {
                        setNumberOfAffectedPanels(
                          new Array(parseInt(e.target.value)).fill(0)
                        );
                      }
                    }}
                  >
                    <option value="">Select</option>
                    {new Array(10).fill(0).map((opt, index) => (
                      <option key={index} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            {numberOfAffectedPanels.map((_, index) => (
              <div key={index}>
                <div className="font-medium text-xl mb-2">
                  Affected panel - {index + 1}
                </div>
                <div>
                  {panelQuestionData.map((question) => (
                    <Row key={`${question._id}-${index}`}>
                      {question.maxDropdownElements === 1
                        ? getDefaultPanelQuestionForm(question, index)
                        : getDropdownPanelForm(question, index)}
                    </Row>
                  ))}
                </div>
              </div>
            ))}

            <Button color="primary" onClick={() => handleSubmitPanelTicket()}>
              Submit
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
}
