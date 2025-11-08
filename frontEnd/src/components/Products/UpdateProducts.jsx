import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { HiPlus, HiTrash, HiPhotograph, HiX } from "react-icons/hi";

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
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/auth/product/${id}`)
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
            img.startsWith("http") ? img : `${import.meta.env.VITE_API_URL}${img}`
          );
          setPreview(fullUrls);
        }

        setColors(data.colors || []);
        setBacks(data.back_types || []);
        setWrists(data.wrists || []);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch product:", err);
        toast.error("Failed to fetch product details");
      })
      .finally(() => setFetchLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreview((prev) => [...prev, ...newPreviews]);
  };

  const removePreview = (index) => {
    setPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const addColor = () =>
    setColors([...colors, { name: "", price_adjustment: "", image: null }]);
  const addBack = () =>
    setBacks([...back_types, { name: "", price_adjustment: "", image: null }]);
  const addWrist = () =>
    setWrists([...wrists, { name: "", price_adjustment: "", image: null }]);

  const removeItem = (setter, index) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubChange = (setter, index, field, value) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

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

      images.forEach((img) => formData.append("images", img));

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

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/product/${id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("✅ Product updated successfully!");
      setTimeout(() => navigate("/adminDashboard/allProducts"), 1000);
    } catch (err) {
      if (err.inner) {
        const formErrors = {};
        err.inner.forEach((e) => (formErrors[e.path] = e.message));
        setErrors(formErrors);
        toast.error("❌ Please fix the errors");
      } else {
        console.error(err);
        toast.error("❌ Update failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400 text-lg">Loading product details...</p>
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-light text-gray-900">Edit Product</h2>
        <button
          onClick={() => navigate("/adminDashboard/allProducts")}
          className="text-gray-600 hover:text-gray-900 font-medium"
        >
          ← Back to Products
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Basic Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <input
                name="brand"
                value={form.brand}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Price (₹)
              </label>
              <input
                type="number"
                name="base_price"
                value={form.base_price}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wrist Size
            </label>
            <input
              name="wrist_size"
              value={form.wrist_size}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="2"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description
            </label>
            <textarea
              name="detailed_description"
              value={form.detailed_description}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Status Toggles */}
          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  name="is_new"
                  checked={!!form.is_new}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-amber-500 transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              </div>
              <span className="text-sm font-medium text-gray-700">
                Mark as New Arrival
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  name="in_stock"
                  checked={!!form.in_stock}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              </div>
              <span className="text-sm font-medium text-gray-700">
                In Stock
              </span>
            </label>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Product Images
          </h3>

          {preview.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-4">
              {preview.map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={img}
                    alt={`Preview ${i}`}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  {/* <button
                    type="button"
                    onClick={() => removePreview(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <HiX className="w-4 h-4" />
                  </button> */}
                </div>
              ))}
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
            <HiPhotograph className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <label className="cursor-pointer">
              <span className="text-amber-600 hover:text-amber-700 font-medium">
                Add more images
              </span>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>
        </div>

        {/* Customization Options */}
        <Section
          title="Color Options"
          items={colors}
          addItem={addColor}
          removeItem={removeItem}
          handleSubChange={handleSubChange}
          setter={setColors}
        />

        <Section
          title="Back Types"
          items={back_types}
          addItem={addBack}
          removeItem={removeItem}
          handleSubChange={handleSubChange}
          setter={setBacks}
        />

        <Section
          title="Wrist Styles"
          items={wrists}
          addItem={addWrist}
          removeItem={removeItem}
          handleSubChange={handleSubChange}
          setter={setWrists}
        />

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/adminDashboard/allProducts")}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 rounded-full transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-medium py-4 rounded-full hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, items, addItem, removeItem, handleSubChange, setter }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-700 font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <HiPlus className="w-4 h-4" />
          Add
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          No {title.toLowerCase()} added yet
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Option {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(setter, index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <HiTrash className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  placeholder="Option name"
                  value={item.name || ""}
                  onChange={(e) =>
                    handleSubChange(setter, index, "name", e.target.value)
                  }
                  className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="number"
                  placeholder="Price adjustment (₹)"
                  value={item.price_adjustment || ""}
                  onChange={(e) =>
                    handleSubChange(
                      setter,
                      index,
                      "price_adjustment",
                      e.target.value
                    )
                  }
                  className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="mt-3">
                <input
                  type="file"
                  onChange={(e) =>
                    handleSubChange(setter, index, "image", e.target.files[0])
                  }
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                  accept="image/*"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}