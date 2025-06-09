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
  const [isLoading, setIsLoading] = useState(true); // Initial loading state
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Verify token and get user profile from backend
  useEffect(() => {
    const verifyToken = async () => {
      setIsLoading(true);
      if (token) {
        try {
          setLoading(true);
          // Use the correct API method to get user profile from backend
          const userData = await authAPI.getProfile(token);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (err) {
          console.error("Token verification failed:", err);
          // Token is invalid, clear it
          setToken(null);
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
      setIsLoading(false);
    };
    verifyToken();
  }, [token]);

  // Signup with backend API
  const signup = async ({ firstName, lastName, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      // Call backend signup endpoint
      await authAPI.signup(firstName, lastName, email, password);
      setLoading(false);
      navigate("/login"); // Navigate to login after successful signup
      return {
        success: true,
        message: "Account created successfully! Please login.",
      };
    } catch (err) {
      const errorMessage = err.message || "Signup failed";
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Login with backend API
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Call backend login endpoint
      const { token: newToken } = await authAPI.login(email, password);

      // Store token and get user profile
      localStorage.setItem("token", newToken);
      setToken(newToken);

      // Get user profile from backend
      const userData = await authAPI.getProfile(newToken);
      setUser(userData);
      setIsAuthenticated(true);

      navigate("/dashboard");
      return { success: true, message: "Login successful!" };
    } catch (err) {
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update user profile in backend
  const updateProfile = async (firstName, lastName) => {
    if (!token) {
      throw new Error("No authentication token");
    }

    setLoading(true);
    setError(null);
    try {
      await authAPI.updateProfile(token, firstName, lastName);

      // Refresh user data from backend
      const userData = await authAPI.getProfile(token);
      setUser(userData);

      return { success: true, message: "Profile updated successfully!" };
    } catch (err) {
      const errorMessage = err.message || "Failed to update profile";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout and clear all data
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    navigate("/login");
  };

  // Clear error state
  const clearError = () => {
    setError(null);
  };

  // Check if backend is healthy
  const checkBackendHealth = async () => {
    try {
      const isHealthy = await authAPI.healthCheck();
      return isHealthy;
    } catch (err) {
      console.error("Backend health check failed:", err);
      return false;
    }
  };

  // Refresh user data from backend
  const refreshUser = async () => {
    if (!token) return;

    try {
      const userData = await authAPI.getProfile(token);
      setUser(userData);
    } catch (err) {
      console.error("Failed to refresh user data:", err);
      // If token is invalid, logout
      if (err.message.includes("Token") || err.message.includes("401")) {
        logout();
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        loading, // Operation loading (login, signup, etc.)
        isLoading, // Initial app loading state
        error,
        signup,
        login,
        logout,
        updateProfile,
        clearError,
        checkBackendHealth,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
