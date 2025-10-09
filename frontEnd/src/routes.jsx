import App from "./App";
import ImageSlider from "./components/Imageslider";
import About from "./components/About";
import ErrorPage from "./errorpage";
import Shop from "./components/Shop";
import NewArrivals from "./components/NewArrivals";
import Account from "./components/Account";
import Cart from "./components/Cart";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Testimonials from "./components/Testimonials";
import ContactForm from "./components/Contactus";




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
        <ImageSlider/>,
        <NewArrivals/>,
        <Testimonials/>,
        <ContactForm/>
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
      { path: "signUp", element: <Signup /> },
      { path: "logIn", element: <Login /> },
    ],
  },
];

export default routes;
