import { ButtonAccept, ButtonDark } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import { colors } from "@/stores/colors";
import { URL_BASE, URL_DANI } from "@/stores/consts";
import { patientProfile, usePatientStore } from "@/stores/patientStore";
import { useUserLogInStore } from "@/stores/userLogIn";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function HistorialDeChat() {
  const token = useUserLogInStore((state) => state.token);
  const [weekResume, setWeekResume] = useState("");
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  const patients = usePatientStore((state: { patients: any; }) => state.patients);
  const patient = patients.find((p:patientProfile) => p.id === patientId);
  
  const fetchData = useCallback(async () => {
      try {
        const response = await fetch(URL_BASE + URL_DANI + "/weeklySummary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ userId: patientId }),
        });
        
        if (!response.ok && response.status !== 500) {
          const errorText = await response.json();          
          throw new Error(errorText.error);
        }
        
        const data = await response.json();
        setWeekResume(data.summary)
      } catch (error) {       
        console.error("Error al obtener resumen de paciente:", error);
        Alert.alert("Error", "No se pudo obtener resumen de paciente.");
      } 
    }, [patientId, token]);

  useEffect(() => {
      fetchData();
    }, [fetchData]);
  
  return (
    <SafeAreaProvider>
      <LinearGradient
          colors={[colors.color5, colors.fondo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="w-full h-full"
        >
          <HeaderGoBack
            text={"Resumen " + patient.firstName + " " + patient.lastName }
            onPress={() => router.replace("/profesional/home")}
          />
          
          <ScrollView className="flex-1 px-5 py-5">
            {/* Tarjeta resumen */}
            <View className="bg-fondo rounded-2xl p-4 shadow-md">
              <Text className="text-center text-xl font-bold text-pink-500 mb-2">
                Semana
              </Text>
              {weekResume === "" && 
                  <View className="self-center bg-gray-200 px-4 py-2 rounded-full my-2">
                    <Text className="text-gray-600 italic">Generando Resumen ...</Text>
                  </View>
              }
              <Text className="text-sm text-oscuro text-left font-bold">
                {weekResume}
              </Text>
            </View>
            
            <View className="justify-end mt-8 space-y-4">
              <ButtonAccept text="Reportes" onPress={() => console.log("Ver detalles")} />
              <ButtonDark text="Personalizado" onPress={() => {
                router.push({
                    pathname: "/screensOnlyProf/personaliseResume",
                    params: { patientId },
                });
                }} />
              <ButtonDark text="Historico" onPress={() => {
                router.push({
                    pathname: "/screensOnlyProf/historicPatient",
                    params: { patientId },
                });
                }} />
            </View>
          </ScrollView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

