import { motion } from "framer-motion";
import {
  FaInstagram,
  FaReddit,
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
    <div className="bg-gray-50 min-h-[60vh] flex flex-col items-center justify-center px-6 py-16">
      {/* Heading Section */}
      
        <BlurText
          text="Contact Us"
          delay={150}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className="text-3xl mb-4 font-bold"
        />

        <BlurText
          text="We’d love to help you find your next luxury timepiece."
          delay={150}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className="text-xl mb-4 font-small"
        />

      {/* Contact Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Get in Touch
            </h2>
            <div className="space-y-4 text-gray-600">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-indigo-600 text-lg" />
                <span>Email: support@yourbrand.com</span>
              </div>
              <div className="flex items-center gap-3">
                <FaWhatsapp className="text-green-600 text-lg" />
                <span>WhatsApp: +91 XXXXXXXX</span>
              </div>
              <div className="flex items-center gap-3">
                <FaClock className="text-indigo-600 text-lg" />
                <span>Business Hours: Mon–Sat, 10 AM – 7 PM</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col justify-center text-center md:text-left">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Connect With Us
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-5 text-gray-700 text-2xl">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-600 transition"
              >
                <FaReddit />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-600 transition"
              >
                <FaWhatsapp />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500 transition"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
