import { create } from "zustand";

type AuthState = {
  token: string | null;
  user: { id: string; email: string; role: string } | null;
  isAuthenticated: boolean;
  login: (token: string, user: any) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined"
    ? localStorage.getItem("cms_token")
    : null,
  user: null,
  isAuthenticated: false,

  login: (token, user) => {
    localStorage.setItem("cms_token", token);
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("cms_token");
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
