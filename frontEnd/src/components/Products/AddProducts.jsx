import { useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { HiPlus, HiTrash, HiPhotograph } from "react-icons/hi";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const addColor = () =>
    setColors([...colors, { name: "", price_adjustment: "", image: null }]);
  const addBack = () =>
    setBacks([...backs, { name: "", price_adjustment: "", image: null }]);
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
      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value)
      );

      images.forEach((img) => formData.append("images", img));
      formData.append("colors", JSON.stringify(colors));
      formData.append("backs", JSON.stringify(backs));
      formData.append("wrists", JSON.stringify(wrists));

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

      // Reset form
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
    <div>
      <Toaster position="top-right" reverseOrder={false} />

      <h2 className="text-2xl font-light text-gray-900 mb-6">
        Add New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Basic Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Title *
            </label>
            <input
              name="title"
              placeholder="e.g., Classic Leather Watch"
              value={form.title}
              onChange={handleChange}
              className={`w-full border ${
                errors.title ? "border-red-300" : "border-gray-200"
              } rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500`}
            />
            {errors.title && (
              <p className="text-xs text-red-600 mt-1">{errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand *
              </label>
              <input
                name="brand"
                placeholder="e.g., Rolex"
                value={form.brand}
                onChange={handleChange}
                className={`w-full border ${
                  errors.brand ? "border-red-300" : "border-gray-200"
                } rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500`}
              />
              {errors.brand && (
                <p className="text-xs text-red-600 mt-1">{errors.brand}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Price (₹) *
              </label>
              <input
                type="number"
                name="base_price"
                placeholder="e.g., 25000"
                value={form.base_price}
                onChange={handleChange}
                className={`w-full border ${
                  errors.base_price ? "border-red-300" : "border-gray-200"
                } rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500`}
              />
              {errors.base_price && (
                <p className="text-xs text-red-600 mt-1">{errors.base_price}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wrist Size *
            </label>
            <input
              name="wrist_size"
              placeholder="e.g., 18mm, 20mm, 22mm"
              value={form.wrist_size}
              onChange={handleChange}
              className={`w-full border ${
                errors.wrist_size ? "border-red-300" : "border-gray-200"
              } rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500`}
            />
            {errors.wrist_size && (
              <p className="text-xs text-red-600 mt-1">{errors.wrist_size}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description *
            </label>
            <textarea
              name="description"
              placeholder="Brief description for product cards"
              value={form.description}
              onChange={handleChange}
              rows="2"
              className={`w-full border ${
                errors.description ? "border-red-300" : "border-gray-200"
              } rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500`}
            />
            {errors.description && (
              <p className="text-xs text-red-600 mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              name="detailed_description"
              placeholder="Full product description with specifications"
              value={form.detailed_description}
              onChange={handleChange}
              rows="4"
              className={`w-full border ${
                errors.detailed_description ? "border-red-300" : "border-gray-200"
              } rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500`}
            />
            {errors.detailed_description && (
              <p className="text-xs text-red-600 mt-1">
                {errors.detailed_description}
              </p>
            )}
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Product Images
          </h3>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
            <HiPhotograph className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <label className="cursor-pointer">
              <span className="text-amber-600 hover:text-amber-700 font-medium">
                Choose files
              </span>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">
              {images.length > 0
                ? `${images.length} file(s) selected`
                : "Upload multiple product images"}
            </p>
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
          items={backs}
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-medium py-4 rounded-full hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Uploading Product..." : "Add Product"}
        </button>
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
          Add {title.slice(0, -1)}
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
                  value={item.name}
                  onChange={(e) =>
                    handleSubChange(setter, index, "name", e.target.value)
                  }
                  className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="number"
                  placeholder="Price adjustment (₹)"
                  value={item.price_adjustment}
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
                <label className="block text-sm text-gray-600 mb-2">
                  Upload image for this option
                </label>
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