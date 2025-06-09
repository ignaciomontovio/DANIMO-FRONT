import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserLogIn = {
  userLogIn: boolean | null;
  mail: string | null;
  token: string | null;
  setUserLogIn: (userLogIn: boolean | null) => void;
  setUserSession: (mail: string, token: string) => void;
  clearUserSession: () => void;
};

export const useUserLogInStore = create<UserLogIn>()(
  persist(
    (set) => ({
      userLogIn: false,
      mail: null,
      token: null,
      setUserLogIn: (userLogIn) => set({ userLogIn }),
      setUserSession: (mail, token) => set({ mail, token }),
      clearUserSession: () => set({ userLogIn: false, mail: null, token: null }),
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
      // 👇 importante para que persista todas las propiedades
      partialize: (state) =>
        ({
          userLogIn: state.userLogIn,
          mail: state.mail,
          token: state.token,
        } as UserLogIn),
    }
  )
);
