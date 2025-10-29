import { useEffect, useState } from "react";

export default function Cart() {
  const [cart, setCart] = useState([]);

  // ✅ Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // ✅ Remove item
  const handleRemove = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // ✅ Calculate total
  const totalPrice = cart.reduce((sum, item) => sum + item.total_price, 0);

  if (cart.length === 0)
    return (
      <div className="text-center py-20 text-gray-700">
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty 🛒</h2>
        <p>Add some luxury watches to your cart!</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-center bg-white border border-gray-200 rounded-lg shadow-md p-4 gap-4"
          >
            {/* Image */}
            <img
              src={item.image}
              alt={item.title}
              className="w-32 h-32 object-cover rounded-lg"
            />

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-gray-600 text-sm mt-1">
                <span className="font-medium">Base Price:</span> ₹
                {item.base_price}
              </p>

              {/* Selected Customizations */}
              <div className="text-sm text-gray-700 mt-2 space-y-1">
                {item.selectedOptions.color && (
                  <p>
                    🎨 <span className="font-medium">Color:</span>{" "}
                    {item.selectedOptions.color.name} (+₹
                    {item.selectedOptions.color.extra})
                  </p>
                )}
                {item.selectedOptions.back && (
                  <p>
                    ⚙️ <span className="font-medium">Back Type:</span>{" "}
                    {item.selectedOptions.back.name} (+₹
                    {item.selectedOptions.back.extra})
                  </p>
                )}
                {item.selectedOptions.wrist && (
                  <p>
                    ⌚ <span className="font-medium">Wrist Style:</span>{" "}
                    {item.selectedOptions.wrist.name} (+₹
                    {item.selectedOptions.wrist.extra})
                  </p>
                )}
              </div>

              <p className="text-indigo-600 font-semibold mt-2">
                Total: ₹{item.total_price.toLocaleString()}
              </p>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => handleRemove(item.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Total Summary */}
      <div className="text-right mt-8">
        <h3 className="text-2xl font-semibold">
          Grand Total: ₹{totalPrice.toLocaleString()}
        </h3>
        <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
