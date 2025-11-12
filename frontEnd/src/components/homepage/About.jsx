import { motion } from "framer-motion";
import { HiClock, HiSparkles, HiHeart, HiShieldCheck } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function About() {
  const values = [
    {
      icon: HiClock,
      title: "Timeless Craftsmanship",
      description: "Each timepiece is crafted with precision and attention to detail",
    },
    {
      icon: HiSparkles,
      title: "Premium Quality",
      description: "Only the finest materials and components in every watch",
    },
    {
      icon: HiHeart,
      title: "Customer First",
      description: "Your satisfaction and trust are our top priorities",
    },
    {
      icon: HiShieldCheck,
      title: "Authenticity Guaranteed",
      description: "100% genuine products with complete authenticity certificates",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800">
          <img
            src="./watches/watch3.jpeg"
            alt="Heritage Watches"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-amber-400/20 backdrop-blur-md border border-amber-400/30 text-amber-300 px-5 py-2.5 rounded-full text-sm font-medium mb-6"
          >
            <HiSparkles className="w-5 h-5" />
            Established 2020
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-light mb-6 leading-tight">
            Our Story
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed">
            Where tradition meets innovation in the art of timekeeping
          </p>
        </motion.div>
      </section>

      {/* Brand Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <img
                  src="./watches/watch2.jpeg"
                  alt="Our Heritage"
                  className="w-full h-[500px] object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
                Heritage Watches Co
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  Founded with a vision to bring timeless elegance to every wrist,
                  Heritage Watches Co has become synonymous with quality, precision,
                  and sophisticated design.
                </p>
                <p className="text-lg">
                  Our journey began with a simple belief: a watch is more than just
                  a timepiece — it's a statement of character, a symbol of achievement,
                  and a companion through life's moments.
                </p>
                <p className="text-lg">
                  Every watch in our collection is carefully curated from the world's
                  finest watchmakers, ensuring that each piece meets our exacting
                  standards of excellence.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-slate-900" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl lg:text-5xl font-light text-white mb-8">
              Our Mission
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-xl text-slate-300 leading-relaxed">
                To provide discerning customers with access to the world's finest
                timepieces, combining heritage craftsmanship with modern innovation.
              </p>
              <p className="text-xl text-slate-300 leading-relaxed">
                We believe every watch tells a story, and we're committed to helping
                you find the perfect piece that resonates with your personal journey.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <p className="text-5xl font-light text-white mb-2">500+</p>
                <p className="text-slate-300">Premium Timepieces</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <p className="text-5xl font-light text-white mb-2">50+</p>
                <p className="text-slate-300">Luxury Brands</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <p className="text-5xl font-light text-white mb-2">10K+</p>
                <p className="text-slate-300">Happy Customers</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
              Find Your Perfect Timepiece
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Explore our curated collection and discover watches that define
              elegance, precision, and timeless style.
            </p>
            <Link to="/shop">
              <button className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-semibold px-10 py-4 rounded-full hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2">
                Explore Collection
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}