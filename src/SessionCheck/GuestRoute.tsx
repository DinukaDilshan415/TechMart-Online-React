import { useEffect, useState } from "react";
import { checkSession } from "./sessionUtils";
import { Navigate } from "react-router-dom";

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const verify = async () => {
      const isLoggedIn = await checkSession();
      setAllowed(!isLoggedIn);
    };
    verify();
  }, []);

  const PulsingDots = () => {
    return (
      <div className="flex items-center justify-center space-x-2 mt-60">
        <div className="h-20 w-20 animate-pulse rounded-full bg-blue-500 [animation-delay:-0.3s]"></div>
        <div className="h-20 w-20 animate-pulse rounded-full bg-blue-500 [animation-delay:-0.15s]"></div>
        <div className="h-20 w-20 animate-pulse rounded-full bg-blue-500"></div>
      </div>
    );
  };

  if (allowed === null) return <div><PulsingDots /></div>;

  return allowed ? <>{children}</> : <Navigate to="/" />;
};

export default GuestRoute;
