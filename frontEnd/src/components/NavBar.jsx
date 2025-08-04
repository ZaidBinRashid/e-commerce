import { Link } from "react-router-dom";
import React, { useState } from "react";
import { Menu, X, ShoppingCart, User, Search } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-zinc-800 p-8 shadow-sm sticky top-0 z-50 text-2xl font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white">
              HOME
            </Link>
            <Link to="/Shop" className="text-white">
              SHOP
            </Link>
          </div>

          {/* Logo - Center */}
          <div>
            <Link to="/" className="flex items-center">
              <img className="h-30" src="/logo.png" alt="logo" />
            </Link>
          </div>

          {/* Right Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-white">
              ABOUT
            </Link>
            <Link to="/ContactUs" className="text-white">
              CONTACT
            </Link>

            <div className="flex items-center space-x-4">
              <button className="text-white">
                <Search className="w-8 h-8" />
              </button>
              <button className="text-white">
                <User className="w-8 h-8" />
              </button>
              <button className="text-white relative">
                <ShoppingCart className="w-8 h-8" />
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
          </div>

          {/* Mobile menu button and icons */}
          <div className="md:hidden flex items-center space-x-4">
            <button className="text-white">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-white relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
            <button onClick={toggleMenu} className="text-white">
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-96 opacity-100 pb-6"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="mt-8 pt-4 pb-2 space-y-4 border-t border-gray-100">
            <Link
              to="/"
              className="block text-white font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              HOME
            </Link>
            <Link
              to="Shop"
              className="block text-white font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              SHOP
            </Link>
            <Link
              to="About"
              className="block text-white font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              ABOUT
            </Link>
            <Link
              to="ContactUs"
              className="block text-white font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              CONTACT
            </Link>

            <div className="pt-4 border-t border-gray-100">
              <button className="flex items-center space-x-2 text-white py-2">
                <User className="w-5 h-5" />
                <span>ACCOUNT</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
