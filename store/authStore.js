import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
 

  register: async (username, email, password) => {
    try {
      const res = await fetch(
        "https://react-native-bookwarm-av2j.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Registration failed");

      set({ user: data.user, token: data.token });
    } catch (err) {
      console.error("Registration error:", err.message);
      throw err;
    }
  },
  login: async (email, password) => {
    try {
        set({ isLoading: true });
       const res = await fetch(
        "https://react-native-bookwarm-av2j.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      set({ user: data.user, token: data.token });
      return { success: true };
    } catch (err) {
        set({ isLoading: false });
      console.error("Login error:", err.message);
      return { success: false, error: err.message };
    }
  },

  checkAuth: async () => {
    try {
     
      const token = await AsyncStorage.getItem("token");
      const userJSON = await AsyncStorage.getItem("user");
      const user = userJSON ? JSON.parse(userJSON) : null;
      if (token && user) {
        set({ token, user });
      } else {
        set({ token: null, user: null });
      }
    } catch (error) {
      console.log("Auth check failed", error);
    } 
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      set({ user: null, token: null });
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  },
  
}));
