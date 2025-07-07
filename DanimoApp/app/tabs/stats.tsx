import HeaderGoBack from "@/components/headerGoBack";
import { colors } from "@/stores/colors";
import { router } from "expo-router";
import React from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  color: (opacity = 1) => "rgba(0, 0, 0, " + opacity + ")" ,
  labelColor: () => "#333",
  barPercentage: 0.5,
  decimalPlaces: 0,
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
  felicidad: "#FFD700",
  tristeza: "#87CEFA",
  enojo: "#FF6347",
  miedo: "#9370DB",
  ansiedad: "#FFB6C1",
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
          {/* Gráfico mensual */}
          <View className="bg-white rounded-2xl p-4 shadow-md" style={{ elevation: 5 }}>
            <Text className="text-xl font-bold text-center mb-2 text-oscuro">Este Mes</Text>
            <BarChart
              data={{
                labels: emociones,
                datasets: [{ data: valores }],
              }}
              width={screenWidth - 60}
              height={220}
              chartConfig={chartConfig}
              withVerticalLabels
              showBarTops={false}
              fromZero yAxisLabel={""} yAxisSuffix={""}/>
          </View>

          {/* Calendario de emociones */}
          <View className="bg-white rounded-2xl p-4 shadow-md" style={{ elevation: 5 }}>
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
