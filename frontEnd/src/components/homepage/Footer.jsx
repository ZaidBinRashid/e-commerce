import { Link } from "react-router-dom";

import React from "react";
import {
  FaWhatsapp,
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
            Every watch tells more than time — it tells a story. Explore our curated collection of authentic, pre-owned timepieces built to last generations.
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
              href="https://chat.whatsapp.com/C3xbWjZZo250eVkLurvNgk?mode=wwt"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white text-2xl"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://www.instagram.com/heritagewatchcompany?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
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
