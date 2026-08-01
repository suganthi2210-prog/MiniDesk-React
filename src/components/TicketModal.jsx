function TicketModal() {

    return (
        <div
            className="modal fade"
            id="ticketModal"
            tabIndex="-1"
        >
            <div className="modal-dialog">

                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">
                            New Ticket
                        </h5>

                        <button
                            className="btn-close"
                            data-bs-dismiss="modal">
                        </button>
                    </div>

                    <div className="modal-body">

                        <div className="mb-3">
                            <label className="form-label">
                                Title
                            </label>

                            <input
                                className="form-control"
                                type="text"
                            />
                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Description
                            </label>

                            <textarea
                                className="form-control"
                                rows="4">
                            </textarea>

                        </div>

                    </div>

                    <div className="modal-footer">

                        <button
                            className="btn btn-secondary"
                            data-bs-dismiss="modal">
                            Cancel
                        </button>

                        <button className="btn btn-primary">
                            Save
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default TicketModal;