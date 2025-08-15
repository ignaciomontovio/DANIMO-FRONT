import HeaderGoBack from "@/components/headerGoBack";
import { colors } from "@/stores/colors";
import { URL_BASE, URL_DANI } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Markdown from 'react-native-markdown-display';
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function HistoricPatient() {
  const token = useUserLogInStore((state) => state.token);
  const [fullResume, setFullResume] = useState("");
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  
  const fetchData = useCallback(async () => {
      try {
        const response = await fetch(URL_BASE + URL_DANI + "/historicalSummary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ userId: patientId }),
        });
        
        if (!response.ok && response.status !== 500) {
          const errorText = await response.json();          
          // const errorText = await response.text();          
          throw new Error(errorText.error);
        }
  
        const data = await response.json();
        setFullResume(data.summary)
      } catch (error) {       
        console.error("Error al obtener pacientes:", error);
        Alert.alert("Error", "No se pudo obtener la lista de pacientes.");
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
            text="Historico"
            onPress={() =>{
              router.push({
                pathname: "/screensOnlyProf/historialDeChat",
                params: { patientId },
              });}}
          />
          
          <ScrollView className="flex-1 px-5 py-5">
            <View className="bg-fondo rounded-2xl p-4 shadow-md mb-10">
              <Text className="text-center text-xl font-bold text-pink-500 mb-2">
                Historico
              </Text>
              {/* <Text className="text-sm text-black text-left">
                {fullResume}
              </Text> */}
              {fullResume === "" && 
                <View className="self-center bg-gray-200 px-4 py-2 rounded-full my-2">
                  <Text className="text-gray-600 italic">Generando Resumen ...</Text>
                </View>
              }
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
