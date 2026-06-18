import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../Home/Home";
import Login from "../Login/Login";
import GuestRoute from "../SessionCheck/GuestRoute";
import VerifyAccount from "../EmailVerification/VerifyAccount";

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

]);

const AppRouter = () => {
  return (<><RouterProvider router={router} /></>)
}

export default AppRouter