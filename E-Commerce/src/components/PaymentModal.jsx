import { useEffect, useState } from "react";
import { processPayment } from "../services/paymentService";

export default function PaymentModal({ show, order, onClose, onPaymentSuccess }) {
    const [customerName, setCustomerName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (show && order) {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user) {
                setCustomerName(user.fullName || "");
                setEmail(user.email || "");
                setPhone(user.mobileNo || "");
            }
        }
    }, [show, order]);

    if (!show || !order) return null;

    const product = order.product || {};
    const productName = product.name || order.productName;
    const productImage = product.imageUrl || order.imageUrl;
    const productPrice = product.price || order.priceSnapshot;

    const handlePayNow = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.token) {
            alert("User not authenticated");
            return;
        }

        // useEffect(() => {
        //     console.log("PaymentModal ORDER:", order);
        // }, [order]);

        const paymentData = {
            orderId: order.orderId,
            token: user.token,
        };

        console.log(paymentData)

        try {
            setProcessing(true);
            const res = await processPayment(paymentData);

            alert("✅ Payment successful!\nBill generated at:\n" + res.data.pdfPath);

            // ✅ notify parent that payment succeeded
            if (onPaymentSuccess) onPaymentSuccess(order.orderId);

            onClose();
        } catch (err) {
            console.error(err);
            alert("❌ Payment failed. Try again.");
        } finally {
            setProcessing(false);
        }
    };

    const handlePayLater = () => {
        alert("⏳ You can pay later from your orders page.");
        onClose();
    };
    return (
        <div
            className="modal fade show d-block"
            style={{
                backdropFilter: "blur(6px)",
                backgroundColor: "rgba(0,0,0,0.35)",
            }}
            onClick={onClose}
        >
            <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content" style={{ borderRadius: "12px" }}>
                    <div className="modal-header">
                        <h5 className="modal-title">Payment Details</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">
                        <div className="row align-items-center">
                            <div className="col-md-6">
                                <h5 className="fw-bold">{productName}</h5>
                                <p className="text-success fs-5 fw-semibold">
                                    ₹{productPrice?.toLocaleString()}
                                </p>
                                <p className="mb-1"><strong>Full Name:</strong> {customerName}</p>
                                <p className="mb-1"><strong>Email:</strong> {email}</p>
                                <p className="mb-1"><strong>Phone:</strong> {phone}</p>
                                {order.address && (
                                    <p className="mb-0"><strong>Address:</strong> {order.address}</p>
                                )}
                            </div>

                            <div className="col-md-6 text-center">
                                <img
                                    src={productImage}
                                    alt={productName}
                                    className="img-fluid rounded"
                                    style={{
                                        height: "220px",
                                        objectFit: "contain",
                                        borderRadius: "8px",
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            className="btn btn-success"
                            onClick={handlePayNow}
                            disabled={processing}
                        >
                            {processing ? "Processing..." : "Pay Now 💳"}
                        </button>

                        <button className="btn btn-outline-secondary" onClick={handlePayLater}>
                            Pay Later ⏳
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
