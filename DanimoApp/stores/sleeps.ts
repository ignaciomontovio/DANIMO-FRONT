import { create } from "zustand";

type Sleep = {
  number: number;
  name: string;
  description: string;
};

type SleepStore = {
  emotions: Sleep[];
  setEmotions: (emotions: Sleep[]) => void;
  getSleepByNumber: (num: number) => Sleep | undefined;
};

export const useSleepStore = create<SleepStore>((set, get) => ({
  emotions: [],
  setEmotions: (emotions) => set({ emotions }),
  getSleepByNumber: (num) =>
    get().emotions.find((e) => e.number === num),
}));
