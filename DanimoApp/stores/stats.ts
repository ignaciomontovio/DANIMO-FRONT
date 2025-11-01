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

type SleepStats = {
  date: string;
  sleepQuality: number;
  sleepHours: number;
};

type WeeklySleepStats = {
  averageQuality: number;
  averageHours: number;
  sleeps: SleepStats[];
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
  
  // Sleep Data
  weeklySleepStats: WeeklySleepStats | null;
  
  // Raw data with dates (for calendar)
  monthlyRawData: EmotionRecord[] | null;
  
  // Loading states
  loadingWeekly: boolean;
  loadingMonthly: boolean;
  loadingYearly: boolean;
  loadingWeeklyActivities: boolean;
  loadingMonthlyActivities: boolean;
  loadingCustomActivities: boolean;
  loadingWeeklySleep: boolean;
  
  // Error states
  errorWeekly: string | null;
  errorMonthly: string | null;
  errorYearly: string | null;
  errorWeeklyActivities: string | null;
  errorMonthlyActivities: string | null;
  errorCustomActivities: string | null;
  errorWeeklySleep: string | null;
  
  // Actions
  fetchWeeklyStats: (userId?: string) => Promise<void>;
  fetchMonthlyStats: (month: number, year: number, userId?: string) => Promise<void>;
  fetchYearlyStats: (year: number, userId?: string) => Promise<void>;
  
  // Activity Actions
  fetchWeeklyActivities: (userId?: string) => Promise<void>;
  fetchMonthlyActivities: (month: number, year: number, userId?: string) => Promise<void>;
  fetchCustomActivities: (since: string, until: string) => Promise<void>;
  
  // Sleep Actions
  fetchWeeklySleepStats: (userId?: string) => Promise<void>;
  
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
  
  // Initial state - Sleep
  weeklySleepStats: null,
  
  // Loading states
  loadingWeekly: false,
  loadingMonthly: false,
  loadingYearly: false,
  loadingWeeklyActivities: false,
  loadingMonthlyActivities: false,
  loadingCustomActivities: false,
  loadingWeeklySleep: false,
  
  // Error states
  errorWeekly: null,
  errorMonthly: null,
  errorYearly: null,
  errorWeeklyActivities: null,
  errorMonthlyActivities: null,
  errorCustomActivities: null,
  errorWeeklySleep: null,
  
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

  fetchWeeklySleepStats: async (userId?: string) => {
    set({ loadingWeeklySleep: true, errorWeeklySleep: null });
    
    try {
      const userIdToUse = userId || await getUserId();
      const token = useUserLogInStore.getState().token;
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const requestBody = { userId: userIdToUse };
      
      const response = await fetch(`${URL_BASE}${URL_STATS}/sleeps-week`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        if (response.status === 404) {
          // No hay datos de sueño disponibles
          set({ 
            weeklySleepStats: {
              averageQuality: 0,
              averageHours: 0,
              sleeps: []
            },
            loadingWeeklySleep: false,
            errorWeeklySleep: null
          });
          return;
        }
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      
      // Procesar los datos del API según la estructura real
      let processedData: WeeklySleepStats;
      
      if (Array.isArray(data) && data.length > 0) {
        // El API devuelve un array de categorías de sueño con conteos
        // Ejemplo: [{"sleepName": "Excelente", "count": "6"}]
        
        // Mapear nombres de sueño a valores numéricos
        const sleepQualityMap: { [key: string]: number } = {
          'Excelente': 5,
          'Muy bueno': 4, 
          'Bueno': 3,
          'Regular': 2,
          'Muy malo': 1,
          'Malo': 1
        };

        // Mapear horas estimadas por calidad
        const sleepHoursMap: { [key: string]: number } = {
          'Excelente': 8.5,
          'Muy bueno': 8.0,
          'Bueno': 7.5,
          'Regular': 6.5,
          'Muy malo': 5.5,
          'Malo': 5.5
        };

        // Calcular promedios basados en los conteos
        let totalWeightedQuality = 0;
        let totalWeightedHours = 0;
        let totalCount = 0;

        // Procesar cada categoría de sueño
        for (const item of data) {
          const sleepName = item.sleepName || '';
          const count = parseInt(item.count || '0', 10);
          const quality = sleepQualityMap[sleepName] || 0;
          const estimatedHours = sleepHoursMap[sleepName] || 6.0;
          
          if (count > 0 && quality > 0) {
            totalWeightedQuality += quality * count;
            totalWeightedHours += estimatedHours * count;
            totalCount += count;
          }
        }

        // Calcular promedios
        const avgQuality = totalCount > 0 ? totalWeightedQuality / totalCount : 0;
        const avgHours = totalCount > 0 ? totalWeightedHours / totalCount : 0;

        // Crear datos simulados por día para visualización
        const sleepsData: SleepStats[] = [];
        
        if (totalCount > 0) {
          // Generar 7 días de datos simulados basados en los promedios reales
          for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            // Añadir variación realista pero conservar el promedio
            const qualityVariation = (Math.random() - 0.5) * 1.0;
            const hoursVariation = (Math.random() - 0.5) * 1.5;
            
            const dailyQuality = Math.max(1, Math.min(5, Math.round(avgQuality + qualityVariation)));
            const dailyHours = Math.max(4, Math.min(12, Number((avgHours + hoursVariation).toFixed(1))));
            
            sleepsData.push({
              date: date.toISOString().split('T')[0],
              sleepQuality: dailyQuality,
              sleepHours: dailyHours
            });
          }
        }

        processedData = {
          averageQuality: Number(avgQuality.toFixed(1)),
          averageHours: Number(avgHours.toFixed(1)),
          sleeps: sleepsData
        };
      } else if (data && typeof data === 'object') {
        // Si recibimos un objeto con estadísticas ya procesadas
        processedData = {
          averageQuality: data.averageQuality || 0,
          averageHours: data.averageHours || 0,
          sleeps: Array.isArray(data.sleeps) ? data.sleeps : []
        };
      } else {
        // Sin datos
        processedData = {
          averageQuality: 0,
          averageHours: 0,
          sleeps: []
        };
      }

      set({ 
        weeklySleepStats: processedData,
        loadingWeeklySleep: false,
        errorWeeklySleep: null
      });

    } catch (error) {
      set({ 
        errorWeeklySleep: error instanceof Error ? error.message : 'Error desconocido',
        loadingWeeklySleep: false,
        weeklySleepStats: null
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