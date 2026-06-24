import { Gift } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { TECHMART_BASE_URL, DEFAULT_HEADERS } from '../api/client';

// --- Type Definitions ---

interface Address {
    id: string;
    addressType: string;
    fullName: string;
    addressLine1: string;
    city: string;
    postalCode: string;
    phone: string;
    email: string;
    cityObject?: City;
}

// Added this new interface for the form data state
interface AddressDetails {
    addressType: string;
    phone: string;
    fullName: string;
    addressLine1: string;
    city: string;
    postalCode: string;
}

interface OrderItem {
    id: number;
    name: string;
    originalPrice: number;
    discountedPrice: number;
    quantity: number;
    discount: number;
    total: number;
}

interface City {
    id: string;
    name: string;
}

// Updated props for the NewAddressForm
interface NewAddressFormProps {
    cities: City[];
    formData: AddressDetails;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}


interface OrderSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
}


// --- SVG Icon Components (No Changes)---

const ChevronDownIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 transform transition-transform group-hover:-rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

const ArrowUpRightIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
);

const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


// --- Placeholder Data (No Changes) ---

const cardLogos: string[] = ["HNB", "HSBC", "Nations Trust Bank", "NDB Bank", "SEYLAN BANK", "BOC CARDS", "PEOPLE'S BANK", "DFCC BANK", "Commercial Bank", "Anagi", "Cargills Bank", "CLUB VISION"];
// const orderItems: OrderItem[] = [
//     {
//         id: 1,
//         name: "Colour Me Happy - Fun for Little Kids",
//         originalPrice: 225.00,
//         discountedPrice: 180.00,
//         quantity: 2,
//         discount: 90.00,
//         total: 360.00
//     },
//     {
//         id: 2,
//         name: "Textliter - Pink & Orange (Blister Pack)",
//         originalPrice: 140.00,
//         discountedPrice: 112.00,
//         quantity: 3,
//         discount: 84.00,
//         total: 336.00
//     }];

let mockAddresses: Address[] = [
    {
        id: 'addr1',
        addressType: 'home',
        fullName: 'Dinuka Dilshan',
        addressLine1: 'No. 4/a Aluthgama, Dekinda, Nawalapitiya',
        city: 'Nawalapitiya',
        postalCode: '20650',
        phone: '0762078415',
        email: 'hirunikalpani28@gmail.com',
    },
    {
        id: 'addr2',
        addressType: 'home',
        fullName: 'Jane Doe',
        addressLine1: '123 Main Street',
        city: 'Colombo',
        postalCode: '20650',
        phone: '0771234567',
        email: 'jane.doe@example.com',
    }];

// --- Child Components ---



// MODIFIED: NewAddressForm is now a controlled component
const NewAddressForm: React.FC<NewAddressFormProps> = ({ cities, formData, handleChange }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" name="addressType" placeholder="Address Type (Eg : Home/Work)" value={formData.addressType} onChange={handleChange} className="p-3 border border-gray-300 rounded-md" />
            <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="p-3 border border-gray-300 rounded-md" />
            <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="p-3 border border-gray-300 rounded-md col-span-2" />
            <input type="text" name="addressLine1" placeholder="Address" value={formData.addressLine1} onChange={handleChange} className="p-3 border border-gray-300 rounded-md col-span-2" />
            <select name="city" value={formData.city} onChange={handleChange} className="p-3 border border-gray-300 rounded-md text-gray-500">
                <option value="0">Select a city</option>
                {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                        {city.name}
                    </option>
                ))}
            </select>
            <input type="text" name="postalCode" placeholder="PostalCode" value={formData.postalCode} onChange={handleChange} className="p-3 border border-gray-300 rounded-md" />
        </div>
    );
};


