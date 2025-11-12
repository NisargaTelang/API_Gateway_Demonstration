export default function OrderDetailsModal({ order, onClose }) {
    return (
        <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(5px)" }}
            onClick={onClose}
        >
            <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content rounded-3 shadow">

                    <div className="modal-header">
                        <h5 className="modal-title">Order Details</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-5 text-center">
                                <img
                                    src={order.imageUrl}
                                    alt={order.productName}
                                    className="img-fluid rounded"
                                    style={{ height: "200px", objectFit: "contain" }}
                                />
                                <h5 className="mt-3">{order.productName}</h5>
                                <div className="fw-bold text-success fs-5">
                                    ₹{order.priceSnapshot.toLocaleString()}
                                </div>
                            </div>

                            <div className="col-md-7">
                                <h6 className="fw-bold">Customer Details</h6>
                                <p><strong>Name:</strong> {order.fullName}</p>
                                <p><strong>Email:</strong> {order.email}</p>
                                <p><strong>Phone:</strong> {order.mobileNo}</p>
                                <p><strong>Address:</strong> {order.address}</p>

                                <hr />

                                <h6 className="fw-bold">Order Info</h6>
                                <p><strong>Status:</strong> {order.status}</p>
                                <p>
                                    <strong>Created:</strong>{" "}
                                    {new Date(order.createdAt).toLocaleString("en-IN")}
                                </p>
                                <p>
                                    <strong>Updated:</strong>{" "}
                                    {new Date(order.updatedAt).toLocaleString("en-IN")}
                                </p>

                                <hr />

                                <h6 className="fw-bold">Payment Details</h6>
                                {order.paymentId ? (
                                    <>
                                        <p><strong>Payment ID:</strong> {order.paymentId}</p>
                                        <p><strong>Status:</strong> {order.paymentStatus}</p>
                                        <p>
                                            <strong>Invoice:</strong>{" "}
                                            <a href={order.pdfPath} target="_blank" rel="noreferrer">
                                                Download PDF
                                            </a>
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-danger fw-bold">Not Paid Yet</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
