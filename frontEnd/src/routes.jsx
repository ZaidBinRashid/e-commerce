import App from "./App";
import About from "./components/homepage/About";
import Shop from "./components/homepage/Shop";
import NewArrivals from "./components/homepage/NewArrivals";
import Cart from "./components/homepage/Cart";
import Contact from "./components/homepage/Contactus";
import ErrorPage from "./errorpage";
import Account from "./components/user/Account";
import SignupForm from "./components/user/SignupForm";
import LoginForm from "./components/user/LoginForm";
import AdminDashboard from "./components/user/AdminDashboard";
import AdminRoute from "./auth/AdminRoute";
import AllProducts from "./components/Products/AllProducts";
import AddProducts from "./components/Products/AddProducts";
import Analytics from "./components/Products/Analytics";
import Brands from "./components/homepage/Brands";
import Testimonials from "./components/Testimonials/Testimonials";
import AddTestimonials from "./components/Testimonials/AddTestimonials";
import AllTestimonials from "./components/Testimonials/AllTestimonials";
import UpdateProducts from "./components/Products/UpdateProducts";
import ProductDetails from "./components/Products/ProductDetails";
import CheckOut from "./components/CheckOut/CheckOut";
import FloatingHero from "./components/UI/FloatingHero";



const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <>
            <FloatingHero />
            <NewArrivals />,
            <Brands />,
            <Testimonials />,
            <Contact />
          </>
        ),
      },
      {
        path: "shop",
        element: <Shop />,
      },

      {
        path: "about",
        element: <About />,
      },
      {
        path: "account",
        element: <Account />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "signUp",
        element: <SignupForm />,
      },
      {
        path: "logIn",
        element: <LoginForm />,
      },
      {
        path: "product/:id",
        element: <ProductDetails />,
      },
      {
        path: "checkOut",
        element: <CheckOut />,
      },
      {
        path: "adminDashboard",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
        children: [
          { index: true, element: <AllProducts /> },
          { path: "allProducts", element: <AllProducts /> },
          { path: "addProducts", element: <AddProducts /> },
          { path: "updateProduct/:id", element: <UpdateProducts /> },
          { path: "analytics", element: <Analytics /> },
          { path: "addTestimonials", element: <AddTestimonials /> },
          { path: "allTestimonials", element: <AllTestimonials /> },
        ],
      },
    ],
  },
];

export default routes;
