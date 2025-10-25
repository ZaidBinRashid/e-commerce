import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProductsProvider } from "./auth/ProductContext";
import routes from "./routes";
import "./main.css";

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ProductsProvider>
    <RouterProvider router={router} />
    </ProductsProvider>
    </AuthProvider>
  </StrictMode>
);
