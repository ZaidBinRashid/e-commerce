import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    
    <nav className="fixed top-0 left-0 right-0 z-20 px-4 py-4  " style={{backgroundColor:"#000000"}}>
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center justify-between ">
          {/* Logo */}
          <div >
          <img src="./icons/logo.png" alt="logo" className='h-14 rounded-full' />
            
            
          </div>

          {/* Desktop Navigation Menu */}
          <div className="hidden md:flex space-x-16">
            <Link to="/" className="text-white hover:text-gray-600 font-bold text-2xl transition-colors duration-200">
              Home
            </Link>
            <Link to="/shop" className="text-white hover:text-gray-600 font-bold text-2xl transition-colors duration-200">
              Shop
            </Link>
            <Link to="/collection" className="text-white hover:text-gray-600 font-bold text-2xl transition-colors duration-200">
              Collection
            </Link>
            <Link to="/about" className="text-white hover:text-gray-600 font-bold text-2xl transition-colors duration-200">
              About
            </Link>
          </div>

          {/* Desktop Right Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="account">
            {/* Profile Icon */}
            <button className="w-10 h-10">
              
              <img src="./icons/account.png" alt="user" />
            </button>
            </Link>
            {/* Cart Icon with Badge */}
              <Link to="/cart">
            <div className="relative w-10 h-10">
              <img src="./icons/shopping-bag.png" alt="cart"/>
              <span className="absolute -top-1 -right-1 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </div>
              </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-white hover:text-gray-600 font-medium text-xl transition-colors duration-200">
              Home
            </Link>
            <Link to="/shop" className="text-white hover:text-gray-600 font-medium text-xl transition-colors duration-200">
              Shop
            </Link>
            <Link to="/about" className="text-white hover:text-gray-600 font-medium text-xl transition-colors duration-200">
              About
            </Link>
            <Link to="/contactus" className="text-white hover:text-gray-600 font-medium text-xl transition-colors duration-200">
              Contact
            </Link>
              
              {/* Mobile Icons Row */}
              <div className="flex items-center justify-center space-x-4 pt-4">
                <Link to="account">
            {/* Profile Icon */}
            <button className="w-10 h-10">
              
              <img src="./icons/account.png" alt="user" />
            </button>
            </Link>
            {/* Cart Icon with Badge */}
              <Link to="/cart">
            <div className="relative w-10 h-10">
              <img src="./icons/shopping-bag.png" alt="cart"/>
              <span className="absolute -top-1 -right-1 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </div>
              </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>

  );
};

export default Navbar;

