import { useEffect, useState, useRef } from "react";
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
  const thumbnailContainerRef = useRef(null);

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

  // ✅ Auto-scroll thumbnails to selected image
  const handleImageSelect = (img, index) => {
    setSelectedImage(`http://localhost:8080${img}`);
    
    if (thumbnailContainerRef.current) {
      const container = thumbnailContainerRef.current;
      const thumbnail = container.children[index];
      if (thumbnail) {
        const containerWidth = container.offsetWidth;
        const thumbnailLeft = thumbnail.offsetLeft;
        const thumbnailWidth = thumbnail.offsetWidth;
        const scrollPosition = thumbnailLeft - (containerWidth / 2) + (thumbnailWidth / 2);
        
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  // ✅ Add to Cart
  const handleAddToCart = () => {
    if (!product.in_stock) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItemIndex = cart.findIndex(
      (item) =>
        item.id === product.id &&
        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
    );

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      const newItem = {
        id: product.id,
        title: product.title,
        base_price: product.base_price,
        total_price: totalPrice,
        selectedOptions,
        image: selectedImage,
        quantity,
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    );
  if (!product)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-gray-400 text-lg">Product not found</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* -------- Left: Image Gallery -------- */}
          <div className="space-y-4">
            <div className="aspect-square w-full bg-white rounded-2xl overflow-hidden shadow-lg">
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails with auto-scroll */}
            <div 
              ref={thumbnailContainerRef}
              className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => handleImageSelect(img, i)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all shadow-md ${
                    selectedImage === `http://localhost:8080${img}`
                      ? "ring-2 ring-black ring-offset-2 ring-offset-gray-100"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={`http://localhost:8080${img}`}
                    alt={`View ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* -------- Right: Product Info -------- */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h1 className="text-3xl lg:text-4xl font-light tracking-tight text-gray-900 mb-3">
                {product.title}
              </h1>
              <p className="text-3xl font-light text-gray-900">
                ₹{totalPrice.toLocaleString()}
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-lg space-y-4">
              <p className="text-slate-200 leading-relaxed">
                {product.detailed_description}
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">Brand</p>
                  <p className="text-white font-medium">{product.brand}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">Wrist Size</p>
                  <p className="text-white font-medium">{product.wrist_size}</p>
                </div>
              </div>
            </div>

            {/* ---------- Customization Section ---------- */}
            {(product.colors?.length > 0 || product.back_types?.length > 0 || product.wrists?.length > 0) && (
              <div className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
                <h2 className="text-sm uppercase tracking-wider text-gray-400 font-semibold border-b border-gray-100 pb-3">
                  Customize Your Watch
                </h2>

                {/* Colors */}
                {product.colors?.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-900">Color</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {product.colors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => handleSelect("color", color)}
                          className={`group relative rounded-xl overflow-hidden transition-all ${
                            selectedOptions.color?.id === color.id
                              ? "ring-2 ring-amber-500 ring-offset-2"
                              : "hover:ring-2 hover:ring-gray-300"
                          }`}
                        >
                          <div className="aspect-square bg-gray-100">
                            <img
                              src={`http://localhost:8080${color.image}`}
                              alt={color.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                            <p className="text-xs font-medium text-white">{color.name}</p>
                            <p className="text-xs text-amber-300">+₹{color.price_adjustment}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Back Types */}
                {product.back_types?.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-900">Back Type</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {product.back_types.map((back) => (
                        <button
                          key={back.id}
                          onClick={() => handleSelect("back", back)}
                          className={`group relative rounded-xl overflow-hidden transition-all ${
                            selectedOptions.back?.id === back.id
                              ? "ring-2 ring-amber-500 ring-offset-2"
                              : "hover:ring-2 hover:ring-gray-300"
                          }`}
                        >
                          <div className="aspect-square bg-gray-100">
                            <img
                              src={`http://localhost:8080${back.image}`}
                              alt={back.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                            <p className="text-xs font-medium text-white">{back.name}</p>
                            <p className="text-xs text-amber-300">+₹{back.price_adjustment}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Wrists */}
                {product.wrists?.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-900">Wrist Style</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {product.wrists.map((wrist) => (
                        <button
                          key={wrist.id}
                          onClick={() => handleSelect("wrist", wrist)}
                          className={`group relative rounded-xl overflow-hidden transition-all ${
                            selectedOptions.wrist?.id === wrist.id
                              ? "ring-2 ring-amber-500 ring-offset-2"
                              : "hover:ring-2 hover:ring-gray-300"
                          }`}
                        >
                          <div className="aspect-square bg-gray-100">
                            <img
                              src={`http://localhost:8080${wrist.image}`}
                              alt={wrist.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                            <p className="text-xs font-medium text-white">{wrist.name}</p>
                            <p className="text-xs text-amber-300">+₹{wrist.price_adjustment}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-900 font-bold"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-16 text-center border border-gray-200 rounded-lg py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-900 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className={`w-full py-4 rounded-full font-medium transition-all ${
                  product.in_stock
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 hover:from-amber-500 hover:to-amber-600 shadow-lg hover:shadow-xl"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {product.in_stock ? "Add to Cart" : "Out of Stock"}
              </button>

              {addedMessage && (
                <div className="text-center bg-green-50 border border-green-200 rounded-lg py-2">
                  <p className="text-sm text-green-700 font-medium">
                    {addedMessage}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}