// --- Main Checkout Page Component (MODIFIED) ---
const CheckOutPage: React.FC = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    // const [addressList, setaddressList] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
    const [isGift, setIsGift] = useState<boolean>(false);
    const [isOrderModalOpen, setOrderModalOpen] = useState<boolean>(false);
    const [cities, setCities] = useState<City[]>([]);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);


    const totalDiscount = orderItems.reduce((acc, item) => acc + item.discount, 0);
    const subtotal = orderItems.reduce((acc, item) => acc + item.total, 0);
    const originalTotal = orderItems.reduce((acc, item) => acc + (item.originalPrice * item.quantity), 0);
    const deliveryFee = 500.00;
    const finalTotal = subtotal + deliveryFee;
    // OrderSummaryModal Component (No Changes)
    const OrderSummaryModal: React.FC<OrderSummaryModalProps> = ({ isOpen, onClose }) => {
        return (
            <div className={`fixed inset-0 z-50 flex justify-center items-center p-4 transition-all duration-300 ease-in-out ${isOpen ? 'visible backdrop-blur-xs shadow-2xl bg-black/30' : 'invisible bg-opacity-0 backdrop-blur-none'}`} onClick={onClose}>
                <div className={`bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                    <div className="bg-lime-400 p-4 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
                        <button onClick={onClose} className="text-gray-800 hover:text-black cursor-pointer"><CloseIcon /></button>
                    </div>
                    <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                        <div className="flex space-x-2">
                            <span className="bg-blue-500 text-white text-xs font-semibold px-2.5 py-1 rounded">Site Discount</span>
                            <span className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded">Coupen Discount</span>
                            <span className="bg-yellow-400 text-black text-xs font-semibold px-2.5 py-1 rounded">Bank Discount</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="border-b"><tr><th className="p-2">#</th><th className="p-2">Item Description</th><th className="p-2 text-right">Discount</th><th className="p-2 text-right">Total</th></tr></thead>
                                <tbody>{orderItems.map((item, index) => (<tr key={item.id} className="border-b"><td className="p-2">{index + 1}</td><td className="p-2"><p className="font-medium">{item.name}</p><span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">-20.00%</span><span className="line-through text-gray-500">LKR {item.originalPrice.toFixed(2)}</span><span className="text-gray-800"> LKR {item.discountedPrice.toFixed(2)} x {item.quantity}</span></td><td className="p-2 text-right">LKR {item.discount.toFixed(2)}</td><td className="p-2 text-right font-semibold">LKR {item.total.toFixed(2)}</td></tr>))}</tbody>
                            </table>
                        </div>
                        <div className="space-y-4">
                            <div className="flex w-12/12 items-center border-t pt-4"><span className="font-semibold">Subtotal and Discount</span>
                                <div className="w-6/12 text-right font-semibold">LKR {totalDiscount.toFixed(2)}</div>
                                <div className="w-3/12 text-right"><p className="font-bold text-xl">LKR {subtotal.toFixed(2)}</p><p className="line-through text-gray-500">LKR {originalTotal.toFixed(2)}</p></div>
                            </div>
                            <div className="flex justify-between items-center border-t pt-4"><span>Delivery fee</span><span>LKR {deliveryFee.toFixed(2)}</span></div>
                            <div className="flex justify-between items-center border-t pt-4 text-2xl font-bold"><span>Total</span><span>LKR {finalTotal.toFixed(2)}</span></div>
                            <div className="text-right text-red-600 font-bold border-t pt-4">Your Total Saving On This Order LKR {totalDiscount.toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // --- NEW: State Management for Address Forms ---
    const initialAddressState: AddressDetails = {
        addressType: '',
        phone: '',
        fullName: '',
        addressLine1: '',
        city: '0',
        postalCode: '',
    };

    const [selectedAddress, setSelectedAddress] = useState<AddressDetails>(initialAddressState);
    const [giftAddress, setGiftAddress] = useState({ ...initialAddressState, note: '' });

    // --- NEW: Handlers to update state on input change ---
    const handleSelectedAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSelectedAddress(prevState => ({ ...prevState, [name]: value }));
    };

    const handleGiftAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setGiftAddress(prevState => ({ ...prevState, [name]: value }));
    };

    const loadCityData = async () => {
        try {
            const response = await fetch(`${TECHMART_BASE_URL}/LoadCityData`, {
                method: "GET",
                credentials: "include",
                headers: {
                    ...DEFAULT_HEADERS,
                }
            });

            if (response.ok) {
                const json = await response.json();
                setCities(json);
            } else {
                console.log("City data load failed. Please try again");
                toast.error("City data load failed. Please try again");
            }
        } catch (error) {
            toast.error("Something wrong ! Please try again" + error);
            console.error("City data load Error:", error);
        }
    };

    const loadCartItems = async () => {
        try {
            const response = await fetch(`${TECHMART_BASE_URL}/LoadCartItems`, {
                method: "GET",
                credentials: "include",
                headers: {
                    ...DEFAULT_HEADERS,
                }
            });

            if (response.ok) {
                const json = await response.json();
                if (json.status) {
                    console.log(json);

                    const orderItems = json.cartItems.map((item: any) => ({
                        id: item.product.id,
                        name: item.product.title,
                        originalPrice: (item.stock.price * 100 / (100 - item.product.discount)),
                        discountedPrice: item.stock.price,
                        quantity: item.qty,
                        discount: Math.round((((item.stock.price * 100 / (100 - item.product.discount)) - item.stock.price) * item.qty)),
                        total: (item.qty * item.stock.price)
                    }));

                    setOrderItems(orderItems);

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

    const loadAddresses = async () => {

        try {
            const response = await fetch(`${TECHMART_BASE_URL}/SaveNewAddress`, {
                method: "GET",
                credentials: "include",
                headers: {
                    ...DEFAULT_HEADERS,
                }
            });

            if (response.ok) {
                const json = await response.json();

                if (json.addreassList) {
                    console.log("Addresses loaded successfully:", json.addreassList);

                    const addressList = json.addreassList.map((item: any) => ({
                        id: item.id,
                        addressType: item.type,
                        fullName: item.full_name,
                        addressLine1: item.address,
                        city: item.city.name,
                        postalCode: item.postal_code,
                        phone: item.mobile,
                        email: item.user.email,
                        cityObject: item.city
                    }));

                    mockAddresses = addressList;

                    setAddresses(mockAddresses);
                    if (mockAddresses.length > 0) {
                        setSelectedAddressId(mockAddresses[0].id);
                    }
                } else {
                    toast.warning("No addresses found.");
                    mockAddresses = [];
                }
            } else {
                console.log("Failed to load addresses");
                toast.error("Failed to load addresses");
            }
        } catch (error) {
            toast.error("Error connecting to server for get addresses");
            console.error("Address Load Error:", error);
        }
    };

    useEffect(() => {
        loadCartItems();
        loadCityData();
        loadAddresses();

    }, []);

    // --- In CheckOutPage.tsx ---

    useEffect(() => {
        if (selectedAddressId === 'new') {
            setSelectedAddress(initialAddressState);
        } else {
            const addressToSelect = addresses.find(addr => addr.id == selectedAddressId);
            if (addressToSelect) {
                // NEW: Find the city ID from the cities list based on the name
                const cityObject = cities.find(c => c.name === addressToSelect.city);
                const cityId = cityObject ? cityObject.id : ""; // Get id or default to empty string

                setSelectedAddress({
                    fullName: addressToSelect.fullName,
                    addressLine1: addressToSelect.addressLine1,
                    city: cityId, // Use the found city ID here
                    phone: addressToSelect.phone,
                    postalCode: addressToSelect.postalCode,
                    addressType: addressToSelect.addressType
                });
            }
        }
    }, [selectedAddressId, addresses, cities]); // Add 'cities' to the dependency array


    const displayedAddress = addresses.find(addr => addr.id == selectedAddressId);

    const checkOut = async () => {

        const payload = {
            deliveryAddress: selectedAddress,
            isGift: isGift,
            // Conditionally add giftAddress only if isGift is true
            ...(isGift && { giftAddress: giftAddress })
        };

        console.log("Sending to backend:", payload); // Good for debugging!

        try {
            const response = await fetch(`${TECHMART_BASE_URL}/CheckOut`, {
                method: "POST",
                credentials: "include",
                headers: {
                    ...DEFAULT_HEADERS,
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const json = await response.json();
                if (json.status) {
                    toast.success(json.message);
                    console.log(json.message);
                    window.location.href = "/product/cart";
                } else {
                    console.log(json.message);
                    toast.error(json.message);
                }
            } else {
                console.log("Checkout failed. Please try again");
                toast.error("Checkout failed. Please try again");
            }
        } catch (error) {
            toast.error("Error connecting to server");
            console.error("Checkout Error:", error);
        }
    };

    window.payhere.onCompleted = function onCompleted(orderId: any) {
        toast.success("Payment completed. OrderID:" + orderId);
        checkOut();
    };

    // Payment window closed
    window.payhere.onDismissed = function onDismissed() {
        // Note: Prompt user to pay again or show an error page
        console.log("Payment dismissed");
        toast.error("Payment dismissed");
    };

    // Error occurred
    window.payhere.onError = function onError(error: any) {
        // Note: show an error page
        console.log("Error:" + error);
        toast.error("Error:" + error);
    };

    const makePayment = async () => {

        const payload = {
            deliveryAddress: selectedAddress,
            isGift: isGift,
            // Conditionally add giftAddress only if isGift is true
            ...(isGift && { giftAddress: giftAddress })
        };

        console.log("Sending to backend:", payload); // Good for debugging!

        try {
            const response = await fetch(`${TECHMART_BASE_URL}/MakePayment`, {
                method: "POST",
                credentials: "include",
                headers: {
                    ...DEFAULT_HEADERS,
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const json = await response.json();
                if (json.status) {
                    // PayHere Process
                    window.payhere.startPayment(json.payhereJson);
                } else {
                    console.log(json.message);
                    toast.error(json.message);
                }
            } else {
                console.log("Payment failed. Please try again");
                toast.error("Payment failed. Please try again");
            }
        } catch (error) {
            toast.error("Error connecting to server");
            console.error("Payment Error:", error);
        }
    };

    return (
        <>
            <div className="bg-gray-50 font-sans min-h-screen pt-20">
                <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <div className="bg-lime-400 p-4 flex justify-between items-center cursor-pointer group">
                                    <h2 className="text-lg font-semibold text-gray-800">Delivery information</h2>
                                    <ChevronDownIcon />
                                </div>
                                <div className="p-6 space-y-6">
                                    <div>
                                        <label htmlFor="address-select" className="block text-sm font-medium text-gray-700 mb-1">Select available addresses:</label>
                                        <select
                                            id="address-select"
                                            value={selectedAddressId}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedAddressId(e.target.value)}
                                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500 bg-white"
                                        >
                                            <option value="new">Add new address...</option>
                                            {addresses.map(addr => (
                                                <option key={addr.id} value={addr.id}>
                                                    {addr.addressLine1}, {addr.city}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedAddressId !== 'new' && displayedAddress ? (
                                        <div className="border-2 border-green-500 bg-green-50 p-4 rounded-md space-y-1">
                                            <div className="flex justify-between items-start">
                                                <p className="font-bold text-gray-800">{displayedAddress.fullName}</p>
                                            </div>
                                            <p className="text-gray-600 text-sm">{displayedAddress.addressLine1}</p>
                                            <p className="text-gray-600 text-sm">Phone: {displayedAddress.phone}</p>
                                            <p className="text-gray-600 text-sm">Email: {displayedAddress.email}</p>
                                        </div>
                                    ) : (
                                        <NewAddressForm
                                            cities={cities}
                                            formData={selectedAddress}
                                            handleChange={handleSelectedAddressChange}
                                        />
                                    )}

                                    <div>
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={isGift}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsGift(e.target.checked)}
                                                className="h-5 w-5 rounded border-gray-300 text-lime-600 shadow-sm focus:ring-lime-500 cursor-pointer"
                                            />
                                            <Gift className="h-5 w-5 text-lime-600" />
                                            <span className="text-gray-800 font-medium">This is a gift for someone.</span>
                                        </label>
                                    </div>
                                    {isGift && (
                                        <div className="border-t pt-6 space-y-4">
                                            <h3 className="text-md font-semibold text-gray-800">Gift Recipient's Details</h3>
                                            {/* MODIFIED: Gift address inputs are now controlled */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <input type="text" name="fullName" placeholder="Recipient's Full Name" value={giftAddress.fullName} onChange={handleGiftAddressChange} className="p-3 border border-gray-300 rounded-md col-span-2" />
                                                <input type="text" name="addressLine1" placeholder="Recipient's Address" value={giftAddress.addressLine1} onChange={handleGiftAddressChange} className="p-3 border border-gray-300 rounded-md col-span-2" />
                                                <select name="city" value={giftAddress.city} onChange={handleGiftAddressChange} className="p-3 border border-gray-300 rounded-md text-gray-500">
                                                    <option value="0">Select a city</option>
                                                    {cities.map((city) => (
                                                        <option key={city.id} value={city.id}>
                                                            {city.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <input type="text" name="postalCode" placeholder="PostalCode" value={giftAddress.postalCode} onChange={handleGiftAddressChange} className="p-3 border border-gray-300 rounded-md" />
                                                <textarea name="note" placeholder="Note" value={giftAddress.note} onChange={handleGiftAddressChange} className="p-3 border border-gray-300 rounded-md col-span-2 h-24"></textarea>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex justify-end pt-4">
                                        <button onClick={makePayment} className="bg-lime-500 hover:bg-lime-600 text-white font-bold py-3 px-8 rounded-md transition-colors shadow-sm w-full sm:w-auto">
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            {/* The rest of the component remains unchanged */}
                            <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
                                <button
                                    className="text-lime-600 font-semibold w-full hover:underline text-center cursor-pointer"
                                    onClick={() => setOrderModalOpen(true)}
                                >
                                    See Order Details <ArrowUpRightIcon />
                                </button>
                                <div className="bg-lime-500 p-4 -mx-6 text-center">
                                    <h2 className="text-lg font-bold text-gray-800">Order Summary</h2>
                                </div>
                                <div className="space-y-3 text-gray-700">
                                    <div className="flex justify-between"><span>Subtotal</span><span>LKR {subtotal}.00</span></div>
                                    <div className="flex justify-between"><span>Site wide discount</span><span>LKR {totalDiscount}.00</span></div>
                                    <div className="flex justify-between"><span>Total discount amount</span><span>LKR {totalDiscount}.00</span></div>
                                    <div className="flex justify-between"><span>Delivery fee</span><span>LKR 500.00</span></div>
                                </div>
                                <hr />
                                <div className="flex justify-between items-center font-bold text-xl">
                                    <span>Total</span>
                                    <span>LKR {finalTotal}.00</span>
                                </div>
                                <div className="bg-red-100 text-red-600 text-center font-bold p-3 rounded-md">
                                    Your Total Saving On This Order LKR {totalDiscount}.00
                                </div>
                                <a href="#" className="text-blue-600 text-sm text-center block hover:underline">You have a coupon code?</a>
                                <div className="border-2 border-blue-400 rounded-lg p-4 space-y-4">
                                    <h3 className="font-semibold text-gray-800">Available Card Promotions</h3>
                                    <p className="text-xs text-gray-500">Please enter first 6 digits of your Credit Card number</p>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-center">
                                        {cardLogos.map(logo => (
                                            <div key={logo} className="border flex items-center justify-center p-1 h-10 text-xs text-gray-500 rounded bg-gray-50">{logo}</div>
                                        ))}
                                    </div>
                                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                        <input type="text" placeholder="First 6 digits of your Credit Card" className="flex-grow p-3 border border-gray-300 rounded-md" />
                                        <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-3 px-4 rounded-md transition-colors shadow-sm">ADD CARD</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <OrderSummaryModal isOpen={isOrderModalOpen} onClose={() => setOrderModalOpen(false)} />
        </>
    );
};

export default CheckOutPage;