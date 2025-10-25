import { useProductContext } from "../../auth/ProductContext";
import BlurText from "../UI/BlurText";
import { motion } from "framer-motion";

const handleAnimationComplete = () => {
  console.log("Animation completed!");
};

export default function NewArrivals() {
  const { products, loading, error } = useProductContext();

  if (loading)
    return (
      <p className="text-center text-gray-600 mt-10">Loading products...</p>
    );

  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  // ✅ Filter products where is_new is true
  const newArrivals = products.filter((product) => product.is_new === true);

  if (newArrivals.length === 0)
    return (
      <p className="text-center text-gray-600 mt-10">
        No new arrivals available.
      </p>
    );

  return (
    <div className="bg-gray-200 min-h-screen p-6 flex flex-col items-center">
      {/* Section Header */}
      <BlurText
        text="New Arrivals"
        delay={150}
        animateBy="words"
        direction="top"
        onAnimationComplete={handleAnimationComplete}
        className="text-3xl mb-4 font-bold"
      />

      <BlurText
        text="Check out the latest additions to our collection!"
        delay={150}
        animateBy="words"
        direction="top"
        onAnimationComplete={handleAnimationComplete}
        className="text-xl mb-8"
      />

      {/* Product Grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {newArrivals.map((product) => (
            <div
              key={product.id}
              className="bg-white  p-4 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-56 object-cover  transition-transform duration-300 hover:scale-105"
                />
              )}

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.title}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {product.description}
                </p>
                <p className="text-black font-bold mt-3">₹{product.price}</p>

                <button className="mt-4 w-full bg-slate-800 hover:bg-slate-600 text-white font-medium py-2  transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
