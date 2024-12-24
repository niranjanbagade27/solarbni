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

export default function AdminFormNotesPage({ loggedInUser }) {
  const [isLoading, setIsLoading] = useState(true);
  const [formNotes, setFormNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  async function fetchFormNotes() {
    try {
      const response = await axios.get("/api/formnotes");
      setFormNotes(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchFormNotes();
  }, []);

  const handleNoteSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/formnotes", {
        formNote: newNote,
      });
      fetchFormNotes();
      setNewNote("");
      toast.success("Note added successfully");
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Error adding note");
      setIsLoading(false);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/formnotes/deleteformnote`, { id });
      fetchFormNotes();
      toast.success("Note deleted successfully");
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Error deleting note");
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="flex flex-row justify-between items-center">
        <div className="w-[85%]">
          <Input
            type="textarea"
            placeholder="Add a note"
            onChange={(e) => setNewNote(sanatizeHtml(e.target.value))}
          />
        </div>
        <div className="w-[10%]">
          <Button color="primary" onClick={() => handleNoteSubmit()}>
            Add Note
          </Button>
        </div>
      </div>
      <hr />
      {isLoading && (
        <div className="flex justify-center">
          <BounceLoader color={spinnerColor} />
        </div>
      )}
      {!isLoading && formNotes.length === 0 && (
        <div>
          <h2 className="text-center">No notes found</h2>
        </div>
      )}
      {!isLoading &&
        formNotes.map((note, index) => (
          <div
            key={index}
            className="flex flex-row justify-between items-center gap-4"
          >
            <div className="font-semibold text-xl text-black">{note.notes}</div>
            <div>
              <Button color="danger" onClick={() => handleDeleteNote(note._id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
    </div>
  );
}
