/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const userData = localStorage.getItem("userData");
  const loginTime = localStorage.getItem("loginTime");

  if (!userData || !loginTime) {
    return <Navigate to="/login" replace />;
  }

  const now = Date.now();
  const loginTimestamp = parseInt(loginTime, 10);
  const twoHours = 2 * 60 * 60 * 1000; // 2 jam dalam milidetik
  // const twoHours = 60 * 1000;

  if (now - loginTimestamp > twoHours) {
    localStorage.removeItem("userData");
    localStorage.removeItem("loginTime");
    return <Navigate to="/login" replace />;
  }

  return children;
}
