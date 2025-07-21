import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";
type UserType = 'usuario' | 'profesional' | null;

type UserLogIn = {
  userLogIn: boolean | null;
  mail: string | null;
  token: string | null;
  expoPushToken: string | null; 
  userType: UserType;
  setUserLogIn: (userLogIn: boolean | null) => void;
  setUserSession: (mail: string, token: string) => void;
  setPushToken: (token: string) => void; 
  setUserType: (userType: UserType) => void;
  clearUserSession: () => void;
};

export const useUserLogInStore = create<UserLogIn>()(
  persist(
    (set) => ({
      userLogIn: false,
      mail: null,
      token: null,
      expoPushToken: null, 
      userType: 'usuario',
      setUserLogIn: (userLogIn) => set({ userLogIn }),
      setUserSession: (mail, token) => set({ mail, token }),
      setPushToken: (expoPushToken) => set({ expoPushToken }), 
      setUserType: (userType) => set({ userType }),
      clearUserSession: () =>
        set({ userLogIn: false, mail: null, token: null, expoPushToken: null }), 
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
      partialize: (state) =>
        ({
          userLogIn: state.userLogIn,
          mail: state.mail,
          token: state.token,
          expoPushToken: state.expoPushToken, 
          userType: state.userType,
        } as UserLogIn),
    }
  )
);
