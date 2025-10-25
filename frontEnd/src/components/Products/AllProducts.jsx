import { Link } from "react-router-dom";
import { useProductContext } from "../../auth/ProductContext"; // ✅ import context

export default function AllProducts() {
  const { products, loading, error } = useProductContext(); // ✅ use global context

  if (loading)
    return <p className="text-center text-gray-600 mt-10">Loading products...</p>;

  if (error)
    return <p className="text-center text-red-600 mt-10">{error}</p>;

  if (!products || products.length === 0)
    return <p className="text-center text-gray-600 mt-10">No products found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">All Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-lg border border-gray-300 shadow hover:shadow-lg transition"
          >
            {/* Product Image */}
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-48 object-cover rounded-md mb-3"
              />
            )}

            {/* Product Details */}
            <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{product.description}</p>
            <p className="text-indigo-600 font-bold mt-3">₹{product.price}</p>

            {/* Admin Action Buttons */}
            <div className="mt-3 flex gap-2">
              <Link to={`/adminDashboard/updateProduct/${product.id}`}>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
                  Edit
                </button>
              </Link>

              <Link to={`/adminDashboard/deleteProduct/${product.id}`}>
                <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
