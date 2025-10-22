import { useState } from "react";
import * as Yup from "yup";
import axios from "axios";

// Schema for validation
const ProductSchema = Yup.object().shape({
  title: Yup.string().min(3).max(50).required("Title is required"),
  description: Yup.string().min(3).max(200).required("Description is required"),
  price: Yup.number().min(1, "Price must be at least 1").required("Price is required"),
  image: Yup.mixed()
    .test("fileSize", "File too large (max 5MB)", (value) => !value || value.size <= 5 * 1024 * 1024)
    .test("fileType", "Unsupported file format", (value) =>
      !value || ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
    )
    .required("Image is required"),
  is_new: Yup.boolean(),
});

export default function AddProducts() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    is_new: false,
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle text + checkbox changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle file input
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await ProductSchema.validate({ ...form, image }, { abortEarly: false });

      // Use FormData for multipart/form-data
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("is_new", form.is_new);
      formData.append("image", image);

      const res = await axios.post("http://localhost:8080/api/auth/addProduct", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert( "Product added successfully!");
      console.log(res.data);

      // Reset form
      setForm({ title: "", description: "", price: "", is_new: false });
      setImage(null);
    } catch (err) {
      if (err.inner) {
        const formErrors = {};
        err.inner.forEach((e) => (formErrors[e.path] = e.message));
        setErrors(formErrors);
      } else {
        console.error(err);
        alert(" Failed to add product");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md border border-black">
      <h2 className="text-xl font-semibold mb-4 text-center">Add Product</h2>

      <input
        type="text"
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
      />
      {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
      />
      {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
      />
      {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}

      <label className="flex items-center gap-2">
        <input type="checkbox" name="is_new" checked={form.is_new} onChange={handleChange} />
        Mark as New Arrival
      </label>

      <input type="file" name="image" onChange={handleFileChange} className="w-full" />
      {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl py-2 font-medium shadow-sm bg-gradient-to-r from-indigo-500 to-indigo-600 text-white disabled:opacity-60"
      >
        {loading ? "Please wait..." : "Add Product"}
      </button>
    </form>
  );
}
