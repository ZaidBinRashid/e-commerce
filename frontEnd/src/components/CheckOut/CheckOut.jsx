import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export default function CheckOut() {
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
  const FREE_SHIPPING_THRESHOLD = 2500; // Free shipping above ₹2500

  // ✅ Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // ✅ Calculate total and shipping
  useEffect(() => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.total_price * item.quantity,
      0
    );
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 100;
    setShippingCharge(shipping);
    setTotal(subtotal + shipping);
  }, [cart]);

  // ✅ Handle input change
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
    // 🧠 Auto-detect City and State when 6-digit PIN is entered
    if (name === "pincode" && value.length === 6) {
      try {
        const res = await axios.get(
          `https://api.postalpincode.in/pincode/${value}`
        );
        const data = res.data[0];
        if (data.Status === "Success" && data.PostOffice?.length > 0) {
          const { District, State } = data.PostOffice[0];
          setShippingInfo((prev) => ({
            ...prev,
            city: District,
            state: State,
          }));
        } else {
          alert("❌ Invalid Pincode");
        }
      } catch (err) {
        console.error(err);
        alert("⚠️ Failed to fetch location for this pincode");
      }
    }
  };

  // ✅ Proceed to payment
  const handleProceedToPayment = async () => {
    // const allFilled = Object.values(shippingInfo).every((v) => v.trim() !== "");
    // if (!allFilled) return alert("Please fill all shipping details!");

    // localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));
    // navigate("/payment"); // we'll make Payment.jsx next
      const allFilled = Object.values(shippingInfo).every((v) => v.trim() !== "");
  if (!allFilled) return alert("Please fill all shipping details!");

  try {
    const res = await axios.post("http://localhost:8080/api/orders/create", {
      ...shippingInfo,
      cart,
      total,
      shippingCharge,
    }, {
      headers: { "Content-Type": "application/json" },
    });

    if (res.data.success) {
      alert("✅ Order placed successfully!");
      localStorage.removeItem("cart");
      navigate("/thankyou"); // or show confirmation page
    }
  } catch (err) {
    console.error(err);
    alert("❌ Failed to place order");
  }
  };

  // 🧭 State dropdown (optional for manual selection)
  const indianStates = [
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
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md grid md:grid-cols-2 gap-8">
        {/* Left: Shipping Info */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
          <form className="space-y-3">
            <input
              name="full_name"
              value={shippingInfo.full_name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="email"
              type="email"
              value={shippingInfo.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="phone"
              value={shippingInfo.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="address"
              value={shippingInfo.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="city"
              value={shippingInfo.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />

            {/* State Dropdown */}
            <select
              name="state"
              value={shippingInfo.state}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select State</option>
              {indianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            <input
              name="pincode"
              value={shippingInfo.pincode}
              onChange={handleChange}
              placeholder="Pincode"
              maxLength="6"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </form>

          <button
            onClick={handleProceedToPayment}
            className="mt-5 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Proceed to Payment
          </button>
        </div>
        {/* Right: Order Summary */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

          {cart.length === 0 ? (
            <p>No items in your cart.</p>
          ) : (
            <>
              <ul className="space-y-4 mb-4">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="border-b pb-3 text-sm flex flex-col gap-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.title}</span>
                      <span>
                        ₹{item.base_price} × {item.quantity}
                      </span>
                    </div>

                    {/* Optional customizations */}
                    {item.selectedOptions?.color && (
                      <p>
                        🎨 <span className="font-medium">Color:</span>{" "}
                        {item.selectedOptions.color.name} (+₹
                        {item.selectedOptions.color.price_adjustment})
                      </p>
                    )}
                    {item.selectedOptions?.back && (
                      <p>
                        ⚙️ <span className="font-medium">Back Type:</span>{" "}
                        {item.selectedOptions.back.name} (+₹
                        {item.selectedOptions.back.price_adjustment})
                      </p>
                    )}
                    {item.selectedOptions?.wrist && (
                      <p>
                        ⌚ <span className="font-medium">Wrist Style:</span>{" "}
                        {item.selectedOptions.wrist.name} (+₹
                        {item.selectedOptions.wrist.price_adjustment})
                      </p>
                    )}
                  </li>
                ))}
              </ul>

              <div className="border-t pt-3 space-y-1 text-sm">
                <p>Subtotal: ₹{total - shippingCharge}</p>
                <p>
                  Shipping:{" "}
                  {shippingCharge === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `₹${shippingCharge}`
                  )}
                </p>
                <p className="font-bold text-lg">Total: ₹{total}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
