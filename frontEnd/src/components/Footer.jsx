import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="m-2 rounded-2xl pt-4" style={{backgroundColor:"#6A6B4E"}}>
      <div className="container mx-auto px-4">
        {/* Social Media Icons Row */}
        <div className="flex justify-center items-center pt-4 pb-4 ">
          <div className="flex items-center space-x-4">
            {/* Reddit */}
            <a href="#" className="w-10 h-10">
                <img src="./icons/reddit.png" alt="reddit" />
            </a>
            
            {/* Facebook */}
            <a href="#" className="w-10 h-10">
                <img src="./icons/fb.png" alt="reddit" />
            </a>
            
            {/* WhatsApp */}
            <a href="#" className="w-10 h-10">
                <img src="./icons/whatsapp.png" alt="reddit" />
            </a>
            
            {/* Twitter/X */}
            <a href="#" className="w-10 h-10">
                <img src="./icons/twitter.png" alt="reddit" />
            </a>
            
            {/* Instagram */}
            <a href="#" className="w-10 h-10">
                <img src="./icons/instagram.png" alt="reddit" />
            </a>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="pb-4">
          <div className="flex justify-center items-center space-x-8 ">
            <Link to="/" className="text-black hover:text-white transition-colors font-bold text-xl">
              Home
            </Link>
            <Link to="/shop" className="text-black hover:text-white transition-colors font-bold text-xl">
              Shop
            </Link>
            <Link to="/about" className="text-black hover:text-white transition-colors font-bold text-xl">
              About
            </Link>
            <Link to="/collection" className="text-black hover:text-white transition-colors font-bold text-xl">
              Collection
            </Link>
          </div>
        </nav>
        
        {/* Copyright */}
        {/* <div className="text-center py-2 text-xs text-black" style={{backgroundColor:"#82AB70"}}>
          Copyright © 2025
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
