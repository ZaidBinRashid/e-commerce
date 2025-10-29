import { useState } from "react";
import * as Yup from "yup";
import axios from "axios";

// ✅ Validation schema
const ProductSchema = Yup.object().shape({
  title: Yup.string().min(3).max(50).required("Title is required"),
  description: Yup.string().min(3).max(200).required("Description is required"),
  detailed_description: Yup.string()
    .min(10)
    .required("Detailed description is required"),
  base_price: Yup.number()
    .min(1, "Price must be at least 1")
    .required("Base price is required"),
  brand: Yup.string().min(2).max(50).required("Brand is required"),
  wrist_size: Yup.string().required("Wrist size is required"),
});

export default function AddProducts() {
  // ✅ Product main info
  const [form, setForm] = useState({
    title: "",
    description: "",
    detailed_description: "",
    base_price: "",
    brand: "",
    wrist_size: "",
  });

  // ✅ Images & customizations
  const [images, setImages] = useState([]);
  const [colors, setColors] = useState([]);
  const [backs, setBacks] = useState([]);
  const [wrists, setWrists] = useState([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle multiple image uploads
  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  // ✅ Handle dynamic sections
  const addColor = () =>
    setColors([...colors, { name: "", price_adjustment: "", image: null }]);
  const addBack = () =>
    setBacks([...backs, { name: "", price_adjustment: "", image: null }]);
  const addWrist = () =>
    setWrists([...wrists, { name: "", price_adjustment: "", image: null }]);

  const handleSubChange = (setter, index, field, value) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await ProductSchema.validate(form, { abortEarly: false });

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value)
      );

      // ✅ Product images
      images.forEach((img) => formData.append("images", img));

      // ✅ Colors, backs, wrists
      // ✅ 1. Send the JSON data for colors, backs, wrists
      formData.append("colors", JSON.stringify(colors));
      formData.append("backs", JSON.stringify(backs));
      formData.append("wrists", JSON.stringify(wrists));

      // ✅ 2. Send corresponding images in order
      colors.forEach((c) => {
        if (c.image) formData.append("colorImages", c.image);
      });
      backs.forEach((b) => {
        if (b.image) formData.append("backImages", b.image);
      });
      wrists.forEach((w) => {
        if (w.image) formData.append("wristImages", w.image);
      });

      const res = await axios.post(
        "http://localhost:8080/api/auth/addProduct",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("✅ Product added successfully!");
      console.log(res.data);

      // ✅ Reset form
      setForm({
        title: "",
        description: "",
        detailed_description: "",
        base_price: "",
        brand: "",
        wrist_size: "",
      });
      setImages([]);
      setColors([]);
      setBacks([]);
      setWrists([]);
    } catch (err) {
      if (err.inner) {
        const formErrors = {};
        err.inner.forEach((e) => (formErrors[e.path] = e.message));
        setErrors(formErrors);
      } else {
        console.error(err);
        alert("❌ Failed to add product");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        Add New Product
      </h2>

      {/* Basic Fields */}
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        className="w-full border rounded-lg px-3 py-2"
      />
      {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}

      <textarea
        name="description"
        placeholder="Short Description"
        value={form.description}
        onChange={handleChange}
        className="w-full border rounded-lg px-3 py-2"
      />
      {errors.description && (
        <p className="text-xs text-red-500">{errors.description}</p>
      )}

      <textarea
        name="detailed_description"
        placeholder="Detailed Description"
        value={form.detailed_description}
        onChange={handleChange}
        className="w-full border rounded-lg px-3 py-2"
        rows="4"
      />
      {errors.detailed_description && (
        <p className="text-xs text-red-500">{errors.detailed_description}</p>
      )}

      <input
        type="number"
        name="base_price"
        placeholder="Base Price"
        value={form.base_price}
        onChange={handleChange}
        className="w-full border rounded-lg px-3 py-2"
      />
      {errors.base_price && (
        <p className="text-xs text-red-500">{errors.base_price}</p>
      )}

      <input
        name="brand"
        placeholder="Brand"
        value={form.brand}
        onChange={handleChange}
        className="w-full border rounded-lg px-3 py-2"
      />
      {errors.brand && <p className="text-xs text-red-500">{errors.brand}</p>}

      <input
        name="wrist_size"
        placeholder="Wrist Size (e.g., 18mm, 20mm, 22mm)"
        value={form.wrist_size}
        onChange={handleChange}
        className="w-full border rounded-lg px-3 py-2"
      />
      {errors.wrist_size && (
        <p className="text-xs text-red-500">{errors.wrist_size}</p>
      )}

      {/* Images */}
      <label className="block font-medium text-gray-700">Product Images:</label>
      <input
        type="file"
        multiple
        onChange={(e) => setImages(Array.from(e.target.files))}
      />
      {errors.images && <p className="text-xs text-red-500">{errors.images}</p>}

      {/* Colors Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Colors</h3>
        {colors.map((color, index) => (
          <div key={index} className="border p-3 rounded mb-2">
            <input
              placeholder="Color Name"
              value={color.name}
              onChange={(e) =>
                handleSubChange(setColors, index, "name", e.target.value)
              }
              className="border rounded px-2 py-1 w-full mb-2"
            />
            <input
              type="number"
              placeholder="Price Adjustment"
              value={color.price_adjustment}
              onChange={(e) =>
                handleSubChange(
                  setColors,
                  index,
                  "price_adjustment",
                  e.target.value
                )
              }
              className="border rounded px-2 py-1 w-full mb-2"
            />
            <input
              type="file"
              onChange={(e) =>
                handleSubChange(setColors, index, "image", e.target.files[0])
              }
              className="w-full"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addColor}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          + Add Color
        </button>
      </div>

      {/* Backs Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Back Types</h3>
        {backs.map((back, index) => (
          <div key={index} className="border p-3 rounded mb-2">
            <input
              placeholder="Back Type Name"
              value={back.name}
              onChange={(e) =>
                handleSubChange(setBacks, index, "name", e.target.value)
              }
              className="border rounded px-2 py-1 w-full mb-2"
            />
            <input
              type="number"
              placeholder="Price Adjustment"
              value={back.price_adjustment}
              onChange={(e) =>
                handleSubChange(
                  setBacks,
                  index,
                  "price_adjustment",
                  e.target.value
                )
              }
              className="border rounded px-2 py-1 w-full mb-2"
            />
            <input
              type="file"
              onChange={(e) =>
                handleSubChange(setBacks, index, "image", e.target.files[0])
              }
              className="w-full"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addBack}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          + Add Back Type
        </button>
      </div>

      {/* Wrists Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Wrist Styles</h3>
        {wrists.map((wrist, index) => (
          <div key={index} className="border p-3 rounded mb-2">
            <input
              placeholder="Wrist Style Name"
              value={wrist.name}
              onChange={(e) =>
                handleSubChange(setWrists, index, "name", e.target.value)
              }
              className="border rounded px-2 py-1 w-full mb-2"
            />
            <input
              type="number"
              placeholder="Price Adjustment"
              value={wrist.price_adjustment}
              onChange={(e) =>
                handleSubChange(
                  setWrists,
                  index,
                  "price_adjustment",
                  e.target.value
                )
              }
              className="border rounded px-2 py-1 w-full mb-2"
            />
            <input
              type="file"
              onChange={(e) =>
                handleSubChange(setWrists, index, "image", e.target.files[0])
              }
              className="w-full"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addWrist}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          + Add Wrist Style
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition mt-6"
      >
        {loading ? "Uploading..." : "Add Product"}
      </button>
    </form>
  );
}
