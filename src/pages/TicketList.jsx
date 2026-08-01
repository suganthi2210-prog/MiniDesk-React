import { useState, useEffect } from "react";
import api from "../services/api";
import TicketModal from "../components/TicketModal";

function TicketList(){
    const [tickets, setTickets] = useState([]);
    useEffect(
        ()=>{
            api.get("/Ticket").then(response => {
                console.log(response.data);
                setTickets(response.data);
            })
            .catch(error => {
                console.log(error);
            })
        }, []
    );
    console.log(tickets);
    return (
    <div className="container mt-4">

        <nav className="navbar navbar-dark bg-dark rounded px-3 mb-4">

            <span className="navbar-brand mb-0 h1">
                MiniDesk
            </span>

            <div>

                <span className="text-white me-3">
                    Welcome Admin
                </span>

                <button className="btn btn-outline-light btn-sm">
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Logout
                </button>

            </div>

        </nav>

        <div className="d-flex justify-content-between align-items-center mb-3">

            <h2>Ticket Management
                <span className="badge bg-primary ms-2">
                    {tickets.length}
                </span>
            </h2>

            <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#ticketModal">
                <i className="bi bi-plus-circle me-1"></i>New Ticket
            </button>
        </div>

        <table className="table table-striped table-hover shadow">

            <thead className="table-dark">

                <tr className="align-middle">
                    <th>#</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>

            </thead>

            <tbody>

                {tickets.map(ticket => (

                    <tr className="align-middle" key={ticket.id}>

                        <td>{ticket.id}</td>
                        <td>{ticket.title}</td>
                        <td>{ticket.description}</td>
                        <td>
                            <button className="btn btn-warning btn-sm me-2"><i className="bi bi-pencil-square"></i></button>
                            <button className="btn btn-danger btn-sm"><i className="bi bi-trash"></i></button>
                        </td>

                    </tr>

                ))}

            </tbody>

        </table>
    <TicketModal />
    </div>
);
}
export default TicketList;