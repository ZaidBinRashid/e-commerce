import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ✅ added

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/auth/allProducts", {
        withCredentials: true,
      })
      .then((res) => {
        if (Array.isArray(res.data.products)) {
          setProducts(res.data.products);
        } else {
          console.error("Unexpected response format:", res.data);
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products.");
      })
      .finally(() => setLoading(false));
  }, []);

  // ✅ Provide all states for child components
  return (
    <ProductsContext.Provider value={{ products, setProducts, loading, error }}>
      {children}
    </ProductsContext.Provider>
  );
};

// ✅ Custom Hook for easy access
export const useProductContext = () => useContext(ProductsContext);
