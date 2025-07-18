import { ButtonDark } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import { colors } from "@/stores/colors";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default function PatientDetailScreen() {
  const { patientId, patientName } = useLocalSearchParams<{ 
    patientId: string; 
    patientName: string; 
  }>();

  console.log("PatientID:", patientId);
  console.log("PatientName:", patientName);

  return (
    <LinearGradient
      colors={[colors.color5, colors.fondo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full h-full"
    >
      <HeaderGoBack 
        text="Detalle de paciente" 
        onPress={() => router.back()} 
      />
      
      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-center items-center px-6">
          <View
            className="w-full max-w-md rounded-2xl shadow-xl"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 10,
            }}
          >
            {/* Header de la card */}
            <View className="py-6 rounded-t-2xl" style={{ backgroundColor: colors.color1 }}>
              <Text className="text-3xl font-bold text-white text-center">
                {patientName || "Paciente"}
              </Text>
            </View>

            {/* Contenido de la card */}
            <View className="p-6 rounded-b-2xl" style={{ backgroundColor: colors.fondo }}>
              
              {/* Información básica */}
              <View className="space-y-4 mb-6">
                <View className="flex-row items-center bg-white/60 rounded-xl p-4">
                  <FontAwesome name="envelope" size={20} color={colors.oscuro} />
                  <Text className="ml-3 text-base" style={{ color: colors.oscuro }}>
                    mateo@gmail.com
                  </Text>
                </View>
                
                <View className="flex-row items-center bg-white/60 rounded-xl p-4">
                  <FontAwesome name="birthday-cake" size={20} color={colors.oscuro} />
                  <Text className="ml-3 text-base" style={{ color: colors.oscuro }}>
                    8/12/1999
                  </Text>
                </View>
              </View>
              
              {/* Botones de acción */}
              <View className="space-y-3">
                <TouchableOpacity 
                  className="rounded-xl p-4"
                  style={{ backgroundColor: colors.color1 }}
                >
                  <Text className="text-white text-center text-2xl font-bold">
                    Estadísticas
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  className="rounded-xl p-4"
                  style={{ backgroundColor: colors.color1 }}
                >
                  <Text className="text-white text-center text-2xl font-bold">
                    Historial chat
                  </Text>
                </TouchableOpacity>
                
                <View className="mt-4">
                  <ButtonDark text="Desvincular" onPress={() => {
                    console.log("Desvincular paciente");
                  }} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}