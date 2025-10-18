import { create } from "zustand";
import { URL_AUTH, URL_AUTH_PROF, URL_BASE, URL_STATS } from "./consts";
import { useUserLogInStore } from "./userLogIn";

type EmotionCount = {
  [emotion: string]: number;
};

type EmotionRecord = {
  date: string;
  emotionName: string;
};

type ActivityCount = {
  [activity: string]: number;
};

type ActivityRecord = {
  date: string;
  activityName: string;
};

type ActivityResponse = {
  hobbies: Array<{
    activityName: string;
    percentage?: string;
    count?: number;
  }>;
  activities: Array<{
    activityName: string;
    percentage?: string;
    count?: number;
  }>;
};

type StatsState = {
  // Emotion Data
  weeklyStats: EmotionCount | null;
  monthlyStats: EmotionCount | null;
  yearlyStats: EmotionCount | null;
  
  // Activity Data
  weeklyActivities: ActivityCount | null;
  monthlyActivities: ActivityCount | null;
  customActivities: ActivityCount | null;
  
  // Raw data with dates (for calendar)
  monthlyRawData: EmotionRecord[] | null;
  
  // Loading states
  loadingWeekly: boolean;
  loadingMonthly: boolean;
  loadingYearly: boolean;
  loadingWeeklyActivities: boolean;
  loadingMonthlyActivities: boolean;
  loadingCustomActivities: boolean;
  
  // Error states
  errorWeekly: string | null;
  errorMonthly: string | null;
  errorYearly: string | null;
  errorWeeklyActivities: string | null;
  errorMonthlyActivities: string | null;
  errorCustomActivities: string | null;
  
  // Actions
  fetchWeeklyStats: (userId?: string) => Promise<void>;
  fetchMonthlyStats: (month: number, year: number, userId?: string) => Promise<void>;
  fetchYearlyStats: (year: number, userId?: string) => Promise<void>;
  
  // Activity Actions
  fetchWeeklyActivities: (userId?: string) => Promise<void>;
  fetchMonthlyActivities: (month: number, year: number, userId?: string) => Promise<void>;
  fetchCustomActivities: (since: string, until: string) => Promise<void>;
  
  // Clear functions
  clearWeeklyStats: () => void;
  clearMonthlyStats: () => void;
  clearYearlyStats: () => void;
  clearActivities: () => void;
};

const processStatsData = (data: Array<{ date: string; emotionName: string }>): EmotionCount => {
  const emotionCount: EmotionCount = {};
  
  data.forEach(item => {
    const emotion = item.emotionName.toLowerCase();
    emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;
  });
  
  return emotionCount;
};

