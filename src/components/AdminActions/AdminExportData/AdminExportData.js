import { useState, useEffect } from "react";
import axios from "axios";
import BounceLoader from "react-spinners/BounceLoader";
import { spinnerColor } from "@/constants/colors";
import sanatizeHtml from "sanitize-html";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  FormFeedback,
} from "reactstrap";
import { userRoles } from "@/constants/role";
import { toast } from "react-toastify";

export default function AdminExportPage({ loggedInUser }) {
  const [isLoadingAllExport, setIsLoadingAllExport] = useState(false);

  const convertToCSV = (data) => {
    const excludedKeys = ["ticketEmailContent", "_v"]; // Add keys to exclude
    const headers = Object.keys(data[0])
      .filter((key) => !excludedKeys.includes(key))
      .join(",");
    const csvContent = [
      headers,
      ...data.map((ticket) => {
        return Object.keys(ticket)
          .filter((key) => !excludedKeys.includes(key))
          .map((key) => ticket[key])
          .join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "tickets.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAllExport = async () => {
    setIsLoadingAllExport(true);
    try {
      const {
        data: { ticketData },
      } = await axios.get("/api/ticket");
      convertToCSV(ticketData);
      setIsLoadingAllExport(false);
    } catch (err) {
      console.log(err);
      toast(err.response.data.message);
      setIsLoadingAllExport(false);
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="font-semibold text-lg">Export all tickets</div>
        <div>
          {!isLoadingAllExport && (
            <Button color="primary" onClick={() => handleAllExport()}>
              Export
            </Button>
          )}
          {isLoadingAllExport && <BounceLoader color={spinnerColor} />}
        </div>
      </div>
      {/* <div className="flex justify-between items-center">
        <div className="font-semibold text-lg">Export all tickets</div>
        <div>
          {!isLoadingAllExport && (
            <Button color="primary" onClick={() => handleAllExport()}>
              Export
            </Button>
          )}
          {isLoadingAllExport && <BounceLoader color={spinnerColor} />}
        </div>
      </div> */}
    </div>
  );
}
