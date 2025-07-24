import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type patientProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email:string;
  birthDate:string;
  gender:string;
  livesWith:string;
  occupation:string;
  Users?: string[];
};

type PatientStore = {
  patients: patientProfile[];
  setPatients: (patients: patientProfile[]) => void;
  clearPatients: () => void;
};

export const usePatientStore = create<PatientStore>()(
  persist(
    (set) => ({
      patients: [],
      setPatients: (patients) => set({ patients }),
      clearPatients: () => set({ patients: [] }),
    }),
    {
      name: "patients-storage",
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
      partialize: (state) => ({ patients: state.patients } as any),
    }
  )
);
