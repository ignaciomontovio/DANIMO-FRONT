import HeaderGoBack from "@/components/headerGoBack";
import { colors } from "@/stores/colors";
import { useStatsStore } from "@/stores/stats";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Dimensions, ScrollView, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

// Datos mock para "Últimos 7 días (todas)"
const weeklyData = {
  tristeza: 8,
  felicidad: 12,
  enojo: 3,
  miedo: 2,
  ansiedad: 6,
};

// Datos mock para "Este Mes"
const monthlyData = {
  tristeza: 15,
  felicidad: 30,
  enojo: 5,
  miedo: 4,
  ansiedad: 10,
};

// Datos mock para "Este Año (predominantes)" - solo las emociones más frecuentes
const yearlyData = {
  felicidad: 180,
  tristeza: 95,
  ansiedad: 60,
  enojo: 45,
  miedo: 30,
};

const calendarData = [
  ["felicidad", "tristeza", "enojo", "felicidad", "miedo", "felicidad", "ansiedad"],
  ["ansiedad", "felicidad", "tristeza", "felicidad", "miedo", "felicidad", "felicidad"],
  ["felicidad", "felicidad", "enojo", "miedo", "felicidad", "felicidad", "tristeza"],
  ["tristeza", "felicidad", "felicidad", "ansiedad", "felicidad", "miedo", "felicidad"],
  ["felicidad", "ansiedad", "tristeza", "enojo", "felicidad", "felicidad", "miedo"],
];

const emotionColors: Record<string, string> = {
  felicidad: "#FDE846",
  tristeza: "#057BC4",
  enojo: "#EA2718",
  miedo: "#d150da",
  ansiedad: "#FF872E",
};

