import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const isAuthenticated = user && Object.keys(user).length > 0;
  const isAuthorized = !allowedRoles || (user && allowedRoles.includes(user.role));

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (!isAuthorized) {
      navigate("/");
    }
  }, [isAuthenticated, isAuthorized, navigate]);

  if (!isAuthenticated || !isAuthorized) return null;

  return children;
};

export default ProtectedRoute;
