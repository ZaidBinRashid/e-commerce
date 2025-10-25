import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

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

  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <section
      className="w-full bg-gray-200 py-16"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        
        
          <BlurText
            text="What Our Customers Say"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-3xl mb-6 font-bold md:text-4xl "
          />
        

        {/* Testimonial Card */}
        {testimonials.length > 0 ? (
           <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
          <div className="relative">
            <div
              key={testimonials[currentIndex].id}
              className="bg-slate-800 rounded-2xl shadow-lg p-8 transition-all duration-700 ease-in-out"
            >
              <div className="flex flex-col items-center space-y-4">
                <p className="text-white italic max-w-xl">
                  “{testimonials[currentIndex].comment}”
                </p>
                <h4 className="font-semibold text-white">
                  {testimonials[currentIndex].name}
                </h4>
              </div>
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    currentIndex === index ? "bg-gray-800" : "bg-gray-400"
                  }`}
                ></button>
              ))}
            </div>
          </div>
          </motion.div>
        ) : (
          <p className="text-gray-600 italic">No testimonials yet.</p>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
