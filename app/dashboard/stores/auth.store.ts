import { create } from "zustand";

type User = {
  email?: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => {
  let token: string | null = null;
  let user: User | null = null;

  if (typeof window !== "undefined") {
    token = localStorage.getItem("auth_token");

    const rawUser = localStorage.getItem("auth_user");
    user = rawUser ? JSON.parse(rawUser) : null;
  }

  return {
    token,
    user,
    isAuthenticated: !!token,

    login: (token, user) => {
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));

      set({
        token,
        user,
        isAuthenticated: true,
      });
    },

    logout: () => {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");

      set({
        token: null,
        user: null,
        isAuthenticated: false,
      });
    },
  };
});