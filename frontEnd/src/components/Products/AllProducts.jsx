import { Link } from "react-router-dom";
import { useProductContext } from "../../auth/ProductContext";
import axios from "axios";
import toast from "react-hot-toast";

export default function AllProducts() {
  const { products, setProducts, loading, error } = useProductContext();

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
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
      // Remove product from UI immediately
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  if (loading)
    return <p className="text-center text-gray-600 mt-10">Loading products...</p>;

  if (error)
    return <p className="text-center text-red-600 mt-10">{error}</p>;

  if (!products || products.length === 0)
    return <p className="text-center text-gray-600 mt-10">No products found.</p>;

  return (
    <div className="p-6 text-gray-900">
      <h2 className="text-2xl font-semibold mb-6 text-center">All Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          // ✅ If images are stored in Cloudinary, they’ll already have HTTPS URLs
          const firstImage =
            product.images?.length > 0 ? product.images[0] : null;

          return (
            <div
              key={product.id}
              className="bg-white p-4 rounded-lg border border-gray-200 shadow hover:shadow-lg transition flex flex-col"
            >
              {firstImage ? (
                <img
                  src={firstImage}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-md mb-3"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-400 rounded-md mb-3">
                  No Image
                </div>
              )}

              <h3 className="text-lg font-semibold text-gray-800">
                {product.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {product.description}
              </p>
              <p className="text-indigo-600 font-bold mt-3">
                ₹{product.base_price}
              </p>

              <div className="mt-auto pt-4 flex gap-3">
                <Link to={`/adminDashboard/updateProduct/${product.id}`}>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded w-full sm:w-auto transition">
                    Edit
                  </button>
                </Link>

                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded w-full sm:w-auto transition"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
