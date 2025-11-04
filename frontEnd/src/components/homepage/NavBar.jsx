import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-sm ">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/icons/logo1.png"
            alt="logo"
            className="w-20 h-20 rounded-full"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-10 text-xl">
          <Link
            to="/"
            className="text-gray-800 hover:text-gray-500 font-medium"
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="text-gray-800 hover:text-gray-500 font-medium"
          >
            Shop
          </Link>
          <Link
            to="/about"
            className="text-gray-800 hover:text-gray-500 font-medium"
          >
            About
          </Link>
        </div>

        {/* Search + Icons */}
        <div className="hidden lg:flex items-center space-x-6">
          <Link to="/account">
            <img src="/icons/account.png" alt="user" className="w-6 h-6" />
          </Link>

          <Link to="/cart" className="relative">
            <img src="/icons/shopping-bag.png" alt="cart" className="w-6 h-6" />
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
            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className="text-gray-800 hover:text-gray-500 font-medium"
            >
              About
            </Link>

            <div className="flex items-center space-x-6 pt-2">
              <Link to="/account" onClick={() => setMenuOpen(false)}>
                <img src="/icons/account.png" alt="user" className="w-6 h-6" />
              </Link>
              <Link
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className="relative"
              >
                <img
                  src="/icons/shopping-bag.png"
                  alt="cart"
                  className="w-6 h-6"
                />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
