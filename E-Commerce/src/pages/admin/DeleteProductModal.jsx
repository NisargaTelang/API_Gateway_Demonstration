import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../../services/productService";

export default function DeleteProductModal({ show, onClose }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        if (show) {
            fetchProducts();
        }
    }, [show]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await getProducts();
            setProducts(res.data);
        } catch {
            alert("Failed to load products ❌");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product permanently?")) return;
        setDeleting(id);

        try {
            await deleteProduct(id);
            setProducts(products.filter((p) => p.id !== id));
            alert("Product deleted ✅");
        } catch {
            alert("Delete failed ❌");
        } finally {
            setDeleting(null);
        }
    };

    if (!show) return null;

    return (
        <div
            className="modal fade show d-block"
            style={{
                backdropFilter: "blur(6px)",
                backgroundColor: "rgba(0,0,0,0.35)"
            }}
            onClick={onClose}
        >
            <div
                className="modal-dialog modal-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Delete Products</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body"
                        style={{ maxHeight: "70vh", overflowY: "auto" }}>
                        {loading ? (
                            <div className="text-center p-4">
                                <div className="spinner-border"></div>
                            </div>
                        ) : (
                            <div className="row">
                                {products.map((p) => (
                                    <div className="col-md-3 mb-4" key={p.id}>
                                        <div className="card h-100 w-100 shadow-sm" style={{ minHeight: "230px", maxHeight: "230px" }}>
                                            <img
                                                src={p.imageUrl}
                                                alt={p.name}
                                                className="card-img-top img-fluid"
                                                style={{ height: "120px", objectFit: "contain", padding: "5px" }}
                                            />

                                            <div className="card-body p-2 text-center">
                                                <h6 className="card-title text-truncate">{p.name}</h6>
                                                <p className="fw-bold text-success small mb-1">₹{p.price.toLocaleString()}</p>

                                                {p.quantity < 10 && (
                                                    <p className="text-danger small mb-2 text-truncate">Only {p.quantity} left!</p>
                                                )}

                                                <button
                                                    className="btn btn-sm btn-danger w-100"
                                                    onClick={() => handleDelete(p.id)}
                                                    disabled={deleting === p.id}
                                                >
                                                    {deleting === p.id ? "Deleting..." : "Delete"}
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
