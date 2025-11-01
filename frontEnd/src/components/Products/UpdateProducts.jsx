import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";

const ProductSchema = Yup.object().shape({
  title: Yup.string().min(3).max(50),
  description: Yup.string().min(3).max(200),
  detailed_description: Yup.string().min(10),
  base_price: Yup.number().min(1, "Price must be positive"),
  brand: Yup.string(),
  wrist_size: Yup.string(),
  is_new: Yup.boolean(),
  in_stock: Yup.boolean(),
});

export default function UpdateProducts() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    detailed_description: "",
    base_price: "",
    brand: "",
    wrist_size: "",
    is_new: false,
    in_stock: false,
  });

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [colors, setColors] = useState([]);
  const [back_types, setBacks] = useState([]);
  const [wrists, setWrists] = useState([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Fetch existing product
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/auth/product/${id}`)
      .then((res) => {
        const data = res.data.product;

        setForm({
          title: data.title,
          description: data.description,
          detailed_description: data.detailed_description,
          base_price: data.base_price,
          brand: data.brand,
          wrist_size: data.wrist_size,
          is_new: data.is_new || false,
          in_stock: data.in_stock || false,
        });

        if (data.images?.length > 0) {
          const fullUrls = data.images.map((img) =>
            img.startsWith("http") ? img : `http://localhost:8080${img}`
          );
          setPreview(fullUrls);
        }

        setColors(data.colors || []);
        setBacks(data.back_types || []);
        setWrists(data.wrists || []);
      })
      .catch((err) => console.error("❌ Failed to fetch product:", err));
  }, [id]);

  // ✅ Input change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Handle new image uploads
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreview((prev) => [...prev, ...newPreviews]);
  };

  // ✅ Add new customization options
  const addColor = () =>
    setColors([...colors, { name: "", price_adjustment: "", image: null }]);
  const addBack = () =>
    setBacks([...back_types, { name: "", price_adjustment: "", image: null }]);
  const addWrist = () =>
    setWrists([...wrists, { name: "", price_adjustment: "", image: null }]);

  const handleSubChange = (setter, index, field, value) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  // ✅ Submit updates
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await ProductSchema.validate(form, { abortEarly: false });

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== "" && value !== null) {
          formData.append(key, value);
        }
      });

      // ✅ Images
      images.forEach((img) => formData.append("images", img));

      // ✅ Customizations
      formData.append("colors", JSON.stringify(colors));
      colors.forEach((c) => {
        if (c.image) formData.append("colorImages", c.image);
      });

      formData.append("backs", JSON.stringify(back_types));
      back_types.forEach((b) => {
        if (b.image) formData.append("backImages", b.image);
      });

      formData.append("wrists", JSON.stringify(wrists));
      wrists.forEach((w) => {
        if (w.image) formData.append("wristImages", w.image);
      });

      await axios.put(`http://localhost:8080/api/auth/product/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Product updated successfully!");
      navigate("/adminDashboard/allProducts"); // ✅ fixed path
    } catch (err) {
      if (err.inner) {
        const formErrors = {};
        err.inner.forEach((e) => (formErrors[e.path] = e.message));
        setErrors(formErrors);
      } else {
        console.error(err);
        alert("❌ Update failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md mt-8 space-y-6"
    >
      <h2 className="text-2xl font-semibold text-center">Edit Product</h2>

      {/* Basic Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="border rounded px-3 py-2" />
        <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" className="border rounded px-3 py-2" />
        <input name="wrist_size" value={form.wrist_size} onChange={handleChange} placeholder="Wrist Size" className="border rounded px-3 py-2" />
        <input type="number" name="base_price" value={form.base_price} onChange={handleChange} placeholder="Base Price" className="border rounded px-3 py-2" />
      </div>

      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Short Description" className="w-full border rounded px-3 py-2" />
      <textarea name="detailed_description" value={form.detailed_description} onChange={handleChange} placeholder="Detailed Description" className="w-full border rounded px-3 py-2" />

      {/* ✅ New Arrival Toggle */}
      <div className="flex items-center gap-2">
        <input type="checkbox" name="is_new" checked={!!form.is_new} onChange={handleChange} />
        <span>{form.is_new} Mark as New Arrival</span>
        <input type="checkbox" name="in_stock" checked={!!form.in_stock} onChange={handleChange} />
        <span>{form.in_stock} Mark as In Stock</span>
      </div>

      {/* Product Images */}
      <label className="block font-semibold">Product Images:</label>
      <input type="file" multiple onChange={handleImageChange} />
      <div className="flex flex-wrap gap-3 mt-3">
        {preview.length > 0 ? (
          preview.map((img, i) => (
            <img key={i} src={img} alt={`Image ${i}`} className="w-24 h-24 object-cover rounded shadow" />
          ))
        ) : (
          <p className="text-sm text-gray-500">No images uploaded yet</p>
        )}
      </div>

      {/* Colors */}
      <div>
        <h3 className="font-semibold mb-2">Colors</h3>
        {colors.map((color, index) => (
          <div key={index} className="border rounded p-3 mb-2">
            <input
              value={color.name}
              placeholder="Color Name"
              onChange={(e) =>
                handleSubChange(setColors, index, "name", e.target.value)
              }
              className="border rounded px-2 py-1 w-full mb-2"
            />
            <input
              type="number"
              value={color.price_adjustment}
              placeholder="Price Adjustment"
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
      {/* Backs */}
      <div>
        <h3 className="font-semibold mb-2">Back Types</h3>
        {back_types.map((back, index) => (
          <div key={index} className="border rounded p-3 mb-2">
            <input
              value={back.name}
              placeholder="Back Type"
              onChange={(e) =>
                handleSubChange(setBacks, index, "name", e.target.value)
              }
              className="border rounded px-2 py-1 w-full mb-2"
            />
            <input
              type="number"
              value={back.price_adjustment}
              placeholder="Price Adjustment"
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
      {/* Wrists */}
      <div>
        <h3 className="font-semibold mb-2">Wrist Styles</h3>
        {wrists.map((wrist, index) => (
          <div key={index} className="border rounded p-3 mb-2">
            <input
              value={wrist.name}
              placeholder="Wrist Style"
              onChange={(e) =>
                handleSubChange(setWrists, index, "name", e.target.value)
              }
              className="border rounded px-2 py-1 w-full mb-2"
            />
            <input
              type="number"
              value={wrist.price_adjustment}
              placeholder="Price Adjustment"
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

      <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded mt-4">
        {loading ? "Updating..." : "Update Product"}
      </button>
    </form>
  );
}