const getUserId = async (): Promise<string> => {
  // Intentar obtener userId del store
  const storedUserId = useUserLogInStore.getState().userId;
  
  if (storedUserId) {
    return storedUserId;
  }
  
  // Fallback: Si no está en el store, intentar desde el profile
  const token = useUserLogInStore.getState().token;
  const userType = useUserLogInStore.getState().userType;
  
  if (!token) {
    console.error('No hay token disponible');
    return "U-4f9c0ba9-2b20-4994-b55c-8fdc645fc8e9";
  }
  
  try {
    const profileUrl = `${URL_BASE}${userType === "profesional" ? URL_AUTH_PROF : URL_AUTH}/profile`;
    
    const response = await fetch(profileUrl, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const userData = await response.json();
      const userId = userData.codigo || userData.code || userData.id || userData.userId || userData.user_id || userData.ID;
      
      if (userId) {
        return userId;
      }
    }
    
    console.error('No se pudo obtener userId del profile');
    return "U-4f9c0ba9-2b20-4994-b55c-8fdc645fc8e9";
  } catch (error) {
    console.error('Error al obtener userId:', error);
    return "U-4f9c0ba9-2b20-4994-b55c-8fdc645fc8e9";
  }
};
const parseActivityResponse = (response: ActivityResponse): ActivityCount => {
  const result: ActivityCount = {};
  
  if (!response || typeof response !== 'object') {
    return result;
  }
  
  const hobbies = Array.isArray(response.hobbies) ? response.hobbies : [];
  const activities = Array.isArray(response.activities) ? response.activities : [];
  
  [...hobbies, ...activities].forEach(item => {
    if (item && item.activityName) {
      if (item.count !== undefined) {
        const count = parseInt(String(item.count));
        result[item.activityName] = count;
      } else if (item.percentage) {
        const count = Math.round(parseFloat(item.percentage));
        result[item.activityName] = count;
      }
    }
  });
  
  return result;
};

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
  // Initial state - Emotions
  weeklyStats: null,
  monthlyStats: null,
  yearlyStats: null,
  monthlyRawData: null,
  
  // Initial state - Activities
  weeklyActivities: null,
  monthlyActivities: null,
  customActivities: null,
  
  // Loading states
  loadingWeekly: false,
  loadingMonthly: false,
  loadingYearly: false,
  loadingWeeklyActivities: false,
  loadingMonthlyActivities: false,
  loadingCustomActivities: false,
  
  // Error states
  errorWeekly: null,
  errorMonthly: null,
  errorYearly: null,
  errorWeeklyActivities: null,
  errorMonthlyActivities: null,
  errorCustomActivities: null,
  
  fetchWeeklyStats: async (userId?: string) => {
    set({ loadingWeekly: true, errorWeekly: null });
    
    try {
      const userIdToUse = userId || await getUserId();
      const bodyData = userIdToUse !== (await getUserId()) ? { userId: userIdToUse } : {};
      const data = await makeAuthenticatedRequest('/week', bodyData);
      const processedData = processStatsData(data);
      set({ weeklyStats: processedData, loadingWeekly: false });
    } catch (error) {
      set({ 
        errorWeekly: error instanceof Error ? error.message : 'Error desconocido',
        loadingWeekly: false 
      });
    }
  },
  
  fetchMonthlyStats: async (month: number, year: number, userId?: string) => {
    set({ loadingMonthly: true, errorMonthly: null });
    
    try {
      const userIdToUse = userId || await getUserId();
      const bodyData = userIdToUse !== (await getUserId()) 
        ? { month, year, userId: userIdToUse } 
        : { month, year };
      const data = await makeAuthenticatedRequest('/month', bodyData);
      const processedData = processStatsData(data);
      set({ 
        monthlyStats: processedData, 
        monthlyRawData: data,
        loadingMonthly: false 
      });
    } catch (error) {
      set({ 
        errorMonthly: error instanceof Error ? error.message : 'Error desconocido',
        loadingMonthly: false 
      });
    }
  },
  
  fetchYearlyStats: async (year: number, userId?: string) => {
    set({ loadingYearly: true, errorYearly: null });
    
    try {
      const userIdToUse = userId || await getUserId();
      const bodyData = userIdToUse !== (await getUserId()) 
        ? { year, userId: userIdToUse } 
        : { year };
      const data = await makeAuthenticatedRequest('/year', bodyData);
      const processedData = processStatsData(data);
      set({ yearlyStats: processedData, loadingYearly: false });
    } catch (error) {
      set({ 
        errorYearly: error instanceof Error ? error.message : 'Error desconocido',
        loadingYearly: false 
      });
    }
  },

  fetchWeeklyActivities: async (userId?: string) => {
    set({ loadingWeeklyActivities: true, errorWeeklyActivities: null });
    
    try {
      const userIdToUse = userId || await getUserId();
      if (!userIdToUse) {
        set({ weeklyActivities: {}, loadingWeeklyActivities: false });
        return;
      }

      const token = useUserLogInStore.getState().token;
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      const bodyData = { userId: userIdToUse };
      
      const response = await fetch(`${URL_BASE}${URL_STATS}/activities-week`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          set({ weeklyActivities: {}, loadingWeeklyActivities: false });
          return;
        }
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && typeof data === 'object' && (data.hobbies || data.activities)) {
        const parsedData = parseActivityResponse(data);
        
        const sortedActivities = Object.entries(parsedData)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 6)
          .reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
          }, {} as ActivityCount);
        
        set({ weeklyActivities: sortedActivities, loadingWeeklyActivities: false });
      } else {
        set({ weeklyActivities: {}, loadingWeeklyActivities: false });
      }
      
    } catch (error) {
      set({ 
        errorWeeklyActivities: error instanceof Error ? error.message : 'Error desconocido',
        loadingWeeklyActivities: false 
      });
    }
  },
  
  fetchMonthlyActivities: async (month: number, year: number, userId?: string) => {
    set({ loadingMonthlyActivities: true, errorMonthlyActivities: null });
    
    try {
      const userIdToUse = userId || await getUserId();
      if (!userIdToUse) {
        set({ monthlyActivities: {}, loadingMonthlyActivities: false });
        return;
      }

      const token = useUserLogInStore.getState().token;
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const bodyData = {
        userId: userIdToUse,
        month: month,
        year: year
      };

      const response = await fetch(`${URL_BASE}${URL_STATS}/activities-month`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          set({ monthlyActivities: {}, loadingMonthlyActivities: false });
          return;
        }
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data: ActivityResponse = await response.json();

      if (data && typeof data === 'object' && (data.hobbies || data.activities)) {
        const parsedData = parseActivityResponse(data);
        
        const sortedActivities = Object.entries(parsedData)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 6)
          .reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
          }, {} as ActivityCount);
        
        set({ monthlyActivities: sortedActivities, loadingMonthlyActivities: false });
      } else {
        set({ monthlyActivities: {}, loadingMonthlyActivities: false });
      }
    } catch (error) {
      set({ 
        errorMonthlyActivities: 'Error al cargar actividades del mes',
        loadingMonthlyActivities: false,
        monthlyActivities: {}
      });
    }
  },
  
  fetchCustomActivities: async (since: string, until: string) => {
    set({ loadingCustomActivities: true, errorCustomActivities: null });
    
    try {
      const userId = await getUserId();
      
      const bodyData = {
        id: userId,
        since: since,
        until: until
      };
      
      const token = useUserLogInStore.getState().token;
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      const response = await fetch(`${URL_BASE}${URL_STATS}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && typeof data === 'object' && (data.hobbies || data.activities)) {
        const parsedData = parseActivityResponse(data);
        set({ customActivities: parsedData, loadingCustomActivities: false });
      } else {
        set({ customActivities: {}, loadingCustomActivities: false });
      }
      
    } catch (error) {
      set({ 
        errorCustomActivities: error instanceof Error ? error.message : 'Error desconocido',
        loadingCustomActivities: false 
      });
    }
  },
  
  clearWeeklyStats: () => set({ weeklyStats: null, errorWeekly: null }),
  clearMonthlyStats: () => set({ monthlyStats: null, monthlyRawData: null, errorMonthly: null }),
  clearYearlyStats: () => set({ yearlyStats: null, errorYearly: null }),
  clearActivities: () => set({ 
    weeklyActivities: null, 
    monthlyActivities: null, 
    customActivities: null,
    errorWeeklyActivities: null,
    errorMonthlyActivities: null,
    errorCustomActivities: null
  }),
}));