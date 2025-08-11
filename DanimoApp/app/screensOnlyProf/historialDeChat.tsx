import { ButtonDark } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import { colors } from "@/stores/colors"; // Asegúrate que tengas estos colores
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function HistorialDeChat() {
  return (
    <SafeAreaProvider>
      <LinearGradient
          colors={[colors.color5, colors.fondo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="w-full h-full"
        >
          <HeaderGoBack
            text="Resumen"
            onPress={() => router.replace("/profesional/home")}
          />
          
          <ScrollView className="flex-1 px-5 py-5">
            {/* Tarjeta resumen */}
            <View className="bg-white/90 rounded-2xl p-4 shadow-md">
              <Text className="text-center text-base font-bold text-pink-500 mb-2">
                Semana
              </Text>
              <Text className="text-sm text-black text-justify">
                Explorar recursos internos y externos para mejorar. Se recomienda fortalecer hábitos de descanso, espacios de contención emocional y actividades que refuercen la autoestima.
              </Text>
            </View>
            
            <View className="justify-end mt-8 space-y-4">
              <ButtonDark text="Detalle" onPress={() => console.log("Ver detalles")} />
              <ButtonDark text="Personalizado" onPress={() => console.log("Ver detalles")} />
              <ButtonDark text="Historico" onPress={() => console.log("Ver historico")} />
            </View>
          </ScrollView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}
