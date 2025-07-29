import { Outlet, Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute() {
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    // Redirect to /sign-in, but save the current location they were trying to go to
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <Outlet />;
}