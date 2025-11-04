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
  };

  // ✅ Update quantity
  const updateQuantity = (cartItemId, newQty) => {
    if (newQty < 1) return;
    const updatedCart = cart.map((item) =>
      item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // ✅ Proceed to checkout
  const handleCheckout = () => {
    if (cart.length === 0) return alert("Your cart is empty!");
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Your cart is empty 🛒
        </h2>
        <button
          onClick={() => navigate("/shop")}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Go to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>

        {/* Cart Items */}
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.cartItemId}
              className="flex flex-col sm:flex-row items-center justify-between border-b pb-4"
            >
              {/* Left: Image + Info */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <div>
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="text-gray-600 text-sm">₹{item.total_price}</p>

                  {/* Show selected customizations */}
                  {item.selectedOptions?.color && (
                    <p className="text-xs text-gray-500">
                      🎨 Color: {item.selectedOptions.color.name}
                    </p>
                  )}
                  {item.selectedOptions?.back && (
                    <p className="text-xs text-gray-500">
                      ⚙️ Back: {item.selectedOptions.back.name}
                    </p>
                  )}
                  {item.selectedOptions?.wrist && (
                    <p className="text-xs text-gray-500">
                      ⌚ Wrist: {item.selectedOptions.wrist.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Quantity & Remove */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.cartItemId, item.quantity - 1)
                    }
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 font-bold"
                  >
                    −
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.cartItemId, item.quantity + 1)
                    }
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.cartItemId)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total + Checkout */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center border-t pt-4">
          <p className="text-lg font-semibold">
            Total: ₹{total.toLocaleString()}
          </p>
          <button
            onClick={handleCheckout}
            className="mt-4 sm:mt-0 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
