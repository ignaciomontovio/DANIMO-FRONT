import { ButtonAccept, ButtonDark } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import { colors } from "@/stores/colors";
import { URL_AUTH_PROF, URL_BASE } from "@/stores/consts";
import { patientProfile, usePatientStore } from "@/stores/patientStore";
import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Alert, SafeAreaView, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default function PatientDetailScreen() {
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  const patients = usePatientStore((state: { patients: any; }) => state.patients);
  const patient = patients.find((p:patientProfile) => p.id === patientId);
  const token = useUserLogInStore((state) => state.token);

  if (!patient) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Cargando datos del paciente...</Text>
      </View>
    );
  }
  const unlinkPatient = async () => {
    try {
      const response = await fetch(URL_BASE + URL_AUTH_PROF + "/unlink-user" , {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ userId : patient.id }),
      });

      if (!response.ok) {
        const errorText = await response.json();
        throw new Error(errorText.error);
      }
      router.replace("/profesional/home");
    } catch (error) {
      console.error("Error al desvincular:", error);
      Alert.alert("Error", "No se pudo desvincular paciente.");
    };
  }

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
                {"Paciente"}
              </Text>
            </View>

            {/* Contenido de la card */}
            <View className="p-6 rounded-b-2xl" style={{ backgroundColor: colors.fondo }}>
              
              {/* Información básica */}
              {patient && (
                <View className="space-y-4 mb-6">
                  <View className="flex-row items-center bg-white/60 rounded-xl p-4">
                    <FontAwesome name="user" size={20} color={colors.oscuro} />
                    <Text className="ml-3 text-base" style={{ color: colors.oscuro }}>
                      {patient.firstName} {patient.lastName}
                    </Text>
                  </View>

                  <View className="flex-row items-center bg-white/60 rounded-xl p-4">
                    <FontAwesome name="envelope" size={20} color={colors.oscuro} />
                    <Text className="ml-3 text-base" style={{ color: colors.oscuro }}>
                      {patient.email}
                    </Text>
                  </View>

                  <View className="flex-row items-center bg-white/60 rounded-xl p-4">
                    <FontAwesome name="birthday-cake" size={20} color={colors.oscuro} />
                    <Text className="ml-3 text-base" style={{ color: colors.oscuro }}>
                      {patient.birthDate.split("T")[0]} 
                    </Text>
                  </View>

                  <View className="flex-row items-center bg-white/60 rounded-xl p-4">
                    <FontAwesome name="venus-mars" size={20} color={colors.oscuro} />
                    <Text className="ml-3 text-base" style={{ color: colors.oscuro }}>
                      {patient.gender}
                    </Text>
                  </View>
                </View>
              )}
              
              {/* Botones de acción */}
              <View className="space-y-3">
                <ButtonAccept text="Estadisticas"  />
                <ButtonAccept text="Historial chat" onPress={()=>router.push("/screensOnlyProf/historialDeChat")} />
                <ButtonDark text="Desvincular" onPress={unlinkPatient} />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}