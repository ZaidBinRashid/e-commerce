import axios from "axios";
import { useEffect, useState } from "react";
import  { Link } from "react-router-dom"

export default function AllProducts() {
  const [products, setProducts] = useState([]); // ✅ initialize as array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!products || products.length === 0) return <p>No products found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">All Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-lg border border-black shadow hover:shadow-md transition"
          >
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
            )}
            <h3 className="text-lg font-bold">{product.title}</h3>
            <p className="text-gray-600 text-sm">{product.description}</p>
            <p className="text-indigo-600 font-semibold mt-2">
              ₹{product.price}
            </p>
            <Link to={`/adminDashboard/updateProduct/${product.id}`}>
              <button className="bg-yellow-500 text-white px-3 py-1 rounded mt-2 hover:bg-yellow-600">
                Edit
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
