// import { useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { scroller } from "react-scroll";
// import { CiSearch } from "react-icons/ci";
// import { HiMenu, HiX } from "react-icons/hi";

// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const scrollToSection = (id) => {
//     if (location.pathname !== "/") {
//       navigate("/");
//       setTimeout(() => {
//         scroller.scrollTo(id, {
//           smooth: true,
//           duration: 600,
//           offset: -80,
//         });
//       }, 300);
//     } else {
//       scroller.scrollTo(id, {
//         smooth: true,
//         duration: 600,
//         offset: -80,
//       });
//     }
//     setMenuOpen(false);
//   };

//   return (
//     <nav className="w-full bg-white shadow-sm">
//       <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col items-center">
//         {/* 🔹 Top Bar with Logo and Hamburger */}
//         <div className="flex items-center w-full justify-center md:justify-center">
//           {/* Logo */}
//           <img
//             src="./icons/logo2.png"
//             alt="logo"
//             className="w-40 sm:w-56 md:w-72 md:mx-auto flex-shrink-0"
//           />

//           {/* Hamburger Icon (Mobile) */}
//           <button
//             className="md:hidden ml-auto text-3xl text-gray-800"
//             onClick={() => setMenuOpen(!menuOpen)}
//           >
//             {menuOpen ? <HiX /> : <HiMenu />}
//           </button>
//         </div>

//         {/* 🔹 Desktop Menu */}
//         <div className="hidden md:flex justify-between items-center w-full mt-4 pl-42">
//           {/* Left Links */}
//           <div className="flex items-center space-x-8">
//             <Link
//               to="/"
//               className="text-black text-xl font-medium hover:text-gray-600"
//             >
//               Home
//             </Link>
//             <Link
//               to="/shop"
//               className="text-black text-xl font-medium hover:text-gray-600"
//             >
//               Shop
//             </Link>
//           </div>

//           {/* Search Bar */}
//           <div className="relative w-64 xl:w-80">
//             <input
//               type="text"
//               placeholder="Search"
//               className="w-full pl-10 pr-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
//             />
//             <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
//           </div>

//           {/* Right Links + Icons */}
//           <div className="flex items-center space-x-8">
//             <Link
//               to="/about"
//               className="text-black text-xl font-medium hover:text-gray-600"
//             >
//               About
//             </Link>

//             <button
//               onClick={() => scrollToSection("new-arrivals")}
//               className="text-black text-xl font-medium hover:text-gray-600"
//             >
//               New Arrivals
//             </button>

//             {/* Profile */}
//             <Link to="/account">
//               <img src="./icons/account.png" alt="user" className="w-6 h-6" />
//             </Link>

//             {/* Cart */}
//             <Link to="/cart" className="relative">
//               <img
//                 src="./icons/shopping-bag.png"
//                 alt="cart"
//                 className="w-6 h-6"
//               />
//               <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                 0
//               </span>
//             </Link>
//           </div>
//         </div>

//         {/* 🔹 Mobile Menu (collapsible) */}
//         {menuOpen && (
//           <div className="flex flex-col items-center w-full mt-4 space-y-4 md:hidden">
//             <div className="flex flex-col items-center space-y-3">
//               <Link
//                 to="/"
//                 onClick={() => setMenuOpen(false)}
//                 className="text-black text-lg font-medium hover:text-gray-600"
//               >
//                 Home
//               </Link>
//               <Link
//                 to="/shop"
//                 onClick={() => setMenuOpen(false)}
//                 className="text-black text-lg font-medium hover:text-gray-600"
//               >
//                 Shop
//               </Link>
//               <button
//                 onClick={() => scrollToSection("new-arrivals")}
//                 className="text-black text-xl font-medium hover:text-gray-600"
//               >
//                 New Arrivals
//               </button>
//               <Link
//                 to="/about"
//                 onClick={() => setMenuOpen(false)}
//                 className="text-black text-lg font-medium hover:text-gray-600"
//               >
//                 About
//               </Link>
//             </div>

//             {/* Search + Icons (mobile) */}
//             <div className="w-full flex flex-col items-center space-y-3">
//               <div className="relative w-72">
//                 <input
//                   type="text"
//                   placeholder="Search"
//                   className="w-full pl-10 pr-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
//                 />
//                 <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
//               </div>

//               <div className="flex items-center space-x-6 mt-2">
//                 <Link to="/account" onClick={() => setMenuOpen(false)}>
//                   <img
//                     src="./icons/account.png"
//                     alt="user"
//                     className="w-6 h-6"
//                   />
//                 </Link>
//                 <Link
//                   to="/cart"
//                   onClick={() => setMenuOpen(false)}
//                   className="relative"
//                 >
//                   <img
//                     src="./icons/shopping-bag.png"
//                     alt="cart"
//                     className="w-6 h-6"
//                   />
//                   <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                     0
//                   </span>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { scroller } from "react-scroll";
import { HiMenu, HiX } from "react-icons/hi";
import { CiSearch } from "react-icons/ci";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        scroller.scrollTo(id, {
          smooth: true,
          duration: 600,
          offset: -80,
        });
      }, 300);
    } else {
      scroller.scrollTo(id, {
        smooth: true,
        duration: 600,
        offset: -80,
      });
    }
    setMenuOpen(false);
  };

  return (
    <nav className="w-full bg-white shadow-sm ">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="./icons/logo1.png" alt="logo" className="w-20 h-20 rounded-full" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-10">
          <Link to="/" className="text-gray-800 hover:text-gray-500 font-medium">
            Home
          </Link>
          <Link to="/shop" className="text-gray-800 hover:text-gray-500 font-medium">
            Shop
          </Link>
          <button
            onClick={() => scrollToSection("new-arrivals")}
            className="text-gray-800 hover:text-gray-500 font-medium"
          >
            New Arrivals
          </button>
          <Link to="/about" className="text-gray-800 hover:text-gray-500 font-medium">
            About
          </Link>
        </div>

        {/* Search + Icons */}
        <div className="hidden lg:flex items-center space-x-6">
          <div className="relative">
            <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-3 py-1.5 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <Link to="/account">
            <img src="./icons/account.png" alt="user" className="w-6 h-6" />
          </Link>

          <Link to="/cart" className="relative">
            <img src="./icons/shopping-bag.png" alt="cart" className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              0
            </span>
          </Link>
        </div>

        {/* Hamburger (for <900px) */}
        <button
          className="lg:hidden text-3xl text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white shadow-inner border-t border-gray-100">
          <div className="flex flex-col items-center py-4 space-y-4">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="text-gray-800 hover:text-gray-500 font-medium"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setMenuOpen(false)}
              className="text-gray-800 hover:text-gray-500 font-medium"
            >
              Shop
            </Link>
            <button
              onClick={() => scrollToSection("new-arrivals")}
              className="text-gray-800 hover:text-gray-500 font-medium"
            >
              New Arrivals
            </button>
            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className="text-gray-800 hover:text-gray-500 font-medium"
            >
              About
            </Link>

            <div className="relative w-72 mt-3">
              <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <div className="flex items-center space-x-6 pt-2">
              <Link to="/account" onClick={() => setMenuOpen(false)}>
                <img src="./icons/account.png" alt="user" className="w-6 h-6" />
              </Link>
              <Link
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className="relative"
              >
                <img
                  src="./icons/shopping-bag.png"
                  alt="cart"
                  className="w-6 h-6"
                />
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
