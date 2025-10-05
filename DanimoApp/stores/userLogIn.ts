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
  userId?: string; // ✅ AGREGAR ESTO
  firstName?: string;
  lastName?: string;
  setUserLogIn: (userLogIn: boolean | null) => void;
  setUserSession: (mail: string, token: string, userId?: string) => void; // ✅ MODIFICAR
  setPushToken: (token: string) => void;
  setUserType: (userType: UserType) => void;
  setUserProfile: (firstName: string, lastName?: string) => void;
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
      userId: undefined, // ✅ AGREGAR ESTO
      firstName: undefined,
      lastName: undefined,
      setUserLogIn: (userLogIn) => set({ userLogIn }),
      setUserSession: (mail, token, userId) => set({ mail, token, userId }), // ✅ MODIFICAR
      setPushToken: (expoPushToken) => set({ expoPushToken }),
      setUserType: (userType) => set({ userType }),
      setUserProfile: (firstName, lastName) => set({ firstName, lastName }),
      clearUserSession: () =>
        set({
          userLogIn: false,
          mail: null,
          token: null,
          expoPushToken: null,
          userId: undefined, // ✅ AGREGAR ESTO
          firstName: undefined,
          lastName: undefined
        }),
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
          userId: state.userId,
          firstName: state.firstName,
          lastName: state.lastName,
        } as UserLogIn),
    }
  )
);