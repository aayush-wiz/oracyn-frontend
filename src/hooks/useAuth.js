import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api.js";
import { useState, useEffect, useCallback } from "react";

export const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Get user profile
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => authAPI.getProfile(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry if token is invalid
      if (error.message.includes("401") || error.message.includes("Token")) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Memoize logout function to prevent infinite loops
  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
    queryClient.clear(); // Clear all cached data
    navigate("/login");
  }, [navigate, queryClient]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => authAPI.login(email, password),
    onSuccess: (data) => {
      const newToken = data.token;
      setToken(newToken);
      localStorage.setItem("token", newToken);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: ({ firstName, lastName, email, password }) =>
      authAPI.signup(firstName, lastName, email, password),
    onSuccess: () => {
      // Don't auto-login, redirect to login page
      navigate("/login");
    },
    onError: (error) => {
      console.error("Signup failed:", error);
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: ({ firstName, lastName }) =>
      authAPI.updateProfile(token, firstName, lastName),
    onSuccess: () => {
      // Invalidate user profile to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
    onError: (error) => {
      console.error("Profile update failed:", error);
    },
  });

  // Reset errors function - use refs to avoid dependency issues
  const clearErrors = useCallback(() => {
    loginMutation.reset();
    signupMutation.reset();
    updateProfileMutation.reset();
  }, []); // Empty dependency array since we want a stable reference

  // Check if user is authenticated
  const isAuthenticated = !!token && !!user && !userError;

  // Check if initial loading is complete
  const isLoading = isLoadingUser && !!token;

  // Handle token validation errors - remove logout from dependencies
  useEffect(() => {
    if (userError && token) {
      const errorMessage = userError.message.toLowerCase();
      if (
        errorMessage.includes("token") ||
        errorMessage.includes("401") ||
        errorMessage.includes("unauthorized")
      ) {
        console.warn("Token expired or invalid, logging out");
        // Call logout directly instead of using it as a dependency
        setToken(null);
        localStorage.removeItem("token");
        queryClient.clear();
        navigate("/login");
      }
    }
  }, [userError, token, navigate, queryClient]); // Removed logout dependency

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,

    // Actions
    login: loginMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    updateProfile: updateProfileMutation.mutateAsync,
    logout,
    refetchUser,

    // Loading states
    isLoggingIn: loginMutation.isPending,
    isSigningUp: signupMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,

    // Errors
    loginError: loginMutation.error,
    signupError: signupMutation.error,
    updateError: updateProfileMutation.error,
    userError,

    // Reset errors
    clearErrors,
  };
};
