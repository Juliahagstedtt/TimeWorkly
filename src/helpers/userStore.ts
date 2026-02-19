import { create } from "zustand";

interface UserState {
  token: string | null;
  userId: string | null;
  username: string | null;
  setUser: (data: { token: string; userId: string; username: string }) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  token: localStorage.getItem("jwt"),
  userId: localStorage.getItem("userId"),
  username: localStorage.getItem("username"),

  setUser: ({ token, userId, username }) => {
    localStorage.setItem("jwt", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("username", username);
    set({ token, userId, username });
  },

  logout: () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    set({ token: null, userId: null, username: null });
  },
}));