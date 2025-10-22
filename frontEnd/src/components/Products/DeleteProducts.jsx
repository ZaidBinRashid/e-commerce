import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";



export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  //  Fetch products
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/auth/allProducts", { withCredentials: true })
      .then((res) => setProducts(res.data.products))
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  //  Delete product
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/api/auth/product/${id}`, {
        withCredentials: true,
      });
      toast.success("Product deleted successfully!");
      // Remove deleted product from local state
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert(" Failed to delete product");
    }
  };

  if (loading) return <p>Loading products...</p>;

  if (products.length === 0) return <p>No products found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">All Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow">
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
            )}
            <h3 className="text-lg font-bold">{product.title}</h3>
            <p className="text-gray-600 text-sm">{product.description}</p>
            <p className="text-indigo-600 font-semibold mt-2">${product.price}</p>

            <div className="flex gap-2 mt-3">
              {/* Edit Button */}
              <a
                href={`/adminDashboard/updateProduct/${product.id}`}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                Edit
              </a>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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
