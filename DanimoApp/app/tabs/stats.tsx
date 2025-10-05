import HeaderGoBack from "@/components/headerGoBack";
import { colors } from "@/stores/colors";
import { URL_BASE, URL_STATS } from "@/stores/consts";
import { useStatsStore } from "@/stores/stats";
import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, ScrollView, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Line, Path, Text as SvgText } from "react-native-svg";

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

// Colores para actividades
const activityColors = [
  "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", 
  "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9", "#F8C471"
];

// Componente para gráfico circular de emociones (Donut Chart)
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

// Componente para gráfico de barras detallado de emociones
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

// Componente para gráfico de barras compacto de emociones
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

// Componente para gráfico de líneas de evolución emocional
const LineChart = ({ monthlyRawData, mapEmotionName }: {
  monthlyRawData: any[] | null;
  mapEmotionName: (emotion: string) => EmotionType;
}) => {
  const [selectedDays, setSelectedDays] = useState<number>(7);
  const chartWidth = screenWidth - 80;
  const chartHeight = 200;
  const padding = 40;

  const dayOptions = [
    { value: 7, label: '7 días' },
    { value: 15, label: '15 días' }, 
    { value: 30, label: '30 días' }
  ];

  const getLastDaysData = () => {
    if (!monthlyRawData || monthlyRawData.length === 0) return [];

    const dailyData: Record<string, Record<EmotionType, number>> = {};
    
    monthlyRawData.forEach(record => {
      const date = record.date;
      const emotion = mapEmotionName(record.emotionName);
      
      if (!dailyData[date]) {
        dailyData[date] = {
          alegria: 0,
          tristeza: 0,
          enojo: 0,
          miedo: 0,
          ansiedad: 0
        };
      }
      
      dailyData[date][emotion]++;
    });

    const sortedData = Object.entries(dailyData)
      .map(([date, emotions]) => {
        const mostFrequent = Object.entries(emotions).reduce((max, [emotion, count]) => 
          count > max.count ? { emotion: emotion as EmotionType, count } : max,
          { emotion: 'alegria' as EmotionType, count: 0 }
        );
        
        return {
          date,
          emotion: mostFrequent.emotion,
          dayNumber: parseInt(date.split('-')[2])
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-selectedDays);

    return sortedData;
  };

  const data = getLastDaysData();

  if (data.length === 0) {
    return (
      <View className="bg-fondo bg-opacity-80 rounded-2xl p-4 mb-3">
        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold text-oscuro">Evolución emocional</Text>
            
            <TouchableOpacity 
              className="bg-white rounded-lg px-3 py-2 flex-row items-center"
              onPress={() => {
                const currentIndex = dayOptions.findIndex(opt => opt.value === selectedDays);
                const nextIndex = (currentIndex + 1) % dayOptions.length;
                setSelectedDays(dayOptions[nextIndex].value);
              }}
            >
              <Text className="text-xs font-medium text-oscuro mr-1">
                {dayOptions.find(opt => opt.value === selectedDays)?.label}
              </Text>
              <Text className="text-xs text-oscuro">⌄</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-sm text-oscuro opacity-70">Últimos {selectedDays} días</Text>
        </View>
        
        <View className="items-center py-8">
          <FontAwesome name="line-chart" size={60} color={colors.oscuro} style={{ opacity: 0.5, marginBottom: 16 }} />
          <Text className="text-oscuro text-center opacity-70">Sin suficientes registros para mostrar la gráfica</Text>
        </View>
      </View>
    );
  }

  const emotionValues: Record<EmotionType, number> = {
    alegria: 5,
    ansiedad: 4,
    miedo: 3, 
    enojo: 2,
    tristeza: 1
  };

  const points = data.map((item, index) => {
    const x = padding + (index * (chartWidth - 2 * padding)) / Math.max(data.length - 1, 1);
    const y = chartHeight - padding - ((emotionValues[item.emotion] - 1) * (chartHeight - 2 * padding)) / 4;
    return { x, y, emotion: item.emotion, dayNumber: item.dayNumber };
  });

  const pathData = points.reduce((path, point, index) => {
    const command = index === 0 ? 'M' : 'L';
    return `${path} ${command} ${point.x} ${point.y}`;
  }, '');

  return (
    <View className="bg-fondo bg-opacity-80 rounded-2xl p-4 mb-3">
      <View className="mb-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-bold text-oscuro">Evolución emocional</Text>
          
          <TouchableOpacity 
            className="bg-white rounded-lg px-3 py-2 flex-row items-center"
            onPress={() => {
              const currentIndex = dayOptions.findIndex(opt => opt.value === selectedDays);
              const nextIndex = (currentIndex + 1) % dayOptions.length;
              setSelectedDays(dayOptions[nextIndex].value);
            }}
          >
            <Text className="text-xs font-medium text-oscuro mr-1">
              {dayOptions.find(opt => opt.value === selectedDays)?.label}
            </Text>
            <Text className="text-xs text-oscuro">⌄</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-sm text-oscuro opacity-70">Últimos {selectedDays} días</Text>
      </View>
      
      <View style={{ width: chartWidth, height: chartHeight }}>
        <Svg width={chartWidth} height={chartHeight}>
          {[1, 2, 3, 4, 5].map((level) => {
            const y = chartHeight - padding - ((level - 1) * (chartHeight - 2 * padding)) / 4;
            return (
              <Line
                key={level}
                x1={padding}
                y1={y}
                x2={chartWidth - padding}
                y2={y}
                stroke={colors.color5}
                strokeWidth={1}
                opacity={0.3}
              />
            );
          })}
          
          <Path
            d={pathData}
            fill="none"
            stroke={colors.color1}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {points.map((point, index) => (
            <Circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={6}
              fill={emotionColors[point.emotion]}
              stroke="#FFFFFF"
              strokeWidth={2}
            />
          ))}
          
          {points.map((point, index) => {
            let shouldShow = true;
            if (selectedDays === 30) {
              shouldShow = index % 5 === 0 || index === points.length - 1;
            } else if (selectedDays === 15) {
              shouldShow = index % 3 === 0 || index === points.length - 1;
            }
            
            if (!shouldShow) return null;
            
            return (
              <SvgText
                key={index}
                x={point.x}
                y={chartHeight - 10}
                textAnchor="middle"
                fontSize="12"
                fill={colors.oscuro}
                opacity={0.7}
              >
                {point.dayNumber}
              </SvgText>
            );
          })}
        </Svg>
      </View>
      
      <View className="mt-2 mb-2">
        <Text className="text-xs text-center text-oscuro opacity-60">
          Los números indican los días del mes
        </Text>
      </View>
      
      <View className="mt-4 flex-row justify-center flex-wrap">
        {[
          { emotion: 'alegria' as EmotionType, level: 5 },
          { emotion: 'ansiedad' as EmotionType, level: 4 },
          { emotion: 'miedo' as EmotionType, level: 3 },
          { emotion: 'enojo' as EmotionType, level: 2 },
          { emotion: 'tristeza' as EmotionType, level: 1 }
        ].map(({ emotion }) => {
          const color = emotionColors[emotion];
          const SvgIcon = emotionSvgs[emotion];
          return (
            <View key={emotion} className="items-center mx-2 mb-2">
              <View 
                className="w-8 h-8 rounded-full items-center justify-center mb-1"
                style={{ backgroundColor: color + '30' }}
              >
                <SvgIcon width={20} height={20} />
              </View>
              <Text className="text-xs text-oscuro font-medium">
                {emotionLabels[emotion]}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

// Componente para patrones semanales
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

const EmptyStateCard = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <View className="bg-fondo bg-opacity-80 rounded-2xl p-8 items-center mb-3">
    <FontAwesome name="pie-chart" size={60} color={colors.oscuro} style={{ opacity: 0.5, marginBottom: 16 }} />
    <Text className="text-xl font-bold text-center text-oscuro mb-2">{title}</Text>
    <Text className="text-base text-center text-oscuro opacity-70 mb-6">{subtitle}</Text>
    <TouchableOpacity 
      className="bg-color1 rounded-xl px-6 py-3"
      onPress={() => router.push("/tabs/home")}
    >
      <Text className="text-fondo font-semibold">Registrar emoción</Text>
    </TouchableOpacity>
  </View>
);

// Componente para gráfico circular de actividades
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
    fetchMonthlyActivities
  } = useStatsStore();

  const [calendarDate, setCalendarDate] = useState({ month: 0, year: 0 });
  const [activityMonthDate, setActivityMonthDate] = useState({ month: 0, year: 0 });

  useFocusEffect(
    useCallback(() => {
      const now = new Date();
      setCalendarDate({ month: now.getMonth() + 1, year: now.getFullYear() });
      setActivityMonthDate({ month: now.getMonth() + 1, year: now.getFullYear() });
    }, [])
  );

  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    fetchWeeklyStats();
    fetchMonthlyStats(currentMonth, currentYear);
    fetchYearlyStats(currentYear);
    
    fetchWeeklyActivities().catch(console.error);
    fetchMonthlyActivities(currentMonth, currentYear).catch(console.error);
    
    setCalendarData(null);
    setLoadingCalendar(true);
    setActivityMonthDate({ month: currentMonth, year: currentYear });
  }, []);

  useEffect(() => {
    if (activityMonthDate.month === 0) return;
    fetchMonthlyActivities(activityMonthDate.month, activityMonthDate.year).catch(console.error);
  }, [activityMonthDate]);

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

  const [calendarData, setCalendarData] = useState<any[] | null>(null);
  const [loadingCalendar, setLoadingCalendar] = useState(false);

  const fetchCalendarDataOnly = async (month: number, year: number) => {
    setLoadingCalendar(true);
    try {
      const token = useUserLogInStore.getState().token;
      if (!token) throw new Error('No hay token de autenticación');
      
      const response = await fetch(URL_BASE + URL_STATS + '/month', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ month, year }),
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
  }, [calendarDate, monthlyRawData, loadingMonthly]);

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

  return (
    <LinearGradient
      colors={[colors.color5, colors.fondo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full h-full"
    >
      <HeaderGoBack
        text="Estadísticas"
        onPress={() => router.push("/tabs/home")}
      />
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
              subtitle="Registra tus emociones para ver tu resumen"
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
              subtitle="Registra emociones para ver tu progreso semanal"
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
              subtitle="Registra emociones para ver tu progreso mensual detallado"
            />
          ) : (
            <EmotionChart 
              title="Este mes"
              subtitle={`${currentMonth} ${currentYear} - Vista detallada`}
              data={completeMonthlyData}
              showPercentages={true}
            />
          )}

          {/* 4. Gráfico de líneas */}
          {hasMonthlyData && <LineChart monthlyRawData={monthlyRawData} mapEmotionName={mapEmotionName} />}

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
                  {new Date(calendarDate.year, calendarDate.month - 1).toLocaleDateString('es-ES', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
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
                  Sin registros en {new Date(calendarDate.year, calendarDate.month - 1).toLocaleDateString('es-ES', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </Text>
                {isCurrentMonth() && (
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
              subtitle="Registra emociones para ver tu progreso anual"
            />
          ) : (
            <CompactBarChart 
              title={`Año ${currentYear}`}
              subtitle="Emociones predominantes"
              data={completeYearlyData}
            />
          )}

          {/* SECCIÓN DE ACTIVIDADES */}

          {/* 8. Actividades Semanales (7 días) */}
          {loadingWeeklyActivities ? (
            <LoadingCard message="Cargando actividades semanales..." />
          ) : errorWeeklyActivities ? (
            !errorWeeklyActivities.includes('404') && !errorWeeklyActivities.includes('fetch') ? (
              <ErrorCard message={errorWeeklyActivities} />
            ) : null
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
                            {value} veces
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
                    {new Date(activityMonthDate.year, activityMonthDate.month - 1).toLocaleDateString('es-ES', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
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
                  Tus actividades más realizadas este mes
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
                            {value} veces
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

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}