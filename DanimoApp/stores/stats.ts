import { create } from "zustand";
import { URL_BASE, URL_STATS } from "./consts";
import { useUserLogInStore } from "./userLogIn";

type EmotionCount = {
  [emotion: string]: number;
};

type EmotionRecord = {
  date: string;
  emotionName: string;
};

type StatsState = {
  // Data
  weeklyStats: EmotionCount | null;
  monthlyStats: EmotionCount | null;
  yearlyStats: EmotionCount | null;
  
  // Raw data with dates (for calendar)
  monthlyRawData: EmotionRecord[] | null;
  
  // Loading states
  loadingWeekly: boolean;
  loadingMonthly: boolean;
  loadingYearly: boolean;
  
  // Error states
  errorWeekly: string | null;
  errorMonthly: string | null;
  errorYearly: string | null;
  
  // Actions
  fetchWeeklyStats: () => Promise<void>;
  fetchMonthlyStats: (month: number, year: number) => Promise<void>;
  fetchYearlyStats: (year: number) => Promise<void>;
  
  // Clear functions
  clearWeeklyStats: () => void;
  clearMonthlyStats: () => void;
  clearYearlyStats: () => void;
};

// Función helper para procesar la respuesta de la API
const processStatsData = (data: Array<{ date: string; emotionName: string }>): EmotionCount => {
  const emotionCount: EmotionCount = {};
  
  data.forEach(item => {
    const emotion = item.emotionName.toLowerCase();
    emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;
  });
  
  return emotionCount;
};

// Función helper para hacer requests autenticados
const makeAuthenticatedRequest = async (endpoint: string, bodyData: object = {}) => {
  const token = useUserLogInStore.getState().token;
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }
  
  const response = await fetch(URL_BASE + URL_STATS + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(bodyData),
  });
  
  if (!response.ok) {
    const errorText = await response.json();
    console.error("Error:", errorText.error);
    throw new Error(errorText.error);
  }
  
  return response.json();
};

export const useStatsStore = create<StatsState>((set, get) => ({
  // Initial state
  weeklyStats: null,
  monthlyStats: null,
  yearlyStats: null,
  monthlyRawData: null,
  
  loadingWeekly: false,
  loadingMonthly: false,
  loadingYearly: false,
  
  errorWeekly: null,
  errorMonthly: null,
  errorYearly: null,
  
  // Fetch weekly stats
  fetchWeeklyStats: async () => {
    set({ loadingWeekly: true, errorWeekly: null });
    
    try {
      const data = await makeAuthenticatedRequest('/week', {});
      const processedData = processStatsData(data);
      set({ weeklyStats: processedData, loadingWeekly: false });
    } catch (error) {
      set({ 
        errorWeekly: error instanceof Error ? error.message : 'Error desconocido',
        loadingWeekly: false 
      });
    }
  },
  
  // Fetch monthly stats
  fetchMonthlyStats: async (month: number, year: number) => {
    set({ loadingMonthly: true, errorMonthly: null });
    
    try {
      const data = await makeAuthenticatedRequest('/month', { month, year });
      const processedData = processStatsData(data);
      set({ 
        monthlyStats: processedData, 
        monthlyRawData: data,  // Guardamos también los datos raw
        loadingMonthly: false 
      });
    } catch (error) {
      set({ 
        errorMonthly: error instanceof Error ? error.message : 'Error desconocido',
        loadingMonthly: false 
      });
    }
  },
  
  // Fetch yearly stats
  fetchYearlyStats: async (year: number) => {
    set({ loadingYearly: true, errorYearly: null });
    
    try {
      const data = await makeAuthenticatedRequest('/year', { year });
      const processedData = processStatsData(data);
      set({ yearlyStats: processedData, loadingYearly: false });
    } catch (error) {
      set({ 
        errorYearly: error instanceof Error ? error.message : 'Error desconocido',
        loadingYearly: false 
      });
    }
  },
  
  // Clear functions
  clearWeeklyStats: () => set({ weeklyStats: null, errorWeekly: null }),
  clearMonthlyStats: () => set({ monthlyStats: null, monthlyRawData: null, errorMonthly: null }),
  clearYearlyStats: () => set({ yearlyStats: null, errorYearly: null }),
}));