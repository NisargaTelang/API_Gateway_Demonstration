import { useState } from "react";
import { addProduct } from "../../services/productService";

export default function AddProductModal({ show, onClose }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [image, setImage] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!show) return null; // ✅ show only when parent says so

  const validateImage = (file) => {
    if (!file) return "Please select image";
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) return "Only JPG/PNG allowed";
    if (file.size > 2 * 1024 * 1024) return "Max 2MB allowed";
    return null;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const err = validateImage(file);
    if (err) {
      setError(err);
      setImage(null);
    } else {
      setError("");
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !price || !qty) {
      setError("All fields are required");
      return;
    }

    const imgErr = validateImage(image);
    if (imgErr) return setError(imgErr);

    setLoading(true);

    try {
      const productData = { name, price: Number(price), quantity: Number(qty) };

      const formData = new FormData();
      formData.append("data", new Blob([JSON.stringify(productData)], { type: "application/json" }));
      formData.append("image", image);

      await addProduct(formData);
      setSuccess("Product added ✅");

      setTimeout(() => {
        onClose(); // ✅ close modal
        setName("");
        setPrice("");
        setQty("");
        setImage(null);
        setSuccess("");
      }, 1000);
    } catch (err) {
      setError("Failed to add product ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.35)" }}
      onClick={onClose}
    >
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content" style={{ borderRadius: "12px" }}>
          
          <div className="modal-header">
            <h5 className="modal-title">Add Product</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <div className="mb-3">
                <label className="form-label">Product Name</label>
                <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="mb-3">
                <label className="form-label">Price</label>
                <input type="number" min="1" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>

              <div className="mb-3">
                <label className="form-label">Quantity</label>
                <input type="number" min="1" className="form-control" value={qty} onChange={(e) => setQty(e.target.value)} />
              </div>

              <div className="mb-3">
                <label className="form-label">Image</label>
                <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
                <small className="text-muted">Max 2MB JPG/PNG</small>
              </div>

            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
              <button className="btn btn-success" disabled={loading || !name || !price || !qty || !image}>
                {loading ? "Saving..." : "Save Product"}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
