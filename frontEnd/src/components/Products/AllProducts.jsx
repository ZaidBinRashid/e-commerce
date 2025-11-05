import { Link } from "react-router-dom";
import { useProductContext } from "../../auth/ProductContext";
import axios from "axios";
import toast from "react-hot-toast";

export default function AllProducts() {
  const { products, setProducts, loading, error } = useProductContext();

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/auth/product/${id}`, {
        withCredentials: true,
      });

      toast.success("Product deleted successfully!");
      setProducts((prev) => prev.filter((p) => p.id !== id)); // Remove deleted product from UI
    } catch (err) {
      console.error("❌ Delete error:", err);
      toast.error("Failed to delete product.");
    }
  };

  if (loading)
    return <p className="text-center text-gray-600 mt-10">Loading products...</p>;

  if (error)
    return <p className="text-center text-red-600 mt-10">{error}</p>;

  if (!products || products.length === 0)
    return <p className="text-center text-gray-600 mt-10">No products found.</p>;

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">All Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-lg border border-gray-300 shadow hover:shadow-lg transition flex flex-col"
          >
            {product.images?.length > 0 && (
              <img
                src={`http://localhost:8080${product.images[0]}`}
                alt={product.title}
                className="w-full h-48 sm:h-56 md:h-60 lg:h-48 object-cover rounded-md mb-3"
              />
            )}

            <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {product.description}
            </p>
            <p className="text-indigo-600 font-bold mt-3">₹{product.base_price}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              <Link to={`/adminDashboard/updateProduct/${product.id}`}>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded w-full sm:w-auto">
                  Edit
                </button>
              </Link>

              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded w-full sm:w-auto"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
