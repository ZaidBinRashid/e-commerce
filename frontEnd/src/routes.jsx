import App from "./App";
import ImageSlider from "./components/homepage/Imageslider";
import About from "./components/homepage/About";
import Shop from "./components/homepage/Shop";
import NewArrivals from "./components/homepage/NewArrivals";
import Cart from "./components/homepage/Cart";
import Testimonials from "./components/homepage/Testimonials";
import ContactForm from "./components/homepage/Contactus";
import ErrorPage from "./errorpage";
import Account from "./components/user/Account";
import SignupForm from "./components/user/SignupForm";
import LoginForm from "./components/user/LoginForm";




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
      { 
        path: "signUp",
        element: <SignupForm /> 
      },
      {
        path: "logIn", 
        element: <LoginForm /> 
      },
    ],
  },
];

export default routes;
