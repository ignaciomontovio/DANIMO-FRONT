import { colors } from "@/stores/colors";
import { useStatsStore } from "@/stores/stats";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

type MiniMetricsProps = {
  onPress?: () => void;
};

export default function MiniMetrics({ onPress }: MiniMetricsProps) {
  const {
    monthlyStats,
    loadingMonthly,
    errorMonthly,
    fetchMonthlyStats
  } = useStatsStore();

  // Cargar datos del mes actual al montar el componente
  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    // Solo cargar si no hay datos ya
    if (!monthlyStats && !loadingMonthly) {
      fetchMonthlyStats(currentMonth, currentYear);
    }
  }, []);

  // Función para mapear nombres de emociones
  const mapEmotionName = (emotion: string): string => {
    const emotionMap: Record<string, string> = {
      'alegría': 'alegria',
      'alegria': 'alegria',
      'felicidad': 'alegria',
      'tristeza': 'tristeza',
      'enojo': 'enojo',
      'ira': 'enojo',
      'miedo': 'miedo',
      'ansiedad': 'ansiedad',
    };
    return emotionMap[emotion.toLowerCase()] || emotion.toLowerCase();
  };

  // Colores de las emociones
  const emotionColors: Record<string, string> = {
    alegria: "#FDE846",
    tristeza: "#057BC4", 
    enojo: "#EA2718",
    miedo: "#d150da",
    ansiedad: "#FF872E",
  };

  // Procesar datos para mostrar - incluir todas las emociones
  const processedData = monthlyStats ? 
    Object.keys(monthlyStats).reduce((acc, emotion) => {
      const mappedEmotion = mapEmotionName(emotion);
      acc[mappedEmotion] = monthlyStats[emotion];
      return acc;
    }, {} as Record<string, number>) : null;

  // Crear datos completos con todas las emociones (incluyendo las que están en 0)
  const allEmotions = ['alegria', 'tristeza', 'enojo', 'miedo', 'ansiedad'];
  const completeData = processedData 
    ? allEmotions.reduce((acc, emotion) => {
        acc[emotion] = processedData[emotion] || 0;
        return acc;
      }, {} as Record<string, number>)
    : allEmotions.reduce((acc, emotion) => {
        acc[emotion] = 0;
        return acc;
      }, {} as Record<string, number>);

  // Obtener todas las emociones ordenadas por valor (mayor a menor)
  const sortedEmotions = Object.entries(completeData)
    .sort(([,a], [,b]) => b - a);

  const maxValue = Math.max(...Object.values(completeData), 1); // Mínimo 1 para evitar división por 0

  return (
    <View
      className="w-[160px] h-[264px] bg-color5 rounded-lg p-5 relative m-2 mr-10"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 8, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 10,
      }}
      onTouchEnd={onPress}
    >
      {/* Título */}
      <Text className="text-lg font-bold text-oscuro mb-3 text-center">
        Este Mes
      </Text>

      {/* Contenido según el estado */}
      {loadingMonthly ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.color1} />
          <Text className="text-oscuro text-sm mt-2 text-center">
            Cargando...
          </Text>
        </View>
      ) : errorMonthly ? (
        <View className="flex-1 justify-center items-center px-2">
          <Text className="text-red-500 text-sm text-center mb-1">
            Error al cargar
          </Text>
          <Text className="text-oscuro text-xs text-center">
            {errorMonthly.length > 50 ? errorMonthly.substring(0, 50) + "..." : errorMonthly}
          </Text>
        </View>
      ) : !processedData ? (
        <View className="flex-1 justify-center items-center px-2">
          <Text className="text-oscuro text-sm text-center font-semibold mb-1">
            Sin registros
          </Text>
          <Text className="text-oscuro text-xs text-center opacity-70">
            emocionales este mes
          </Text>
        </View>
      ) : (
        /* Mini gráfico de barras - Todas las emociones */
        <View className="flex-1 justify-center">
          <View className="space-y-2">
            {sortedEmotions.map(([emotion, value], index) => {
              const color = emotionColors[emotion] || "#999";
              const barWidth = maxValue > 0 ? (value / maxValue) * 100 : 0; // Porcentaje del máximo
              
              return (
                <View key={index} className="flex-row items-center space-x-2">
                  {/* Barra */}
                  <View className="flex-1 h-3 bg-gray-200 rounded-full">
                    <View className="h-full rounded-xl"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: color,
                        minWidth: value > 0 ? '10%' : '0%', // Mínimo visible si tiene valor
                      }}
                    />
                  </View>
                  
                  {/* Valor */}
                  <Text className="text-xs font-bold text-oscuro w-6 text-right">
                    {value}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Total de registros */}
          <View className="absolute bottom-0 left-0 right-0">
            <Text className="text-xs text-oscuro opacity-70 text-center">
              {Object.values(completeData).reduce((a, b) => a + b, 0)} registros
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}