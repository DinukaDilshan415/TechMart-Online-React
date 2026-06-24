import { useEffect, useState } from 'react';
import {
  User,
  Edit,
  Package,
  MapPin,
  Lock,
  LogOut,
  Plus,
  Eye,
  EyeOff,
  Save,
  X,
  MessageSquareHeart,
  Star
} from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

// --- INTERFACES ---

interface AccountData {
  username: string;
  email: string;
  mobile: string;
  created_at: string;
}

interface UserProfile {
  username: string;
  mobile: string;
}

interface UserPassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

type City = {
  id: string;
  name: string;
};

type Address = {
  id: number;
  type: string;
  full_name: string;
  mobile: string;
  address: string;
  cityName: string;
  postal_code: string;
  isDefault: boolean;
  city?: City;
};

type OrderStatus = 'Paid' | 'Pending' | 'Processing' | 'Shipped' | 'Delivered';

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: string;
  items: number;
}

interface OrderItem {
  id: number;
  productName: string;
  brand: string;
  quantity: number;
  price: string;
  imageUrl: string;
  status: string;
}

interface InvoiceItemsEntry {
  orderId: string;
  itemsCount: number;
  invoiceItemses: any[];
}

interface ReviewData {
  rating: number;
  reviewText: string;
}

// --- INLINE CONFIRM TOAST COMPONENT ---
const ConfirmToast = ({ message, onConfirm, toastId }: { message: string, onConfirm: () => void, toastId: string }) => {
  const handleConfirm = () => {
    onConfirm();
    toast.dismiss(toastId);
  };

  const handleCancel = () => {
    toast.dismiss(toastId);
  };

  return (
    <div className="p-2">
      <p className="mb-3 text-gray-700">{message}</p>
      <div className="flex gap-2">
        <button
          onClick={handleConfirm}
          className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-red-700 transition-colors"
        >
          Confirm
        </button>
        <button
          onClick={handleCancel}
          className="bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm font-semibold hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};


const MyAccountPage = () => {
  // --- STATE MANAGEMENT ---
  const [activeSection, setActiveSection] = useState('account');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [invoiceItemsList, setInvoiceItemsList] = useState<InvoiceItemsEntry[]>([]);

  const [accountData, setAccountData] = useState<AccountData>({
    username: '', email: '', mobile: '', created_at: ''
  });

  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: '', mobile: ''
  });

  const [password, setPassword] = useState<UserPassword>({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });

  const [cities, setCities] = useState<City[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState<Address>({
    id: 0, type: "", full_name: "", mobile: "", address: "", cityName: "0", postal_code: "", isDefault: false,
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[]>([]);
  const [isLoadingOrderItems, setIsLoadingOrderItems] = useState(false);


  // --- API & DATA FETCHING ---

  const fetchAccountData = async () => {
    try {
      const response = await fetch("http://localhost:8080/techmart/SetAccountData", {
        method: "GET", credentials: "include",
      });
      if (response.ok) {
        const json = await response.json();
        if (json.status) {
          setAccountData(json);
          setUserProfile(json);
        } else {
          toast.error(json.message);
        }
      } else {
        toast.error("Data load failed. Please try again");
      }
    } catch (error) {
      toast.error("Something wrong! Please try again");
      console.error("Data load Error:", error);
    }
  };

  const loadCityData = async () => {
    try {
      const response = await fetch("http://localhost:8080/techmart/LoadCityData", {
        method: "GET", credentials: "include",
      });
      if (response.ok) {
        const json = await response.json();
        setCities(json);
      } else {
        toast.error("City data load failed. Please try again");
      }
    } catch (error) {
      toast.error("Something wrong! Please try again");
      console.error("City data load Error:", error);
    }
  };

  const loadAddresses = async () => {
    try {
      const response = await fetch("http://localhost:8080/techmart/SaveNewAddress", {
        method: "GET", credentials: "include",
      });
      if (response.ok) {
        const json = await response.json();
        if (json.addreassList) {
          setAddresses(json.addreassList as Address[]);
        } else {
          setAddresses([]);
        }
      } else {
        toast.error("Failed to load addresses");
      }
    } catch (error) {
      toast.error("Error connecting to server for get addresses");
      console.error("Address Load Error:", error);
    }
  };

  useEffect(() => {
    fetchAccountData();
    loadCityData();
    loadAddresses();
    loadOrders();
  }, []);

  //load Orders

  const loadOrders = async () => {
    try {
      const response = await fetch(`http://localhost:8080/techmart/LoadUserOrders`, {
        method: "GET",
        credentials: "include"
      });

      if (response.ok) {
        const json = await response.json();
        if (json.status) {
          console.log(json);

          const orders = json.invoiceList.map((item: any) => {
            const matchingInvoiceItem = json.invoiceItemsList.find(
              (invItem: any) => invItem.orderId === item.order_id
            );

            return {
              id: item.order_id,
              date: format(new Date(item.created_at), 'yyyy-MM-dd'),
              status: item.orderStatus.value,
              total: `LKR ${item.amount}.00`,
              items: matchingInvoiceItem ? matchingInvoiceItem.itemsCount : 0
            };
          });

          setOrders(orders);

          setInvoiceItemsList(json.invoiceItemsList);

        } else {
          console.log(json.message);
          toast.error(json.message);
        }
      } else {
        console.log("loadOrders failed. Please try again");
        toast.error("loadOrders failed. Please try again");
      }
    } catch (error) {
      toast.error("Internal Server Error. Please try again later");
      console.error("loadOrders Error:", error);
    }
  };

  //load Orders

  const fetchOrderDetails = async (orderId: string, status: string) => {

    setIsLoadingOrderItems(true);
    setShowOrderDetailsModal(true);

    await new Promise(resolve => setTimeout(resolve, 1)); // simulate async delay

    const matchedOrder = invoiceItemsList.find(order => {
      return order.orderId === orderId;
    });

    const items = matchedOrder
      ? matchedOrder.invoiceItemses.map((item: any) => ({
        id: item.id,
        productName: item.stock.product.title,
        brand: item.stock.product.brand.name,
        quantity: item.qty,
        price: `LKR ${item.stock.price}.00`,
        imageUrl: `http://localhost:8080/techmart/product-images/${item.stock.product.id}/image1.png`,
        status: status
      }))
      : [];

    setSelectedOrderItems(items);
    setIsLoadingOrderItems(false);
  };


  // --- HANDLERS ---

  const updateProfile = async () => {
    const updateData = {
      username: userProfile.username,
      mobile: userProfile.mobile,
    };
    try {
      const response = await fetch("http://localhost:8080/techmart/UpdateUserProfile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
      });
      if (response.ok) {
        const json = await response.json();
        if (json.status) {
          toast.success("Profile updated successfully!");
          fetchAccountData();
        } else {
          toast.error(json.message);
        }
      } else {
        toast.error("Profile update failed. Please try again");
      }
    } catch (error) {
      toast.error("Something wrong ! Please try again");
      console.error("Profile update Error:", error);
    }
  };

  const saveNewAddress = async () => {
    try {
      const response = await fetch("http://localhost:8080/techmart/SaveNewAddress", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress)
      });
      if (response.ok) {
        const json = await response.json();
        if (json.status) {
          toast.success("Address saved!");
          setNewAddress({ id: 0, type: "", full_name: "", mobile: "", address: "", cityName: "0", postal_code: "", isDefault: false });
          setShowAddressForm(false);
          loadAddresses();
        } else {
          toast.error(json.message);
        }
      } else {
        toast.error("Address Registration failed. Please try again");
      }
    } catch (error) {
      toast.error("Error connecting to server");
      console.error("Address Registration Error:", error);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/techmart/DeleteAddress?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        const json = await response.json();
        if (json.status) {
          toast.success("Address deleted successfully!");
          loadAddresses();
        } else {
          toast.error(json.message);
        }
      } else {
        toast.error("Address deletion failed. Please try again");
      }
    } catch (error) {
      toast.error("Something wrong ! Please try again");
      console.error("Address deletion Error:", error);
    }
  };

  const updatePassword = async () => {
    const updateData = {
      currentPassword: password.currentPassword,
      newPassword: password.newPassword,
      confirmPassword: password.confirmPassword
    };
    try {
      const response = await fetch("http://localhost:8080/techmart/UpdateUserPassword", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
      });
      if (response.ok) {
        const json = await response.json();
        if (json.status) {
          toast.success("Password updated successfully!");
          setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } else {
          toast.error(json.message);
        }
      } else {
        toast.error("Password update failed. Please try again");
      }
    } catch (error) {
      toast.error("Something wrong ! Please try again");
      console.error("Password update Error:", error);
    }
  };

  const logOutFromAccount = async () => {
    try {
      const response = await fetch("http://localhost:8080/techmart/SignOut", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const json = await response.json();
        if (json.status) {
          window.location.href = "/login";
        } else {
          toast.error(json.message);
        }
      } else {
        toast.error("Log out failed. Please try again");
      }
    } catch (error) {
      toast.error("Something wrong ! Please try again");
      console.error("Log out Error:", error);
    }
  };

  const showLogoutConfirm = () => {
    const toastId = "custom-confirm";
    toast(
      <ConfirmToast
        message="Are you sure you want to Log out?"
        onConfirm={logOutFromAccount}
        toastId={toastId}
      />,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        toastId: toastId,
        style: { width: "340px" },
      }
    );
  };

  const handleMenuClick = (id: string) => setActiveSection(id);

  // --- UI & RENDER FUNCTIONS ---

  const menuItems = [
    { id: 'account', label: 'Account Information', icon: User },
    { id: 'profile', label: 'Update Profile', icon: Edit },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'password', label: 'Change Password', icon: Lock },
    { id: 'logout', label: 'Logout', icon: LogOut }
  ];

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered': return 'text-green-700 bg-green-100';
      case 'Shipped': return 'text-blue-700 bg-blue-100';
      case 'Processing': return 'text-yellow-700 bg-yellow-100';
      case 'Paid': return 'text-indigo-700 bg-indigo-100';
      case 'Pending': return 'text-gray-700 bg-gray-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderAccountInfo = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Name</label>
          <p className="text-lg text-gray-800">{accountData.username}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Member Since</label>
          <p className="text-lg text-gray-800">{accountData.created_at}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
          <p className="text-lg text-gray-800">{accountData.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Phone</label>
          <p className="text-lg text-gray-800">{accountData.mobile}</p>
        </div>
      </div>
    </div>
  );

  const renderUpdateProfile = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Profile</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Username</label>
            <input
              type="text"
              value={userProfile.username}
              onChange={(e) => setUserProfile({ ...userProfile, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Mobile Number</label>
            <input
              type="tel"
              value={userProfile.mobile}
              onChange={(e) => setUserProfile({ ...userProfile, mobile: e.target.value })}
              placeholder="Enter mobile number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <button onClick={updateProfile}
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-200 flex items-center gap-2 cursor-pointer"
        >
          <Save size={16} />
          Update Profile
        </button>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Order History</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Order ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Items</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Total</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{order.id}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{order.date}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{order.items}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{order.total}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => fetchOrderDetails(order.id, order.status)}
                    className="text-green-600 hover:text-green-800 text-sm font-medium cursor-pointer"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAddresses = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Addresses</h2>
        <button
          onClick={() => setShowAddressForm(!showAddressForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 flex items-center gap-2"
        >
          <Plus size={16} />
          Add New Address
        </button>
      </div>

      {showAddressForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Address Type (Eg : Home/Work)</label>
                <input
                  type="text"
                  value={newAddress.type}
                  onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
                <input
                  type="text"
                  value={newAddress.full_name}
                  onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-2">Address</label>
                <input
                  type="text"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">City</label>
                <select
                  value={newAddress.cityName}
                  onChange={(e) => setNewAddress({ ...newAddress, cityName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="0">Select a city</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Postal Code</label>
                <input
                  type="text"
                  value={newAddress.postal_code}
                  onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Mobile Number</label>
                <input
                  type="tel"
                  value={newAddress.mobile}
                  onChange={(e) => setNewAddress({ ...newAddress, mobile: e.target.value })}
                  placeholder="Enter mobile number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>
            {/* <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newAddress.isDefault}
                onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                className="h-4 w-4 text-green-600"
              />
              <label className="text-sm text-gray-600">Set as default address</label>
            </div> */}
            <div className="flex gap-2">
              <button onClick={saveNewAddress}
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
              >
                Save Address
              </button>
              <button
                type="button"
                onClick={() => setShowAddressForm(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div key={address.id} className="border border-gray-200 rounded-md p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-600 rounded">
                  {address.type}
                </span>
                {address.isDefault && (
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded">
                    Default
                  </span>
                )}
              </div>
              <button
                // onClick={() => handleDeleteAddress(address.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
            <h4 className="font-medium text-gray-800 mb-1"> {address.full_name} </h4>
            <p className="text-sm text-gray-600 mb-1">{address.mobile}</p>
            <p className="text-sm text-gray-600 mb-1">{address.address}</p>
            <p className="text-sm text-gray-600">
              {address.city?.name}, {address.postal_code}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPasswordChange = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Current Password</label>
          <div className="relative">
            <input value={password.currentPassword}
              onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })}
              type={showPassword ? "text" : "password"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">New Password</label>
          <div className="relative">
            <input value={password.newPassword}
              onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
              type={showNewPassword ? "text" : "password"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Confirm New Password</label>
          <div className="relative">
            <input value={password.confirmPassword}
              onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })}
              type={showConfirmPassword ? "text" : "password"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <button onClick={updatePassword}
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-200 flex items-center gap-2"
        >
          <Lock size={16} />
          Change Password
        </button>
      </div>
    </div>
  );

  const renderLogOut = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <button onClick={showLogoutConfirm}
        type="submit"
        className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-200 flex items-center gap-2 cursor-pointer"
      >
        <LogOut size={16} />
        Log Out
      </button>
    </div>
  );

  // UPDATED: OrderDetailsModal to display images
  const OrderDetailsModal = () => {
    // NEW: State for the Review Modal
    const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
    const [itemToReview, setItemToReview] = useState<OrderItem | null>(null);

    // NEW: Handlers for the review modal
    const handleOpenReviewModal = (item: OrderItem) => {
      setItemToReview(item);
      // setShowOrderDetailsModal(false);
      setShowReviewModal(true);
    };

    const handleReviewSubmit = async (reviewData: ReviewData) => {
      console.log(reviewData);
      console.log(itemToReview?.id);

      const reviewDetails = {
        rating: reviewData.rating,
        reviewText: reviewData.reviewText,
        itemId: itemToReview?.id
      };

      try {
        const response = await fetch("http://localhost:8080/techmart/SubmitProductReview", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reviewDetails)
        });
        if (response.ok) {
          const json = await response.json();
          if (json.status) {
            toast.success(json.message);
            setShowReviewModal(false);
          } else {
            toast.error(json.message);
          }
        } else {
          toast.error("SubmitProductReview failed. Please try again");
        }
      } catch (error) {
        toast.error("Error connecting to server");
        console.error("SubmitProductReview Error:", error);
      }
    };

    return (
      <div
        className={`fixed inset-0 backdrop-blur-xs shadow-2xl bg-black/30 bg-opacity-50 flex justify-center items-center z-50 transition-all duration-300 ease-in-out ${showOrderDetailsModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setShowOrderDetailsModal(false)}
      >
        <div
          className={`bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 p-6 transform transition-all duration-300 ${showOrderDetailsModal ? 'scale-100' : 'scale-95'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h3 className="text-xl font-bold text-gray-800">Order Items</h3>
            <button
              onClick={() => setShowOrderDetailsModal(false)}
              className="text-gray-500 hover:text-gray-800"
            >
              <X size={24} />
            </button>
          </div>
          {isLoadingOrderItems ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading items...</p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[60vh]">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left text-sm font-medium text-gray-600">
                    <th className="p-3 w-20">Image</th>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Brand</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-right"></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrderItems.length > 0 ? (
                    selectedOrderItems.map(item => (
                      <tr key={item.id} className="border-b">
                        <td className="p-2">
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-16 h-16 object-cover rounded-md"
                            onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/e2e8f0/4a5568?text=N/A'; }}
                          />
                        </td>
                        <td className="p-3 font-medium text-gray-800">{item.productName}</td>
                        <td className="p-3 text-gray-600">{item.brand}</td>
                        <td className="p-3 text-center text-gray-600">{item.quantity}</td>
                        <td className="p-3 text-right font-medium text-gray-800">{item.price}</td>
                        <td className="p-3 text-right font-medium text-gray-800">
                          {item.status === 'Delivered' ? (
                            <button
                              onClick={() => handleOpenReviewModal(item)}
                              type="button"
                              className='cursor-pointer hover:bg-edumartHover hover:text-white rounded-full p-2'
                              title={`Review ${item.productName}`}
                            >
                              <MessageSquareHeart />
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">Not Delivered</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center p-6 text-gray-500">
                        No items found for this order.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleReviewSubmit}
          product={itemToReview}
        />
      </div>
    );
  };

  interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ReviewData) => void;
    product: OrderItem | null;
  }

  const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit, product }) => {
    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [reviewText, setReviewText] = useState<string>('');

    useEffect(() => {
      if (isOpen) {
        setRating(0);
        setHoverRating(0);
        setReviewText('');
      }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (rating === 0) {
        // You can replace this with a toast notification
        alert('Please select a star rating before submitting.');
        return;
      }
      onSubmit({ rating, reviewText });
    };

    if (!isOpen) {
      return null;
    }

    return (
      <div
        className="fixed inset-0 backdrop-blur-sm bg-black/40 flex justify-center items-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 sm:p-8 transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Write a Review</h2>
            <p className="text-gray-600 mt-1">for {product?.productName || 'this product'}</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Star Rating Section */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3 text-center">Your Rating</label>
              <div className="flex justify-center items-center space-x-1" onMouseLeave={() => setHoverRating(0)}>
                {[...Array(5)].map((_, index) => {
                  const starValue = index + 1;
                  return (
                    <button
                      type="button"
                      key={starValue}
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                      className="cursor-pointer"
                      aria-label={`Rate ${starValue} stars`}
                    >
                      <Star
                        size={40}
                        className="transition-colors duration-200"
                        fill={starValue <= (hoverRating || rating) ? '#ffc107' : 'none'}
                        stroke={starValue <= (hoverRating || rating) ? '#ffc107' : '#e4e5e9'}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-1">
                Your Review (Optional)
              </label>
              <textarea
                id="reviewText"
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                placeholder="What did you like or dislike? How did you use this product?"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={rating === 0}
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'account': return renderAccountInfo();
      case 'profile': return renderUpdateProfile();
      case 'orders': return renderOrders();
      case 'address': return renderAddresses();
      case 'password': return renderPasswordChange();
      case 'logout': return renderLogOut();
      default: return renderAccountInfo();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {accountData.username ? accountData.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{accountData.username}</h1>
              <p className="text-gray-600">{accountData.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-md transition duration-200 ${activeSection === item.id
                        ? 'bg-green-100 text-green-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>

      <OrderDetailsModal />
    </div>
  );
};

export default MyAccountPage;
