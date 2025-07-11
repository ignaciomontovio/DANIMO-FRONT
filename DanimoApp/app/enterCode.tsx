import { ButtonDark } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import { colors } from "@/stores/colors";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function EnterCode() {
  const [code, setCode] = useState("");

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={[colors.color5, colors.fondo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full h-full"
      >
        <HeaderGoBack text="Compartir Código" onPress={() => router.replace("/profesional/home")} />
          <View className="flex-1 mt-20 px-5">
            <View
              className="w-full max-w-md rounded-2xl"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 10,
              }}
            >
              {/* Header de la tarjeta */}
              <View className="py-3 bg-color1 rounded-t-2xl">
                <Text className="text-2xl font-bold text-white text-center">Código</Text>
              </View>

              {/* Cuerpo de la tarjeta */}
              <View className="p-6 bg-fondo rounded-b-2xl items-center space-y-4">
                <TextInput
                  className="text-2xl font-bold w-full px-4 py-10 mb-2 border border-oscuro rounded-md text-oscuro"
                  placeholder="Ingresar código"
                  placeholderTextColor="#999"
                  value={code}
                  onChangeText={setCode}
                />

                <ButtonDark text="Añadir paciente" onPress={() => Alert.alert("Funcionalidad en desarrollo")} />
              </View>
            </View>
          </View>
      </LinearGradient>
    </SafeAreaProvider>
  );
}
