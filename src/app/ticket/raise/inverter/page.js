"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import useVerifyUser from "@/hooks/verifyUser";
import { userRoles } from "@/constants/role";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import CustomerDetailForm from "@/components/CustomerDetailForm/CustomerDetailForm";
import sanatizeHtml from "sanitize-html";
import { jsPDF } from "jspdf";
import BounceLoader from "react-spinners/BounceLoader";
import { spinnerColor } from "@/constants/colors";
import { threePhaseQuestions } from "@/constants/threePhaseQuestions";
import { singlePhaseQuestions } from "@/constants/singlePhaseQuestions";
import uploadPdf from "@/util/uploadPdf";
import { GeneratedTicketDetails } from "@/components/GeneratedTicketDetails/GeneratedTicketDetails";

export default function RaiseInverterTicketPage() {
  const { isVerified, verifyingUser, error } = useVerifyUser();
  useEffect(() => {
    if (!verifyingUser && isVerified === false) {
      window.location.href = "/login";
    } else if (!verifyingUser && isVerified.role === userRoles.OEM) {
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
  const [isQuestionLoading, setIsQuestionLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [inverterQuestionDataOne, setInverterQuestionDataOne] = useState([]);
  const [inverterQuestionDataTwo, setInverterQuestionDataTwo] = useState([]);
  const [inverterAnswersOne, setInverterAnswersOne] = useState({});
  const [inverterAnswersTwo, setInverterAnswersTwo] = useState({});
  const [quesDropdownLimit, setQuesDropdownLimit] = useState({});
  const [customerDetail, setCustomerDetail] = useState({
    custName: "",
    custEmail: "",
    custPhone: "",
    custAddress: "",
    custPincode: "",
    sollarInstallerServicePerson: "",
    sollarInstallerServicePersonPhone: "",
    custSysCapacity: "",
    custInstalledInverterCompany: "",
    custInstalledInverterModel: "",
    custSysAge: "",
    custInverterCapacity: "",
    custThreeOrSinglePhase: "",
    custInstalledInverterSingleOrThreePhase: "",
    custInstalledPanelCompany: "",
    custInstalledPanelModel: "",
    custPanelType: "",
    custDcrOrNonDcr: "",
    custPanelWattage: "",
    custRemoteMonitoringUserId: "",
    custRemoteMonitoringPassword: "",
  });
  const [singlePhaseAnswers, setSinglePhaseAnswers] =
    useState(singlePhaseQuestions);
  const [threePhaseAnswers, setThreePhaseAnswers] =
    useState(threePhaseQuestions);
  const [pdfUrl, setPdfUrl] = useState();
  const [isPDFPreviewLoading, setIsPDFPreviewLoading] = useState(false);
  let pdfQuesNo = 1;
  const [isFormFilled, setIsFormFilled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("/api/inverterfaultquestions");
      const allQuestions = result.data.questions;
      const sectionOne = allQuestions.filter(
        (question) => parseInt(question.questionSection) === 1
      );
      const sectionTwo = allQuestions.filter(
        (question) => parseInt(question.questionSection) === 2
      );
      setInverterQuestionDataOne(sectionOne);
      setInverterQuestionDataTwo(sectionTwo);
      setIsQuestionLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isFormFilled) {
      handleSubmitInverterTicket();
    }
  }, [isFormFilled]);

  const handleInverterDropdownLimit = (srNo, value) => {
    setQuesDropdownLimit({ ...quesDropdownLimit, [srNo]: parseInt(value) });
  };

  const getDefaultInverterQuestionForm = (
    question,
    index,
    stateHandler,
    qSection
  ) => {
    const ques = question.questionChild[0];
    let invAnswer = qSection === "1" ? inverterAnswersOne : inverterAnswersTwo;
    return (
      <Col key={index}>
        <FormGroup className="flex flex-col gap-2">
          <Label
            for={`inverterQuestion-${ques.question}-${index}`}
            className="font-medium"
          >
            {ques.question}
          </Label>
          {ques.textAllowed && (
            <Input
              required
              type="text"
              name={`inverterQuestion-${ques.question}-${index}`}
              id={`inverterQuestion-${ques.question}-${index}`}
              placeholder="Enter your answer"
              onChange={(e) =>
                stateHandler({
                  ...invAnswer,
                  [question.srNo]: {
                    ...invAnswer[question.srNo],
                    question: ques.question,
                    answer: sanatizeHtml(e.target.value),
                  },
                })
              }
            />
          )}
          {ques.photoAllowed && (
            <Input
              required
              type="file"
              name={`inverterQuestion-${ques.question}-${index}`}
              id={`inverterQuestion-${ques.question}-${index}`}
              placeholder="Upload photo"
              accept="capture=camera"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    stateHandler({
                      ...invAnswer,
                      [question.srNo]: {
                        ...invAnswer[question.srNo],
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

  const getDropdownInverterForm = (question, index, stateHandler, qSection) => {
    let invAnswer = qSection === "1" ? inverterAnswersOne : inverterAnswersTwo;
    return (
      <>
        <Col key={index}>
          <FormGroup>
            <Label
              for={`inverter-${question.question}-${index}`}
              className="font-medium"
            >
              {question.question}
            </Label>
            <Input
              required={question.question.startsWith("Optional") ? false : true}
              type="select"
              name={`inverter-${question.question}-${index}`}
              id={`inverter-${question.question}-${index}`}
              onChange={(e) => {
                handleInverterDropdownLimit(question.srNo, e.target.value);
                const updatedAnswers = { ...invAnswer };
                Object.keys(updatedAnswers).forEach((key) => {
                  if (key.startsWith(`${question.srNo}-`)) {
                    delete updatedAnswers[key];
                  }
                });
                stateHandler(updatedAnswers);
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
                        required={
                          question.question.startsWith("Optional")
                            ? false
                            : true
                        }
                        type="text"
                        name={`inverterQuestion-${i}-${index}`}
                        id={`inverterQuestion-${i}-${index}`}
                        placeholder="Enter your answer"
                        onChange={(e) =>
                          stateHandler({
                            ...invAnswer,
                            [`${question.srNo}-${i}-${index}`]: {
                              ...invAnswer[`${question.srNo}-${i}-${index}`],
                              question: `${ques.question}-${i + 1}`,
                              answer: sanatizeHtml(e.target.value),
                            },
                          })
                        }
                      />
                    )}
                    {ques.photoAllowed && (
                      <Input
                        required={
                          question.question.startsWith("Optional")
                            ? false
                            : true
                        }
                        type="file"
                        name={`inverterQuestion-${i}-${index}`}
                        id={`inverterQuestion-${i}-${index}`}
                        placeholder="Upload photo"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              stateHandler({
                                ...invAnswer,
                                [`${question.srNo}-${i}-${index}`]: {
                                  ...invAnswer[
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
    pdf.text(
      `${isVerified.companyName}, ${customerDetail.custAddress}, ${customerDetail.custSysCapacity} kW`,
      20,
      8
    );
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
    pdf.addImage("/images/page_bg.png", "JPEG", 0, 0, 297, 210);
    pdf.setFontSize(20);
    pdf.text(`Q - ${question}`, 20, 25);
    if (answer) {
      pdf.setFontSize(15);
      const splitText = pdf.splitTextToSize(`Answer: ${answer}`, 250);
      pdf.text(splitText, 20, 40);
    }
    if (photo) {
      pdf.addImage(photo, "PNG", 45, 70, 212, 120);
    } else {
      pdf.addImage("/images/no_photo.jpg", "JPEG", 100, 80, 100, 100);
    }
    pdfQuesNo = pdfQuesNo + 1;
  };

  const addEmailContent = (pdf) => {
    pdf.setFontSize(13);
    pdf.addImage("/images/page_bg.png", "JPEG", 0, 0, 297, 210);
    pdf.text(`Date : ${new Date().toDateString()}`, 230, 15);
    pdf.setFontSize(18);
    pdf.text(
      `Subject: Request for service support for Solar PV system : Inverter`,
      20,
      35
    );
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      `Respected ${customerDetail.custInstalledInverterCompany} representative,`,
      20,
      50
    );
    const splitEmailHeader = pdf.splitTextToSize(
      `We require service support with ${customerDetail.custInstalledInverterCompany} inverter installed at ${customerDetail.custAddress} with plant capacity ${customerDetail.custSysCapacity}kW. This report has been generated to provide you all necessary parameters required for site assessment.`,
      260
    );
    pdf.text(splitEmailHeader, 27, 60);
    pdf.text(`Looking forward to your positive feedback.`, 27, 78);
    pdf.text(`Thanks, and regards,`, 20, 90);
    pdf.text(`Customer name : ${customerDetail.custName}`, 23, 100);
    pdf.text(`Customer phone : ${customerDetail.custPhone}`, 23, 110);
    pdf.text(`Project installed by,`, 20, 130);
    pdf.text(`Contractor name : ${isVerified.fullName}`, 23, 140);
    pdf.text(`Contractor company : ${isVerified.companyName}`, 23, 150);
    pdf.text(
      `Service person : ${customerDetail.sollarInstallerServicePerson}`,
      20,
      160
    );
    pdf.text(
      `Service person contact number : ${customerDetail.sollarInstallerServicePersonPhone}`,
      20,
      170
    );
  };

  const addDashLine = (pdf, y) => {
    pdf.setLineWidth(0.3);
    pdf.setLineDash([2.0]);
    pdf.setDrawColor(0, 0, 0);
    pdf.line(20, y, 285, y);
  };

  const addCustomerInformation = (pdf) => {
    pdf.setFontSize(24);
    pdf.addImage("/images/page_bg.png", "JPEG", 0, 0, 297, 210);
    pdf.text(`Customer Information : `, 20, 35);
    pdf.setFontSize(14);
    pdf.text(`Customer Name - ${customerDetail.custName}`, 20, 50);
    addDashLine(pdf, 58);
    pdf.text(`Customer email ID - ${customerDetail.custEmail}`, 20, 68);
    addDashLine(pdf, 76);
    pdf.text(`Customer contact number - ${customerDetail.custPhone}`, 20, 86);
    addDashLine(pdf, 94);
    const splitAddress = pdf.splitTextToSize(
      `Site address - ${customerDetail.custAddress}`,
      260
    );
    pdf.text(splitAddress, 20, 104);
    addDashLine(pdf, 112);
    pdf.text(`Site pincode - ${customerDetail.custPincode}`, 20, 122);
    addDashLine(pdf, 130);
  };

  const addSolarInstallerInformation = (pdf) => {
    pdf.setFontSize(24);
    pdf.addImage("/images/page_bg.png", "JPEG", 0, 0, 297, 210);
    pdf.text(`Solar Installer Information : `, 20, 35);
    pdf.setFontSize(14);
    pdf.text(
      `Solar Installer company name - ${isVerified.companyName}`,
      20,
      50
    );
    addDashLine(pdf, 58);
    pdf.text(
      `Solar Installer company representative - ${isVerified.fullName}`,
      20,
      68
    );
    addDashLine(pdf, 76);
    pdf.text(`Solar Installer contact number - ${isVerified.phone}`, 20, 86);
    addDashLine(pdf, 94);
    pdf.text(`Solar Installer Email ID - ${isVerified.email}`, 20, 104);
    addDashLine(pdf, 112);
    pdf.text(
      `Solar Installer service person - ${customerDetail.sollarInstallerServicePerson}`,
      20,
      120
    );
    addDashLine(pdf, 128);
    pdf.text(
      `Solar Installer service person contact number - ${customerDetail.sollarInstallerServicePersonPhone}`,
      20,
      136
    );
    addDashLine(pdf, 144);
    pdf.text(
      `Solar Installer office address - ${isVerified.officeAddress}`,
      20,
      152
    );
    addDashLine(pdf, 160);
    pdf.text(`Solar Installer pincode - ${isVerified.pincode}`, 20, 168);
    addDashLine(pdf, 176);
  };

  const addSystemInformation = (pdf) => {
    pdf.setFontSize(24);
    pdf.addImage("/images/page_bg.png", "JPEG", 0, 0, 297, 210);
    pdf.text(`System Information : `, 20, 35);
    pdf.setFontSize(14);
    pdf.text(
      `Installed plant capacity (in kW) - ${customerDetail.custSysCapacity}`,
      20,
      50
    );
    addDashLine(pdf, 58);
    pdf.text(`System age (in months) - ${customerDetail.custSysAge}`, 20, 68);
    addDashLine(pdf, 76);
    pdf.text(
      `Inverter manufacturer - ${customerDetail.custInstalledInverterCompany}`,
      20,
      84
    );
    addDashLine(pdf, 92);
    pdf.text(
      `Inverter model name - ${customerDetail.custInstalledInverterModel}`,
      20,
      100
    );
    addDashLine(pdf, 108);
    pdf.text(
      `Solar panel manufacturer - ${customerDetail.custInstalledPanelCompany}`,
      20,
      116
    );
    addDashLine(pdf, 124);
    pdf.text(`Solar panel type - ${customerDetail.custPanelType}`, 20, 132);
    addDashLine(pdf, 140);
    pdf.text(
      `Solar panel wattage (Watt) - ${customerDetail.custPanelWattage}`,
      20,
      148
    );
    addDashLine(pdf, 156);
    pdf.text(
      `Remote monitoring UserID (if applicable) - ${
        customerDetail.custRemoteMonitoringUserId
          ? customerDetail.custRemoteMonitoringUserId
          : "Not Found"
      }`,
      20,
      164
    );
    addDashLine(pdf, 172);
    pdf.text(
      `Remote monitoring password (if applicable) - ${
        customerDetail.custRemoteMonitoringPassword
          ? customerDetail.custRemoteMonitoringPassword
          : "Not Found"
      }`,
      20,
      180
    );
    addDashLine(pdf, 188);
  };

  const generatePdf = async () => {
    console.log("submitting ticket");
    // console.log(customerDetail);
    // console.log(singlePhaseAnswers);
    // console.log(threePhaseAnswers);
    // console.log(inverterAnswersTwo);
    let inverterAnswersOneNew = {};
    Object.keys(inverterAnswersOne)
      .sort((a, b) => {
        const aParts = a.split("-").map(Number);
        const bParts = b.split("-").map(Number);
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
          if (aParts[i] !== bParts[i]) {
            return (aParts[i] || 0) - (bParts[i] || 0);
          }
        }
        return 0;
      })
      .forEach((key, index) => {
        inverterAnswersOneNew[index] = inverterAnswersOne[key];
      });
    let inverterAnswersTwoNew = {};
    Object.keys(inverterAnswersTwo)
      .sort((a, b) => {
        const aParts = a.split("-").map(Number);
        const bParts = b.split("-").map(Number);
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
          if (aParts[i] !== bParts[i]) {
            return (aParts[i] || 0) - (bParts[i] || 0);
          }
        }
        return 0;
      })
      .forEach((key, index) => {
        inverterAnswersTwoNew[index] = inverterAnswersTwo[key];
      });
    console.log(inverterAnswersTwoNew);
    const pageWidth = 297;
    const pageHeight = 210;
    const pdf = new jsPDF("landscape", "mm", "a4");
    pdf.page = 1;
    pdf.addImage("/images/pdf_bg.png", "JPEG", 0, 0, 297, 210);
    const bottomHeight = pageHeight * 0.2;
    pdf.setFillColor(0, 0, 0, 250);
    pdf.rect(0, pageHeight - bottomHeight, pageWidth, bottomHeight, "F");
    pdf.addImage("/images/solarbni_logo.png", "JPEG", 30, 180, 50, 25);
    pdf.addImage("/images/white_bg.jpg", "JPEG", 110, 20, 170, 150);
    pdf.setFontSize(30);
    pdf.setTextColor(150, 75, 0);
    pdf.text("SOLAR PV SYSTEM HEALTH", 125, 35);
    pdf.text("PARAMETERS REPORT", 138, 50);
    pdf.setLineWidth(1.5);
    pdf.setDrawColor(150, 75, 0);
    pdf.line(122, 60, 270, 60);
    pdf.setFontSize(18);
    pdf.text(`${customerDetail.custName}`, 125, 75);
    pdf.text(`${customerDetail.custSysCapacity} kW`, 125, 85);
    const splitAddress = pdf.splitTextToSize(customerDetail.custAddress, 150);
    pdf.text(splitAddress, 125, 95);
    pdf.text(`${customerDetail.custPincode}`, 125, 104);
    pdf.text("Installed by,", 125, 120);
    pdf.text(isVerified.companyName, 125, 130);
    pdf.text(new Date().toDateString(), 125, 140);
    pdf.addPage();
    pdf.setTextColor(0, 0, 0);
    addEmailContent(pdf);
    pdf.addPage();
    addCustomerInformation(pdf);
    pdf.addPage();
    addSolarInstallerInformation(pdf);
    pdf.addPage();
    addSystemInformation(pdf);
    Object.keys(inverterAnswersOneNew).forEach((key) => {
      addNewPage({
        pdf,
        question: inverterAnswersOneNew[key].question,
        answer: inverterAnswersOneNew[key]?.answer,
        photo: inverterAnswersOneNew[key]?.photo,
      });
    });
    if (
      parseInt(customerDetail.custInstalledInverterSingleOrThreePhase) === 1
    ) {
      Object.keys(singlePhaseAnswers).forEach((key) => {
        addNewPage({
          pdf,
          question: singlePhaseAnswers[key].question,
          answer: singlePhaseAnswers[key]?.answer,
          photo: singlePhaseAnswers[key]?.photo,
        });
      });
    }
    if (
      parseInt(customerDetail.custInstalledInverterSingleOrThreePhase) === 3
    ) {
      Object.keys(threePhaseAnswers).forEach((key) => {
        addNewPage({
          pdf,
          question: threePhaseAnswers[key].question,
          answer: threePhaseAnswers[key]?.answer,
          photo: threePhaseAnswers[key]?.photo,
        });
      });
    }
    Object.keys(inverterAnswersTwoNew).forEach((key) => {
      addNewPage({
        pdf,
        question: inverterAnswersTwoNew[key].question,
        answer: inverterAnswersTwoNew[key]?.answer,
        photo: inverterAnswersTwoNew[key]?.photo,
      });
    });
    const totalPages = pdf.internal.getNumberOfPages();
    for (let currPage = 2; currPage <= totalPages; currPage++) {
      pdf.setPage(currPage);
      addHeader(pdf);
      addFooter(pdf, currPage, totalPages);
    }
    // pdf.save("inverter-ticket.pdf");
    return pdf;
  };

  const getSinglePhaseForm = () => {
    return (
      <>
        <Col md={12}>
          <FormGroup>
            <Label for="singlePhaseQues1" className="font-medium">
              Phase to neutral voltage (For single phase only. Write 0
              otherwise)
            </Label>
            <Input
              required
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
              required
              type="file"
              name="singlePhaseQues1"
              id="singlePhaseQues1"
              placeholder="Enter answer"
              accept="capture=camera"
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
              Phase to earth voltage (For single phase only. Write 0 otherwise)
            </Label>
            <Input
              required
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
              required
              type="file"
              name={`singlePhaseQues2`}
              id={`singlePhaseQues2`}
              placeholder="Upload photo"
              accept="capture=camera"
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
              required
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
              required
              type="file"
              name={`threePhaseQues1`}
              id={`threePhaseQues1`}
              placeholder="Upload photo"
              accept="capture=camera"
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
              required
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
              required
              type="file"
              name={`threePhaseQues2`}
              id={`threePhaseQues2`}
              placeholder="Upload photo"
              accept="capture=camera"
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
              required
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
              required
              type="file"
              name={`threePhaseQues3`}
              id={`threePhaseQues3`}
              placeholder="Upload photo"
              accept="capture=camera"
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
              required
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
              required
              type="file"
              name={`threePhaseQues4`}
              id={`threePhaseQues4`}
              placeholder="Upload photo"
              accept="capture=camera"
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
              required
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
              required
              type="file"
              name={`threePhaseQues5`}
              id={`threePhaseQues5`}
              placeholder="Upload photo"
              accept="capture=camera"
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
              required
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
              required
              type="file"
              name={`threePhaseQues6`}
              id={`threePhaseQues6`}
              placeholder="Upload photo"
              accept="capture=camera"
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
              required
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
              required
              type="file"
              name={`threePhaseQues7`}
              id={`threePhaseQues7`}
              placeholder="Upload photo"
              accept="capture=camera"
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
              required
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
              required
              type="file"
              name={`threePhaseQues8`}
              id={`threePhaseQues8`}
              placeholder="Upload photo"
              accept="capture=camera"
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
              required
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
              required
              type="file"
              name={`threePhaseQues9`}
              id={`threePhaseQues9`}
              placeholder="Upload photo"
              accept="capture=camera"
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

  const handleSubmitInverterTicket = async () => {
    setIsGeneratingPdf(true);
    const pdf = await generatePdf();
    const pdfBlob = await uploadPdf({
      pdfFileName: `${
        customerDetail.custInstalledInverterCompany
      }_Inverter_${customerDetail.custName.split(" ").join("_")}_${
        customerDetail.custSysCapacity
      }kW`,
      pdf,
    });
    setIsGeneratingPdf(false);
    setPdfUrl(pdfBlob.url);
  };

  const handlePdfPreview = async () => {
    setIsPDFPreviewLoading(true);
    const pdf = await generatePdf();
    const pdfBlob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
    setIsPDFPreviewLoading(false);
  };

  const generateQuestionArray = () => {
    const questionArray = [];
    if (
      parseInt(customerDetail.custInstalledInverterSingleOrThreePhase) === 1
    ) {
      Object.keys(singlePhaseAnswers).forEach((key) => {
        if (singlePhaseAnswers[key]?.answer) {
          questionArray.push({
            question: singlePhaseAnswers[key].question,
            answer: singlePhaseAnswers[key]?.answer,
          });
        }
      });
    }
    if (
      parseInt(customerDetail.custInstalledInverterSingleOrThreePhase) === 3
    ) {
      Object.keys(threePhaseAnswers).forEach((key) => {
        if (threePhaseAnswers[key]?.answer) {
          questionArray.push({
            question: threePhaseAnswers[key].question,
            answer: threePhaseAnswers[key]?.answer,
          });
        }
      });
    }
    Object.keys(inverterAnswersOne).forEach((key) => {
      if (inverterAnswersOne[key]?.answer) {
        questionArray.push({
          question: inverterAnswersOne[key].question,
          answer: inverterAnswersOne[key]?.answer,
        });
      }
    });
    Object.keys(inverterAnswersTwo).forEach((key) => {
      if (inverterAnswersTwo[key]?.answer) {
        questionArray.push({
          question: inverterAnswersTwo[key].question,
          answer: inverterAnswersTwo[key]?.answer,
        });
      }
    });
    return questionArray;
  };

  return (
    <div className="mt-20 md:mt-0">
      {(verifyingUser || isQuestionLoading) && (
        <div className="flex justify-center items-center h-full">
          <BounceLoader color={spinnerColor} />
        </div>
      )}
      {!verifyingUser && isVerified._id && !isQuestionLoading && (
        <>
          {!pdfUrl && (
            <div>
              <div className="text-4xl">Raise new inverter ticket</div>
              <br></br>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsFormFilled(true);
                }}
              >
                <CustomerDetailForm
                  handleCustomerDetailForm={setCustomerDetail}
                  customerDetail={customerDetail}
                  contractorDetail={isVerified}
                />
                <div className="text-3xl">Faulty Inverter Question</div>
                <hr />
                {inverterQuestionDataOne.map((question, index) => (
                  <Row key={index}>
                    {question.maxDropdownElements === 1
                      ? getDefaultInverterQuestionForm(
                          question,
                          index,
                          setInverterAnswersOne,
                          "1"
                        )
                      : getDropdownInverterForm(
                          question,
                          index,
                          setInverterAnswersOne,
                          "1"
                        )}
                    <hr />
                  </Row>
                ))}
                {parseInt(
                  customerDetail.custInstalledInverterSingleOrThreePhase
                ) === 1 && (
                  <>
                    <Row>{getSinglePhaseForm()}</Row>
                  </>
                )}
                {parseInt(
                  customerDetail.custInstalledInverterSingleOrThreePhase
                ) === 3 && (
                  <>
                    <Row>{getThreePhaseForm()}</Row>
                  </>
                )}
                {inverterQuestionDataTwo.map((question, index) => (
                  <Row key={index}>
                    {question.maxDropdownElements === 1
                      ? getDefaultInverterQuestionForm(
                          question,
                          index,
                          setInverterAnswersTwo,
                          "2"
                        )
                      : getDropdownInverterForm(
                          question,
                          index,
                          setInverterAnswersTwo,
                          "2"
                        )}
                    <hr />
                  </Row>
                ))}
                <div className="flex flex-row gap-4">
                  <div>
                    {!isPDFPreviewLoading && (
                      <Button
                        color="warning"
                        onClick={() => handlePdfPreview()}
                      >
                        Preview PDF
                      </Button>
                    )}
                    {isPDFPreviewLoading && (
                      <div className="flex justify-center items-center h-full">
                        <BounceLoader color={spinnerColor} />
                      </div>
                    )}
                  </div>
                  <div>
                    {isGeneratingPdf && (
                      <div className="flex justify-center items-center h-full">
                        <BounceLoader color={spinnerColor} />
                      </div>
                    )}
                    {!isGeneratingPdf && (
                      <Button color="warning" type="submit">
                        Submit
                      </Button>
                    )}
                  </div>
                </div>
              </Form>
              <Modal isOpen={isGeneratingPdf}>
                <ModalHeader>Generating PDF</ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-4 justify-center items-center">
                    <div>
                      Preparing PDF. Please wait, this may take a few minutes.
                    </div>
                    <div className="flex justify-center items-center h-full">
                      <BounceLoader color={spinnerColor} />
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <div className="text-rose-700 font-medium italic">{`Don't close the window until the PDF is generated.`}</div>
                </ModalFooter>
              </Modal>
              {isPDFPreviewLoading && (
                <div className="flex justify-center items-center h-full">
                  <BounceLoader color={spinnerColor} />
                </div>
              )}
            </div>
          )}
          {pdfUrl && (
            <GeneratedTicketDetails
              customerDetail={customerDetail}
              pdfUrl={pdfUrl}
              contractorDetail={isVerified}
              questionArray={generateQuestionArray()}
              ticketType="Inverter"
            />
          )}
        </>
      )}
    </div>
  );
}
