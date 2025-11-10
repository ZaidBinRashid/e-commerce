import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiArrowRight, HiSparkles, HiShoppingBag } from "react-icons/hi";

const FloatingHero = () => {
  const watches = [
    { image: "./watches/watch1.jpeg", position: "top-left" },
    { image: "./watches/watch2.jpeg", position: "top-right" },
    { image: "./watches/watch3.jpeg", position: "center" },
    { image: "./watches/watch4.jpeg", position: "bottom-left" },
    { image: "./watches/watch5.jpeg", position: "bottom-right" },
  ];

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const getPosition = (position) => {
    const positions = {
      "top-left": "top-[10%] left-[5%] w-32 sm:w-40 lg:w-48",
      "top-right": "top-[15%] right-[8%] w-28 sm:w-36 lg:w-44",
      center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 lg:w-80 z-20",
      "bottom-left": "bottom-[12%] left-[10%] w-24 sm:w-32 lg:w-40",
      "bottom-right": "bottom-[18%] right-[12%] w-28 sm:w-36 lg:w-44",
    };
    return positions[position] || "";
  };

  return (
    <div className="relative  mt-20 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

      {/* Floating Watches */}
      <div className="absolute inset-0">
        {watches.map((watch, index) => (
          <motion.div
            key={index}
            className={`absolute ${getPosition(watch.position)}`}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{
              opacity: watch.position === "center" ? 1 : 0.7,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: index * 0.15,
            }}
          >
            <motion.div
              animate={floatingAnimation}
              transition={{
                duration: 3 + index * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.3,
              }}
              className={`relative ${
                watch.position === "center" ? "z-20" : "z-10"
              }`}
            >
              <div
                className={`relative rounded-2xl overflow-hidden ${
                  watch.position === "center"
                    ? "shadow-2xl ring-4 ring-amber-400/50"
                    : "shadow-xl"
                } backdrop-blur-sm`}
              >
                <img
                  src={watch.image}
                  alt={`Watch ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {watch.position !== "center" && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                )}
              </div>
              {watch.position === "center" && (
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-amber-500 rounded-3xl blur-2xl opacity-30 -z-10"></div>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-30 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="inline-flex items-center gap-2 bg-amber-400/20 backdrop-blur-md border border-amber-400/30 text-amber-300 px-5 py-2.5 rounded-full text-sm font-medium mb-8 shadow-lg"
            >
              <HiSparkles className="w-5 h-5" />
              Exclusive Collection 2025
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight"
            >
              Time Redefined
              <br />
              <span className="font-medium bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                Luxury Crafted
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="text-slate-300 text-lg lg:text-xl mb-10 max-w-xl leading-relaxed"
            >
              Discover the perfect fusion of timeless elegance and modern
              craftsmanship. Each timepiece tells a unique story.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/shop">
                <button className="group w-full sm:w-auto bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-semibold px-8 py-4 rounded-full hover:from-amber-500 hover:to-amber-600 transition-all shadow-2xl hover:shadow-amber-500/50 hover:scale-105 flex items-center justify-center gap-2">
                  <HiShoppingBag className="w-5 h-5" />
                  Explore Collection
                  <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10"
            >
              <div>
                <p className="text-3xl font-light text-white mb-1">500+</p>
                <p className="text-slate-400 text-sm">Premium Watches</p>
              </div>
              <div>
                <p className="text-3xl font-light text-white mb-1">50+</p>
                <p className="text-slate-400 text-sm">Luxury Brands</p>
              </div>
              <div>
                <p className="text-3xl font-light text-white mb-1">10K+</p>
                <p className="text-slate-400 text-sm">Happy Customers</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent z-20"></div>
    </div>
  );
};

export default FloatingHero;