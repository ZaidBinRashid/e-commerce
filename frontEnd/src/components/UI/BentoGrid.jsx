import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiArrowRight, HiSparkles, HiClock } from "react-icons/hi";

const BentoHero = () => {
  const watches = [
    {
      image: "./watches/watch1.jpeg",
      title: "Classic Collection",
      subtitle: "Timeless Elegance",
    },
    {
      image: "./watches/watch2.jpeg",
      title: "Seiko Automatic Collection",
      subtitle: "Powered by motion, perfected by time",
    },
    {
      image: "./watches/watch3.jpeg",
      title: "Luxury Edition",
      subtitle: "Crafted to Perfection",
    },
    {
      image: "./watches/watch4.jpeg",
      title: "Heritage Line",
      subtitle: "Traditional Excellence",
    },
    {
      image: "./watches/watch5.jpeg",
      title: "Modern Design",
      subtitle: "Contemporary Aesthetics",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 mt-16">
          {/* Large Feature Card - Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 lg:row-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 lg:p-12 flex flex-col justify-between min-h-[400px] lg:min-h-[600px] relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-amber-400/20 backdrop-blur-sm text-amber-300 px-4 py-2 rounded-full text-sm font-medium mb-6"
              >
                <HiSparkles className="w-4 h-4" />
                New Collection 2025
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl lg:text-6xl font-light text-white mb-4 leading-tight"
              >
                Heritage
                <br />
                <span className="font-medium bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
                  Watches Co
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-slate-300 text-lg lg:text-xl mb-8 max-w-md"
              >
                Discover timeless elegance with our curated collection of
                luxury timepieces
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative z-10 flex flex-col sm:flex-row gap-4"
            >
              <Link to="/shop" className="flex-1">
                <button className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-medium px-8 py-4 rounded-full hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                  Explore Collection
                  <HiArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Watch 1 - Large */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4 lg:row-span-2 group relative rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
              <img
                src={watches[0].image}
                alt={watches[0].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl font-semibold mb-1">
                  {watches[0].title}
                </h3>
                <p className="text-slate-200 text-sm">{watches[0].subtitle}</p>
              </div>
            </div>
          </motion.div>

          {/* Watch 2 - Medium */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3 group relative rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 min-h-[250px]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
              <img
                src={watches[1].image}
                alt={watches[1].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl font-semibold mb-1">
                  {watches[1].title}
                </h3>
                <p className="text-slate-200 text-sm">{watches[1].subtitle}</p>
              </div>
            </div>
          </motion.div>

          {/* Stats/Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-3 lg:row-span-1 bg-gradient-to-br from-amber-400 to-amber-500 rounded-3xl p-6 lg:p-8 flex flex-col justify-center min-h-[200px] relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-20">
              <HiClock className="absolute top-4 right-4 w-32 h-32 text-slate-900" />
            </div>
            <div className="relative z-10">
              <p className="text-slate-900 text-5xl lg:text-6xl font-light mb-2">
                500+
              </p>
              <p className="text-slate-800 font-medium text-lg">
                Premium Timepieces
              </p>
              <p className="text-slate-700 text-sm mt-2">
                Curated from the finest brands worldwide
              </p>
            </div>
          </motion.div>

          {/* Watch 3 - Small */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="lg:col-span-2 group relative rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 min-h-[250px]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
              <img
                src={watches[2].image}
                alt={watches[2].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-lg font-semibold mb-1">
                  {watches[2].title}
                </h3>
                <p className="text-slate-200 text-xs">{watches[2].subtitle}</p>
              </div>
            </div>
          </motion.div>

          {/* Watch 4 - Small */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="lg:col-span-2 group relative rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 min-h-[250px]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
              <img
                src={watches[3].image}
                alt={watches[3].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-lg font-semibold mb-1">
                  {watches[3].title}
                </h3>
                <p className="text-slate-200 text-xs">{watches[3].subtitle}</p>
              </div>
            </div>
          </motion.div>

          {/* Watch 5 - Medium */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="lg:col-span-3 group relative rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 min-h-[250px]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
              <img
                src={watches[4].image}
                alt={watches[4].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl font-semibold mb-1">
                  {watches[4].title}
                </h3>
                <p className="text-slate-200 text-sm">{watches[4].subtitle}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BentoHero;