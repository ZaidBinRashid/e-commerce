import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/auth/allProducts");
        if (isMounted) {
          const data = res.data?.products;
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) setError("Failed to load products.");
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => { isMounted = false; };
  }, []);

  return (
    <ProductsContext.Provider value={{ products, setProducts, loading, error }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductsContext);
