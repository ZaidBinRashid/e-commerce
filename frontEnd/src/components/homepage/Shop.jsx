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

  // ✅ multiple selections now stored as arrays
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
    return <p className="text-center text-gray-600 mt-10">Loading products...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;
  if (products.length === 0)
    return <p className="text-center text-gray-600 mt-10">No products available.</p>;

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

      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl">
        {/* ------------------ Sidebar Filter ------------------ */}
        <div className="bg-slate-800 text-white p-4 rounded-lg shadow-md w-full lg:w-64">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Filter Products
          </h3>

          {/* Brand Filter */}
          <div className="mb-6">
            <h4 className=" text-xl font-medium text-white mb-2">Brand</h4>
            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
              {brands.map((brand) => (
                <label key={brand} className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleSelection(brand, "brand")}
                    className="text-blue-500 focus:ring-blue-400 rounded"
                  />
                  <span className="text-white">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="mb-6">
            <h4 className=" text-xl font-medium text-white mb-2">Wrist Size</h4>
            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
              {wrist_sizes.map((wrist_size) => (
                <label key={wrist_size} className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(wrist_size)}
                    onChange={() => toggleSelection(wrist_size, "wrist_size")}
                    className="text-blue-500 focus:ring-blue-400 rounded"
                  />
                  <span className="text-white">{wrist_size}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Reset Filters */}
          {(selectedBrands.length > 0 || selectedSizes.length > 0) && (
            <button
              onClick={() => {
                setSelectedBrands([]);
                setSelectedSizes([]);
              }}
              className="w-full bg-blue-500 hover:bg-blue-600  py-2 rounded"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* ------------------ Products Grid ------------------ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="flex-1"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
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
                    <p className="text-gray-500 text-sm mt-1">{product.description}</p>
                    <p className="text-black font-bold mt-3">₹{product.base_price}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Brand: {product.brand || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Size: {product.wrist_size || "N/A"}
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
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full">
                No products match your filters.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
