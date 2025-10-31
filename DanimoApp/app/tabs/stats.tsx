import HeaderGoBack from "@/components/headerGoBack";
import { colors } from "@/stores/colors";
import { URL_BASE, URL_STATS } from "@/stores/consts";
import { useStatsStore } from "@/stores/stats";
import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, ScrollView, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Line, Path } from "react-native-svg";

// Import SVG emotions
import Alegria from "@/assets/Emojis/emojis/mios/alegria.svg";
import Ansiedad from "@/assets/Emojis/emojis/mios/ansiedad.svg";
import Enojo from "@/assets/Emojis/emojis/mios/enojo.svg";
import Miedo from "@/assets/Emojis/emojis/mios/miedo.svg";
import Tristeza from "@/assets/Emojis/emojis/mios/tristeza.svg";

const screenWidth = Dimensions.get("window").width;

type EmotionType = 'alegria' | 'tristeza' | 'enojo' | 'miedo' | 'ansiedad';

const emotionColors: Record<EmotionType, string> = {
  alegria: "#FDE846",
  tristeza: "#057BC4",
  enojo: "#EA2718",
  miedo: "#d150da",
  ansiedad: "#FF872E",
};

const emotionLabels: Record<EmotionType, string> = {
  alegria: "Alegría",
  tristeza: "Tristeza",
  enojo: "Enojo",
  miedo: "Miedo",
  ansiedad: "Ansiedad",
};

const emotionSvgs: Record<EmotionType, React.ComponentType<any>> = {
  alegria: Alegria,
  tristeza: Tristeza,
  enojo: Enojo,
  miedo: Miedo,
  ansiedad: Ansiedad,
};

const dayLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const activityColors = [
  "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", 
  "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9", "#F8C471"
];

const DonutChart = ({ data, size = 160 }: { data: Record<EmotionType, number>; size?: number }) => {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  if (total === 0) return null;

  const radius = size / 2 - 20;
  const strokeWidth = 30;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercentage = 0;
  
  return (
    <View className="items-center">
      <View style={{ width: size, height: size }} className="relative">
        <Svg width={size} height={size} className="absolute">
          {Object.entries(data).map(([emotion, value]) => {
            if (value === 0) return null;
            
            const emotionKey = emotion as EmotionType;
            const percentage = value / total;
            const strokeDasharray = `${percentage * circumference} ${circumference}`;
            const strokeDashoffset = -cumulativePercentage * circumference;
            
            cumulativePercentage += percentage;
            
            return (
              <Circle
                key={emotion}
                cx={center}
                cy={center}
                r={radius}
                stroke={emotionColors[emotionKey]}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            );
          })}
        </Svg>
        
        <View 
          className="absolute items-center justify-center bg-fondo rounded-full"
          style={{ 
            width: size - 80, 
            height: size - 80,
            top: 40,
            left: 40,
          }}
        >
          <Text className="text-4xl font-bold" style={{ color: colors.oscuro }}>{total}</Text>
          <Text className="text-sm font-medium" style={{ color: colors.oscuro }}>registros</Text>
        </View>
      </View>
    </View>
  );
};

