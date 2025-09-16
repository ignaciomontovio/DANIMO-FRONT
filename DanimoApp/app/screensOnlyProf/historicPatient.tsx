import HeaderGoBack from "@/components/headerGoBack";
import { colors } from "@/stores/colors";
import { URL_BASE, URL_DANI } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Markdown from 'react-native-markdown-display';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { ButtonLight_small_center } from "@/components/buttons";

export default function HistoricPatient() {
  const token = useUserLogInStore((state) => state.token);
  const [fullResume, setFullResume] = useState("");
  const [caches, setCaches] = useState(false);
  const [year, setYear] = useState(2025);
  const [posibleYears, setPosibleYears] = useState([2020,2021,2022,2023,2024,2025]);
  const { patientId } = useLocalSearchParams<{ patientId: string }>();

  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => setModalVisible((prev) => !prev);
  
  const fetchData = useCallback(async () => {
      caches && year && setFullResume(""); 
      console.log("Fetching data with refreshCache:", caches);

      try {
        const start = new Date(`${year}-01-01T00:00:00.000Z`);
        const end = new Date(`${year}-12-31T23:59:59.999Z`);

        const response = await fetch(URL_BASE + URL_DANI + "/summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ 
            userId: patientId,
            // refreshCache: caches,
            startDate: start.toISOString().split("T")[0], 
            endDate: end.toISOString().split("T")[0] 
          }),
        });
        
        if (!response.ok && response.status !== 500) {
          const errorText = await response.json();          
          throw new Error(errorText.error);
        }
  
        const data = await response.json();
        setFullResume(data.summary);
      } catch (error) {       
        console.error("Error al obtener histórico:", error);
        Alert.alert("Error", "No se pudo obtener el histórico del paciente.");
      } 
    }, [caches, year, token, patientId]);

  useEffect(() => {
      fetchData();
    }, [fetchData]);
  
  const ModalYear = <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={toggleModal}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}
            onPress={toggleModal}
          >
            <View className="bg-fondo rounded-xl p-4" style={{ minWidth: 250 }} onStartShouldSetResponder={() => true}>
              <Text className="text-lg font-bold mb-2">Selecciona un año</Text>
              {posibleYears.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => {
                    setYear(option as number);
                    setModalVisible(false);
                    setCaches(true);
                  } }
                  className="py-2"
                >
                  <Text className="text-base">{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>;
  
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
          <View className="px-20 items-center justify-center">
            <ButtonLight_small_center onPress={toggleModal} text={year.toString()}/>
            {/* <ButtonDark_small onPress={()=>""} text={year.toString()}/> */}
          </View>

          {ModalYear}

          <ScrollView className="flex-1 px-5 py-5">


            <View className="bg-fondo rounded-2xl p-4 shadow-md mb-10">
              
              <View className="flex-row items-center justify-center mb-2">
                <Text className="text-xl font-bold text-pink-500">
                  Historico
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
