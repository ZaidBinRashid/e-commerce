import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import BlurText from "../UI/BlurText";

const handleAnimationComplete = () => {
  console.log("Animation completed!");
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState(null);

  // Fetch testimonials from backend
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/auth/testimonials", {
        withCredentials: true,
      })
      .then((res) => {
        if (Array.isArray(res.data.testimonials)) {
          setTestimonials(res.data.testimonials);
        } else {
          console.error("Unexpected response format:", res.data);
          setTestimonials([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch testimonials:", err);
        setError("Failed to load testimonials.");
      });
  }, []);

  // Auto-scroll every 4 seconds
  useEffect(() => {
    if (isHovered || testimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex, isHovered, testimonials]);

  if (error)
    return (
      <div className="flex items-center justify-center py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  return (
    <section
      className="w-full bg-gradient-to-br from-gray-50 to-gray-100 py-16 lg:py-24"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <BlurText
            text="What Our Customers Say"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-4xl lg:text-5xl font-light tracking-tight text-gray-900"
          />
        </div>

        {/* Testimonial Card */}
        {testimonials.length > 0 ? (
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl p-8 sm:p-12 lg:p-16"
              >
                <div className="flex flex-col items-center space-y-6">
                  {/* Quote Icon */}
                  <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-slate-900"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-white text-lg sm:text-xl lg:text-2xl font-light leading-relaxed max-w-3xl text-center">
                    "{testimonials[currentIndex].comment}"
                  </p>

                  {/* Customer Name */}
                  <div className="pt-4 border-t border-slate-700 w-full max-w-md">
                    <h4 className="font-medium text-white text-lg text-center">
                      {testimonials[currentIndex].name}
                    </h4>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    currentIndex === index
                      ? "w-8 h-3 bg-amber-400"
                      : "w-3 h-3 bg-gray-400 hover:bg-gray-500"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                ></button>
              ))}
            </div>

            {/* Arrow Navigation */}
            {testimonials.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      prev === 0 ? testimonials.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors group"
                  aria-label="Previous testimonial"
                >
                  <svg
                    className="w-6 h-6 text-gray-600 group-hover:text-gray-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      prev === testimonials.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors group"
                  aria-label="Next testimonial"
                >
                  <svg
                    className="w-6 h-6 text-gray-600 group-hover:text-gray-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg italic">No testimonials yet</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;