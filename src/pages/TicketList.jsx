import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import TicketModal from "../components/TicketModal";

function TicketList() {
    const apiBaseUrl = api.defaults.baseURL.replace("/api", "");
    const navigate = useNavigate();

    const username = localStorage.getItem("username");

    const [tickets, setTickets] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {

        try {

            const response = await api.get("/Ticket");

            setTickets(response.data);

        }
        catch (error) {

            console.error(error);

        }

    };

const saveTicket = async (ticket) => {

    try {

        const formData = new FormData();

        formData.append("Id", ticket.id ?? 0);
        formData.append("Title", ticket.title);
        formData.append("Description", ticket.description);

        if (ticket.file) {
            formData.append("file", ticket.file);
        }

        if (ticket.id) {

            await api.put(`/Ticket/${ticket.id}`, formData);

        }
        else {

            await api.post("/Ticket", formData);

        }

        await loadTickets();

        setShowModal(false);

        setSelectedTicket(null);

    }
    catch (error) {

        console.error(error);

        alert("Unable to save ticket.");

    }

};
    const updateTicket = async (ticket) => {

    try {

        await api.put(`/Ticket/${ticket.id}`, ticket);

        await loadTickets();

        setShowModal(false);
        setSelectedTicket(null);

    }
    catch (error) {

        console.error(error);

        alert("Unable to update ticket.");

    }

};
const deleteTicket = async (id) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this ticket?"
    );

    if (!confirmDelete)
        return;

    try {

        await api.delete(`/Ticket/${id}`);

        await loadTickets();

    }
    catch (error) {

        console.error(error);

        alert("Unable to delete ticket.");

    }
};
    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("username");

        navigate("/");

    };

    return (
        <div className="container-fluid p-0">

            {/* Navbar */}

            <nav className="navbar navbar-dark bg-dark px-4">

                <h2 className="text-white m-0">
                    MiniDesk
                </h2>

                <div>

                    <span className="text-white me-3">
                        Welcome {username}
                    </span>

                    <button
                        className="btn btn-outline-light"
                        onClick={logout}
                    >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                    </button>

                </div>

            </nav>


            <div className="container mt-5">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <h1>
                        Ticket Management

                        <span className="badge bg-primary ms-2">
                            {tickets.length}
                        </span>

                    </h1>

                    <button
                        className="btn btn-success"
                        onClick={() => {

                            setSelectedTicket(null);
                            setShowModal(true);

                        }}
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        New Ticket
                    </button>

                </div>

                <table className="table table-striped table-hover align-middle">

                    <thead className="table-dark">

                        <tr>

                            <th>#</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th width="180">Actions</th>
                            <th>Attachment</th>
                        </tr>

                    </thead>

                    <tbody>

                        {tickets.map((ticket, index) => (

                            <tr key={ticket.id}>

                                <td>{index + 1}</td>

                                <td>{ticket.title}</td>

                                <td>{ticket.description}</td>

                                <td>

                                    <button className="btn btn-warning btn-sm me-2" onClick={() => {
                                        setSelectedTicket(ticket);
                                        setShowModal(true);
                                    }}>
                                    <i className="bi bi-pencil-square"></i>
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => deleteTicket(ticket.id)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>

                                </td>
                                <td>
                                    {ticket.attachmentPath ? (
                                    <a
                                        href={`${apiBaseUrl}${ticket.attachmentPath}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                    <i className="bi bi-paperclip"></i> View
                                    </a>
                                    ) : (
                                        "-"
                                    )}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            <TicketModal
    show={showModal}
    ticket={selectedTicket}
    onClose={() => {

        setShowModal(false);
        setSelectedTicket(null);

    }}
    onSave={saveTicket}
/>

        </div>
    );

}

export default TicketList;