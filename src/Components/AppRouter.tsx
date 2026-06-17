import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../Home/Home";
import Login from "../Login/Login";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
        <Login/>
    ),
  },
  {
    path: "/",
    Component: Home
  },

]);

const AppRouter = () => {
  return (<><RouterProvider router={router} /></>)
}

export default AppRouter