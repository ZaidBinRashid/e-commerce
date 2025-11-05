import { useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

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
  const [form, setForm] = useState({
    title: "",
    description: "",
    detailed_description: "",
    base_price: "",
    brand: "",
    wrist_size: "",
  });

  const [images, setImages] = useState([]);
  const [colors, setColors] = useState([]);
  const [backs, setBacks] = useState([]);
  const [wrists, setWrists] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Handle basic input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle multiple image uploads
  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  // ✅ Dynamic sections
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

  // ✅ Submit handler
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
      formData.append("colors", JSON.stringify(colors));
      formData.append("backs", JSON.stringify(backs));
      formData.append("wrists", JSON.stringify(wrists));

      // ✅ Attach corresponding images
      colors.forEach((c) => c.image && formData.append("colorImages", c.image));
      backs.forEach((b) => b.image && formData.append("backImages", b.image));
      wrists.forEach((w) => w.image && formData.append("wristImages", w.image));

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/addProduct`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("✅ Product added successfully!");

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
        toast.error("❌ Please fix the highlighted errors.");
      } else if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        console.error(err);
        toast.error("❌ Failed to add product. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-300">
      <Toaster position="top-right" reverseOrder={false} />

      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        Add New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />
        {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}

        {/* Short Description */}
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

        {/* Detailed Description */}
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

        {/* Base Price */}
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

        {/* Brand */}
        <input
          name="brand"
          placeholder="Brand"
          value={form.brand}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />
        {errors.brand && <p className="text-xs text-red-500">{errors.brand}</p>}

        {/* Wrist Size */}
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

        {/* Product Images */}
        <label className="block font-medium text-gray-700">
          Product Images:
        </label>
        <input type="file" multiple onChange={handleImageChange} />
        {errors.images && (
          <p className="text-xs text-red-500">{errors.images}</p>
        )}

        {/* Colors Section */}
        <Section
          title="Colors"
          items={colors}
          addItem={addColor}
          handleSubChange={handleSubChange}
          setter={setColors}
        />

        {/* Backs Section */}
        <Section
          title="Back Types"
          items={backs}
          addItem={addBack}
          handleSubChange={handleSubChange}
          setter={setBacks}
        />

        {/* Wrists Section */}
        <Section
          title="Wrist Styles"
          items={wrists}
          addItem={addWrist}
          handleSubChange={handleSubChange}
          setter={setWrists}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition mt-6"
        >
          {loading ? "Uploading..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}

// ✅ Reusable Section Component
function Section({ title, items, addItem, handleSubChange, setter }) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {items.map((item, index) => (
        <div key={index} className="border p-3 rounded mb-2">
          <input
            placeholder={`${title.slice(0, -1)} Name`}
            value={item.name}
            onChange={(e) =>
              handleSubChange(setter, index, "name", e.target.value)
            }
            className="border rounded px-2 py-1 w-full mb-2"
          />
          <input
            type="number"
            placeholder="Price Adjustment"
            value={item.price_adjustment}
            onChange={(e) =>
              handleSubChange(setter, index, "price_adjustment", e.target.value)
            }
            className="border rounded px-2 py-1 w-full mb-2"
          />
          <input
            type="file"
            onChange={(e) =>
              handleSubChange(setter, index, "image", e.target.files[0])
            }
            className="w-full"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        + Add {title.slice(0, -1)}
      </button>
    </div>
  );
}
