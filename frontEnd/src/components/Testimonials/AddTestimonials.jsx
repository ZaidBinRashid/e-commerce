import React, { useState } from "react";
import axios from "axios";
import { HiChatAlt2, HiUser, HiCheckCircle, HiXCircle } from "react-icons/hi";

const AddTestimonial = () => {
  const [form, setForm] = useState({ name: "", comment: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (message) setMessage(null); // Clear message on input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/addTestimonials`,
        form,
        { withCredentials: true }
      );

      setMessage({ type: "success", text: "Testimonial added successfully!" });
      setForm({ name: "", comment: "" });
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to add testimonial.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-light text-gray-900 mb-2">
          Add Customer Testimonial
        </h2>
        <p className="text-sm text-gray-600">
          Share positive customer feedback with your audience
        </p>
      </div>

      {/* Message Alert */}
      {message && (
        <div
          className={`rounded-xl p-4 mb-6 flex items-start gap-3 ${
            message.type === "success"
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <HiCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <HiXCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <p
            className={`text-sm ${
              message.type === "success" ? "text-green-800" : "text-red-800"
            }`}
          >
            {message.text}
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 space-y-5">
        {/* Customer Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="name"
              placeholder="e.g., John Smith"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow"
            />
          </div>
        </div>

        {/* Testimonial Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Testimonial
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <HiChatAlt2 className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              name="comment"
              placeholder="Write the customer's feedback here..."
              value={form.comment}
              onChange={handleChange}
              required
              rows="5"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow resize-none"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {form.comment.length} characters
          </p>
        </div>

        {/* Preview */}
        {form.comment && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
              Preview
            </p>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-slate-900 font-semibold text-sm">
                  {form.name.charAt(0).toUpperCase() || "?"}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-1">
                  {form.name || "Customer Name"}
                </p>
                <p className="text-gray-600 text-sm italic">
                  "{form.comment}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-medium py-4 rounded-full hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-slate-900"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Adding...
            </>
          ) : (
            <>
              <HiCheckCircle className="w-5 h-5" />
              Add Testimonial
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddTestimonial;