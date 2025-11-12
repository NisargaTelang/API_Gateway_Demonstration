import { useState, useEffect } from "react";
import { createPendingOrder } from "../services/orderService";
import PaymentModal from "./PaymentModal"; // ✅ import new modal

export default function OrderModal({ product, show, onClose }) {
    const [customerName, setCustomerName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        if (show) {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user) {
                setCustomerName(user.fullName || "");
                setEmail(user.email || "");
                setPhone(user.mobileNo || "");
            }
            setAddress("");
        }
    }, [show]);

    if (!show || !product) return null;

    const handleConfirm = async () => {
        const user = JSON.parse(localStorage.getItem("user"));

        const order = {
            productId: product.id,
            email: user.email,
            fullName: user.fullName,
            mobileNo: user.mobileNo,
            status: "CREATED",
            token: user.token,
            address: address,
        };

        try {
            const res = await createPendingOrder(order);
            setOrderDetails({ ...order, 
                orderId : res.data.orderId,
                product });
            setShowPaymentModal(true);
        } catch (error) {
            console.error(error);
            alert("❌ Failed to place order");
        }
    };

    const handleClosePayment = () => {
        setShowPaymentModal(false);
        onClose();
    };

    return (
        <>
            {/* Order Confirmation Modal */}
            {!showPaymentModal && (
                <div
                    className="modal fade show d-block"
                    style={{
                        backdropFilter: "blur(6px)",
                        backgroundColor: "rgba(0,0,0,0.35)",
                    }}
                    onClick={onClose}
                >
                    <div
                        className="modal-dialog modal-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-content" style={{ borderRadius: "12px" }}>
                            <div className="modal-header">
                                <h5 className="modal-title">Order Details</h5>
                                <button className="btn-close" onClick={onClose}></button>
                            </div>

                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-7">
                                        <h5 className="fw-bold">{product.name}</h5>
                                        <p className="text-success fw-bold fs-5">
                                            ₹{product.price.toLocaleString()}
                                        </p>

                                        <div className="mb-2">
                                            <label className="form-label">Full Name</label>
                                            <input
                                                className="form-control"
                                                value={customerName}
                                                onChange={(e) => setCustomerName(e.target.value)}
                                            />
                                        </div>

                                        <div className="mb-2">
                                            <label className="form-label">Email</label>
                                            <input
                                                className="form-control"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>

                                        <div className="mb-2">
                                            <label className="form-label">Phone</label>
                                            <input
                                                className="form-control"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                        </div>

                                        <div className="mb-2">
                                            <label className="form-label">Address</label>
                                            <textarea
                                                rows="3"
                                                className="form-control"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-5 text-center">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            style={{
                                                width: "100%",
                                                height: "220px",
                                                objectFit: "contain",
                                                borderRadius: "8px",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-success" onClick={handleConfirm}>
                                    Confirm Order ✅
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Payment Modal (second step) */}
            <PaymentModal
                show={showPaymentModal}
                order={orderDetails}
                onClose={handleClosePayment}
                onPaymentSuccess={() => {
                    alert("✅ Order updated successfully!");
                    handleClosePayment();
                }}
            />

        </>
    );
}
