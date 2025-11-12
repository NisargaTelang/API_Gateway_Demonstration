import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { createPendingOrder } from "../services/orderService";
import OrderModal from "../components/OrderModal";

export default function Home({ onLoginRequest }) {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await getProducts();
                setProducts(res.data);
            } catch {
                console.log("❌ Failed to fetch products");
            }
        })();
    }, []);

    const openModal = (product) => {
        const user = localStorage.getItem("user");
        if (!user) {
            onLoginRequest();
            return;
        }
        setSelectedProduct(product);
        setShowOrderModal(true);
    };

    const closeModal = () => {
        setSelectedProduct(null);
        setShowOrderModal(false);
    };


    return (
        <div className="container py-4">
            <h2 className="mb-4">Products</h2>

            <div className="row">
                {products.map((p) => (
                    <div className="col-md-3 mb-4" key={p.id}>
                        <div className="card h-100 shadow-sm">
                            <img src={p.imageUrl} alt={p.name} className="card-img-top"
                                style={{ height: "180px", objectFit: "contain", padding: "10px" }}
                            />
                            <div className="card-body">
                                <h5 className="card-title text-truncate">{p.name}</h5>
                                <h6 className="text-success fw-bold">₹{p.price.toLocaleString()}</h6>
                                {p.quantity < 10 && (
                                    <p className="text-danger small mb-2">Only {p.quantity} left!</p>
                                )}
                                <button className="btn btn-primary w-100" onClick={() => openModal(p)}>
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <OrderModal
                show={showOrderModal}
                product={selectedProduct}
                onClose={closeModal}
                onConfirm={() => { }}
            />
        </div>
    );
}
