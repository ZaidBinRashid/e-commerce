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

  // Ensure Razorpay SDK is loaded (if not in index.html)
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
      // 1) Create order on backend -> backend creates Razorpay order and saves local order
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
      // razorpay: { id, amount, currency }

      // 2) Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID ?? key,
        amount: razorpay.amount,
        currency: razorpay.currency,
        name: "Heritage Watches Co",
        description: "Order Payment",
        order_id: razorpay.id,
        // optional prefill
        prefill: {
          name: shippingInfo.full_name,
          email: shippingInfo.email,
          contact: shippingInfo.phone,
        },
        handler: async function (response) {
          try {
            // send only required fields explicitly
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (verifyRes.data.success) {
              // Save order info (optional)
              localStorage.removeItem("cart");

              // Show popup message
              const popup = document.createElement("div");
              popup.className =
                "fixed inset-0 flex items-center justify-center bg-slate-800 bg-opacity-50 z-50";
              popup.innerHTML = `
    <div class="bg-white rounded-2xl p-8 shadow-xl text-center max-w-sm w-full animate-fadeIn">
      <svg xmlns="http://www.w3.org/2000/svg" 
           class="w-14 h-14 text-green-500 mx-auto mb-3" 
           fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4" />
      </svg>
      <h2 class="text-xl font-semibold text-gray-800 mb-1">Thank you for shopping!</h2>
      <p class="text-gray-600 mb-5">Your order has been placed successfully 🎉</p>
      <p class="text-sm text-gray-500">Redirecting to home...</p>
    </div>
  `;
              document.body.appendChild(popup);

              // Animate fade-in
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

              // Redirect after 3 seconds
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
        theme: { color: "#4f46e5" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Create order error:", err.response?.data || err.message);
      alert("Failed to start payment");
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Checkout
      </h2>

      {/* Shipping Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          name="full_name"
          placeholder="Full name"
          value={shippingInfo.full_name}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          name="email"
          placeholder="Email"
          value={shippingInfo.email}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          name="phone"
          placeholder="Phone"
          value={shippingInfo.phone}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          name="address"
          placeholder="Address"
          value={shippingInfo.address}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:col-span-2"
        />
        <input
          name="city"
          placeholder="City"
          value={shippingInfo.city}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* State Dropdown */}
        <select
          name="state"
          value={shippingInfo.state}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

        <input
          name="pincode"
          placeholder="Pincode"
          value={shippingInfo.pincode}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Order Summary */}
      <div className="mt-8 bg-gray-50 p-5 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Order Summary
        </h3>
        <div className="flex justify-between text-gray-600 mb-2">
          <span>Items</span>
          <span>{cart.length}</span>
        </div>
        <div className="flex justify-between text-gray-600 mb-2">
          <span>Subtotal</span>
          <span>₹{(total - shippingCharge).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600 mb-2">
          <span>Shipping</span>
          <span>₹{shippingCharge}</span>
        </div>
        <div className="flex justify-between text-gray-900 font-semibold text-lg mt-3">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Proceed Button */}
      <button
        onClick={handleProceedToPayment}
        className="w-full mt-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors duration-300"
      >
        Proceed to Payment
      </button>
    </div>
  );
}
