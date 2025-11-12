import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProductsProvider } from "./auth/ProductContext";
import routes from "./routes";
import "./main.css";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter(routes, {
  basename: "/e-commerce",
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ProductsProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-center" // you can also use "bottom-center", "top-center", etc.
          toastOptions={{
            success: {
              duration: 3000,
              style: { background: "#4ade80", color: "white" },
            },
            error: {
              duration: 4000,
              style: { background: "#f87171", color: "white" },
            },
          }}
        />
      </ProductsProvider>
    </AuthProvider>
  </StrictMode>
);
