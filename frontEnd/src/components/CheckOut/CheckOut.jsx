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
    const subtotal = cart.reduce((sum, item) => sum + (item.price ?? item.total_price ?? 0) * (item.quantity ?? 1), 0);
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
    const allFilled = Object.values(shippingInfo).every((v) => v && v.toString().trim() !== "");
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
      const createRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/create-order`, {
        ...shippingInfo,
        cart,
        total,
        shippingCharge,
      });

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
            const verifyRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              // clear cart on successful verification
              localStorage.removeItem("cart");
              // navigate to thank you page
              navigate("/thankyou");
            } else {
              alert("Payment verification failed: " + (verifyRes.data.message || ""));
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
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <h2>Checkout</h2>

      <div>
        <input name="full_name" placeholder="Full name" value={shippingInfo.full_name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={shippingInfo.email} onChange={handleChange} />
        <input name="phone" placeholder="Phone" value={shippingInfo.phone} onChange={handleChange} />
        <input name="address" placeholder="Address" value={shippingInfo.address} onChange={handleChange} />
        <input name="city" placeholder="City" value={shippingInfo.city} onChange={handleChange} />
        <input name="state" placeholder="State" value={shippingInfo.state} onChange={handleChange} />
        <input name="pincode" placeholder="Pincode" value={shippingInfo.pincode} onChange={handleChange} />
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Order Summary</h3>
        <p>Items: {cart.length}</p>
        <p>Subtotal: ₹{(total - shippingCharge).toFixed(2)}</p>
        <p>Shipping: ₹{shippingCharge}</p>
        <p>Total: ₹{total.toFixed(2)}</p>
      </div>

      <button onClick={handleProceedToPayment} style={{ marginTop: 20 }}>
        Proceed to Payment
      </button>
    </div>
  );
}
