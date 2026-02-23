import { create } from "zustand";

type AuthState = {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
  login: (token: string, user: any) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("auth_token")
      : null;

  return {
    token,
    user: null,
    isAuthenticated: !!token,

    login: (token, user) => {
      localStorage.setItem("auth_token", token);
      set({ token, user, isAuthenticated: true });
    },

    logout: () => {
      localStorage.removeItem("auth_token");
      set({ token: null, user: null, isAuthenticated: false });
    },
  };
});