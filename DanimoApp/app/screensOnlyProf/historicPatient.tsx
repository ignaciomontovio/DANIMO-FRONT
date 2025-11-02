import HeaderGoBack from "@/components/headerGoBack";
import { colors } from "@/stores/colors";
import { URL_BASE, URL_DANI } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Markdown from 'react-native-markdown-display';
import { SafeAreaProvider } from "react-native-safe-area-context";

export interface riskMessagesType {
    date: Date;
    message: string;
}

export default function HistoricPatient() {
  const token = useUserLogInStore((state) => state.token);
  const [fullResume, setFullResume] = useState("");
  const [riskMessages, setRiskMessages] = useState<riskMessagesType[]>([]);
  const [caches, setCaches] = useState(false);
  const [years, setYears] = useState([2025,2024]);
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  
  const fetchData = useCallback(async () => {
      caches && setFullResume("");  
      console.log("Fetching data with refreshCache:", caches);
      let start = new Date(`${selectedYear}-01-01T00:00:00`);
      let end = new Date(`${selectedYear}-12-31T23:59:59`);
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
                  refreshCache: caches,
                }),
              });
        
        if (!response.ok && response.status !== 500) {
          const errorText = await response.json();          
          throw new Error(errorText.error);
        }
  
        const data = await response.json();
        setFullResume(data.summary);
        setRiskMessages(Array.isArray(data.riskMessages) ? data.riskMessages : []);

      } catch (error) {       
        console.error("Error al obtener histórico:", error);
        Alert.alert("Error", "No se pudo obtener el histórico del paciente.");
      } 
    }, [patientId, token, caches, selectedYear]);
  

  const fetchYears = useCallback(async () => {
    try {
      const response = await fetch(URL_BASE + URL_DANI + "/summary/availableYears", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ 
          userId: patientId, 
        }),
      });
      
      if (!response.ok && response.status !== 500) {
        const errorText = await response.json();          
        throw new Error(errorText.error);
      }

      const data = await response.json();
      
      setYears(data.availableYears)
    } catch (error) {       
      console.error("Error al obtener histórico:", error);
      Alert.alert("Error", "No se pudo obtener el histórico del paciente.");
    } 
  }, [patientId, token]);

  useEffect(() => {
      fetchData();
      fetchYears();
    }, [fetchData,fetchYears]);
  
  return (
    <SafeAreaProvider>
      <LinearGradient
          colors={[colors.color5, colors.fondo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="w-full h-full"
        >
          <HeaderGoBack
            text="Histórico"
            onPress={() =>{
              router.push({
                pathname: "/screensOnlyProf/historialDeChat",
                params: { patientId },
              });}}
          />
          
          <View className="bg-oscuro rounded-full my-2 mx-20 items-center justify-center">
            <Picker
              selectedValue={selectedYear}
              onValueChange={(itemValue) => setSelectedYear(itemValue)}
              style={{ height: 50, width: 150}}
            >
              {years.map((year) => (
                <Picker.Item key={year} label={year.toString()} value={year} />
              ))}
            </Picker>
          </View>

          <ScrollView className="flex-1 px-5 py-5">

            {cardRiskMsj(riskMessages)}

            {/* TARJETA Histórico */}
            <View className="bg-fondo rounded-2xl p-4 shadow-md mb-10">
              <View className="flex-row items-center justify-center mb-2">
                <Text className="text-xl font-bold text-pink-500">
                  Histórico
                </Text>
                <View className="ml-5">
                  <FontAwesome 
                    name="refresh" 
                    size={20} 
                    color={colors.color5} 
                    onPress={() => { setCaches(true); fetchData(); }} 
                  />
                </View>
              </View>

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
export function cardRiskMsj(riskMessages: riskMessagesType[]) {
  return <View className="bg-fondo rounded-2xl p-4 shadow-md mb-10">
    <View className="flex-row items-center justify-center mb-2">
      <Text className="text-xl font-bold text-pink-500">
        Mensajes de Riesgo
      </Text>
    </View>

    {riskMessages.length === 0 ? (
      <View className="self-center bg-gray-100 px-4 py-2 rounded-full my-2">
        <Text className="text-gray-600 italic">No hay mensajes de riesgo para este periodo</Text>
      </View>
    ) : (
      <Markdown style={{
        body: { color: 'black', fontSize: 14 },
        heading1: { fontSize: 22, fontWeight: 'bold', color: '#E91E63' },
        heading2: { fontSize: 20, fontWeight: 'bold' },
        bullet_list: { marginVertical: 5 },
      }}>
        {riskMessages
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map(({ date, message }) => `## ${new Date(date).toLocaleDateString()}\n${message}`)
          .join("\n\n")}
      </Markdown>
    )}
  </View>;
}

