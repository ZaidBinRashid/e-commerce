import NavBar from "./components/homepage/NavBar";
import Footer from "./components/homepage/Footer";
import {Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
