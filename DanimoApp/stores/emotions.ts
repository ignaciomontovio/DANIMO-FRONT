import { create } from "zustand";

type Emotion = {
  number: number;
  name: string;
  description: string;
};

type EmotionStore = {
  emotions: Emotion[];
  setEmotions: (emotions: Emotion[]) => void;
  getEmotionByNumber: (num: number) => Emotion | undefined;
};

export const useEmotionStore = create<EmotionStore>((set, get) => ({
  emotions: [],
  setEmotions: (emotions) => set({ emotions }),
  getEmotionByNumber: (num) =>
    get().emotions.find((e) => e.number === num),
}));
