import App from "./App";
// import Hero from "./components/Hero";
import About from "./components/About";
import ErrorPage from "./errorpage";
import Shop from "./components/Shop";
import NewArrivals from "./components/NewArrivals";
import Account from "./components/Account";
import Cart from "./components/Cart";
import Signup from "./components/Signup";
import Login from "./components/Login";




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
        
          </>
        ),
      },
      {
        path: "shop",
        element: <Shop />,
      },
      {
        path: "newArrivals",
        element: <NewArrivals />,
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
