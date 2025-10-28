import { Link } from "react-router-dom";
import { useProductContext } from "../../auth/ProductContext";
import BlurText from "../UI/BlurText";
import { motion } from "framer-motion";

const handleAnimationComplete = () => {
  console.log("Animation completed!");
};

export default function Shop() {
  const { products, loading, error } = useProductContext();

  if (loading)
    return (
      <p className="text-center text-gray-600 mt-10">Loading products...</p>
    );

  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  if (products.length === 0)
    return (
      <p className="text-center text-gray-600 mt-10">No products available.</p>
    );

  return (
    <div className="bg-gray-200 min-h-screen p-6 flex flex-col items-center">
      <BlurText
        text="🛍️ Our Collection"
        delay={150}
        animateBy="words"
        direction="top"
        onAnimationComplete={handleAnimationComplete}
        className="text-3xl mb-4 font-bold"
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 md:w-md lg:w-3xl  ">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {product.images && product.images.length > 0 && (
                <img
                  src={
                    product.images[0].startsWith("http")
                      ? product.images[0]
                      : `http://localhost:8080${product.images[0]}`
                  }
                  alt={product.title}
                  className="w-full h-48 sm:h-56 md:h-60 lg:h-48 object-cover rounded-md mb-3"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.title}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {product.description}
                </p>
                <p className="text-black font-bold mt-3">
                  ₹{product.base_price}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Link to={`/product/${product.id}`}>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded w-full sm:w-auto">
                      More Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
