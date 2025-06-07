// contexts/AuthProvider.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext.js";
import { authAPI } from "../services/api.js";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          setLoading(true);
          const userData = await authAPI.getUser(token);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (err) {
          console.log(err);
          setToken(null);
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    };
    verifyToken();
  }, [token]);

  const signup = async ({ firstName, lastName, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      await authAPI.register(firstName, lastName, email, password);
      setLoading(false);
      navigate("/login"); // Navigate to login after signup
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Signup failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { token } = await authAPI.login(email, password);
      localStorage.setItem("token", token);
      setToken(token);
      const userData = await authAPI.getUser(token);
      setUser(userData);
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    navigate("/login");
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        loading,
        error,
        signup,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
