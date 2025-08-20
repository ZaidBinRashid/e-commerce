import App from "./App";
import Hero from "./components/Hero";
import About from "./components/About";
import ErrorPage from "./errorpage";
import Shop from "./components/Shop";
import Collection from "./components/Collection";
import Account from "./components/Account";
import Cart from "./components/Cart";
import Signup from "./components/Signup";
import Login from "./components/Login";

// import Gallery from "./components/gallery";

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
            <Hero />
            {/* <Gallery /> */}
          </>
        ),
      },
      {
        path: "shop",
        element: <Shop />,
      },
      {
        path: "collection",
        element: <Collection />,
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
