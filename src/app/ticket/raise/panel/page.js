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
import uploadPdf from "@/util/uploadPdf";
import { GeneratedTicketDetails } from "@/components/GeneratedTicketDetails/GeneratedTicketDetails";

export default function RaisePanelTicketPage() {
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
  const [panelQuestionOne, setPanelQuestionOne] = useState([]);
  const [panelQuestionTwo, setPanelQuestionTwo] = useState([]);
  const [panelAnswers, setPanelAnswers] = useState({});
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
  const [numberOfAffectedPanels, setNumberOfAffectedPanels] = useState([]);
  let pdfQuesNo = 1;
  const [panelFaultTypeList, setPanelFaultTypeList] = useState([
    "Reticular crack",
    "EVA delamination",
    "Delamination caused by poor silica gel",
    "Solar panel burnt out",
    "Junction box on fire",
    "Cell crack",
    "Too much solar cell flux",
    "Tempered glass explosion",
    "Low-efficiency solar cells",
    "EVA strip turns yellow",
    "Solar panel colour difference",
    "False welding and over welding",
    "Foreign matter",
    "The silica gel of the junction box is not solidified",
    "False soldering of lead wire",
    "Missing glue",
    "Silicone bubbles and gaps",
    "Strip offset or warped fragments after welding",
    "Bubble",
    "Other",
  ]);
  const [pdfUrl, setPdfUrl] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("/api/panelfaultquestions");
      const allQuestions = result.data.questions;
      const questionOne = allQuestions.filter(
        (question) => parseInt(question.questionSection) === 1
      );
      const questionTwo = allQuestions.filter(
        (question) => parseInt(question.questionSection) === 2
      );
      setPanelQuestionOne(questionOne);
      setPanelQuestionTwo(questionTwo);
      setIsQuestionLoading(false);
    };
    fetchData();
  }, []);

  const handlePanelDropdownLimit = (srNo, value, parIndex) => {
    setQuesDropdownLimit({
      ...quesDropdownLimit,
      [`${srNo}-${parIndex}`]: parseInt(value),
    });
  };

  const getDefaultPanelQuestionForm = (question, index) => {
    const ques = question.questionChild[0];
    return (
      <Col>
        <FormGroup className="flex flex-col gap-2">
          <Label
            for={`panelQuestion-${ques.question}-${index}`}
            className="font-medium"
          >
            {ques.question}
          </Label>
          {ques.textAllowed && (
            <Input
              type="text"
              name={`panelQuestion-${ques.question}-${index}`}
              id={`panelQuestion-${ques.question}-${index}`}
              placeholder="Enter your answer"
              onChange={(e) =>
                setPanelAnswers({
                  ...panelAnswers,
                  [`${index + 1}-${question.srNo}`]: {
                    ...panelAnswers[`${index + 1}-${question.srNo}`],
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
              name={`panelQuestion-${ques.question}-${index}`}
              id={`panelQuestion-${ques.question}-${index}`}
              placeholder="Upload photo"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setPanelAnswers({
                      ...panelAnswers,
                      [`${index + 1}-${question.srNo}`]: {
                        ...panelAnswers[`${index + 1}-${question.srNo}`],
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
            <Label
              for={`panelDropdown-${question.question}-${parIndex}`}
              className="font-medium"
            >
              {question.question}
            </Label>
            <Input
              type="select"
              name={`panelDropdown-${question.question}-${parIndex}`}
              id={`panelDropdown-${question.question}-${parIndex}`}
              onChange={(e) => {
                handlePanelDropdownLimit(
                  question.srNo,
                  e.target.value,
                  parIndex
                );
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
          {Array.from({
            length: quesDropdownLimit[`${question.srNo}-${parIndex}`],
          }).map((_, i) =>
            question.questionChild.map((ques, index) => (
              <Col key={`${i}-${index}`}>
                <FormGroup className="flex flex-col gap-2">
                  <Label
                    for={`panelQuestion-${i}-${index}-${parIndex}`}
                    className="font-medium"
                  >
                    Panel {parIndex + 1} - {ques.question} - {i + 1} - {index}
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
                          [`${parIndex + 1}-${i + 1}-${index}`]: {
                            ...panelAnswers[
                              `${parIndex + 1}-${i + 1}-${index}`
                            ],
                            question: `${ques.question}`,
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
                              [`${parIndex + 1}-${i + 1}-${index}`]: {
                                ...panelAnswers[
                                  `${parIndex + 1}-${i + 1}-${index}`
                                ],
                                question: `${ques.question}`,
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

  const addNewPage = async ({
    pdf,
    question,
    answer,
    photo,
    panelAffected,
  }) => {
    pdf.addPage();
    addHeader(pdf);
    pdf.addImage("/images/page_bg.png", "JPEG", 0, 0, 297, 210);
    pdf.setFontSize(12);
    pdf.text(`[ Affected Panel - ${panelAffected} ]`, 20, 24);
    pdf.setFontSize(20);
    pdf.text(`Q - ${question}`, 20, 35);
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

  const addEmailContent = (pdf) => {
    pdf.setFontSize(13);
    pdf.addImage("/images/page_bg.png", "JPEG", 0, 0, 297, 210);
    pdf.text(`Date : ${new Date().toDateString()}`, 230, 15);
    pdf.setFontSize(18);
    pdf.text(
      `Subject: Request for service support for Solar PV system`,
      20,
      35
    );
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      `Respected ${customerDetail.custInstalledPanelCompany} representative,`,
      20,
      50
    );
    const splitEmailHeader = pdf.splitTextToSize(
      `We require service support with ${customerDetail.custInstalledPanelCompany} panel installed at ${customerDetail.custAddress} with plant capacity ${customerDetail.custSysCapacity}kW. This report has been generated to provide you all necessary parameters required for site assessment.`,
      260
    );
    pdf.text(splitEmailHeader, 27, 60);
    pdf.text(`Looking forward to your positive feedback.`, 27, 78);
    pdf.text(`Thanks, and regards,`, 20, 90);
    pdf.text(`${customerDetail.custName}`, 20, 100);
    pdf.text(`${customerDetail.custPhone}`, 20, 110);
    pdf.text(`Project installed by,`, 20, 130);
    pdf.text(`${isVerified.fullName}`, 20, 140);
    pdf.text(`${isVerified.companyName}`, 20, 150);
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
    pdf.addImage("/images/white_bg.jpg", "JPEG", 110, 20, 174, 150);
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
    pdf.text(`${customerDetail.custPincode}`, 125, 105);
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
    Object.keys(panelAnswers).forEach((key) => {
      addNewPage({
        pdf,
        question: panelAnswers[key].question,
        answer: panelAnswers[key]?.answer,
        photo: panelAnswers[key]?.photo,
        panelAffected: key.split("-")[0],
      });
    });
    const totalPages = pdf.internal.getNumberOfPages();
    for (let currPage = 2; currPage <= totalPages; currPage++) {
      pdf.setPage(currPage);
      addHeader(pdf);
      addFooter(pdf, currPage, totalPages);
    }
    // pdf.save("panel-ticket.pdf");
    const pdfBlob = await uploadPdf({
      pdfFileName: `${customerDetail.custInstalledPanelCompany}_${customerDetail.custInstalledPanelModel}_${customerDetail.custName}_${customerDetail.custSysCapacity}`,
      pdf,
    });
    setIsGeneratingPdf(false);
    setPdfUrl(pdfBlob.url);
  };

  const handleSubmitPanelTicket = () => {
    setIsGeneratingPdf(true);
    generatePdf();
  };

  return (
    <div className="mt-20 md:mt-0">
      {!pdfUrl && (
        <>
          {(verifyingUser || isQuestionLoading) && (
            <div className="flex justify-center items-center h-full">
              <BounceLoader color={spinnerColor} />
            </div>
          )}
          {!verifyingUser && isVerified._id && !isQuestionLoading && (
            <div>
              <div className="text-4xl">Raise new inverter ticket</div>
              <br></br>
              <Form>
                <CustomerDetailForm
                  handleCustomerDetailForm={setCustomerDetail}
                  customerDetail={customerDetail}
                  contractorDetail={isVerified}
                />
                <Row>
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
                            setPanelAnswers({});
                          } else {
                            setNumberOfAffectedPanels(
                              new Array(parseInt(e.target.value)).fill(0)
                            );
                            const updatedAnswers = { ...panelAnswers };
                            Object.keys(updatedAnswers).forEach((key) => {
                              const panelIndex = parseInt(key.split("-")[0]);
                              if (panelIndex > parseInt(e.target.value)) {
                                delete updatedAnswers[key];
                              }
                            });
                            setPanelAnswers(updatedAnswers);
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
                <hr />
                {numberOfAffectedPanels.map((_, index) => (
                  <div key={index}>
                    <div className="font-medium text-xl mb-2">
                      Affected panel - {index + 1}
                    </div>
                    <hr />
                    <div>
                      {panelQuestionOne.map((question) => (
                        <Row key={`${question._id}-${index}`}>
                          {question.maxDropdownElements === 1
                            ? getDefaultPanelQuestionForm(question, index)
                            : getDropdownPanelForm(question, index)}
                          <hr />
                        </Row>
                      ))}
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label
                              for="Select the panel fault type"
                              className="font-medium"
                            >
                              Select the panel fault type
                            </Label>
                            <Input
                              type="select"
                              name="Select the panel fault type"
                              id="Select the panel fault type"
                              onChange={(e) => {
                                setPanelAnswers({
                                  ...panelAnswers,
                                  [`${index + 1}-paneltype`]: {
                                    ...panelAnswers[`${index + 1}-paneltype`],
                                    question: "Panel fault type",
                                    answer: sanatizeHtml(e.target.value),
                                  },
                                });
                              }}
                            >
                              <option value="">Select</option>
                              {panelFaultTypeList.map((opt, index) => (
                                <option key={index} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </Input>
                            <div>
                              Identify your panel fault type{" "}
                              <a
                                href="https://drive.google.com/file/d/1nR400pCeNaFj_AaSXyPuwI2Ett1EEosI/view?usp=drive_link"
                                target="_blank"
                                className="text-inherit underline"
                              >
                                Click here
                              </a>
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                      {panelQuestionTwo.map((question) => (
                        <Row key={`${question._id}-${index}`}>
                          {question.maxDropdownElements === 1
                            ? getDefaultPanelQuestionForm(question, index)
                            : getDropdownPanelForm(question, index)}
                          <hr />
                        </Row>
                      ))}
                    </div>
                  </div>
                ))}
                {!isGeneratingPdf && (
                  <Button
                    color="primary"
                    onClick={() => handleSubmitPanelTicket()}
                  >
                    Submit
                  </Button>
                )}
                {isGeneratingPdf && (
                  <div className="flex justify-center items-center h-full">
                    <BounceLoader color={spinnerColor} />
                  </div>
                )}
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
            </div>
          )}
        </>
      )}
      {pdfUrl && (
        <GeneratedTicketDetails
          customerDetail={customerDetail}
          pdfUrl={pdfUrl}
          contractorDetail={isVerified}
          tikcetType="Panel"
        />
      )}
    </div>
  );
}
