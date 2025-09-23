import { ButtonDark_small } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import { Input_date } from "@/components/input";
import { colors } from "@/stores/colors";
import { URL_BASE, URL_DANI } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Markdown from 'react-native-markdown-display';
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function PersonaliseResume() {
  const token = useUserLogInStore((state) => state.token);
  const [fullResume, setFullResume] = useState("Ingrese fecha de inicio y fin para obtener un resumen.");
  const [start, setStart] = useState<Date | undefined>(undefined);
  const [end, setEnd] = useState<Date | undefined>(undefined);
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  
  const getResume = async () => {
    // Validar que ambas fechas estén seleccionadas
    if (!start || !end) {
      Alert.alert("Error", "Por favor selecciona tanto la fecha de inicio como la fecha de fin.");
      return;
    }

    try {
      const response = await fetch(URL_BASE + URL_DANI + "/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ 
          userId: patientId, 
          startDate: start.toISOString().split("T")[0], 
          endDate: end.toISOString().split("T")[0],
          size:"300" 
        }),
      });
      
      if (!response.ok && response.status !== 500) {
        const errorText = await response.json();          
        throw new Error(errorText.error);
      }

      const data = await response.json();
      setFullResume(data.summary)
    } catch (error) {       
      console.error("Error al obtener resumen:", error);
      Alert.alert("Error", "No se pudo obtener el resumen.");
    } 
  }
  
  return (
    <SafeAreaProvider>
      <LinearGradient
          colors={[colors.color5, colors.fondo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="w-full h-full"
        >
          <HeaderGoBack
            text="Resumen Personalizado"
            onPress={() =>{
              router.push({
                pathname: "/screensOnlyProf/historialDeChat",
                params: { patientId },
              });}}
          />
          
          <ScrollView className="flex-1 px-5 py-5">
            {/* elejir fechas */}
            <View className="p-6 bg-fondo rounded-2xl mb-5">
              <View className="py-2 bg-color1 rounded-2xl mb-2">
                <Text className="text-xl font-bold text-white text-center">Inicio</Text>
              </View>
              <Input_date setDate={setStart} date={new Date()} />
              <View className="py-2 bg-color1 rounded-2xl mb-2 mt-5">
                <Text className="text-xl font-bold text-white text-center">Fin</Text>
              </View>
              <Input_date setDate={setEnd} date={new Date()} />
              <ButtonDark_small
                  text="Obtener Resumen"
                  onPress={getResume}
                />
            </View>
            <View className="bg-fondo rounded-2xl p-4 shadow-md mb-10">
              <Text className="text-center text-xl font-bold text-pink-500 mb-2">
                Resumen
              </Text>

              <Markdown style={{
                body: { color: 'black', fontSize: 14 },
                heading1: { fontSize: 22, fontWeight: 'bold', color: '#E91E63' },
                bullet_list: { marginVertical: 5 },
              }}>
                {fullResume}
              </Markdown>

            </View>
          </ScrollView>
          
      </LinearGradient>
    </SafeAreaProvider>
  );
}