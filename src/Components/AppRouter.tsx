import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../Home/Home";
import Login from "../Login/Login";
import GuestRoute from "../SessionCheck/GuestRoute";
import VerifyAccount from "../EmailVerification/VerifyAccount";
import MyAccount from "../MyAccount/MyAccount";
import ProtectedRoute from "../SessionCheck/ProtectedRoute";

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

]);

const AppRouter = () => {
  return (<><RouterProvider router={router} /></>)
}

export default AppRouter