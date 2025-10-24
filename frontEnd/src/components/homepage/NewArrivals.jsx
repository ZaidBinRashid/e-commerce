import React from "react";
import BlurText from "../UI/BlurText";

const handleAnimationComplete = () => {
  console.log("Animation completed!");
};

<BlurText
  text="Isn't this so cool?!"
  delay={150}
  animateBy="words"
  direction="top"
  onAnimationComplete={handleAnimationComplete}
  className="text-2xl mb-8"
/>;

const products = [
  {
    id: 1,
    name: "Citizen",
    price: "$99",
    image: "./watches/citizen.jpeg",
  },
  {
    id: 2,
    name: "Seiko",
    price: "$149",
    image: "./watches/seiko.jpeg",
  },
  {
    id: 3,
    name: "HMT",
    price: "$89",
    image: "./watches/Hmt.jpeg",
  },
  {
    id: 4,
    name: "Omega",
    price: "$129",
    image: "./watches/omega.jpg",
  },
];

const NewArrivals = () => {
  return (
    <section id="new-arrivals" className="w-full py-4 px-4 bg-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col items-center">

        <BlurText
          text="New Arrivals"
          delay={150}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className="text-3xl mb-4 font-bold"
        />

        <BlurText
          text="Check out the latest additions to our collection!"
          delay={150}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className="text-xl mb-8"
        />

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden group"
            >
              <div className="overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-gray-600 mt-1">{product.price}</p>
                <button className="mt-4 px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
