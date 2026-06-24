import { Maximize2, RefreshCcw } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';

// --- Type Definitions ---
interface CartItemType {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  quantity: number;
  discount: number;
  image: string;
}

// --- Prop Types ---
interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (id: number, newQuantity: number) => void;
  onRemove: (id: number) => void;
}

interface OrderSummaryProps {
  subtotal: number;
  onOpenDetails: () => void;
}

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItemType[];
}


// --- Helper Components ---

// Icon for the remove button
const RemoveIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Icon for the back to shop button
const BackArrowIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

// Icon for the modal close button
const CloseIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);


// --- Main Components ---

// Represents a single item in the shopping cart
const CartItem: React.FC<CartItemProps> = ({ item, onQuantityChange, onRemove }) => {
  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      {/* Product Image & Name */}
      <div className="flex items-center w-5/12 ps-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-md mr-4"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = 'https://placehold.co/80x80/e2e8f0/a0aec0?text=Image';
          }}
        />
        <span className="font-medium text-gray-800">{item.name}</span>
      </div>

      {/* Price */}
      <div className="w-2/12 text-center">
        <span className="font-semibold text-red-500">LKR {item.price}</span><br />
        {item.oldPrice && <span className="text-gray-400 line-through ml-2 text-sm">LKR {item.oldPrice}</span>}
      </div>

      {/* Quantity Selector */}
      <div className="w-2/12 flex justify-center items-center">
        <div className="flex items-center border border-gray-300 rounded-md">
          <button onClick={() => onQuantityChange(item.id, item.quantity - 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md">-</button>
          <input type="text" value={item.quantity} readOnly className="w-10 text-center border-l border-r border-gray-300" />
          <button onClick={() => onQuantityChange(item.id, item.quantity + 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md">+</button>
        </div>
      </div>

      {/* Total */}
      <div className="w-2/12 text-center font-semibold text-red-500">
        LKR {(item.price * item.quantity).toFixed(2)}
      </div>

      {/* Remove Button */}
      <div className="w-1/12 text-right pr-4">
        <button onClick={() => onRemove(item.id)}>
          <RemoveIcon />
        </button>
      </div>
    </div>
  );
};

// Represents the order summary section
const OrderSummary: React.FC<OrderSummaryProps> = ({ subtotal, onOpenDetails }) => {
  const shipping = subtotal > 0 ? 500.00 : 0;
  const total = subtotal + shipping;

  return (
    <div className="w-full lg:w-1/3 bg-gray-50 p-6 rounded-lg self-start">
      <h2 className="text-xl font-semibold mb-4 text-center">Order Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>LKR {subtotal.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 my-2"></div>
        <div className="flex justify-between items-center text-xl font-bold text-gray-900">
          <span>Total</span>
          <span className="text-red-500">LKR {total.toFixed(2)}</span>
        </div>
        <p className="text-xs text-gray-500 text-right">(Shipping fees included)</p>
      </div>
      <a href={total > 0 ? "/product/cart/checkout" : "#"}>
        <button className="cursor-pointer w-full mt-6 bg-lime-500 text-white py-3 rounded-lg font-semibold hover:bg-lime-600 transition-colors">
          Proceed to checkout
        </button>
      </a>
      <button
        onClick={onOpenDetails}
        className="flex justify-center cursor-pointer w-full mt-4 bg-white text-lime-600 border border-lime-500 py-2 rounded-lg font-semibold hover:bg-lime-50 transition-colors"
      >
        <Maximize2 className='mr-2.5' />
        Full Order Details
      </button>
      <div className="mt-6">
        <details className="group">
          <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
            <span>Coupon Discount</span>
            <span className="transition group-open:rotate-180">
              <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
            </span>
          </summary>
          <div className="mt-4">
            <input type="text" placeholder="Enter coupon code" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500" />
            <button className="w-full mt-2 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors">
              Apply
            </button>
          </div>
        </details>
      </div>
    </div>
  );
};

// Represents the modal for full order details
const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ isOpen, onClose, cartItems }) => {
  if (!isOpen) return null;

  const subtotalWithDiscount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const subtotalWithoutDiscount = cartItems.reduce((acc, item) => acc + (item.oldPrice || item.price) * item.quantity, 0);
  const totalDiscount = subtotalWithoutDiscount - subtotalWithDiscount;
  const deliveryFee = 500.00;
  const total = subtotalWithDiscount + deliveryFee;

  return (
    // The overlay div now has a backdrop blur effect
    <div
      className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 bg-lime-500 text-white rounded-t-lg">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <button onClick={onClose} className="hover:bg-lime-600 p-1 rounded-full"><CloseIcon /></button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <span className="px-3 py-1 text-sm bg-blue-500 text-white rounded-full">Site Discount</span>
            <span className="px-3 py-1 text-sm bg-red-500 text-white rounded-full">Coupen Discount</span>
            <span className="px-3 py-1 text-sm bg-yellow-500 text-black rounded-full">Bank Discount</span>
          </div>

          {/* Items Header */}
          <div className="flex text-sm font-semibold text-gray-600 border-b pb-2">
            <div className="w-1/12">#</div>
            <div className="w-5/12">Item Description</div>
            <div className="w-3/12 text-right">Discount</div>
            <div className="w-3/12 text-right">Total</div>
          </div>

          {/* Items List */}
          <div className="space-y-4 mt-4">
            {cartItems.map((item, index) => {
              const itemDiscount = ((item.oldPrice || item.price) - item.price) * item.quantity;
              return (
                <div key={item.id} className="flex items-start border-b pb-4">
                  <div className="w-1/12">{index + 1}</div>
                  <div className="w-5/12">
                    <p className="font-medium">{item.name}</p>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">-{item.discount}%</span>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.oldPrice && <span className="line-through">LKR {item.oldPrice}</span>} LKR {item.price} x {item.quantity}
                    </p>
                  </div>
                  <div className="w-3/12 text-right font-medium">LKR {itemDiscount.toFixed(2)}</div>
                  <div className="w-3/12 text-right font-medium">LKR {(item.price * item.quantity).toFixed(2)}</div>
                </div>
              );
            })}
          </div>

          {/* Totals Section */}
          <div className="mt-6 space-y-4">
            <div className="flex justify-end items-center border-b pb-4">
              <div className="w-7/12 text-left font-semibold">Subtotal and Discount</div>
              <div className="w-3/12 text-right font-semibold">LKR {totalDiscount.toFixed(2)}</div>
              <div className="w-3/12 text-right">
                <p className="font-semibold">LKR {subtotalWithDiscount.toFixed(2)}</p>
                <p className="font-semibold line-through text-gray-500 text-sm">LKR {subtotalWithoutDiscount.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Delivery fee</span>
              <span className="font-medium">LKR {deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-xl font-bold border-t pt-4">
              <span>Total</span>
              <span>LKR {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-red-600 font-bold border-t pt-4">
              <span>Your Total Saving on This Order</span>
              <span>LKR {totalDiscount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// The main component that renders the entire shopping cart page
const CartPage: React.FC = () => {
  let [cartItems, setCartItems] = useState<CartItemType[]>([]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  //update cart qty

  const updateCartQty = async (id: number, qty: number) => {
    try {
      const response = await fetch(`http://localhost:8080/techmart/UpdateCartQtyFromCart?id=${id}&qty=${qty}`, {
        method: "GET",
        credentials: "include"
      });

      if (response.ok) {
        const json = await response.json();
        if (json.status) {
          console.log(json.message);
          loadCartItems();
        } else {
          console.log(json.message);
          toast.error(json.message);
        }
      } else {
        console.log("UpdateCartQtyFromCart failed. Please try again");
        toast.error("UpdateCartQtyFromCart failed. Please try again");
      }
    } catch (error) {
      toast.error("Internal Server Error. Please try again later");
      console.error("UpdateCartQtyFromCart Error:", error);
    }
  };

  //update cart qty

  // Handler to change the quantity of an item
  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return; // Quantity cannot be less than 1

    updateCartQty(id, newQuantity);

  };

  // Handler to remove an item from the cart
  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    removeFromCart(id);
  };

  //cart item remove

  const removeFromCart = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/techmart/RemoveFromCart?id=${id}`, {
        method: "GET",
        credentials: "include"
      });

      if (response.ok) {
        const json = await response.json();
        if (json.status) {
          console.log(json.message);
          toast.success(json.message);
        } else {
          console.log(json.message);
          toast.error(json.message);
        }
      } else {
        console.log("removeFromCart failed. Please try again");
        toast.error("removeFromCart failed. Please try again");
      }
    } catch (error) {
      toast.error("Internal Server Error. Please try again later");
      console.error("removeFromCart Error:", error);
    }
  };

  //cart item remove

  // Calculate subtotal using useMemo for efficiency
  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const saveTempCarts = async () => {
    try {
      const response = await fetch(`http://localhost:8080/techmart/SaveTempCart`, {
        method: "GET",
        credentials: "include"
      });

      if (response.ok) {
        const json = await response.json();
        if (json.status) {
          console.log("Temp Carts Saved");
        } else {
          console.log(json.message);
          toast.error(json.message);
        }
      } else {
        console.log("SaveTempCart failed. Please try again");
        toast.error("SaveTempCart failed. Please try again");
      }
    } catch (error) {
      toast.error("Internal Server Error. Please try again later");
      console.error("SaveTempCart Error:", error);
    }
  };

  const loadCartItems = async () => {
      await saveTempCarts();
      try {
        const response = await fetch(`http://localhost:8080/techmart/LoadCartItems`, {
          method: "GET",
          credentials: "include"
        });

        if (response.ok) {
          const json = await response.json();
          if (json.status) {
            console.log(json);

            const items = json.cartItems.map((item: any) => ({
              id: item.product.id,
              name: item.product.title,
              price: item.stock.price.toFixed(2),
              oldPrice: (item.stock.price * 100 / (100 - item.product.discount)).toFixed(2),
              quantity: item.qty,
              discount: item.product.discount,
              image: `http://localhost:8080/techmart/product-images/${item.product.id}/image1.png`
            }));

            setCartItems(items);

          } else {
            console.log(json.message);
            toast.error(json.message);
          }
        } else {
          console.log("LoadCartItems failed. Please try again");
          toast.error("LoadCartItems failed. Please try again");
        }
      } catch (error) {
        toast.error("Internal Server Error. Please try again later");
        console.error("LoadCartItems Error:", error);
      }
    };

  useEffect(() => {
    loadCartItems();
  }, []);

  return (
    // Add a class to the main page container to be targeted by the modal state
    <div className={`bg-white min-h-screen font-sans flex items-center justify-center pt-20 ${isModalOpen ? 'overflow-hidden' : ''}`}>
      <div className="container mx-auto px-4 py-8 ">
        <h1 className="text-3xl font-bold text-center mb-8">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Cart Header */}
              <div className="flex items-center p-4 border-b border-gray-200 text-gray-500 font-medium">
                <div className="w-2/12"></div>
                <div className="w-3/12">Product's name</div>
                <div className="w-2/12 text-center">Price</div>
                <div className="w-2/12 text-center">Quantity</div>
                <div className="w-2/12 text-center">Total</div>
                <div className="w-1/12"></div>
              </div>

              {/* Cart Body */}
              <div>
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemoveItem}
                    />
                  ))
                ) : (
                  <p className="text-center py-8 text-gray-500">Your cart is empty.</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-6">
              <button onClick={() => { window.location.href = "/" }} className="cursor-pointer flex items-center bg-lime-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-lime-600 transition-colors">
                <BackArrowIcon />
                Back to Shop
              </button>
              <button onClick={() => { window.location.href = "/product/cart" }} className="flex cursor-pointer border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                <RefreshCcw className='mr-2.5' />
                Update cart
              </button>
            </div>
          </div>

          {/* Order Summary Section */}
          <OrderSummary subtotal={subtotal} onOpenDetails={() => setIsModalOpen(true)} />
        </div>
      </div>

      {/* Modal for Order Details */}
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cartItems={cartItems}
      />
    </div>
  );
}

export default CartPage;
