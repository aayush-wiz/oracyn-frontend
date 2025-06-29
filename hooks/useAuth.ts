// hooks/useAuth.ts

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { userAtom } from "../lib/atoms"; // We no longer need loadingAtom
import { api } from "../lib/api";

export function useAuth(pathname: string) {
  const queryClient = useQueryClient();
  const [user, setUser] = useAtom(userAtom);

  const publicRoutes = ["/signin", "/signup"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // This query's ONLY job is to verify the user's token on initial page load.
  const { data, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: api.getMe,
    enabled: !isPublicRoute,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  // This effect is now much simpler. It syncs the query result to the atom.
  React.useEffect(() => {
    if (!isLoading) {
      if (data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    }
  }, [isLoading, data, setUser]);

  // The rest of the mutations remain the same...
  const signupMutation = useMutation({
    mutationFn: api.signup,
    onSuccess: (responseData) => {
      queryClient.setQueryData(["auth"], responseData);
      setUser(responseData.user);
    },
  });

  const signinMutation = useMutation({
    mutationFn: api.signin,
    onSuccess: (responseData) => {
      queryClient.setQueryData(["auth"], responseData);
      setUser(responseData.user);
    },
  });

  const signoutMutation = useMutation({
    mutationFn: api.signout,
    onSuccess: () => {
      queryClient.setQueryData(["auth"], { user: null });
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== "auth",
      });
      setUser(null);
    },
    onError: (error) => {
      console.error("Signout API error:", error);
      queryClient.setQueryData(["auth"], { user: null });
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== "auth",
      });
      setUser(null);
    },
  });

  return {
    user,
    // CRITICAL FIX: The loading state is now directly from the query. No more instability.
    loading: isLoading,
    signup: signupMutation.mutate,
    signin: signinMutation.mutate,
    signout: signoutMutation.mutate,
    isSigningUp: signupMutation.isPending,
    isSigningIn: signinMutation.isPending,
    isSigningOut: signoutMutation.isPending,
    signupError: signupMutation.error as unknown,
    signinError: signinMutation.error as unknown,
  };
}
