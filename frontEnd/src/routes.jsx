import App from "./App";
import ImageSlider from "./components/homepage/Imageslider";
import About from "./components/homepage/About";
import Shop from "./components/homepage/Shop";
import NewArrivals from "./components/homepage/NewArrivals";
import Cart from "./components/homepage/Cart";
import Testimonials from "./components/homepage/Testimonials";
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
import AddTestimonials from "./components/Products/AddTestimonials";
import Brands from "./components/homepage/Brands";


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
            <ImageSlider />,
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
        path: "adminDashboard",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
         children: [
          { index: true, element: <p>Welcome to the Admin Dashboard</p> },
          { path: "allProducts", element: <AllProducts /> },
          { path: "addProducts", element: <AddProducts /> },
          { path: "analytics", element: <Analytics /> },
          { path: "addTestimonials", element: <AddTestimonials /> },
          
        ],
      },
    ],
  },
];

export default routes;
