import HeaderGoBack from "@/components/headerGoBack";
import { colors } from "@/stores/colors";
import { router } from "expo-router";
import React from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  background: colors.fondo,
  color: (opacity = 1) => colors.oscuro ,
  labelColor: () => colors.oscuro,
  barPercentage: 0.5,
  decimalPlaces: 0,
  //el color de cada barra sea el de la emocion y que no tenga labels
};

const monthlyData = {
  tristeza: 15,
  felicidad: 30,
  enojo: 5,
  miedo: 4,
  ansiedad: 10,
};

const calendarData = [
  ["felicidad", "tristeza", "enojo", "felicidad", "miedo", "felicidad", "ansiedad"],
  ["ansiedad", "felicidad", "tristeza", "felicidad", "miedo", "felicidad", "felicidad"],
  ["felicidad", "felicidad", "enojo", "miedo", "felicidad", "felicidad", "tristeza"],
  ["tristeza", "felicidad", "felicidad", "ansiedad", "felicidad", "miedo", "felicidad"],
];

const emotionColors: Record<string, string> = {
  felicidad: "#FDE846",
  tristeza: "#057BC4",
  enojo: "#EA2718",
  miedo: "#d150da",
  ansiedad: "#FF872E",
};

export default function EmotionStatsScreen() {
  const emociones = Object.keys(monthlyData);
  const valores = Object.values(monthlyData);

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
        <ScrollView className="px-4 pt-6 pb-24 space-y-8">
          {/* Gráfico SEMANAL */}
          <View className="bg-fondo rounded-2xl p-4 shadow-md" style={{ elevation: 5 }}>
            <Text className="text-xl font-bold text-center mb-2 text-oscuro">Este Mes</Text>
            ---
            <View className="space-y-3">
            {emociones.map((emocion, index) => {
              const value = valores[index];
              const color = emotionColors[emocion] || "#999";
              const barWidth = (value / Math.max(...valores)) * (screenWidth - 120); // ajustado para que nunca se pase

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
            ---
          </View>

          {/* Calendario de emociones */}
          <View className="bg-fondo rounded-2xl p-4 shadow-md" style={{ elevation: 5 }}>
            <Text className="text-xl font-bold text-center mb-4 text-oscuro">Calendario de emociones</Text>
            <Text className="text-center text-color1 font-semibold mb-2">Julio</Text>
            <View className="flex flex-col space-y-1">
              {calendarData.map((week, i) => (
                <View key={i} className="flex flex-row justify-center space-x-1">
                  {week.map((emotion, j) => (
                    <View
                      key={j}
                      style={{
                        width: 30,
                        height: 30,
                        backgroundColor: emotionColors[emotion] || "#ccc",
                        borderRadius: 4,
                      }}
                    />
                  ))}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