const EmotionChart = ({ title, data, subtitle }: {
  title: string;
  data: Record<string, number>;
  subtitle?: string;
}) => {
  const emociones = Object.keys(data);
  const valores = Object.values(data) as number[];
  const maxValue = Math.max(...valores);

  return (
    <View className="bg-fondo rounded-2xl p-4 shadow-md" style={{ elevation: 5 }}>
      <Text className="text-xl font-bold text-center mb-1 text-oscuro">{title}</Text>
      {subtitle && (
        <Text className="text-sm text-center mb-3 text-oscuro opacity-80">{subtitle}</Text>
      )}
      
      <View className="space-y-3">
        {emociones.map((emocion, index) => {
          const value = valores[index];
          const color = emotionColors[emocion] || "#999";
          const barWidth = (value / maxValue) * (screenWidth - 120);

          return (
            <View key={index} className="flex-row items-center space-x-2">
              <View className="flex-1 h-6 bg-gray-200 rounded-full">
                <View
                  style={{
                    width: barWidth,
                    backgroundColor: color,
                    height: "100%",
                    borderRadius: 12,
                  }}
                />
              </View>
              <Text className="w-8 text-right font-bold text-oscuro">{value}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default function EmotionStatsScreen() {
  const { 
    weeklyStats, 
    loadingWeekly, 
    errorWeekly, 
    fetchWeeklyStats,
    monthlyStats,
    monthlyRawData,
    loadingMonthly,
    errorMonthly,
    fetchMonthlyStats,
    yearlyStats,
    loadingYearly,
    errorYearly,
    fetchYearlyStats
  } = useStatsStore();

  // Cargar datos al entrar a la pantalla
  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // getMonth() devuelve 0-11
    const currentYear = now.getFullYear();
    
    fetchWeeklyStats();
    fetchMonthlyStats(currentMonth, currentYear);
    fetchYearlyStats(currentYear);
  }, []);

  // Función para convertir nombres de emociones de la API a los nombres locales
  const mapEmotionName = (emotion: string): string => {
    const emotionMap: Record<string, string> = {
      'alegría': 'felicidad',
      'alegria': 'felicidad',
      'felicidad': 'felicidad',
      'tristeza': 'tristeza',
      'enojo': 'enojo',
      'ira': 'enojo',
      'miedo': 'miedo',
      'ansiedad': 'ansiedad',
    };
    return emotionMap[emotion.toLowerCase()] || emotion.toLowerCase();
  };

  // Procesar datos semanales para el componente
  const processedWeeklyData = weeklyStats ? 
    Object.keys(weeklyStats).reduce((acc, emotion) => {
      const mappedEmotion = mapEmotionName(emotion);
      acc[mappedEmotion] = weeklyStats[emotion];
      return acc;
    }, {} as Record<string, number>) 
    : weeklyData; // fallback a datos mock

  // Procesar datos mensuales
  const processedMonthlyData = monthlyStats ? 
    Object.keys(monthlyStats).reduce((acc, emotion) => {
      const mappedEmotion = mapEmotionName(emotion);
      acc[mappedEmotion] = monthlyStats[emotion];
      return acc;
    }, {} as Record<string, number>) 
    : monthlyData;

  // Procesar datos anuales
  const processedYearlyData = yearlyStats ? 
    Object.keys(yearlyStats).reduce((acc, emotion) => {
      const mappedEmotion = mapEmotionName(emotion);
      acc[mappedEmotion] = yearlyStats[emotion];
      return acc;
    }, {} as Record<string, number>) 
    : yearlyData;

  // Verificar si hay datos
  const hasWeeklyData = weeklyStats && Object.keys(weeklyStats).length > 0;
  const hasMonthlyData = monthlyStats && Object.keys(monthlyStats).length > 0;
  const hasYearlyData = yearlyStats && Object.keys(yearlyStats).length > 0;

  // Función para generar calendario del mes actual
  const generateCalendar = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    // Primer día del mes y último día del mes
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Día de la semana del primer día (0 = domingo, 1 = lunes, etc.)
    const firstDayWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    // Crear array de fechas para el calendario
    const calendar: (string | null)[][] = [];
    let currentWeek: (string | null)[] = [];
    
    // Llenar días vacíos al inicio
    for (let i = 0; i < firstDayWeek; i++) {
      currentWeek.push(null);
    }
    
    // Llenar días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      currentWeek.push(dateStr);
      
      // Si completamos una semana, la agregamos al calendario
      if (currentWeek.length === 7) {
        calendar.push([...currentWeek]);
        currentWeek = [];
      }
    }
    
    // Llenar días vacíos al final si es necesario
    while (currentWeek.length < 7 && currentWeek.length > 0) {
      currentWeek.push(null);
    }
    if (currentWeek.length > 0) {
      calendar.push(currentWeek);
    }
    
    return calendar;
  };

  // Función para obtener la emoción de una fecha específica
  const getEmotionForDate = (dateStr: string): string | null => {
    if (!monthlyRawData) return null;
    
    // Buscar en los datos raw la emoción de esta fecha
    const emotionForDate = monthlyRawData.find(record => record.date === dateStr);
    
    if (emotionForDate) {
      return mapEmotionName(emotionForDate.emotionName);
    }
    
    return null;
  };

  const calendarDates = generateCalendar();

  return (
    <LinearGradient
      colors={[colors.color5, colors.fondo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full h-full"
    >
      <HeaderGoBack
        text="Estadisticas"
        onPress={() => router.push("/tabs/home")}
      />
      <SafeAreaView className="flex-1">
        <ScrollView className="px-4 pt-6 pb-40">
          {/* Gráfico Semanal */}
          <View className="mb-6">
            {loadingWeekly ? (
              <View className="bg-fondo rounded-2xl p-4 shadow-md items-center justify-center h-40" style={{ elevation: 5 }}>
                <ActivityIndicator size="large" color={colors.color1} />
                <Text className="text-oscuro mt-2">Cargando datos semanales...</Text>
              </View>
            ) : errorWeekly ? (
              <View className="bg-fondo rounded-2xl p-4 shadow-md items-center justify-center h-40" style={{ elevation: 5 }}>
                <Text className="text-red-500 text-center mb-2">Error al cargar datos</Text>
                <Text className="text-oscuro text-center text-sm">{errorWeekly}</Text>
              </View>
            ) : !hasWeeklyData ? (
              <View className="bg-fondo rounded-2xl p-4 shadow-md items-center justify-center h-40" style={{ elevation: 5 }}>
                <Text className="text-oscuro text-center font-semibold mb-2">
                  Aún no posees registros emocionales
                </Text>
                <Text className="text-oscuro text-center text-sm opacity-70">
                  para los últimos 7 días
                </Text>
              </View>
            ) : (
              <EmotionChart 
                title="Últimos 7 días"
                subtitle="(todas)"
                data={processedWeeklyData}
              />
            )}
          </View>

          {/* Gráfico Mensual */}
          <View className="mb-6">
            {loadingMonthly ? (
              <View className="bg-fondo rounded-2xl p-4 shadow-md items-center justify-center h-40" style={{ elevation: 5 }}>
                <ActivityIndicator size="large" color={colors.color1} />
                <Text className="text-oscuro mt-2">Cargando datos mensuales...</Text>
              </View>
            ) : errorMonthly ? (
              <View className="bg-fondo rounded-2xl p-4 shadow-md items-center justify-center h-40" style={{ elevation: 5 }}>
                <Text className="text-red-500 text-center mb-2">Error al cargar datos</Text>
                <Text className="text-oscuro text-center text-sm">{errorMonthly}</Text>
              </View>
            ) : !hasMonthlyData ? (
              <View className="bg-fondo rounded-2xl p-4 shadow-md items-center justify-center h-40" style={{ elevation: 5 }}>
                <Text className="text-oscuro text-center font-semibold mb-2">
                  Aún no posees registros emocionales
                </Text>
                <Text className="text-oscuro text-center text-sm opacity-70">
                  para este mes
                </Text>
              </View>
            ) : (
              <EmotionChart 
                title="Este Mes"
                data={processedMonthlyData}
              />
            )}
          </View>

          {/* Calendario de emociones */}
          <View className="bg-fondo rounded-2xl p-4 shadow-md mb-6" style={{ elevation: 5 }}>
            <Text className="text-xl font-bold text-center mb-4 text-oscuro">
              Calendario de emociones
            </Text>
            <Text className="text-center text-oscuro font-semibold mb-3">
              {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
                .replace(/^\w/, (c) => c.toUpperCase())}
            </Text>
            
            {loadingMonthly ? (
              <View className="items-center justify-center h-40">
                <ActivityIndicator size="large" color={colors.color1} />
                <Text className="text-oscuro mt-2">Cargando calendario...</Text>
              </View>
            ) : errorMonthly ? (
              <View className="items-center justify-center h-40">
                <Text className="text-red-500 text-center mb-2">Error al cargar calendario</Text>
                <Text className="text-oscuro text-center text-sm">{errorMonthly}</Text>
              </View>
            ) : !hasMonthlyData ? (
              <View className="items-center justify-center h-40">
                <Text className="text-oscuro text-center font-semibold mb-2">
                  Aún no posees registros emocionales
                </Text>
                <Text className="text-oscuro text-center text-sm opacity-70">
                  para este mes
                </Text>
              </View>
            ) : (
              <View>
                {/* Header con días de la semana */}
                <View className="flex flex-row justify-center space-x-1 mb-2">
                  {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((dayLetter, index) => (
                    <View
                      key={index}
                      style={{
                        width: 30,
                        height: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text 
                        style={{
                          color: colors.oscuro,
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}
                      >
                        {dayLetter}
                      </Text>
                    </View>
                  ))}
                </View>
                
                {/* Calendario */}
                <View className="flex flex-col space-y-1">
                  {calendarDates.map((week, i) => (
                    <View key={i} className="flex flex-row justify-center space-x-1">
                      {week.map((dateStr, j) => {
                        if (!dateStr) {
                          // Día vacío
                          return (
                            <View
                              key={j}
                              style={{
                                width: 30,
                                height: 30,
                                backgroundColor: 'transparent',
                                borderRadius: 4,
                              }}
                            />
                          );
                        }
                        
                        const emotion = getEmotionForDate(dateStr);
                        const backgroundColor = emotion && emotionColors[emotion] 
                          ? emotionColors[emotion] 
                          : '#ccc'; // Gris si no hay emoción
                        
                        // Extraer el número del día de la fecha
                        const dayNumber = parseInt(dateStr.split('-')[2]);
                        
                        return (
                          <View
                            key={j}
                            style={{
                              width: 30,
                              height: 30,
                              backgroundColor,
                              borderRadius: 4,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Text 
                              style={{
                                color: '#000',
                                fontSize: 10,
                                fontWeight: 'bold',
                              }}
                            >
                              {dayNumber}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Gráfico Anual */}
          <View className="mb-6">
            {loadingYearly ? (
              <View className="bg-fondo rounded-2xl p-4 shadow-md items-center justify-center h-40" style={{ elevation: 5 }}>
                <ActivityIndicator size="large" color={colors.color1} />
                <Text className="text-oscuro mt-2">Cargando datos anuales...</Text>
              </View>
            ) : errorYearly ? (
              <View className="bg-fondo rounded-2xl p-4 shadow-md items-center justify-center h-40" style={{ elevation: 5 }}>
                <Text className="text-red-500 text-center mb-2">Error al cargar datos</Text>
                <Text className="text-oscuro text-center text-sm">{errorYearly}</Text>
              </View>
            ) : !hasYearlyData ? (
              <View className="bg-fondo rounded-2xl p-4 shadow-md items-center justify-center h-40" style={{ elevation: 5 }}>
                <Text className="text-oscuro text-center font-semibold mb-2">
                  Aún no posees registros emocionales
                </Text>
                <Text className="text-oscuro text-center text-sm opacity-70">
                  para este año
                </Text>
              </View>
            ) : (
              <EmotionChart 
                title="Este Año"
                subtitle="(predominantes)"
                data={processedYearlyData}
              />
            )}
          </View>

          {/* Espacio adicional al final */}
          <View className="h-20" />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}