import React, { useState } from "react";
import axios from "axios";

const AddTestimonial = () => {
  const [form, setForm] = useState({ name: "", comment: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/addTestimonials",
        form,
        { withCredentials: true }
      );

      setMessage("✅ Testimonial added successfully!");
      setForm({ name: "", comment: "" });
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add testimonial.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Add Testimonial
      </h2>

      {message && (
        <p
          className={`text-center mb-3 ${
            message.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Customer Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          required
        />

        <textarea
          name="comment"
          placeholder="Customer Feedback"
          value={form.comment}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          rows="4"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          {loading ? "Adding..." : "Add Testimonial"}
        </button>
      </form>
    </div>
  );
};

export default AddTestimonial;
