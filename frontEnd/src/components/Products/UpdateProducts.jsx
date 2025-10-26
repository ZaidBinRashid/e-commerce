import { useState, useEffect } from "react";
import axios from "axios";
import * as Yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import { useProductContext } from "../../auth/ProductContext";

// ✅ Validation only for fields user edits
const ProductSchema = Yup.object().shape({
  title: Yup.string().min(3).max(50),
  description: Yup.string().min(3).max(200),
  price: Yup.number().min(1, "Price must be positive"),
  is_new: Yup.boolean(),
});

export default function UpdateProducts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, setProducts } = useProductContext();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    is_new: false,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ✅ Fetch product from context or backend
  useEffect(() => {
    const existingProduct = products.find((p) => p.id === Number(id));

    if (existingProduct) {
      setForm({
        title: existingProduct.title,
        description: existingProduct.description,
        price: existingProduct.price,
        is_new: existingProduct.is_new,
      });
      setPreview(existingProduct.image_url);
    } else {
      // fallback fetch if context empty
      axios
        .get(`http://localhost:8080/api/auth/product/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          setForm({
            title: res.data.product.title,
            description: res.data.product.description,
            price: res.data.product.price,
            is_new: res.data.product.is_new,
          });
          setPreview(res.data.product.image_url);
        })
        .catch((err) => console.error("Error fetching product:", err));
    }
  }, [id, products]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Image upload handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  // ✅ Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await ProductSchema.validate(form, { abortEarly: false });

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      if (image) formData.append("image", image);

      const res = await axios.put(
        `http://localhost:8080/api/auth/product/${id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("✅ Product updated successfully!");
      // update context
      setProducts((prev) =>
        prev.map((p) =>
          p.id === Number(id) ? { ...p, ...res.data.updatedProduct } : p
        )
      );
      navigate("/adminDashboard/allproducts");
    } catch (err) {
      if (err.inner) {
        const formErrors = {};
        err.inner.forEach((e) => (formErrors[e.path] = e.message));
        setErrors(formErrors);
      } else {
        console.error(err);
        alert("❌ Failed to update product");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-8"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">Edit Product</h2>

      <input
        type="text"
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
      />
      {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
      />
      {errors.description && (
        <p className="text-xs text-red-500">{errors.description}</p>
      )}

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
      />
      {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}

      {/* ✅ New Arrival Toggle */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_new"
          checked={form.is_new}
          onChange={handleChange}
        />
        {form.is_new ? "Remove from New Arrivals" : "Mark as New Arrival"}
      </label>

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-40 h-40 object-cover rounded mb-2"
        />
      )}

      <input type="file" onChange={handleFileChange} />
      {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Updating..." : "Update Product"}
      </button>
    </form>
  );
}
