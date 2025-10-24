import { useEffect, useState } from "react";
import axios from "axios";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    axios
      .get("http://localhost:8080/api/auth/allProducts", {
        withCredentials: true,
      })
      .then((res) => {
        // ✅ check if products exist in response
        if (Array.isArray(res.data.products)) {
          setProducts(res.data.products);
        } else {
          console.error("Unexpected response format:", res.data);
          setProducts([]); // fallback to empty
        }
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center text-gray-600 mt-10">Loading products...</p>;

  if (products.length === 0)
    return <p className="text-center text-gray-600 mt-10">No products available.</p>;

  return (
    <div className="bg-gray-200 min-h-screen p-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">🛍️ Our Collection</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 md:w-md lg:w-3xl  ">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{product.description}</p>
              <p className="text-indigo-600 font-bold mt-3">₹{product.price}</p>

              <button className="mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2  transition">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
