import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [shippingInfo, setShippingInfo] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [shippingCharge, setShippingCharge] = useState(0);
  const [total, setTotal] = useState(0);
  const FREE_SHIPPING_THRESHOLD = 2500;

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  useEffect(() => {
    const subtotal = cart.reduce(
      (sum, item) =>
        sum + (item.price ?? item.total_price ?? 0) * (item.quantity ?? 1),
      0
    );
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 100;
    setShippingCharge(shipping);
    setTotal(subtotal + shipping);
  }, [cart]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Ensure Razorpay SDK is loaded
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => console.log("Razorpay loaded");
    }
  }, []);

  const handleProceedToPayment = async () => {
    const allFilled = Object.values(shippingInfo).every(
      (v) => v && v.toString().trim() !== ""
    );
    if (!allFilled) {
      alert("Please fill all shipping details!");
      return;
    }
    if (!cart || cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      const createRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
        {
          ...shippingInfo,
          cart,
          total,
          shippingCharge,
        }
      );

      const { razorpay, orderId, key } = createRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID ?? key,
        amount: razorpay.amount,
        currency: razorpay.currency,
        name: "Heritage Watches Co",
        description: "Order Payment",
        order_id: razorpay.id,
        prefill: {
          name: shippingInfo.full_name,
          email: shippingInfo.email,
          contact: shippingInfo.phone,
        },
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (verifyRes.data.success) {
              localStorage.removeItem("cart");
              window.dispatchEvent(new Event("cartUpdated"));

              // Premium success popup
              const popup = document.createElement("div");
              popup.className =
                "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4";
              popup.innerHTML = `
    <div class="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md w-full animate-fadeIn">
      <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" 
             class="w-10 h-10 text-white" 
             fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 class="text-2xl font-light text-gray-900 mb-2">Order Confirmed!</h2>
      <p class="text-gray-600 mb-6">Thank you for your purchase. Your order has been placed successfully.</p>
      <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
        <p class="text-sm text-gray-500">Redirecting to home page...</p>
      </div>
    </div>
  `;
              document.body.appendChild(popup);

              const style = document.createElement("style");
              style.innerHTML = `
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out;
    }
  `;
              document.head.appendChild(style);

              setTimeout(() => {
                popup.remove();
                navigate("/");
              }, 3000);
            } else {
              alert("❌ Payment verification failed!");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Server verification failed");
          }
        },
        theme: { color: "#f59e0b" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Create order error:", err.response?.data || err.message);
      alert("Failed to start payment");
    }
  };

  const subtotal = total - shippingCharge;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-light tracking-tight text-gray-900 mb-2">
            Checkout
          </h1>
          <p className="text-gray-600">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Information - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <h2 className="text-xl font-medium text-gray-900 mb-6 border-b border-gray-100 pb-4">
                Shipping Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    name="full_name"
                    placeholder="John Doe"
                    value={shippingInfo.full_name}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={shippingInfo.email}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={shippingInfo.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    name="address"
                    placeholder="Street address, apartment, suite, etc."
                    value={shippingInfo.address}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    name="city"
                    placeholder="City"
                    value={shippingInfo.city}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <select
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow bg-white"
                  >
                    <option value="">Select State</option>
                    {[
                      "Andhra Pradesh",
                      "Arunachal Pradesh",
                      "Assam",
                      "Bihar",
                      "Chhattisgarh",
                      "Goa",
                      "Gujarat",
                      "Haryana",
                      "Himachal Pradesh",
                      "Jharkhand",
                      "Karnataka",
                      "Kerala",
                      "Madhya Pradesh",
                      "Maharashtra",
                      "Manipur",
                      "Meghalaya",
                      "Mizoram",
                      "Nagaland",
                      "Odisha",
                      "Punjab",
                      "Rajasthan",
                      "Sikkim",
                      "Tamil Nadu",
                      "Telangana",
                      "Tripura",
                      "Uttar Pradesh",
                      "Uttarakhand",
                      "West Bengal",
                      "Andaman and Nicobar Islands",
                      "Chandigarh",
                      "Dadra and Nagar Haveli and Daman and Diu",
                      "Delhi",
                      "Jammu and Kashmir",
                      "Ladakh",
                      "Lakshadweep",
                      "Puducherry",
                    ].map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode
                  </label>
                  <input
                    name="pincode"
                    placeholder="123456"
                    value={shippingInfo.pincode}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow"
                  />
                </div>
              </div>
            </div>

            {/* Free Shipping Banner */}
            {subtotal < FREE_SHIPPING_THRESHOLD && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <p className="text-sm text-amber-800">
                  <span className="font-medium">Almost there!</span> Add ₹
                  {(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()} more to
                  get free shipping.
                </p>
              </div>
            )}
            {subtotal >= FREE_SHIPPING_THRESHOLD && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                <p className="text-sm text-green-800 font-medium">
                  🎉 You qualify for free shipping!
                </p>
              </div>
            )}
          </div>

          {/* Order Summary - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl p-6 lg:sticky lg:top-8 space-y-6">
              <h2 className="text-xl font-medium text-white border-b border-slate-700 pb-4">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex gap-3 text-slate-300"
                  >
                    <div className="w-12 h-12 bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm text-white font-medium truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm text-white flex-shrink-0">
                      ₹{((item.price ?? item.total_price ?? 0) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-700">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Shipping</span>
                  <span className={shippingCharge === 0 ? "text-green-400" : ""}>
                    {shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <div className="flex justify-between text-white text-xl font-semibold mb-6">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>

                <button
                  onClick={handleProceedToPayment}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-medium py-4 rounded-full hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl"
                >
                  Complete Payment
                </button>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <button
                  onClick={() => navigate("/cart")}
                  className="w-full text-slate-300 hover:text-white text-sm font-medium py-2 transition-colors"
                >
                  ← Back to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}