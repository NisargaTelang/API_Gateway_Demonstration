import { useEffect, useState } from "react";
import { getAllOrders } from "../../services/orderService";
import OrderDetailsModal from "../../components/OrderDetailsModal"
export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const res = await getAllOrders();
            console.log(res.data)
            setOrders(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to fetch orders ❌");
        } finally {
            setLoading(false);
        }
    };

    if (loading)
        return (
            <div className="text-center py-5">
                <div className="spinner-border"></div>
            </div>
        );

    return (
        <div className="container py-4">
            <h2 className="mb-4">All Orders (Admin)</h2>

            {/* ✅ Data Grid Table */}
            <table className="table table-hover table-striped align-middle">
                <thead className="table-dark">
                    <tr>
                        <th>Order ID</th>
                        <th>Product</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th>View</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map((o) => (
                        <tr key={o.orderId}>
                            <td>{o.orderId.slice(0, 8)}...</td>
                            <td>{o.productName}</td>
                            <td>{o.email}</td>
                            <td>
                                <span
                                    className={`badge ${o.status === "PAID"
                                            ? "bg-success"
                                            : o.status === "CREATED"
                                                ? "bg-warning text-dark"
                                                : "bg-danger"
                                        }`}
                                >
                                    {o.status}
                                </span>
                            </td>

                            <td>
                                {o.paymentStatus ? (
                                    <span className="badge bg-success">{o.paymentStatus}</span>
                                ) : (
                                    <span className="badge bg-secondary">Not Paid</span>
                                )}
                            </td>

                            <td>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => setSelectedOrder(o)}
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ✅ Modal */}
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
}
