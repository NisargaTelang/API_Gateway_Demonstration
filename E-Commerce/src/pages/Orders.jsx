import { useEffect, useState } from "react";
import { cancelOrder, getOrdersByEmail } from "../services/orderService";
import PaymentModal from "../components/PaymentModal";
import { getInvoicePdf } from "../services/paymentService";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState(null);

    // ✅ Payment Modal state
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.email) {
            setError("You must be logged in to view your orders.");
            setLoading(false);
            return;
        }

        (async () => {
            try {
                const res = await getOrdersByEmail(user.email);
                res.data.sort(
                    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
                );
                setOrders(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load orders ❌");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleCancel = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        setProcessing(orderId);

        const cancelOrderData = {
            orderId: orderId,
            status: "CANCELLED"
        }

        try {
            const res = await cancelOrder(cancelOrderData)
            alert(`Order ${orderId} cancelled ✅`);
            setOrders((prev) =>
                prev.map((o) =>
                    o.orderId === orderId ? { ...o, status: "CANCELLED" } : o
                )
            );
        } catch {
            alert("Failed to cancel order ❌");
        } finally {
            setProcessing(null);
        }
    };

    const downloadInvoice = async (orderId) => {
        try {
            const res = await getInvoicePdf(orderId);
            const blob = res.data;
            const text = await blob.text();
            const pdfUrl = text.replace(/"/g, "");
            window.open(pdfUrl, "_blank"); // ✅ open the invoice
        } catch (err) {
            console.error(err);
            alert("❌ Could not fetch invoice");
        }
    };

    // ✅ Open Payment Modal
    const handlePayNow = (order) => {
        setSelectedOrder(order);
        setShowPaymentModal(true);
    };

    const refreshOrders = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const res = await getOrdersByEmail(user.email);

        res.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setOrders(res.data);
    };

    // ✅ Close Payment Modal
    const handleClosePayment = () => {
        setSelectedOrder(null);
        setShowPaymentModal(false);
    };

    if (loading)
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border" role="status"></div>
            </div>
        );

    if (error)
        return (
            <div className="container py-5">
                <div className="alert alert-danger text-center">{error}</div>
            </div>
        );

    if (orders.length === 0)
        return (
            <div className="container py-5 text-center">
                <h5>No orders found 😕</h5>
            </div>
        );

    return (
        <div className="container py-4">
            <h2 className="mb-4">My Orders</h2>

            <div className="row">
                {orders.map((order) => (
                    <div className="col-12 mb-3" key={order.orderId}>
                        <div className="card shadow-sm p-3 d-flex flex-row align-items-center justify-content-between">

                            {/* Product Image */}
                            <div className="col-md-3 text-center">
                                <img
                                    src={order.imageUrl}
                                    alt={order.productName}
                                    className="img-fluid rounded"
                                    style={{ height: "120px", objectFit: "contain" }}
                                />
                            </div>

                            {/* Order Details */}
                            <div className="col-md-6">
                                <h5 className="fw-bold">{order.productName}</h5>
                                <p className="mb-1 text-success fw-semibold">
                                    ₹{order.priceSnapshot?.toLocaleString()}
                                </p>
                                <p className="mb-1">
                                    <strong>Status:</strong>{" "}
                                    <span
                                        className={`badge ${order.status === "CANCELLED"
                                            ? "bg-danger"
                                            : order.status === "CREATED"
                                                ? "bg-warning text-dark"
                                                : order.status === "PAID"
                                                    ? "bg-success"
                                                    : "bg-secondary"
                                            }`}
                                    >
                                        {order.status}
                                    </span>
                                </p>

                                {order.address && (
                                    <p className="mb-1">
                                        <strong>Address:</strong> {order.address}
                                    </p>
                                )}
                                <p className="text-muted small mb-0">
                                    Ordered on:{" "}
                                    {new Date(order.createdAt).toLocaleString("en-IN", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })}
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="col-md-3 text-end">
                                {/* Pay Now button for CREATED */}
                                {order.status === "CREATED" && (
                                    <>
                                        <button
                                            className="btn btn-success me-2"
                                            disabled={processing === order.orderId}
                                            onClick={() => handlePayNow(order)}
                                        >
                                            Pay Now 💳
                                        </button>

                                        <button
                                            className="btn btn-outline-danger"
                                            disabled={processing === order.orderId}
                                            onClick={() => handleCancel(order.orderId)}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}

                                {/* Paid or Cancelled indicators */}
                                {order.status === "PAID" && (
                                    <div> <button className="btn btn-outline-success" disabled>
                                        Paid ✅
                                    </button>
                                        <button
                                            className="btn btn-primary ms-2"
                                            onClick={() => downloadInvoice(order.orderId)}
                                        >
                                            Download Invoice 📄
                                        </button>
                                    </div>



                                )}

                                {order.status === "CANCELLED" && (
                                    <button className="btn btn-outline-danger" disabled>
                                        Cancelled
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ✅ Payment Modal */}
            {showPaymentModal && selectedOrder && (
                <PaymentModal
                    show={showPaymentModal}
                    order={selectedOrder}
                    onClose={handleClosePayment}
                    onPaymentSuccess={(orderId) => {
                        refreshOrders();   // ✅ reload list
                        setShowPaymentModal(false);
                    }}
                />

            )}
        </div>
    );
}
