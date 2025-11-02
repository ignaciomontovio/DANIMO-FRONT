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

  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    if (!monthlyStats && !loadingMonthly) {
      fetchMonthlyStats(currentMonth, currentYear);
    }
  }, []);

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

  const emotionColors: Record<string, string> = {
    alegria: "#FDE846",
    tristeza: "#057BC4", 
    enojo: "#EA2718",
    miedo: "#d150da",
    ansiedad: "#FF872E",
  };

  const emotionLabels: Record<string, string> = {
    alegria: "Alegría",
    tristeza: "Tristeza",
    enojo: "Enojo",
    miedo: "Miedo",
    ansiedad: "Ansiedad",
  };

  const processedData = monthlyStats ? 
    Object.keys(monthlyStats).reduce((acc, emotion) => {
      const mappedEmotion = mapEmotionName(emotion);
      acc[mappedEmotion] = monthlyStats[emotion];
      return acc;
    }, {} as Record<string, number>) : null;

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

  const sortedEmotions = Object.entries(completeData)
    .sort(([,a], [,b]) => b - a);

  const maxValue = Math.max(...Object.values(completeData), 1);

  const getMonthName = () => {
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return months[new Date().getMonth()];
  };

  return (
    <View
      className="w-[160px] h-[264px] bg-color5 rounded-lg p-4 relative m-2 mr-10"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 8, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 10,
      }}
      onTouchEnd={onPress}
    >
      {/* Título mejorado - MÁS COMPACTO */}
      <View className="mb-3">
        <Text className="text-base font-bold text-oscuro text-center">
          {getMonthName()}
        </Text>
        <Text className="text-[10px] text-oscuro opacity-60 text-center">
          Registros emocionales
        </Text>
      </View>

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
        <>
          {/* Gráfico de barras - SIN flex-1 para controlar altura */}
          <View className="space-y-[6px]">
            {sortedEmotions.map(([emotion, value], index) => {
              const color = emotionColors[emotion] || "#999";
              const label = emotionLabels[emotion] || emotion;
              const barWidth = maxValue > 0 ? (value / maxValue) * 100 : 0;
              
              return (
                <View key={index}>
                  {/* Label de la emoción */}
                  <View className="flex-row items-center justify-between mb-[2px]">
                    <Text className="text-[10px] font-semibold text-oscuro">
                      {label}
                    </Text>
                    <Text className="text-[10px] font-bold text-oscuro">
                      {value}
                    </Text>
                  </View>
                  
                  {/* Barra */}
                  <View className="h-[6px] bg-gray-200 rounded-full overflow-hidden">
                    <View 
                      className="h-full rounded-full"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: color,
                        minWidth: value > 0 ? '8%' : '0%',
                      }}
                    />
                  </View>
                </View>
              );
            })}
          </View>

          {/* Total de registros - POSICIÓN ABSOLUTA */}
          <View className="absolute bottom-4 left-4 right-4 pt-2 border-t border-oscuro/10">
            <Text className="text-[10px] text-oscuro font-semibold text-center">
              Total: {Object.values(completeData).reduce((a, b) => a + b, 0)} registros
            </Text>
          </View>
        </>
      )}
    </View>
  );
}