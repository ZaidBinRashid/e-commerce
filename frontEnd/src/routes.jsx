import App from "./App";
import Hero from "./components/Hero";
import About from "./components/About";
import ErrorPage from "./errorpage";
import Shop from "./components/Shop";
import ContactUs from "./components/ContactUs";



const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Hero />,
      },
      {
        path: "Shop",
        element: <Shop />,
      },
      {
        path: "ContactUs",
        element: <ContactUs />,
      },
      {
        path: "About",
        element: <About />,
      },
    ],
  },
];

export default routes;