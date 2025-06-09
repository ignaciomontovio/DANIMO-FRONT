import { create } from 'zustand';

type UserType = 'usuario' | 'profesional' | null;

interface UserStore {
  userType: UserType;
  mail: string | null;
  token: string | null;
  setUserType: (type: UserType) => void;
  setUserSession: (mail: string, token: string) => void;
  clearUserSession: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userType: null,
  mail: null,
  token: null,
  setUserType: (type) => set({ userType: type }),
  setUserSession: (mail, token) => set({ mail, token }),
  clearUserSession: () => set({ mail: null, token: null, userType: null }),
}));
