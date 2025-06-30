// hooks/useAuth.ts

import { useAtom } from "jotai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { userAtom, User } from "../lib/atoms";

/**
 * Provides access to the user state and authentication mutations (login, logout, signup).
 * This hook DOES NOT fetch user data itself. It relies on the global state
 * being initialized by the `AuthInitializer` in providers.tsx.
 */
export function useAuth() {
  const [user, setUser] = useAtom(userAtom);
  const queryClient = useQueryClient();

  // --- MUTATIONS NOW MANAGE THE ENTIRE STATE ---

  const signinMutation = useMutation({
    mutationFn: api.signin,
    onSuccess: (data: { user: User }) => {
      // On successful sign-in, manually set the user in our global state.
      // This provides instant feedback and prevents any need for a refetch.
      setUser(data.user);
    },
  });

  const signupMutation = useMutation({
    mutationFn: api.signup,
    onSuccess: (data: { user: User }) => {
      setUser(data.user);
    },
  });

  const signoutMutation = useMutation({
    mutationFn: api.signout,
    onSuccess: () => {
      // On successful sign-out, clear ALL cached data and set user to null.
      // No more /me calls will be triggered because this hook no longer has that query.
      queryClient.clear();
      setUser(null);
    },
    onError: (error) => {
      console.error("Signout API error, logging out locally anyway:", error);
      queryClient.clear();
      setUser(null);
    },
  });

  return {
    user, // The user object (or null) from the global Jotai atom.
    signin: signinMutation.mutate,
    signup: signupMutation.mutate,
    signout: signoutMutation.mutate,
    isSigningIn: signinMutation.isPending,
    isSigningUp: signupMutation.isPending,
    isSigningOut: signoutMutation.isPending,
    signinError: signinMutation.error as unknown,
    signupError: signupMutation.error as unknown,
  };
}
