import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({
  component: Component,
  ...restOfProps
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("gdfhgfhtkngdfhgfhtkn");
    if (token) {
      try {
        let decoded = jwtDecode(token);
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
