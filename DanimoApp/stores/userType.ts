
import { create } from 'zustand';

type UserType = 'usuario' | 'profesional' | null;

interface UserStore {
  userType: UserType;
  setUserType: (type: UserType) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userType: null,
  setUserType: (type) => set({ userType: type }),
}));
