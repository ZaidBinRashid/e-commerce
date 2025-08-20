import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeProduct, setActiveProduct] = useState(0);
  const containerRef = useRef(null);

  const products = [
    {
      name: "Seiko",
      accent: "hsl(142 71% 45%)",
      tagline: "Innovation in every tick",
      description:
        "Japanese precision timepieces blending cutting-edge technology with timeless design.",
      bgPattern:
        "radial-gradient(circle at 20% 30%, rgba(52, 211, 153, 0.25) 0%, transparent 50%)",
      image: "./watches/seiko.jpeg",
    },
    {
      name: "Citizen",
      accent: "hsl(217 91% 60%)",
      tagline: "Powered by light, crafted for life",
      description:
        "Eco-Drive watches that harness light to deliver sustainable, reliable performance with elegant style.",
      bgPattern:
        "radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.28) 0%, transparent 55%)",
      image: "./watches/citizen.jpeg",
    },
    {
      name: "HMT",
      accent: "hsl(0 84% 60%)",
      tagline: "The timeless Indian classic",
      description:
        "Heritage mechanical watches known for durability, simplicity, and nostalgic charm.",
      bgPattern:
        "radial-gradient(circle at 60% 70%, rgba(239, 68, 68, 0.28) 0%, transparent 55%)",
      image: "./watches/Hmt.jpeg",
    },
    {
      name: "HMT",
      accent: "hsl(25 95% 53%)",
      tagline: "The timeless Indian classic",
      description:
        "Heritage mechanical watches known for durability, simplicity, and nostalgic charm.",
      bgPattern:
        "radial-gradient(circle at 40% 80%, rgba(245, 158, 11, 0.28) 0%, transparent 55%)",
      image: "./watches/Hmt.jpeg",
    },
    {
      name: "Audemars Piguet Royal Oak",
      accent: "hsl(262 83% 58%)",
      tagline: "Defining Icons",
      description: "Distinctive design with octagonal bezel.",
      bgPattern:
        "radial-gradient(circle at 90% 10%, rgba(168, 85, 247, 0.28) 0%, transparent 55%)",
      image: "./HMTW/Hmt5.jpeg",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const containerHeight = rect.height;
        const windowHeight = window.innerHeight;
        const scrollProgress = Math.max(
          0,
          Math.min(1, -rect.top / (containerHeight - windowHeight))
        );
        setScrollY(scrollProgress);

        const productProgress = scrollProgress * (products.length - 1);
        const newActiveProduct = Math.floor(productProgress);
        setActiveProduct(
          Math.max(0, Math.min(newActiveProduct, products.length - 1))
        );
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [products.length]);

  const currentProduct = products[activeProduct] || products[0];
  const nextProduct =
    products[Math.min(activeProduct + 1, products.length - 1)];
  const sectionProgress = (scrollY * (products.length - 1)) % 1;
  const transitionProgress = Math.max(0, (sectionProgress - 0.7) / 0.3);

  return (
    <div
      ref={containerRef}
      className="relative h-[600vh] bg-black overflow-hidden "
    >
      <div className="fixed inset-0 flex items-center justify-center ">
        {/* Animated background */}
        <div
          className="absolute inset-0 transition-all duration-700 ease-out"
          style={{ background: currentProduct.bgPattern }}
        />
        {transitionProgress > 0 && (
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              backgroundImage: nextProduct.bgPattern,
              opacity: transitionProgress,
            }}
          />
        )}

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-20"
              style={{
                width: `${4 + Math.random() * 8}px`,
                height: `${4 + Math.random() * 8}px`,
                backgroundColor: currentProduct.accent,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `
                  translateY(${scrollY * (100 + Math.random() * 200)}px) 
                  translateX(${Math.sin(scrollY * Math.PI * 4 + i) * 50}px)
                  scale(${0.5 + Math.sin(scrollY * Math.PI * 8 + i) * 0.5})
                `,
                transition: "background-color 0.7s ease-out",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between w-full pb-12 lg:pb-24 gap-10">
          {/* Left - text */}
          <div className="flex-1 text-white space-y-6 sm:space-y-8 text-center lg:text-left">
            <div
              className="transform transition-all duration-700 ease-out"
              style={{
                transform: `
          translateX(${-sectionProgress * 100}px) 
          translateY(${Math.sin(scrollY * Math.PI * 2) * 20}px)
          scale(${1 + sectionProgress * 0.05})
        `,
              }}
            >
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black mb-4 tracking-tight">
                <span
                  className="block text-white/90 text-lg sm:text-xl lg:text-2xl font-light mb-2 transition-all duration-500"
                  style={{
                    transform: `translateY(${-sectionProgress * 30}px)`,
                    opacity: 1 - transitionProgress * 0.5,
                  }}
                >
                  {currentProduct.tagline}
                </span>
                <span
                  className="block transition-all duration-700"
                  style={{
                    transform: `translateX(${sectionProgress * 50}px) rotateY(${
                      sectionProgress * 10
                    }deg)`,
                  }}
                >
                  {currentProduct.name}
                </span>
              </h1>

              <p
                className="text-base sm:text-lg lg:text-xl text-white/80 max-w-md mx-auto lg:mx-0 leading-relaxed transition-all duration-500"
                style={{
                  transform: `translateY(${sectionProgress * 40}px)`,
                  opacity: 1 - transitionProgress * 0.7,
                }}
              >
                {currentProduct.description}
              </p>
            </div>

            <div
              className="transform transition-all duration-700 ease-out"
              style={{
                transform: `
          translateY(${sectionProgress * 60}px) 
          scale(${1 - sectionProgress * 0.1})
        `,
                opacity: 1 - transitionProgress * 0.8,
              }}
            >
              <Link
                to="/collection"
                className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white font-semibold text-base sm:text-lg hover:bg-white/20 transition-all duration-300 overflow-hidden"
                style={{
                  borderColor: `color-mix(in oklab, ${currentProduct.accent} 30%, transparent)`,
                }}
              >
                <span className="relative z-10">Discover More</span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(45deg, ${currentProduct.accent}, transparent)`,
                  }}
                />
              </Link>
            </div>
          </div>

          {/* Right - Card */}
          <div className="flex-1 flex justify-center items-center">
            <div
              className="relative w-40 h-40 sm:w-60 sm:h-60 lg:w-96 lg:h-96"
              style={{
                transform: `
          perspective(1000px) 
          rotateY(${scrollY * 720 + sectionProgress * 180}deg) 
          rotateX(${Math.sin(scrollY * Math.PI * 4) * 10}deg)
          rotateZ(${Math.cos(scrollY * Math.PI * 3) * 2}deg)
          scale(${1 + Math.sin(scrollY * Math.PI * 6) * 0.05})
          translateZ(${sectionProgress * 60}px)
        `,
                transition: "all 0.1s ease-out",
              }}
            >
              <div className="relative w-full h-full rounded-3xl shadow-2xl overflow-hidden border border-white/10 bg-card">
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
                <img
                  src={currentProduct.image}
                  alt={`${currentProduct.name} watch`}
                  loading="lazy"
                  className="absolute object-cover inset-0 w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)] transition-all duration-500"
                  style={{
                    transform: `translateY(${
                      Math.sin(scrollY * Math.PI * 6) * 8
                    }px) scale(${1 + sectionProgress * 0.06})`,
                  }}
                />
                <div
                  className="opacity-40 transition-all duration-500"
                  style={{
                    background: `radial-gradient(40% 40% at 50% 60%, ${currentProduct.accent}, transparent)`,
                  }}
                />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="text-white/90 text-sm sm:text-base lg:text-lg font-semibold">
                    {currentProduct.name.split(" ")[0]}
                  </div>
                  <div
                    className="h-1 rounded-full"
                    style={{
                      width: `${64 + sectionProgress * 32}px`,
                      backgroundColor: currentProduct.accent,
                      boxShadow: `0 0 20px ${currentProduct.accent}`,
                    }}
                  />
                </div>
              </div>

              {/* Orbiting accents */}
              <div className="absolute -inset-20 pointer-events-none">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full transition-all duration-300"
                    style={{
                      width: `${6 + Math.sin(scrollY * Math.PI * 8 + i) * 3}px`,
                      height: `${
                        6 + Math.sin(scrollY * Math.PI * 8 + i) * 3
                      }px`,
                      backgroundColor: currentProduct.accent,
                      left: `${
                        50 +
                        Math.cos(scrollY * Math.PI * 6 + i * (Math.PI / 5)) * 45
                      }%`,
                      top: `${
                        50 +
                        Math.sin(scrollY * Math.PI * 6 + i * (Math.PI / 5)) * 45
                      }%`,
                      opacity: 0.5 + Math.sin(scrollY * Math.PI * 10 + i) * 0.4,
                      transform: `scale(${
                        0.3 + Math.sin(scrollY * Math.PI * 12 + i) * 0.6
                      })`,
                      filter: "blur(0.2px)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-center">
          <div
            className="mb-2 text-sm font-light transition-all duration-500"
            style={{
              transform: `translateY(${
                Math.sin(scrollY * Math.PI * 16) * 5
              }px)`,
            }}
          >
            Scroll to explore
          </div>
          <div className="w-1 h-16 bg-white/20 rounded-full mx-auto overflow-hidden">
            <div
              className="w-full rounded-full transition-all duration-300"
              style={{
                height: `${scrollY * 100}%`,
                backgroundColor: currentProduct.accent,
                boxShadow: `0 0 10px ${currentProduct.accent}`,
              }}
            />
          </div>
        </div>

        {/* Watermark */}
        {/* <div
          className="absolute top-8 left-8 text-white/40 font-light text-sm transition-all duration-500"
          style={{ transform: `translateX(${Math.sin(scrollY * Math.PI * 8) * 10}px)` }}
        >
          Premium Watch Collection
        </div> */}

        {/* Counter */}
        {/* <div className="absolute top-8 right-8 text-white/60 font-mono text-lg">
          <span style={{ color: currentProduct.accent }}>{String(activeProduct + 1).padStart(2, '0')}</span>
          <span className="text-white/30"> / 05</span>
        </div> */}
      </div>
    </div>
  );
};

export default Hero;
