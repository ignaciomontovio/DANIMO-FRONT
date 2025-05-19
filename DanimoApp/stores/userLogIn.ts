import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserLogIn = {
  userLogIn: boolean | null;
  setUserLogIn: (userLogIn: boolean | null) => void;
};

export const useUserLogInStore = create<UserLogIn>()(
  persist(
    (set) => ({
      userLogIn: false,
      setUserLogIn: (userLogIn) => set({ userLogIn }),
    }),
    {
      name: "user-login-storage",
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);