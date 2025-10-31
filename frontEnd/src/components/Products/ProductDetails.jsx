import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState("");
  const [selectedOptions, setSelectedOptions] = useState({
    color: null,
    back: null,
    wrist: null,
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/auth/product/${id}`
        );
        setProduct(res.data.product);
        setSelectedImage(`http://localhost:8080${res.data.product.images[0]}`);
        setTotalPrice(Number(res.data.product.base_price));
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ✅ Handle customization selections
  const handleSelect = (type, option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [type]: prev[type]?.id === option.id ? null : option,
    }));
  };

  // ✅ Recalculate total price whenever customization changes
  useEffect(() => {
    if (!product) return;

    const newPrice =
      Number(product.base_price) +
      (selectedOptions.color?.price_adjustment || 0) +
      (selectedOptions.back?.price_adjustment || 0) +
      (selectedOptions.wrist?.price_adjustment || 0);

    setTotalPrice(newPrice);
  }, [selectedOptions, product]);

  // ✅ Add to Cart
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Find same item (same id + same customizations)
    const existingItemIndex = cart.findIndex(
      (item) =>
        item.id === product.id &&
        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
    );

    if (existingItemIndex >= 0) {
      // If exists → update quantity
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Else → add new item
      const newItem = {
        id: product.id,
        title: product.title,
        base_price: product.base_price,
        total_price: totalPrice,
        selectedOptions,
        image: selectedImage,
        quantity, // ✅ added
      };
      cart.push(newItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    setAddedMessage("✅ Added to cart!");
    setTimeout(() => setAddedMessage(""), 2000);
  };

  if (loading)
    return (
      <p className="text-center text-gray-600 mt-10">Loading product...</p>
    );
  if (!product)
    return (
      <p className="text-center text-gray-600 mt-10">Product not found.</p>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-10 text-gray-800">
      {/* -------- Left: Image Slider -------- */}
      <div>
        <div className="w-full h-[400px] border rounded-lg overflow-hidden">
          <img
            src={selectedImage}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Thumbnails */}
        <div className="flex gap-3 mt-4 overflow-x-auto">
          {product.images.map((img, i) => (
            <img
              key={i}
              src={`http://localhost:8080${img}`}
              alt={`Image ${i + 1}`}
              className={`w-24 h-24 object-cover rounded-lg cursor-pointer border-2 ${
                selectedImage === `http://localhost:8080${img}`
                  ? "border-blue-600"
                  : "border-transparent"
              }`}
              onClick={() => setSelectedImage(`http://localhost:8080${img}`)}
            />
          ))}
        </div>
      </div>

      {/* -------- Right: Product Info -------- */}
      <div>
        <h1 className="text-3xl font-medium mb-3 mt-4 pl-1">{product.title}</h1>
        <div className=" bg-slate-800 text-white p-4 rounded-2xl">
          <p className="mb-4">{product.detailed_description}</p>
          <p className="text-lg font-medium mb-3">
            Brand:{" "}
            <span className="text-lg font-normal mb-3">{product.brand}</span>
          </p>
          <p className="text-lg font-medium mb-3">
            Wrist Size:{" "}
            <span className="text-lg font-normal mb-3">
              {product.wrist_size}
            </span>
          </p>
        </div>
        <div className="my-2 bg-amber-400 text-center px-4 py-2 rounded-3xl">
          <p className=" text-2xl font-medium">Customize</p>
        </div>
        {/* ---------- Colors ---------- */}
        {product.colors?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Colors:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {product.colors.map((color) => (
                <div
                  key={color.id}
                  onClick={() => handleSelect("color", color)}
                  className={`border rounded-lg p-2 cursor-pointer ${
                    selectedOptions.color?.id === color.id
                      ? "border-blue-600"
                      : "border-gray-300"
                  }`}
                >
                  <img
                    src={`http://localhost:8080${color.image}`}
                    alt={color.name}
                    className="w-full h-20 object-cover rounded mb-1"
                  />
                  <p className="text-sm font-medium">{color.name}</p>
                  <p className="text-xs text-gray-500">
                    +₹{color.price_adjustment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------- Back Types ---------- */}
        {product.back_types?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Back Types:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {product.back_types.map((back) => (
                <div
                  key={back.id}
                  onClick={() => handleSelect("back", back)}
                  className={`border rounded-lg p-2 cursor-pointer ${
                    selectedOptions.back?.id === back.id
                      ? "border-blue-600"
                      : "border-gray-300"
                  }`}
                >
                  <img
                    src={`http://localhost:8080${back.image}`}
                    alt={back.name}
                    className="w-full h-20 object-cover rounded mb-1"
                  />
                  <p className="text-sm font-medium">{back.name}</p>
                  <p className="text-xs text-gray-500">
                    +₹{back.price_adjustment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------- Wrists ---------- */}
        {product.wrists?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Wrist Styles:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {product.wrists.map((wrist) => (
                <div
                  key={wrist.id}
                  onClick={() => handleSelect("wrist", wrist)}
                  className={`border rounded-lg p-2 cursor-pointer ${
                    selectedOptions.wrist?.id === wrist.id
                      ? "border-blue-600"
                      : "border-gray-300"
                  }`}
                >
                  <img
                    src={`http://localhost:8080${wrist.image}`}
                    alt={wrist.name}
                    className="w-full h-20 object-cover rounded mb-1"
                  />
                  <p className="text-sm font-medium">{wrist.name}</p>
                  <p className="text-xs text-gray-500">
                    +₹{wrist.price_adjustment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            className="px-3 py-1 bg-gray-200 rounded text-lg font-bold"
          >
            −
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-16 text-center border rounded p-1"
            min="1"
          />
          <button
            onClick={() => setQuantity((prev) => prev + 1)}
            className="px-3 py-1 bg-gray-200 rounded text-lg font-bold"
          >
            +
          </button>
        </div>

        <p className="text-xl font-semibold  mb-6">
          ₹{totalPrice.toLocaleString()}
        </p>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full sm:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
        >
          Add to Cart
        </button>
        {addedMessage && (
          <p className="text-green-600 font-semibold mt-2">{addedMessage}</p>
        )}
      </div>
    </div>
  );
}
