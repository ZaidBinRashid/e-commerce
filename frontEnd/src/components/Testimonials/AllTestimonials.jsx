import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { HiTrash, HiChatAlt2 } from "react-icons/hi";
import { motion } from "framer-motion";

export default function AllTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/auth/testimonials`, {
        withCredentials: true,
      })
      .then((res) => {
        if (Array.isArray(res.data.testimonials)) {
          setTestimonials(res.data.testimonials);
        } else {
          console.error("Unexpected response format:", res.data);
          setError("Invalid response format");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch testimonials:", err);
        setError("Failed to load testimonials.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?"))
      return;

    const deletePromise = axios.delete(
      `${import.meta.env.VITE_API_URL}/api/auth/testimonial/${id}`,
      { withCredentials: true }
    );

    toast.promise(
      deletePromise,
      {
        loading: "Deleting testimonial...",
        success: "✅ Testimonial deleted successfully!",
        error: "❌ Failed to delete testimonial.",
      },
      { position: "top-right" }
    );

    try {
      await deletePromise;
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to delete testimonial:", err);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400 text-lg">Loading testimonials...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  if (testimonials.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <HiChatAlt2 className="w-10 h-10 text-gray-400" />
        </div>
        <p className="text-gray-600 text-lg mb-2">No testimonials yet</p>
        <p className="text-gray-500 text-sm">
          Add testimonials to showcase customer feedback
        </p>
        <div className="mt-6">
          <Link to="/adminDashboard/addTestimonials">
            <button className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-medium px-6 py-2 rounded-full hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Testimonial
            </button>
          </Link>
        </div>
      </div>
    );

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-gray-900 mb-2">
            Manage Testimonials
          </h2>
          <p className="text-sm text-gray-600">
            {testimonials.length}{" "}
            {testimonials.length === 1 ? "testimonial" : "testimonials"} total
          </p>
        </div>
        <Link to="/adminDashboard/addTestimonials">
          <button className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-medium px-6 py-2 rounded-full hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Testimonial
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t, index) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100 overflow-hidden group"
          >
            {/* Quote Icon Background */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-6 pt-6 pb-4 relative">
              <div className="absolute top-4 right-4 opacity-10">
                <svg
                  className="w-16 h-16 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-gray-700 italic leading-relaxed relative z-10 line-clamp-4">
                "{t.comment}"
              </p>
            </div>

            {/* Customer Info & Actions */}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-slate-900 font-semibold text-sm">
                    {t.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {t.name}
                  </h4>
                  <p className="text-xs text-gray-500">Customer</p>
                </div>
              </div>

              <button
                onClick={() => handleDelete(t.id)}
                className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 rounded-lg transition-colors border border-red-200"
              >
                <HiTrash className="w-4 h-4" />
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
