import { useState } from "react";
import { updateProduct } from "../../services/productService";

export default function UpdateProductModal({ product, onClose, onUpdate }) {

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [qty, setQty] = useState(product.quantity);
  const [image, setImage] = useState(null); // new selected image
  const [preview, setPreview] = useState(product.imageUrl); // show old image first

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!product) return null; // modal only renders when product exists

  const validateImage = (file) => {
    if (!file) return null; // image optional during update
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
      setPreview(URL.createObjectURL(file)); // show preview
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

    setLoading(true);

    try {
      const productData = {
        name,
        price: Number(price),
        quantity: Number(qty),
      };

      const formData = new FormData();
      formData.append(
        "data",
        new Blob([JSON.stringify(productData)], { type: "application/json" })
      );

      if (image) {
        formData.append("image", image);
      }

      await updateProduct(product.id, formData);

      setSuccess("Product updated ✅");

      setTimeout(() => {
        onUpdate(); // refresh list
      }, 1000);

    } catch (err) {
      if (err.response?.status === 400) setError("Invalid product data ❌");
      else if (err.response?.status === 401) setError("Unauthorized ❌");
      else setError("Failed to update product ❌");
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
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content" style={{ borderRadius: "12px" }}>

          <div className="modal-header">
            <h5 className="modal-title">Update Product</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              {/* Image Preview */}
              <div className="text-center mb-3">
                <img
                  src={preview}
                  alt="preview"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "contain",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "5px"
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Product Name</label>
                <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="mb-3">
                <label className="form-label">Price</label>
                <input type="number" className="form-control" value={price} min="1" onChange={(e) => setPrice(e.target.value)} />
              </div>

              <div className="mb-3">
                <label className="form-label">Quantity</label>
                <input type="number" className="form-control" value={qty} min="0" onChange={(e) => setQty(e.target.value)} />
              </div>

              <div className="mb-3">
                <label className="form-label">Change Image (optional)</label>
                <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button className="btn btn-success" disabled={loading}>
                {loading ? "Updating..." : "Update"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
