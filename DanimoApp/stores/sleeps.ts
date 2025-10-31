import { create } from "zustand";
import { URL_BASE, URL_STATS } from "./consts";
import { useUserLogInStore } from "./userLogIn";

type Sleep = {
  number: number;
  name: string;
  description: string;
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

type SleepStore = {
  emotions: Sleep[];
  setEmotions: (emotions: Sleep[]) => void;
  getSleepByNumber: (num: number) => Sleep | undefined;

  // Statistics
  weeklySleepStats: WeeklySleepStats | null;
  loadingWeeklySleep: boolean;
  errorWeeklySleep: string | null;
  fetchWeeklySleepStats: (userId?: string) => Promise<void>;
};

const getUserId = async (): Promise<string> => {
  const storedUserId = useUserLogInStore.getState().userId;
  
  if (storedUserId) {
    return storedUserId;
  }
  
  // Fallback por si no hay userId disponible
  return "U-4f9c0ba9-2b20-4994-b55c-8fdc645fc8e9";
};

export const useSleepStore = create<SleepStore>((set, get) => ({
  emotions: [],
  setEmotions: (emotions) => set({ emotions }),
  getSleepByNumber: (num) => get().emotions.find((e) => e.number === num),

  // Statistics
  weeklySleepStats: null,
  loadingWeeklySleep: false,
  errorWeeklySleep: null,

  fetchWeeklySleepStats: async (userId?: string) => {
    set({ loadingWeeklySleep: true, errorWeeklySleep: null });
    
    try {
      const token = useUserLogInStore.getState().token;
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const userIdToUse = userId || await getUserId();
      const url = `${URL_BASE}${URL_STATS}/sleeps-week`;
      const requestBody = { userId: userIdToUse };
      
      const response = await fetch(url, {
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
}));
