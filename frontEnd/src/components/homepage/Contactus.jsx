import { motion } from "framer-motion";
import {
  FaInstagram,
  FaEnvelope,
  FaWhatsapp,
  FaClock,
} from "react-icons/fa";
import BlurText from "../UI/BlurText";

const handleAnimationComplete = () => {
  console.log("Animation completed!");
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Heading Section */}
        <div className="text-center mb-12 lg:mb-16">
          <BlurText
            text="Get in Touch"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-4xl lg:text-5xl font-light tracking-tight text-gray-900 mb-4"
          />

          <BlurText
            text="We'd love to help you find your next luxury timepiece"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-lg text-gray-600"
          />
        </div>

        {/* Contact Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Contact Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10">
            <h2 className="text-2xl font-medium text-gray-900 mb-8">
              Contact Information
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center">
                  <FaEnvelope className="text-slate-900 text-lg" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <a
                    href="mailto:heritagewatchesco@gmail.com"
                    className="text-gray-900 hover:text-amber-600 transition-colors font-medium"
                  >
                    heritagewatchesco@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                  <FaWhatsapp className="text-white text-lg" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">WhatsApp</p>
                  <a
                    href="https://wa.me/919596990878"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 hover:text-green-600 transition-colors font-medium"
                  >
                    +91 9596990878
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center">
                  <FaClock className="text-white text-lg" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Business Hours</p>
                  <p className="text-gray-900 font-medium">
                    Monday – Saturday
                  </p>
                  <p className="text-gray-600">10:00 AM – 7:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social & CTA Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-medium text-white mb-4">
                Connect With Us
              </h2>
              <p className="text-slate-300 mb-8">
                Follow us on social media for the latest updates, new arrivals, and exclusive offers.
              </p>

              <div className="flex gap-4">
                <a
                  href="https://chat.whatsapp.com/C3xbWjZZo250eVkLurvNgk?mode=wwt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp className="text-white text-2xl" />
                </a>
                <a
                  href="https://www.instagram.com/heritagewatchcompany?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                  aria-label="Instagram"
                >
                  <FaInstagram className="text-white text-2xl" />
                </a>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-12 pt-8 border-t border-slate-700">
              <h3 className="text-lg font-medium text-white mb-3">
                Ready to explore?
              </h3>
              <p className="text-slate-300 text-sm mb-6">
                Visit our collection and discover timepieces that match your style.
              </p>
              <a
                href="/shop"
                className="inline-block w-full text-center bg-amber-400 hover:bg-amber-300 text-slate-900 font-medium py-3 px-6 rounded-full transition-all hover:shadow-lg"
              >
                Browse Collection
              </a>
            </div>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 bg-white rounded-2xl shadow-md p-6 text-center"
        >
          <p className="text-gray-600">
            <span className="font-medium text-gray-900">Note:</span> We prioritize personalized service. 
            Feel free to reach out with any questions about our watches, pricing, or availability.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
