import App from "./App";
import Hero from "./components/Hero";
import About from "./components/About";
import ErrorPage from "./errorpage";
import Shop from "./components/Shop";
import Collection from "./components/Collection";
import Account from "./components/Account";
import Cart from "./components/Cart";
import Gallery from "./components/gallery";

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
    ],
  },
];

export default routes;
