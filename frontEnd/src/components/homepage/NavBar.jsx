import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMenu, HiX, HiShoppingBag, HiUser } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Update cart count
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(totalItems);
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/about", label: "About" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-white shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src="icons/logo.png"
              alt="Heritage Watches Co"
              className="w-16 h-16 rounded-full transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative text-sm font-medium transition-colors duration-200 ${
                  isActive(link.to)
                    ? "text-amber-600"
                    : "text-gray-700 hover:text-amber-600"
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-500"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Icons */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              to="/account"
              className="text-gray-700 hover:text-amber-600 transition-colors"
              aria-label="Account"
            >
              <HiUser className="w-6 h-6" />
            </Link>

            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-amber-600 transition-colors group"
              aria-label="Shopping cart"
            >
              <HiShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg"
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </motion.span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-700 hover:text-amber-600 transition-colors p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <HiX className="w-7 h-7" />
            ) : (
              <HiMenu className="w-7 h-7" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={link.to}
                    className={`block py-2 text-base font-medium transition-colors ${
                      isActive(link.to)
                        ? "text-amber-600"
                        : "text-gray-700 hover:text-amber-600"
                    }`}
                  >
                    {link.label}
                    {isActive(link.to) && (
                      <div className="w-8 h-0.5 bg-amber-500 mt-1" />
                    )}
                  </Link>
                </motion.div>
              ))}

              <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                <Link
                  to="/account"
                  className="flex items-center gap-2 text-gray-700 hover:text-amber-600 transition-colors"
                >
                  <HiUser className="w-6 h-6" />
                  <span className="text-sm font-medium">Account</span>
                </Link>

                <Link
                  to="/cart"
                  className="flex items-center gap-2 text-gray-700 hover:text-amber-600 transition-colors relative"
                >
                  <div className="relative">
                    <HiShoppingBag className="w-6 h-6" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium">Cart</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;