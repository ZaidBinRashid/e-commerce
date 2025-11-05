import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  // ✅ Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // ✅ Recalculate total on changes
  useEffect(() => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.total_price * item.quantity,
      0
    );
    setTotal(subtotal);
  }, [cart]);

  // ✅ Remove specific variant using cartItemId
  const removeItem = (cartItemId) => {
    const updatedCart = cart.filter((item) => item.cartItemId !== cartItemId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ✅ Update quantity
  const updateQuantity = (cartItemId, newQty) => {
    if (newQty < 1) return;
    const updatedCart = cart.map((item) =>
      item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ✅ Proceed to checkout
  const handleCheckout = () => {
    if (cart.length === 0) return alert("Your cart is empty!");
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center space-y-6">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center shadow-xl">
            <svg
              className="w-16 h-16 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-light text-gray-900">
            Your cart is empty
          </h2>
          <p className="text-gray-600">
            Discover our collection of luxury timepieces
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="inline-block bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-medium px-8 py-3 rounded-full hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl"
          >
            Browse Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-light tracking-tight text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Left Column */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.cartItemId}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-xl overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xl font-light text-gray-900">
                        ₹{item.total_price.toLocaleString()}
                      </p>
                    </div>

                    {/* Customizations */}
                    {(item.selectedOptions?.color ||
                      item.selectedOptions?.back ||
                      item.selectedOptions?.wrist) && (
                      <div className="space-y-1">
                        {item.selectedOptions?.color && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center">
                              🎨
                            </span>
                            <span>Color: {item.selectedOptions.color.name}</span>
                          </div>
                        )}
                        {item.selectedOptions?.back && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center">
                              ⚙️
                            </span>
                            <span>Back: {item.selectedOptions.back.name}</span>
                          </div>
                        )}
                        {item.selectedOptions?.wrist && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center">
                              ⌚
                            </span>
                            <span>Wrist: {item.selectedOptions.wrist.name}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Quantity Controls & Remove */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.cartItemId, item.quantity - 1)
                          }
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-900 font-bold transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-medium text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.cartItemId, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-900 font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl p-6 lg:sticky lg:top-8 space-y-6">
              <h2 className="text-xl font-medium text-white border-b border-slate-700 pb-4">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Shipping</span>
                  <span className="text-sm">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <div className="flex justify-between text-white text-lg font-semibold mb-6">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-medium py-4 rounded-full hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl"
                >
                  Proceed to Checkout
                </button>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <button
                  onClick={() => navigate("/shop")}
                  className="w-full text-slate-300 hover:text-white text-sm font-medium py-2 transition-colors"
                >
                  ← Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}