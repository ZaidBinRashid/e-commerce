import React, { useState, useEffect } from "react";
import axios from "axios";

export default function DeleteTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all testimonials
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/auth/testimonials", { withCredentials: true })
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

  // Handle delete testimonial
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/auth/testimonial/${id}`, {
        withCredentials: true,
      });

      // Remove the deleted testimonial from state
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to delete testimonial:", err);
      alert("Error deleting testimonial.");
    }
  };

  // Loading and error states
  if (loading)
    return <p className="text-center text-gray-600 mt-10">Loading testimonials...</p>;

  if (error)
    return <p className="text-center text-red-600 mt-10">{error}</p>;

  if (testimonials.length === 0)
    return <p className="text-center text-gray-600 mt-10">No testimonials available.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-white mb-6">Manage Testimonials</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition"
          >
            <p className="text-gray-700 italic mb-3">“{t.comment}”</p>
            <h4 className="font-semibold text-gray-900">{t.name}</h4>
            <button
              onClick={() => handleDelete(t.id)}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
