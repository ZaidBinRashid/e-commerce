import { Link } from "react-router-dom";

import React from "react";
import {
  FaReddit,
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 relative z-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div>
          <h2 className="text-2xl font-bold text-white">HeritageWatchesCo</h2>
          <p className="mt-2 text-sm text-gray-400">
            Classic watches, restored to their original glory.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-white">
                Shop
              </Link>
            </li>
            {/* <li>
              <Link to="/collection" className="hover:text-white">
                Collection
              </Link>
            </li> */}
            <li>
              <Link to="/account" className="hover:text-white">
                Account
              </Link>
            </li>

            <li>
              <Link to="/cart" className="hover:text-white">
                Cart
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="https://reddit.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white text-2xl"
            >
              <FaReddit />
            </a>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white text-2xl"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white text-2xl"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white text-2xl"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white text-2xl"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} HeritageWatchesCo. All rights reserved.
      </div>
    </footer>
  );
}
