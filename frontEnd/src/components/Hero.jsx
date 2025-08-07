

import { Link } from 'react-router-dom';
import React from 'react';

const HeroSection = () => {
  return (
    <section className="min-h-screen relative overflow-hidden rounded-2xl m-2" style={{backgroundColor:"#82AB70"}}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-slate-600 to-slate-800 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen py-16 lg:py-20">
          
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left mb-12 lg:mb-0 lg:pr-12">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-black leading-tight mb-6 animate-fade-in-up">
              <span className="block">Precision</span>
              <span className="block bg-gradient-to-r from-fuchsia-700 via-fuchsia-600 to-fuchsia-600 bg-clip-text text-transparent">
                Redefined
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg  sm:text-xl lg:text-2xl text-white mb-8 font-medium leading-relaxed animate-fade-in-up animation-delay-200">
              Timeless craftsmanship. Redefining elegance.
            </p>

            {/* Description */}
            <p className="text-base font-bold sm:text-lg text-white mb-10 max-w-2xl mx-auto lg:mx-0 animate-fade-in-up animation-delay-400">
              Discover our exclusive collection of luxury timepieces, where Swiss precision meets contemporary design. Each watch tells a story of excellence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up animation-delay-600">
              <Link to="/shop">
              <button className="group px-8 py-4 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <span className="flex items-center justify-center">
                  Shop Now
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
              </Link>
            <Link to="/collection">
              <button className="px-8 py-4 border-2 bg-green-800 border-slate-300 text-white font-semibold rounded-full hover:border-slate-900 hover:text-slate-900 transform hover:scale-105 transition-all duration-300">
                View Collection
              </button>
              </Link>
            </div>

            {/* Stats */}
            {/* <div className="flex flex-wrap justify-center lg:justify-start gap-8 mt-12 animate-fade-in-up animation-delay-800">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-black">50+</div>
                <div className="text-sm text-white">Premium Brands</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-black">25 Years</div>
                <div className="text-sm text-white">Experience</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-black">10K+</div>
                <div className="text-sm text-white">Happy Customers</div>
              </div>
            </div> */}
          </div>

          {/* Right Image */}
          <div className="flex-1 relative max-w-lg mx-auto lg:max-w-none h-1/2">
            <div className="relative animate-fade-in-right animation-delay-300">
              {/* Watch Image Container */}
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
                  alt="Luxury Watch"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full opacity-10 animate-pulse animation-delay-1000"></div>

              {/* Decorative Ring */}
              <div className="absolute inset-0 border-2 border-amber-400 rounded-2xl transform scale-105 opacity-20 animate-ping animation-delay-500"></div>
            </div>

            {/* Product Info Card */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg animate-fade-in-up animation-delay-1000">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Swiss Movement</p>
                  <p className="text-xs text-slate-500">Certified Authentic</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

    </section>
  
  );
};

export default HeroSection;
