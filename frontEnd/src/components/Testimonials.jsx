import React, { useState, useEffect } from "react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Product Designer",
    image:
      "https://randomuser.me/api/portraits/women/68.jpg",
    text: "Absolutely love this product! The quality exceeded my expectations and the customer service was amazing.",
  },
  {
    id: 2,
    name: "David Smith",
    role: "Software Engineer",
    image:
      "https://randomuser.me/api/portraits/men/12.jpg",
    text: "The experience was seamless from start to finish. Highly recommend this to anyone looking for value and quality.",
  },
  {
    id: 3,
    name: "Emily Carter",
    role: "Freelance Writer",
    image:
      "https://randomuser.me/api/portraits/women/45.jpg",
    text: "It’s rare to find a brand that truly cares about its customers. This team went above and beyond!",
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Entrepreneur",
    image:
      "https://randomuser.me/api/portraits/men/32.jpg",
    text: "High quality, fast delivery, and outstanding support. I’ll definitely be coming back for more!",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto scroll every 4 seconds
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex, isHovered]);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <section
      className="w-full bg-gray-200 py-16"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
          What Our Customers Say
        </h2>

        {/* Testimonial Card */}
        <div className="relative">
          <div
            key={testimonials[currentIndex].id}
            className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-700 ease-in-out"
          >
            <div className="flex flex-col items-center space-y-4">
              <img
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <p className="text-gray-600 italic max-w-xl">
                “{testimonials[currentIndex].text}”
              </p>
              <div>
                <h4 className="font-semibold text-gray-800">
                  {testimonials[currentIndex].name}
                </h4>
                <p className="text-gray-500 text-sm">
                  {testimonials[currentIndex].role}
                </p>
              </div>
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  currentIndex === index
                    ? "bg-gray-800"
                    : "bg-gray-400"
                }`}
              ></button>
            ))}
          </div>

          {/* Optional Arrows */}
          {/* <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded hover:bg-black/60 transition"
          >
            ‹
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full hover:bg-black/60 transition"
          >
            ›
          </button> */}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
