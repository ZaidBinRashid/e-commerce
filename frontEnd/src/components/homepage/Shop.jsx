import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProductContext } from "../../auth/ProductContext";
import BlurText from "../UI/BlurText";
import { motion } from "framer-motion";

const handleAnimationComplete = () => {
  console.log("Animation completed!");
};

export default function Shop() {
  const { products, loading, error } = useProductContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  // Initialize filtered products
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  // Extract unique brands and sizes
  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];
  const wrist_sizes = [...new Set(products.map((p) => p.wrist_size).filter(Boolean))];

  // Handle checkbox toggles
  const toggleSelection = (value, type) => {
    if (type === "brand") {
      setSelectedBrands((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    } else if (type === "wrist_size") {
      setSelectedSizes((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    }
  };

  // Filtering logic
  useEffect(() => {
    let result = [...products];

    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    if (selectedSizes.length > 0) {
      result = result.filter((p) => selectedSizes.includes(p.wrist_size));
    }

    setFilteredProducts(result);
  }, [selectedBrands, selectedSizes, products]);

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
  if (products.length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-gray-400 text-lg">No products available</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8 lg:mb-12">
          <BlurText
            text="Collection"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-4xl lg:text-5xl font-light tracking-tight text-gray-900"
          />
          <p className="text-gray-600 mt-2 font-medium">
            {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* ------------------ Sidebar Filter ------------------ */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-8 space-y-6">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between lg:block mb-6">
                  <h3 className="text-sm uppercase tracking-wider text-slate-300 font-semibold">
                    Filters
                  </h3>
                  {(selectedBrands.length > 0 || selectedSizes.length > 0) && (
                    <button
                      onClick={() => {
                        setSelectedBrands([]);
                        setSelectedSizes([]);
                      }}
                      className="text-sm text-amber-400 hover:text-amber-300 transition-colors lg:hidden"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Brand Filter */}
                <div className="border-t border-slate-700 pt-6 mb-6">
                  <h4 className="text-sm font-medium text-white mb-4">Brand</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {brands.map((brand) => (
                      <label
                        key={brand}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleSelection(brand, "brand")}
                          className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500 focus:ring-offset-0 focus:ring-offset-slate-800"
                        />
                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                          {brand}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Size Filter */}
                <div className="border-t border-slate-700 pt-6 mb-6">
                  <h4 className="text-sm font-medium text-white mb-4">Wrist Size</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {wrist_sizes.map((wrist_size) => (
                      <label
                        key={wrist_size}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(wrist_size)}
                          onChange={() => toggleSelection(wrist_size, "wrist_size")}
                          className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500 focus:ring-offset-0 focus:ring-offset-slate-800"
                        />
                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                          {wrist_size}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters - Desktop */}
                {(selectedBrands.length > 0 || selectedSizes.length > 0) && (
                  <button
                    onClick={() => {
                      setSelectedBrands([]);
                      setSelectedSizes([]);
                    }}
                    className="hidden lg:block w-full py-3 text-sm font-medium text-slate-900 bg-amber-400 rounded-full hover:bg-amber-300 transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* ------------------ Products Grid ------------------ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredProducts.map((product, index) => (
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
                      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                        <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex-shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-gray-400 text-sm">No image</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        <div className="p-5 space-y-3 flex flex-col flex-grow">
                          <div className="space-y-1 flex-grow">
                            <h3 className="text-base font-semibold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                              {product.title}
                            </h3>

                            <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                              {product.brand && (
                                <span className="bg-slate-100 px-2 py-1 rounded-full">{product.brand}</span>
                              )}
                              {product.wrist_size && (
                                <span className="bg-slate-100 px-2 py-1 rounded-full">{product.wrist_size}</span>
                              )}
                            </div>

                            {product.description && (
                              <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                                {product.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
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
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-md">
                <p className="text-gray-400 text-lg mb-4">No products match your filters</p>
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedSizes([]);
                  }}
                  className="text-sm font-medium text-amber-600 bg-amber-50 px-6 py-2 rounded-full hover:bg-amber-100 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}