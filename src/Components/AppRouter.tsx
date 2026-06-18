import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../Home/Home";
import Login from "../Login/Login";
import GuestRoute from "../SessionCheck/GuestRoute";
import VerifyAccount from "../EmailVerification/VerifyAccount";
import MyAccount from "../MyAccount/MyAccount";
import ProtectedRoute from "../SessionCheck/ProtectedRoute";
import AdminProtectedRoute from "../SessionCheck/AdminProtectedRoute";
import AdminDashboard from "../Admin/AdminDashboard";
import AdminGuestRoute from "../SessionCheck/AdminGuestRoute";
import AdminLoginPage from "../Admin/AdminLoginPage";
import AdminVerificationPage from "../Admin/AdminVerificationPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <GuestRoute>
        <Login/>
      </GuestRoute>
    ),
  },
  {
    path: "/",
    Component: Home
  },
  {
    path: "/Auth/VrifyAccount",
    Component: VerifyAccount
  },
    {
    path: "/home/myaccount",
    element: (
      <ProtectedRoute>
        <MyAccount />
      </ProtectedRoute>
    ),
  },
   {
    path: "/admin/dashboard",
    element: (
      <AdminProtectedRoute>
        <AdminDashboard />
      </AdminProtectedRoute>
    ),
  },
  {
    path: "/admin/login",
    element: (
      <AdminGuestRoute>
      <AdminLoginPage />
      </AdminGuestRoute>
    ),
  }, {
    path: "/admin/verification",
    element: (
      <AdminVerificationPage />
    ),
  },

]);

const AppRouter = () => {
  return (<><RouterProvider router={router} /></>)
}

export default AppRouter