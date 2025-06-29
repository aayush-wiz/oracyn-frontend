// types/auth.ts
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  username: string;
  email: string;
  password: string;
}

export interface UpdateProfileData {
  username?: string;
  email?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  user: User;
}

export interface MessageResponse {
  message: string;
}

export interface ErrorResponse {
  error: string;
}

export interface ApiError extends Error {
  response?: {
    status: number;
    data: ErrorResponse;
  };
}

// Auth state types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

// Auth actions
export type AuthAction =
  | { type: "SET_USER"; payload: User }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_INITIALIZED"; payload: boolean }
  | { type: "CLEAR_AUTH" }
  | { type: "UPDATE_USER"; payload: Partial<User> };

// API response types
export interface GetMeResponse {
  user: User;
}

export interface SignInResponse {
  user: User;
}

export interface SignUpResponse {
  message: string;
  user: User;
}

export interface UpdateProfileResponse {
  message: string;
  user: User;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface RefreshTokenResponse {
  user: User;
}
