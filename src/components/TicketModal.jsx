import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import api from "../services/api";

function TicketModal({ show, onClose, onSave, ticket }) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const apiBaseUrl = api.defaults.baseURL.replace("/api", "");
    useEffect(() => {

        if (ticket) {
            setTitle(ticket.title);
            setDescription(ticket.description);
        }
        else {
            setTitle("");
            setDescription("");
            setFile(null);
        }

    }, [ticket, show]);

    const handleSave = () => {

    if (!title.trim()) {
        alert("Title is required");
        return;
    }

    onSave({
        id: ticket?.id,
        title,
        description,
        file
    });

};

    return (
        <Modal
            show={show}
            onHide={onClose}
            centered
            size="lg"
        >

            <Modal.Header closeButton>
                <Modal.Title>
                    {ticket ? "Edit Ticket" : "New Ticket"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <Form>

                    <Form.Group className="mb-4">

                        <Form.Label>Title</Form.Label>

                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                    </Form.Group>

                    <Form.Group>

                        <Form.Label>Description</Form.Label>

                        <Form.Control
                            as="textarea"
                            rows={5}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                    </Form.Group>
                    <Form.Group className="mt-3">

    <Form.Label>Attachment</Form.Label>

    <Form.Control
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
    />

    {ticket?.attachmentPath && (
        <div className="mt-2">
            Current File:
            <a
                href={`${apiBaseUrl}${ticket.attachmentPath}`}
                target="_blank"
                rel="noreferrer"
                className="ms-2"
            >
                View Attachment
            </a>
        </div>
    )}

</Form.Group>
                </Form>

            </Modal.Body>

            <Modal.Footer>

                <Button
                    variant="secondary"
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="primary"
                    onClick={handleSave}
                >
                    Save
                </Button>

            </Modal.Footer>

        </Modal>
    );
}

export default TicketModal;