const EmotionChart = ({ title, data, subtitle, showPercentages = false }: {
  title: string;
  data: Record<EmotionType, number>;
  subtitle?: string;
  showPercentages?: boolean;
}) => {
  const emociones = Object.keys(data) as EmotionType[];
  const valores = Object.values(data);
  const maxValue = Math.max(...valores, 1);
  const totalValue = valores.reduce((sum, val) => sum + val, 0);

  return (
    <View className="bg-fondo bg-opacity-80 rounded-2xl p-4 mb-3">
      <View className="mb-4">
        <Text className="text-lg font-bold text-oscuro mb-1">{title}</Text>
        {subtitle && (
          <Text className="text-sm text-oscuro opacity-70">{subtitle}</Text>
        )}
      </View>
      
      <View className="space-y-3">
        {emociones.map((emocion, index) => {
          const value = valores[index];
          if (value === 0) return null;
          
          const color = emotionColors[emocion];
          const barWidth = maxValue > 0 ? (value / maxValue) * (screenWidth - 140) : 0;
          const percentage = totalValue > 0 ? Math.round((value / totalValue) * 100) : 0;

          return (
            <View key={index}>
              <View className="flex-row items-center space-x-3">
                <View 
                  className="w-8 h-8 rounded-full items-center justify-center"
                  style={{ backgroundColor: color + '30' }}
                >
                  {(() => {
                    const SvgIcon = emotionSvgs[emocion];
                    return <SvgIcon width={20} height={20} />;
                  })()}
                </View>
                <Text className="text-sm font-medium text-oscuro capitalize w-20">
                  {emotionLabels[emocion]}
                </Text>
                <View className="flex-1 flex-row items-center">
                  <View className="flex-1 h-3 rounded-full mr-3 max-w-32" style={{ backgroundColor: '#E5E7EB' }}>
                    <View 
                      className="h-full rounded-full"
                      style={{
                        width: Math.max((barWidth * 0.6), 12),
                        backgroundColor: color,
                      }}
                    />
                  </View>
                  <Text className="text-base font-bold text-oscuro w-10 text-right">{percentage}%</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const CompactBarChart = ({ title, data, subtitle }: {
  title: string;
  data: Record<EmotionType, number>;
  subtitle?: string;
}) => {
  const emociones = Object.keys(data) as EmotionType[];
  const valores = Object.values(data);
  const maxValue = Math.max(...valores, 1);
  const totalValue = valores.reduce((sum, val) => sum + val, 0);

  return (
    <View className="bg-fondo bg-opacity-80 rounded-2xl p-4 mb-3">
      <Text className="text-lg font-bold text-oscuro mb-1">{title}</Text>
      {subtitle && (
        <Text className="text-sm text-oscuro opacity-70 mb-4">{subtitle}</Text>
      )}
      
      <View className="space-y-3">
        {emociones.map((emocion) => {
          const value = valores[emociones.indexOf(emocion)];
          if (value === 0) return null;
          
          const color = emotionColors[emocion];
          const barWidth = (value / maxValue) * (screenWidth - 140);
          const percentage = totalValue > 0 ? Math.round((value / totalValue) * 100) : 0;

          return (
            <View key={emocion} className="flex-row items-center space-x-3">
              <View 
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: color + '30' }}
              >
                {(() => {
                  const SvgIcon = emotionSvgs[emocion];
                  return <SvgIcon width={20} height={20} />;
                })()}
              </View>
              <Text className="text-sm font-medium text-oscuro capitalize w-20">
                {emotionLabels[emocion]}
              </Text>
              <View className="flex-1 flex-row items-center">
                <View className="flex-1 h-3 rounded-full mr-3 max-w-32" style={{ backgroundColor: '#E5E7EB' }}>
                  <View 
                    className="h-full rounded-full"
                    style={{
                      width: Math.max((barWidth * 0.6), 12),
                      backgroundColor: color,
                    }}
                  />
                </View>
                <Text className="text-base font-bold text-oscuro w-10 text-right">{percentage}%</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const RadarChart = ({ data, size = 300 }: { 
  data: Record<EmotionType, number>; 
  size?: number;
}) => {
  const emotions: EmotionType[] = ['alegria', 'ansiedad', 'miedo', 'enojo', 'tristeza'];
  const center = size / 2;
  const maxRadius = (size / 2) - 50;
  const levels = 5;
  
  // Normalizar los valores a un máximo de 5
  const maxValue = Math.max(...Object.values(data), 1);
  const normalizedData = emotions.map(emotion => ({
    emotion,
    value: data[emotion],
    normalizedValue: (data[emotion] / maxValue) * 5
  }));

  // Calcular puntos del polígono
  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / emotions.length - Math.PI / 2;
    const radius = (value / 5) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle)
    };
  };

  // Calcular puntos para las etiquetas
  const getLabelPoint = (index: number) => {
    const angle = (Math.PI * 2 * index) / emotions.length - Math.PI / 2;
    const labelRadius = maxRadius + 35;
    return {
      x: center + labelRadius * Math.cos(angle),
      y: center + labelRadius * Math.sin(angle)
    };
  };

  // Calcular puntos para las líneas de nivel
  const getLevelPoints = (level: number) => {
    return emotions.map((_, index) => {
      const angle = (Math.PI * 2 * index) / emotions.length - Math.PI / 2;
      const radius = (level / levels) * maxRadius;
      return {
        x: center + radius * Math.cos(angle),
        y: center + radius * Math.sin(angle)
      };
    });
  };

  // Generar path del polígono de datos
  const dataPath = normalizedData.map((item, index) => {
    const point = getPoint(index, item.normalizedValue);
    return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
  }).join(' ') + ' Z';

  // Generar paths de los niveles
  const levelPaths = Array.from({ length: levels }, (_, i) => {
    const level = i + 1;
    const points = getLevelPoints(level);
    return points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z';
  });

  return (
    <View className="items-center">
      <View style={{ width: size, height: size }} className="relative">
        <Svg width={size} height={size}>
          {/* Niveles de fondo */}
          {levelPaths.map((path, index) => (
            <Path
              key={index}
              d={path}
              fill="none"
              stroke={colors.color5}
              strokeWidth={1}
              opacity={0.3}
            />
          ))}

          {/* Líneas desde el centro a cada vértice */}
          {emotions.map((_, index) => {
            const point = getPoint(index, 5);
            return (
              <Line
                key={index}
                x1={center}
                y1={center}
                x2={point.x}
                y2={point.y}
                stroke={colors.color5}
                strokeWidth={1}
                opacity={0.3}
              />
            );
          })}

          {/* Polígono de datos */}
          <Path
            d={dataPath}
            fill={colors.color1}
            fillOpacity={0.3}
            stroke={colors.color1}
            strokeWidth={3}
          />

          {/* Puntos en cada vértice */}
          {normalizedData.map((item, index) => {
            if (item.value === 0) return null; // Solo dibujamos si tiene registros
            
            const point = getPoint(index, item.normalizedValue);
            return (
              <Circle
                key={index}
                cx={point.x}
                cy={point.y}
                r={6}
                fill={emotionColors[item.emotion]}
                stroke="#FFFFFF"
                strokeWidth={3}
              />
            );
          })}
        </Svg>

        {/* Etiquetas de emociones en las esquinas */}
        {normalizedData.map((item, index) => {
          const labelPoint = getLabelPoint(index);
          const SvgIcon = emotionSvgs[item.emotion];
          
          return (
            <View
              key={item.emotion}
              className="absolute items-center justify-center"
              style={{
                left: labelPoint.x - 20,
                top: labelPoint.y - 20,
                width: 40,
              }}
            >
              <View 
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ 
                  backgroundColor: emotionColors[item.emotion] + '30'
                }}
              >
                <SvgIcon width={24} height={24} />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const DailyMoodBar = ({ monthlyRawData, mapEmotionName }: { 
  monthlyRawData: any[] | null;
  mapEmotionName: (emotion: string) => EmotionType;
}) => {
  
  const getDayOfWeekStats = () => {
    if (!monthlyRawData || monthlyRawData.length === 0) {
      return dayLabels.map(() => ({ emotions: [], totalCount: 0, isTie: false }));
    }

    const dayStats: Record<number, Record<EmotionType, number>> = {};
    
    monthlyRawData.forEach(record => {
      const [year, month, day] = record.date.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();
      const emotion = mapEmotionName(record.emotionName);
      
      if (!dayStats[dayOfWeek]) {
        dayStats[dayOfWeek] = {
          alegria: 0,
          tristeza: 0, 
          enojo: 0,
          miedo: 0,
          ansiedad: 0
        };
      }
      
      dayStats[dayOfWeek][emotion]++;
    });

    return dayLabels.map((_, index) => {
      const dayData = dayStats[index];
      if (!dayData) {
        return { emotions: [], totalCount: 0, isTie: false };
      }
      
      const maxCount = Math.max(...Object.values(dayData));
      if (maxCount === 0) {
        return { emotions: [], totalCount: 0, isTie: false };
      }
      
      const topEmotions = Object.entries(dayData)
        .filter(([_, count]) => count === maxCount)
        .map(([emotion, count]) => ({ emotion: emotion as EmotionType, count }));
      
      return {
        emotions: topEmotions,
        totalCount: maxCount,
        isTie: topEmotions.length > 1
      };
    });
  };

  const weeklyData = getDayOfWeekStats();
  const maxCount = Math.max(...weeklyData.map(d => d.totalCount), 1);
  const hasData = weeklyData.some(d => d.totalCount > 0);

  if (!hasData) {
    return (
      <View className="bg-fondo bg-opacity-80 rounded-2xl p-4 mb-3">
        <Text className="text-lg font-bold text-oscuro mb-1">Patrones Semanales</Text>
        <Text className="text-sm text-oscuro opacity-70 mb-2">Este mes</Text>
        <Text className="text-xs text-oscuro opacity-50 mb-4">Basado en tus registros de este mes, qué emoción experimentas más cada día de la semana</Text>
        
        <View className="items-center py-6">
          <FontAwesome name="bar-chart" size={60} color={colors.oscuro} style={{ opacity: 0.5, marginBottom: 16 }} />
          <Text className="text-oscuro text-center opacity-70">Sin suficientes registros para mostrar patrones semanales</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-fondo bg-opacity-80 rounded-2xl p-4 mb-3">
      <Text className="text-lg font-bold text-oscuro mb-1">Patrones Semanales</Text>
      <Text className="text-sm text-oscuro opacity-70 mb-2">Este mes</Text>
      <Text className="text-xs text-oscuro opacity-50 mb-4">Basado en tus registros de este mes, qué emoción experimentas más cada día de la semana</Text>
      
      <View className="flex-row justify-between items-end h-32">
        {dayLabels.map((day, index) => {
          const dayData = weeklyData[index];
          const { emotions, totalCount, isTie } = dayData;
          const barHeight = maxCount > 0 ? (totalCount / maxCount) * 100 : 0;
          const hasData = totalCount > 0;
          
          return (
            <View key={day} className="items-center space-y-3">
              <View 
                className="w-8 rounded-t overflow-hidden"
                style={{ 
                  height: Math.max(barHeight, hasData ? 12 : 8),
                  minHeight: 8,
                  backgroundColor: !hasData ? colors.color5 : 'transparent',
                  opacity: !hasData ? 0.3 : 1,
                }}
              >
                {hasData && emotions.map((emotionData, emotionIndex) => (
                  <View
                    key={emotionIndex}
                    style={{
                      height: `${100 / emotions.length}%`,
                      backgroundColor: emotionColors[emotionData.emotion],
                      width: '100%'
                    }}
                  />
                ))}
              </View>
              
              <Text className="text-xs text-oscuro font-medium text-center">
                {day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const LoadingCard = ({ message }: { message: string }) => (
  <View className="bg-fondo bg-opacity-80 rounded-2xl p-8 items-center mb-3">
    <ActivityIndicator size="large" color={colors.color1} />
    <Text className="text-oscuro mt-4 text-center font-medium">{message}</Text>
  </View>
);

const ErrorCard = ({ message }: { message: string }) => (
  <View className="bg-fondo bg-opacity-80 rounded-2xl p-8 items-center mb-3">
    <FontAwesome name="exclamation-triangle" size={60} color="#EA2718" style={{ marginBottom: 16 }} />
    <Text className="text-red-600 text-center text-lg font-semibold mb-2">Error al cargar datos</Text>
    <Text className="text-oscuro text-center opacity-70">{message}</Text>
  </View>
);

const EmptyStateCard = ({ title, subtitle, isProfessionalView = false }: { 
  title: string; 
  subtitle: string;
  isProfessionalView?: boolean;
}) => (
  <View className="bg-fondo bg-opacity-80 rounded-2xl p-8 items-center mb-3">
    <FontAwesome name="pie-chart" size={60} color={colors.oscuro} style={{ opacity: 0.5, marginBottom: 16 }} />
    <Text className="text-xl font-bold text-center text-oscuro mb-2">{title}</Text>
    <Text className="text-base text-center text-oscuro opacity-70 mb-6">{subtitle}</Text>
    {!isProfessionalView && (
      <TouchableOpacity 
        className="bg-color1 rounded-xl px-6 py-3"
        onPress={() => router.push("/tabs/home")}
      >
        <Text className="text-fondo font-semibold">Registrar emoción</Text>
      </TouchableOpacity>
    )}
  </View>
);

const SleepStatsCard = ({ 
  weeklySleepStats, 
  dayLabels, 
  screenWidth, 
  colors 
}: { 
  weeklySleepStats: any;
  dayLabels: string[];
  screenWidth: number;
  colors: any;
}) => {
  // Helper function para obtener color por calidad
  const getQualityColor = (quality: number) => {
    if (quality >= 4) return colors.color1; // Rosa principal - Excelente
    if (quality >= 3) return colors.color2; // Rosa claro - Bueno  
    if (quality >= 2) return colors.color4; // Lavanda - Regular
    return colors.color5; // Lavanda oscuro - Malo/Sin datos
  };

  return (
    <View className="bg-fondo rounded-3xl p-5 shadow-lg mb-4" style={{ elevation: 8 }}>
      <Text className="text-lg font-bold text-oscuro mb-1">Estadísticas de Sueño</Text>
      <Text className="text-sm text-oscuro opacity-70 mb-4">
        Tus registros de sueño de los últimos 7 días
      </Text>
      
      {/* Gráfico de barras por día */}
      <View className="space-y-3">
        <Text className="text-sm font-bold text-oscuro">Detalle por día:</Text>
        {dayLabels.map((dayLabel, index) => {
          // Buscar datos del día por fecha
          const today = new Date();
          const targetDate = new Date(today);
          targetDate.setDate(today.getDate() - (today.getDay() - index + 7) % 7);
          const dateStr = targetDate.toISOString().split('T')[0];
          
          const dayData = weeklySleepStats.sleeps.find((sleep: any) => 
            sleep.date.split('T')[0] === dateStr
          );
          const hours = dayData?.sleepHours || 0;
          const quality = dayData?.sleepQuality || 0;
          const maxHours = 12; // Escala máxima para las barras
          const barWidth = hours > 0 ? (hours / maxHours) * (screenWidth - 160) : 0;
          
          return (
            <View key={index} className="flex-row items-center space-x-3">
              <Text className="text-xs font-medium text-oscuro w-8">
                {dayLabel}
              </Text>
              
              <View className="flex-1">
                <View className="h-6 rounded-lg overflow-hidden" style={{ backgroundColor: colors.fondo }}>
                  {hours > 0 && (
                    <View 
                      className="h-full rounded-lg flex-row items-center justify-center"
                      style={{ 
                        width: Math.max(barWidth, 40),
                        backgroundColor: getQualityColor(quality)
                      }}
                    >
                      <Text className="text-xs font-bold" style={{ color: colors.oscuro }}>
                        {hours.toFixed(1)}h
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              
              <View className="w-12 items-center">
                {quality > 0 ? (
                  <Text className="text-xs font-bold text-oscuro">
                    {quality}/5
                  </Text>
                ) : (
                  <Text className="text-xs text-oscuro opacity-50">-</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
      
      {/* Leyenda de calidad */}
      <View className="mt-4 pt-3 border-t" style={{ borderColor: colors.color5 }}>
        <Text className="text-xs font-medium text-oscuro mb-2">Calidad del sueño:</Text>
        <View className="flex-row justify-around">
          <View className="flex-row items-center space-x-1">
            <View className="w-3 h-3 rounded" style={{ backgroundColor: colors.color1 }} />
            <Text className="text-xs text-oscuro">Excelente (4-5)</Text>
          </View>
          <View className="flex-row items-center space-x-1">
            <View className="w-3 h-3 rounded" style={{ backgroundColor: colors.color2 }} />
            <Text className="text-xs text-oscuro">Bueno (3)</Text>
          </View>
          <View className="flex-row items-center space-x-1">
            <View className="w-3 h-3 rounded" style={{ backgroundColor: colors.color4 }} />
            <Text className="text-xs text-oscuro">Regular (2)</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const ActivityDonutChart = ({ data, size = 160 }: { data: Record<string, number>; size?: number }) => {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  if (total === 0) return null;

  const radius = size / 2 - 20;
  const strokeWidth = 30;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercentage = 0;
  const sortedActivities = Object.entries(data).sort(([,a], [,b]) => b - a);
  
  return (
    <View className="items-center">
      <View style={{ width: size, height: size }} className="relative">
        <Svg width={size} height={size} className="absolute">
          {sortedActivities.map(([activity, value], index) => {
            if (value === 0) return null;
            
            const percentage = value / total;
            const strokeDasharray = `${percentage * circumference} ${circumference}`;
            const strokeDashoffset = -cumulativePercentage * circumference;
            const color = activityColors[index % activityColors.length];
            
            cumulativePercentage += percentage;
            
            return (
              <Circle
                key={activity}
                cx={center}
                cy={center}
                r={radius}
                stroke={color}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            );
          })}
        </Svg>
        
        <View 
          className="absolute items-center justify-center bg-fondo rounded-full"
          style={{ 
            width: size - 80, 
            height: size - 80,
            top: 40,
            left: 40,
          }}
        >
          <Text className="text-4xl font-bold" style={{ color: colors.oscuro }}>{total}</Text>
          <Text className="text-sm font-medium" style={{ color: colors.oscuro }}>actividades</Text>
        </View>
      </View>
    </View>
  );
};

export default function EmotionStatsScreen() {
  const { patientId } = useLocalSearchParams<{ patientId?: string }>();
  
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
    fetchYearlyStats,
    weeklyActivities,
    monthlyActivities,
    loadingWeeklyActivities,
    loadingMonthlyActivities,
    errorWeeklyActivities,
    errorMonthlyActivities,
    fetchWeeklyActivities,
    fetchMonthlyActivities,
    weeklySleepStats,
    loadingWeeklySleep,
    errorWeeklySleep,
    fetchWeeklySleepStats
  } = useStatsStore();



  const [calendarDate, setCalendarDate] = useState({ month: 0, year: 0 });
  const [activityMonthDate, setActivityMonthDate] = useState({ month: 0, year: 0 });
  const [radarDate, setRadarDate] = useState({ month: 0, year: 0 });

  useFocusEffect(
    useCallback(() => {
      const now = new Date();
      setCalendarDate({ month: now.getMonth() + 1, year: now.getFullYear() });
      setActivityMonthDate({ month: now.getMonth() + 1, year: now.getFullYear() });
      setRadarDate({ month: now.getMonth() + 1, year: now.getFullYear() });
    }, [])
  );

  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    // Pasar patientId a TODAS las funciones de stats
    fetchWeeklyStats(patientId);
    fetchMonthlyStats(currentMonth, currentYear, patientId);
    fetchYearlyStats(currentYear, patientId);
    
    // Pasar patientId si existe (cuando es profesional viendo stats de paciente)
    fetchWeeklyActivities(patientId).catch(console.error);
    fetchMonthlyActivities(currentMonth, currentYear, patientId).catch(console.error);
    
    // Agregar llamada para sleep stats
    fetchWeeklySleepStats(patientId);
    
    setCalendarData(null);
    setLoadingCalendar(true);
    setActivityMonthDate({ month: currentMonth, year: currentYear });
  }, [patientId]);

  useEffect(() => {
    if (activityMonthDate.month === 0) return;
    // Pasar patientId cuando cambia el mes
    fetchMonthlyActivities(activityMonthDate.month, activityMonthDate.year, patientId).catch(console.error);
  }, [activityMonthDate, patientId]);

  const navigateCalendarMonth = (direction: 'prev' | 'next') => {
    setCalendarDate(prev => {
      let newMonth = prev.month;
      let newYear = prev.year;
      
      if (direction === 'prev') {
        newMonth--;
        if (newMonth < 1) {
          newMonth = 12;
          newYear--;
        }
      } else {
        newMonth++;
        if (newMonth > 12) {
          newMonth = 1;
          newYear++;
        }
      }
      
      return { month: newMonth, year: newYear };
    });
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return calendarDate.month === now.getMonth() + 1 && calendarDate.year === now.getFullYear();
  };

  const navigateActivityMonth = (direction: 'prev' | 'next') => {
    setActivityMonthDate(prev => {
      let newMonth = prev.month;
      let newYear = prev.year;
      
      if (direction === 'prev') {
        newMonth--;
        if (newMonth < 1) {
          newMonth = 12;
          newYear--;
        }
      } else {
        newMonth++;
        if (newMonth > 12) {
          newMonth = 1;
          newYear++;
        }
      }
      
      return { month: newMonth, year: newYear };
    });
  };

  const isCurrentActivityMonth = () => {
    const now = new Date();
    return activityMonthDate.month === now.getMonth() + 1 && activityMonthDate.year === now.getFullYear();
  };

  const navigateRadarMonth = (direction: 'prev' | 'next') => {
    setRadarDate(prev => {
      let newMonth = prev.month;
      let newYear = prev.year;
      
      if (direction === 'prev') {
        newMonth--;
        if (newMonth < 1) {
          newMonth = 12;
          newYear--;
        }
      } else {
        newMonth++;
        if (newMonth > 12) {
          newMonth = 1;
          newYear++;
        }
      }
      
      return { month: newMonth, year: newYear };
    });
  };

  const isCurrentRadarMonth = () => {
    const now = new Date();
    return radarDate.month === now.getMonth() + 1 && radarDate.year === now.getFullYear();
  };

  const [calendarData, setCalendarData] = useState<any[] | null>(null);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [radarData, setRadarData] = useState<Record<string, number> | null>(null);
  const [loadingRadar, setLoadingRadar] = useState(false);

  const fetchCalendarDataOnly = async (month: number, year: number) => {
    setLoadingCalendar(true);
    try {
      const token = useUserLogInStore.getState().token;
      if (!token) throw new Error('No hay token de autenticación');
      
      const bodyData = patientId ? { month, year, userId: patientId } : { month, year };
      
      const response = await fetch(URL_BASE + URL_STATS + '/month', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(bodyData),
      });
      
      if (!response.ok) {
        const errorText = await response.json();
        throw new Error(errorText.error);
      }
      
      const data = await response.json();
      setCalendarData(data);
    } catch (error) {
      console.error('Error loading calendar data:', error);
      setCalendarData([]);
    } finally {
      setLoadingCalendar(false);
    }
  };

  const fetchRadarDataOnly = async (month: number, year: number) => {
    setLoadingRadar(true);
    try {
      const token = useUserLogInStore.getState().token;
      if (!token) throw new Error('No hay token de autenticación');
      
      const bodyData = patientId ? { month, year, userId: patientId } : { month, year };
      
      const response = await fetch(URL_BASE + URL_STATS + '/month', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(bodyData),
      });
      
      if (!response.ok) {
        const errorText = await response.json();
        throw new Error(errorText.error);
      }
      
      const rawData = await response.json();
      
      // Procesar los datos para obtener el conteo de emociones
      const emotionCounts: Record<string, number> = {};
      if (Array.isArray(rawData)) {
        rawData.forEach(record => {
          const emotion = mapEmotionName(record.emotionName);
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        });
      }
      
      setRadarData(emotionCounts);
    } catch (error) {
      console.error('Error loading radar data:', error);
      setRadarData(null);
    } finally {
      setLoadingRadar(false);
    }
  };

  useEffect(() => {
    if (calendarDate.month === 0) return;
    if (isCurrentMonth()) {
      setLoadingCalendar(loadingMonthly);
      if (!loadingMonthly && monthlyRawData) {
        setCalendarData(monthlyRawData);
      }
    } else {
      fetchCalendarDataOnly(calendarDate.month, calendarDate.year);
    }
  }, [calendarDate, monthlyRawData, loadingMonthly, patientId]);

  useEffect(() => {
    if (radarDate.month === 0) return;
    if (isCurrentRadarMonth()) {
      setLoadingRadar(loadingMonthly);
      if (!loadingMonthly && monthlyStats) {
        setRadarData(monthlyStats);
      }
    } else {
      fetchRadarDataOnly(radarDate.month, radarDate.year);
    }
  }, [radarDate, monthlyStats, loadingMonthly, patientId]);

  const mapEmotionName = (emotion: string): EmotionType => {
    const emotionMap: Record<string, EmotionType> = {
      'alegría': 'alegria',
      'alegria': 'alegria',
      'felicidad': 'alegria',
      'tristeza': 'tristeza',
      'enojo': 'enojo',
      'ira': 'enojo',
      'miedo': 'miedo',
      'ansiedad': 'ansiedad',
    };
    return emotionMap[emotion.toLowerCase()] || 'alegria';
  };

  const ensureAllEmotions = (data: Record<string, number> | null): Record<EmotionType, number> => {
    const allEmotions: EmotionType[] = ['alegria', 'tristeza', 'enojo', 'miedo', 'ansiedad'];
    const result: Record<EmotionType, number> = {} as Record<EmotionType, number>;
    
    allEmotions.forEach(emotion => {
      result[emotion] = data?.[emotion] || 0;
    });
    
    return result;
  };

  const processData = (stats: Record<string, number> | null): Record<string, number> => {
    if (!stats) return {};
    return Object.keys(stats).reduce((acc, emotion) => {
      const mappedEmotion = mapEmotionName(emotion);
      acc[mappedEmotion] = stats[emotion];
      return acc;
    }, {} as Record<string, number>);
  };

  const completeWeeklyData = ensureAllEmotions(processData(weeklyStats));
  const completeMonthlyData = ensureAllEmotions(processData(monthlyStats));
  const completeYearlyData = ensureAllEmotions(processData(yearlyStats));

  const hasWeeklyData = weeklyStats && Object.values(weeklyStats).some(value => value > 0);
  const hasMonthlyData = monthlyStats && Object.values(monthlyStats).some(value => value > 0);
  const hasYearlyData = yearlyStats && Object.values(yearlyStats).some(value => value > 0);

  const generateCalendar = () => {
    const year = calendarDate.year;
    const month = calendarDate.month - 1;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const calendar: (string | null)[][] = [];
    let currentWeek: (string | null)[] = [];
    
    for (let i = 0; i < firstDayWeek; i++) {
      currentWeek.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      currentWeek.push(dateStr);
      
      if (currentWeek.length === 7) {
        calendar.push([...currentWeek]);
        currentWeek = [];
      }
    }
    
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      calendar.push(currentWeek);
    }
    
    return calendar;
  };

  const getEmotionForDate = (dateStr: string): EmotionType | null => {
    if (!calendarData || calendarData.length === 0) return null;
    const emotionForDate = calendarData.find(record => record.date === dateStr);
    return emotionForDate ? mapEmotionName(emotionForDate.emotionName) : null;
  };

  const calendarDates = generateCalendar();
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const currentMonth = monthNames[new Date().getMonth()];
  const currentYear = new Date().getFullYear();

  // Helper function to get capitalized month name
  const getCapitalizedMonthYear = (month: number, year: number) => {
    return `${monthNames[month - 1]} ${year}`;
  };

  return (
    <LinearGradient
      colors={[colors.color5, colors.fondo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full h-full"
    >
      {patientId ? (
        <HeaderGoBack
          text="Estadísticas del Paciente"
          onPress={() => router.push({
            pathname: "/screensOnlyProf/patientsDetail",
            params: { patientId }
          })}
        />
      ) : (
        <HeaderGoBack
          text="Estadísticas"
          onPress={() => router.push("/tabs/home")}
        />
      )}
      <SafeAreaView className="flex-1">
        <ScrollView className="px-4 pt-4 pb-40" showsVerticalScrollIndicator={false}>
          
          {/* 1. Resumen General con Gráfico Circular */}
          {loadingMonthly ? (
            <LoadingCard message="Cargando resumen..." />
          ) : errorMonthly ? (
            <ErrorCard message={errorMonthly} />
          ) : !hasMonthlyData ? (
            <EmptyStateCard 
              title="Círculo Emocional" 
              subtitle={patientId 
                ? "El paciente no tiene registros de emociones este mes" 
                : "Registra tus emociones para ver tu resumen"}
              isProfessionalView={!!patientId}
            />
          ) : (
            <View className="bg-fondo bg-opacity-80 rounded-2xl p-5 mb-3">
              <Text className="text-lg font-bold text-oscuro mb-1">Círculo Emocional</Text>
              <Text className="text-sm text-oscuro opacity-70 mb-4">
                {currentMonth} {currentYear}
              </Text>
              
              <DonutChart data={completeMonthlyData} size={180} />
              
              <View className="flex-row justify-center flex-wrap mt-4 space-x-2">
                {(Object.entries(completeMonthlyData) as [EmotionType, number][]).map(([emotion, value]) => {
                  if (value === 0) return null;
                  const SvgIcon = emotionSvgs[emotion];
                  return (
                    <View key={emotion} className="items-center m-1">
                      <View 
                        className="w-10 h-10 rounded-full items-center justify-center mb-1"
                        style={{ backgroundColor: emotionColors[emotion] + '40' }}
                      >
                        <SvgIcon width={24} height={24} />
                      </View>
                      <Text className="text-xs text-oscuro font-bold">{value}</Text>
                      <Text className="text-xs text-oscuro opacity-70">
                        {emotionLabels[emotion]}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* 2. Últimos 7 días */}
          {loadingWeekly ? (
            <LoadingCard message="Cargando semana..." />
          ) : errorWeekly ? (
            <ErrorCard message={errorWeekly} />
          ) : !hasWeeklyData ? (
            <EmptyStateCard 
              title="Últimos 7 días" 
              subtitle={patientId 
                ? "El paciente no tiene registros en los últimos 7 días" 
                : "Registra emociones para ver tu progreso semanal"}
              isProfessionalView={!!patientId}
            />
          ) : (
            <CompactBarChart 
              title="Últimos 7 días"
              subtitle="Registros recientes"
              data={completeWeeklyData}
            />
          )}

          {/* 3. Este mes */}
          {loadingMonthly ? (
            <LoadingCard message="Cargando mes..." />
          ) : errorMonthly ? (
            <ErrorCard message={errorMonthly} />
          ) : !hasMonthlyData ? (
            <EmptyStateCard 
              title="Este mes" 
              subtitle={patientId 
                ? "El paciente no tiene registros este mes" 
                : "Registra emociones para ver tu progreso mensual detallado"}
              isProfessionalView={!!patientId}
            />
          ) : (
            <EmotionChart 
              title="Este mes"
              subtitle={`${currentMonth} ${currentYear} - Vista detallada`}
              data={completeMonthlyData}
              showPercentages={true}
            />
          )}

          {/* 4. Gráfico de radar */}
          {(hasMonthlyData || radarData) && (
            <View className="bg-fondo bg-opacity-80 rounded-2xl p-4 mb-3">
              <View className="mb-4">
                <Text className="text-lg font-bold text-oscuro mb-1">Radar Emocional</Text>
                
                <View className="flex-row justify-center items-center space-x-4 mb-2">
                  <TouchableOpacity 
                    className="p-2"
                    onPress={() => navigateRadarMonth('prev')}
                  >
                    <FontAwesome name="chevron-left" size={16} color={colors.color1} />
                  </TouchableOpacity>
                  
                  <Text className="text-sm text-center text-oscuro opacity-70 px-4">
                    {getCapitalizedMonthYear(radarDate.month, radarDate.year)}
                  </Text>
                  
                  <TouchableOpacity 
                    className="p-2"
                    onPress={() => navigateRadarMonth('next')}
                    disabled={isCurrentRadarMonth()}
                    style={{ opacity: isCurrentRadarMonth() ? 0.3 : 1 }}
                  >
                    <FontAwesome 
                      name="chevron-right" 
                      size={16} 
                      color={isCurrentRadarMonth() ? colors.oscuro : colors.color1} 
                    />
                  </TouchableOpacity>
                </View>
                
                {!isCurrentRadarMonth() && (
                  <TouchableOpacity 
                    className="mt-2 rounded-lg px-3 py-1 self-center border border-color1"
                    style={{ backgroundColor: colors.color1 + '20' }}
                    onPress={() => {
                      const now = new Date();
                      setRadarDate({ month: now.getMonth() + 1, year: now.getFullYear() });
                    }}
                  >
                    <Text className="text-xs font-medium" style={{ color: colors.color1 }}>
                      Volver al mes actual
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              
              {loadingRadar ? (
                <View className="items-center py-8">
                  <ActivityIndicator size="large" color={colors.color1} />
                  <Text className="text-oscuro mt-4">Cargando radar emocional...</Text>
                </View>
              ) : (
                <RadarChart 
                  data={ensureAllEmotions(processData(isCurrentRadarMonth() ? monthlyStats : radarData))} 
                  size={280} 
                />
              )}
            </View>
          )}

          {/* 5. Patrones Semanales */}
          {hasMonthlyData && <DailyMoodBar monthlyRawData={monthlyRawData} mapEmotionName={mapEmotionName} />}

          {/* 6. Calendario */}
          <View className="bg-fondo rounded-3xl p-5 shadow-lg mb-4" style={{ elevation: 8 }}>
            <View className="mb-6">
              <Text className="text-xl font-bold text-center text-oscuro mb-1">
                Calendario emocional
              </Text>
              
              <View className="flex-row justify-center items-center space-x-4">
                <TouchableOpacity 
                  className="p-2"
                  onPress={() => navigateCalendarMonth('prev')}
                >
                  <FontAwesome name="chevron-left" size={16} color={colors.color1} />
                </TouchableOpacity>
                
                <Text className="text-sm text-center text-oscuro opacity-70 px-4">
                  {getCapitalizedMonthYear(calendarDate.month, calendarDate.year)}
                </Text>
                
                <TouchableOpacity 
                  className="p-2"
                  onPress={() => navigateCalendarMonth('next')}
                  disabled={isCurrentMonth()}
                  style={{ opacity: isCurrentMonth() ? 0.3 : 1 }}
                >
                  <FontAwesome 
                    name="chevron-right" 
                    size={16} 
                    color={isCurrentMonth() ? colors.oscuro : colors.color1} 
                  />
                </TouchableOpacity>
              </View>
              
              {!isCurrentMonth() && (
                <TouchableOpacity 
                  className="mt-2 rounded-lg px-3 py-1 self-center border border-color1"
                  style={{ backgroundColor: colors.color1 + '20' }}
                  onPress={() => {
                    const now = new Date();
                    setCalendarDate({ month: now.getMonth() + 1, year: now.getFullYear() });
                  }}
                >
                  <Text className="text-xs font-medium" style={{ color: colors.color1 }}>
                    Volver al mes actual
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            
            {loadingCalendar ? (
              <View className="items-center py-8">
                <ActivityIndicator size="large" color={colors.color1} />
                <Text className="text-oscuro mt-4">Cargando calendario...</Text>
              </View>
            ) : !calendarData || calendarData.length === 0 ? (
              <View className="items-center py-8">
                <FontAwesome name="calendar-o" size={60} color={colors.oscuro} style={{ opacity: 0.5, marginBottom: 16 }} />
                <Text className="text-base text-center text-oscuro opacity-70 mb-6">
                  {patientId 
                    ? `El paciente no tiene registros en ${getCapitalizedMonthYear(calendarDate.month, calendarDate.year)}`
                    : `Sin registros en ${getCapitalizedMonthYear(calendarDate.month, calendarDate.year)}`
                  }
                </Text>
                {isCurrentMonth() && !patientId && (
                  <TouchableOpacity 
                    className="bg-color1 rounded-xl px-6 py-3"
                    onPress={() => router.push("/tabs/home")}
                  >
                    <Text className="text-fondo font-semibold">Registrar emoción</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View>
                <View className="flex-row justify-center mb-4">
                  {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((day, index) => (
                    <View key={index} className="w-10 h-8 justify-center items-center">
                      <Text className="text-sm font-bold text-color1">{day}</Text>
                    </View>
                  ))}
                </View>

                <View className="space-y-2">
                  {calendarDates.map((week, i) => (
                    <View key={i} className="flex-row justify-center space-x-1">
                      {week.map((dateStr, j) => {
                        if (!dateStr) {
                          return <View key={j} className="w-10 h-10" />;
                        }
                        
                        const emotion = getEmotionForDate(dateStr);
                        const backgroundColor = emotion && emotionColors[emotion] 
                          ? emotionColors[emotion] 
                          : colors.color5;
                        const dayNumber = parseInt(dateStr.split('-')[2]);
                        const isToday = dateStr === new Date().toISOString().split('T')[0];
                        
                        return (
                          <View
                            key={j}
                            className="w-10 h-10 rounded-xl items-center justify-center"
                            style={{ 
                              backgroundColor,
                              opacity: emotion ? 1 : 0.3,
                              borderWidth: isToday ? 3 : 0,
                              borderColor: isToday ? '#6B7280' : 'transparent',
                            }}
                          >
                            <Text className={`text-xs font-bold ${
                              emotion ? 'text-white' : 'text-oscuro'
                            }`}>
                              {dayNumber}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  ))}
                </View>

                <View className="mt-6 pt-4 border-t border-color5">
                  <Text className="text-center text-oscuro font-semibold mb-3">Emociones</Text>
                  <View className="flex-row flex-wrap justify-center space-x-4">
                    {(Object.entries(emotionColors) as [EmotionType, string][]).map(([emotion, color]) => {
                      const SvgIcon = emotionSvgs[emotion];
                      return (
                        <View key={emotion} className="flex-row items-center space-x-2 mb-2">
                          <View 
                            className="w-8 h-8 rounded items-center justify-center"
                            style={{ backgroundColor: color + '30' }}
                          >
                            <SvgIcon width={20} height={20} />
                          </View>
                          <Text className="text-sm text-oscuro">
                            {emotionLabels[emotion]}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* 7. Este Año */}
          {loadingYearly ? (
            <LoadingCard message="Cargando año..." />
          ) : errorYearly ? (
            <ErrorCard message={errorYearly} />
          ) : !hasYearlyData ? (
            <EmptyStateCard 
              title={`Año ${currentYear}`} 
              subtitle={patientId 
                ? `El paciente no tiene registros en el año ${currentYear}` 
                : "Registra emociones para ver tu progreso anual"}
              isProfessionalView={!!patientId}
            />
          ) : (
            <CompactBarChart 
              title={`Año ${currentYear}`}
              subtitle="Emociones predominantes"
              data={completeYearlyData}
            />
          )}

          {/* ESTADÍSTICAS DE SUEÑO */}
          {loadingWeeklySleep ? (
            <LoadingCard message="Cargando estadísticas de sueño..." />
          ) : errorWeeklySleep ? (
            <ErrorCard message={errorWeeklySleep} />
          ) : weeklySleepStats && weeklySleepStats.sleeps && weeklySleepStats.sleeps.length > 0 ? (
            <SleepStatsCard 
              weeklySleepStats={weeklySleepStats}
              dayLabels={dayLabels}
              screenWidth={screenWidth}
              colors={colors}
            />
          ) : (
            <View className="bg-fondo rounded-3xl p-5 shadow-lg mb-4" style={{ elevation: 8 }}>
              <Text className="text-lg font-bold text-oscuro mb-1">Estadísticas de Sueño</Text>
              <View className="items-center py-8">
                <FontAwesome name="bed" size={60} color={colors.oscuro} style={{ opacity: 0.5, marginBottom: 16 }} />
                <Text className="text-center text-oscuro opacity-70">
                  {patientId 
                    ? "El paciente no tiene registros de sueño esta semana"
                    : "No hay registros de sueño esta semana"
                  }
                </Text>
                {!patientId && (
                  <TouchableOpacity 
                    className="bg-color1 rounded-xl px-4 py-2 mt-4"
                    onPress={() => router.push("/tabs/home")}
                  >
                    <Text className="text-fondo font-semibold text-sm">Registrar sueño</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* SECCIÓN DE ACTIVIDADES */}

          {/* 8. Actividades Semanales (7 días) */}
          {loadingWeeklyActivities ? (
            <LoadingCard message="Cargando actividades semanales..." />
          ) : errorWeeklyActivities ? (
            <ErrorCard message={errorWeeklyActivities} />
          ) : weeklyActivities && Object.keys(weeklyActivities).length > 0 ? (
            <View className="bg-fondo rounded-3xl p-5 shadow-lg mb-4" style={{ elevation: 8 }}>
              <Text className="text-lg font-bold text-oscuro mb-1">Actividades - Últimos 7 días</Text>
              <Text className="text-sm text-oscuro opacity-70 mb-4">
                Tus actividades más frecuentes esta semana
              </Text>
              
              <ActivityDonutChart data={weeklyActivities} size={180} />
              
              <View className="space-y-4 mt-4">
                <Text className="text-sm font-bold text-oscuro mb-2">Detalles por actividad:</Text>
                {Object.entries(weeklyActivities)
                  .sort(([,a], [,b]) => b - a)
                  .map(([activity, value], index) => {
                    const maxValue = Math.max(...Object.values(weeklyActivities));
                    const barWidth = maxValue > 0 ? (value / maxValue) * (screenWidth - 220) : 0;
                    const color = activityColors[index % activityColors.length];
                    
                    return (
                      <View key={activity} className="mb-2">
                        <View className="flex-row justify-between items-center mb-1">
                          <Text className="text-xs font-medium text-oscuro capitalize flex-1" numberOfLines={1}>
                            {activity}
                          </Text>
                          <Text className="text-xs font-bold text-oscuro ml-2">
                          
                          </Text>
                        </View>
                        
                        <View className="h-4 rounded-full" style={{ backgroundColor: '#E5E7EB' }}>
                          <View 
                            className="h-full rounded-full flex-row items-center justify-center" 
                            style={{ 
                              width: Math.max(barWidth, 30),
                              backgroundColor: color
                            }} 
                          >
                            <Text className="text-xs font-bold text-white">
                              {value}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
              </View>
            </View>
          ) : null}

          {/* 9. Actividades del Mes - CON NAVEGACIÓN */}
          {loadingMonthlyActivities ? (
            <LoadingCard message="Cargando actividades del mes..." />
          ) : errorMonthlyActivities ? (
            <ErrorCard message={errorMonthlyActivities} />
          ) : monthlyActivities && Object.keys(monthlyActivities).length > 0 ? (
            <View className="bg-fondo rounded-3xl p-5 shadow-lg mb-4" style={{ elevation: 8 }}>
              <View className="mb-4">
                <Text className="text-lg font-bold text-oscuro mb-1">Actividades del Mes</Text>
                
                <View className="flex-row justify-center items-center space-x-4 mb-2">
                  <TouchableOpacity 
                    className="p-2"
                    onPress={() => navigateActivityMonth('prev')}
                  >
                    <FontAwesome name="chevron-left" size={16} color={colors.color1} />
                  </TouchableOpacity>
                  
                  <Text className="text-sm text-center text-oscuro opacity-70 px-4">
                    {getCapitalizedMonthYear(activityMonthDate.month, activityMonthDate.year)}
                  </Text>
                  
                  <TouchableOpacity 
                    className="p-2"
                    onPress={() => navigateActivityMonth('next')}
                    disabled={isCurrentActivityMonth()}
                    style={{ opacity: isCurrentActivityMonth() ? 0.3 : 1 }}
                  >
                    <FontAwesome 
                      name="chevron-right" 
                      size={16} 
                      color={isCurrentActivityMonth() ? colors.oscuro : colors.color1} 
                    />
                  </TouchableOpacity>
                </View>
                
                {!isCurrentActivityMonth() && (
                  <TouchableOpacity 
                    className="mt-2 rounded-lg px-3 py-1 self-center border border-color1"
                    style={{ backgroundColor: colors.color1 + '20' }}
                    onPress={() => {
                      const now = new Date();
                      setActivityMonthDate({ month: now.getMonth() + 1, year: now.getFullYear() });
                    }}
                  >
                    <Text className="text-xs font-medium" style={{ color: colors.color1 }}>
                      Volver al mes actual
                    </Text>
                  </TouchableOpacity>
                )}
                
                <Text className="text-sm text-oscuro opacity-70 mt-2">
                  Tus actividades más frecuentes este mes
                </Text>
              </View>
              
              <ActivityDonutChart data={monthlyActivities} size={180} />
              
              <View className="space-y-4 mt-4">
                <Text className="text-sm font-bold text-oscuro mb-2">Detalles por actividad:</Text>
                {Object.entries(monthlyActivities)
                  .sort(([,a], [,b]) => b - a)
                  .map(([activity, value], index) => {
                    const maxValue = Math.max(...Object.values(monthlyActivities));
                    const barWidth = maxValue > 0 ? (value / maxValue) * (screenWidth - 220) : 0;
                    const color = activityColors[index % activityColors.length];
                    
                    return (
                      <View key={activity} className="mb-2">
                        <View className="flex-row justify-between items-center mb-1">
                          <Text className="text-xs font-medium text-oscuro capitalize flex-1" numberOfLines={1}>
                            {activity}
                          </Text>
                          <Text className="text-xs font-bold text-oscuro ml-2">
                          </Text>
                        </View>
                        
                        <View className="h-4 rounded-full" style={{ backgroundColor: '#E5E7EB' }}>
                          <View 
                            className="h-full rounded-full flex-row items-center justify-center" 
                            style={{ 
                              width: Math.max(barWidth, 30),
                              backgroundColor: color
                            }} 
                          >
                            <Text className="text-xs font-bold text-white">
                              {value}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
              </View>
            </View>
          ) : (
            <View className="bg-fondo rounded-3xl p-5 shadow-lg mb-4" style={{ elevation: 8 }}>
              <View className="mb-4">
                <Text className="text-lg font-bold text-oscuro mb-1">Actividades del Mes</Text>
                
                <View className="flex-row justify-center items-center space-x-4 mb-2">
                  <TouchableOpacity 
                    className="p-2"
                    onPress={() => navigateActivityMonth('prev')}
                  >
                    <FontAwesome name="chevron-left" size={16} color={colors.color1} />
                  </TouchableOpacity>
                  
                  <Text className="text-sm text-center text-oscuro opacity-70 px-4">
                    {getCapitalizedMonthYear(activityMonthDate.month, activityMonthDate.year)}
                  </Text>
                  
                  <TouchableOpacity 
                    className="p-2"
                    onPress={() => navigateActivityMonth('next')}
                    disabled={isCurrentActivityMonth()}
                    style={{ opacity: isCurrentActivityMonth() ? 0.3 : 1 }}
                  >
                    <FontAwesome 
                      name="chevron-right" 
                      size={16} 
                      color={isCurrentActivityMonth() ? colors.oscuro : colors.color1} 
                    />
                  </TouchableOpacity>
                </View>
                
                {!isCurrentActivityMonth() && (
                  <TouchableOpacity 
                    className="mt-2 rounded-lg px-3 py-1 self-center border border-color1"
                    style={{ backgroundColor: colors.color1 + '20' }}
                    onPress={() => {
                      const now = new Date();
                      setActivityMonthDate({ month: now.getMonth() + 1, year: now.getFullYear() });
                    }}
                  >
                    <Text className="text-xs font-medium" style={{ color: colors.color1 }}>
                      Volver al mes actual
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              
              <View className="items-center py-8">
                <FontAwesome name="bar-chart" size={60} color={colors.oscuro} style={{ opacity: 0.5, marginBottom: 16 }} />
                <Text className="text-center text-oscuro opacity-70">
                  {patientId 
                    ? "El paciente no tiene actividades registradas en este mes"
                    : "No hay actividades registradas en este mes"
                  }
                </Text>
              </View>
            </View>
          )}

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}