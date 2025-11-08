import { Link } from "react-router-dom";
import { useProductContext } from "../../auth/ProductContext";
import axios from "axios";
import toast from "react-hot-toast";
import { HiPencil, HiTrash, HiEye } from "react-icons/hi";
import { motion } from "framer-motion";

export default function AllProducts() {
  const { products, setProducts, loading, error } = useProductContext();

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product? This action cannot be undone."
    );
    if (!confirmDelete) return;

    const deletePromise = axios.delete(
      `${import.meta.env.VITE_API_URL}/api/auth/product/${id}`,
      { withCredentials: true }
    );

    toast.promise(
      deletePromise,
      {
        loading: "Deleting product...",
        success: "✅ Product deleted successfully!",
        error: "❌ Failed to delete product.",
      },
      { position: "top-right" }
    );

    try {
      await deletePromise;
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400 text-lg">Loading products...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  if (!products || products.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <HiEye className="w-10 h-10 text-gray-400" />
        </div>
        <p className="text-gray-600 text-lg mb-4">No products found</p>
        <Link to="/adminDashboard/addProducts">
          <button className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-medium px-6 py-2 rounded-full hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg">
            Add Your First Product
          </button>
        </Link>
      </div>
    );

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-gray-900">All Products</h2>
          <p className="text-sm text-gray-600 mt-1">
            {products.length} {products.length === 1 ? "product" : "products"} total
          </p>
        </div>
        <Link to="/adminDashboard/addProducts">
          <button className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-medium px-6 py-2 rounded-full hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Product
          </button>
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => {
          const firstImage =
            product.images?.length > 0 ? product.images[0] : null;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                {firstImage ? (
                  <img
                    src={firstImage}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No Image</span>
                  </div>
                )}
                
                {/* Stock Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.in_stock
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.in_stock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
                  {product.title}
                </h3>
                
                {product.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {product.description}
                  </p>
                )}

                <div className="flex items-center justify-between mb-4">
                  <p className="text-xl font-bold text-gray-900">
                    ₹{Number(product.base_price).toLocaleString()}
                  </p>
                  {product.brand && (
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-gray-600">
                      {product.brand}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    to={`/product/${product.id}`}
                    className="flex-1"
                    target="_blank"
                  >
                    <button className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg transition-colors">
                      <HiEye className="w-4 h-4" />
                      View
                    </button>
                  </Link>
                  
                  <Link
                    to={`/adminDashboard/updateProduct/${product.id}`}
                    className="flex-1"
                  >
                    <button className="w-full flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-700 font-medium py-2 rounded-lg transition-colors">
                      <HiPencil className="w-4 h-4" />
                      Edit
                    </button>
                  </Link>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}