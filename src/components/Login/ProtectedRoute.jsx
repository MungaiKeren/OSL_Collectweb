import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  component: Component,
  ...restOfProps
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const jwt = require("jsonwebtoken");

  useEffect(() => {
    const token = localStorage.getItem("gdfhgfhtkngdfhgfhtkn");
    if (token) {
      try {
        let decoded = jwt.decode(token);
        if (Date.now() >= decoded.exp * 1000) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

 

  return isAuthenticated ? (
    <Component {...restOfProps} />
  ) : (
    <Navigate to="/login" replace />
  );
}
