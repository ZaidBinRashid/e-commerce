import { useProductContext } from "../../auth/ProductContext";
import BlurText from "../UI/BlurText";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const handleAnimationComplete = () => {
  console.log("Animation completed!");
};

export default function NewArrivals() {
  const { products, loading, error } = useProductContext();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  // ✅ Filter products where is_new is true
  const newArrivals = products.filter((product) => product.is_new === true);

  if (newArrivals.length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-gray-400 text-lg">No new arrivals available</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <BlurText
            text="New Arrivals"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-4xl lg:text-5xl font-light tracking-tight text-gray-900 mb-4"
          />

          <BlurText
            text="Check out the latest additions to our collection"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-lg text-gray-600"
          />
        </div>

        {/* Product Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {newArrivals.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  to={`/product/${product.id}`}
                  className="group block h-full"
                >
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col relative">
                    {/* New Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        NEW
                      </span>
                    </div>

                    <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex-shrink-0">
                      {product.images && product.images.length > 0 && (
                        <img
                          src={
                            product.images[0].startsWith("http")
                              ? product.images[0]
                              : `http://localhost:8080${product.images[0]}`
                          }
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="p-5 space-y-3 flex flex-col flex-grow">
                      <div className="space-y-2 flex-grow">
                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                          {product.title}
                        </h3>

                        {product.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                        <p className="text-lg font-bold text-gray-900">
                          ₹{Number(product.base_price).toLocaleString()}
                        </p>
                        <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full group-hover:bg-amber-100 transition-colors">
                          View Details
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}