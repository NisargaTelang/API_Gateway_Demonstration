import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../../services/productService";
import AddProductModal from "./AddProductModal";
import UpdateProductModal from "./UpdateProductModal";  

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      setProducts(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;

    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Delete failed ❌");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Admin Dashboard</h2>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          + Add Product
        </button>
      </div>

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border"></div>
        </div>
      ) : (
        <div className="row">
          {products.map((p) => (
            <div
              className="col-6 col-sm-4 col-md-3 col-lg-2-4 p-2 d-flex"
              key={p.id}
            >
              <div className="card h-100 w-100 position-relative shadow-sm">

                {/* Edit & Delete buttons */}
                <div className="position-absolute top-0 end-0 p-2 d-flex gap-2">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => setEditProduct(p)}
                  >
                    ✏️
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(p.id)}
                  >
                    🗑️
                  </button>
                </div>

                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="card-img-top img-fluid"
                  style={{
                    height: "140px",
                    objectFit: "contain",
                    padding: "8px"
                  }}
                />

                <div className="card-body text-center p-2">
                  <h6 className="card-title text-truncate">{p.name}</h6>
                  <p className="fw-bold text-success small mb-1">
                    ₹{p.price.toLocaleString()}
                  </p>

                  {p.quantity < 10 && (
                    <p className="text-danger small mb-1">
                      Only {p.quantity} left !
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <AddProductModal show={showAddModal} onClose={() => {
        setShowAddModal(false);
        fetchProducts();
      }} />

      {editProduct && (
        <UpdateProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onUpdate={() => {
            setEditProduct(null);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
}
