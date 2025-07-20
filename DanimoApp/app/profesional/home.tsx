import { ButtonAccept, ButtonDark } from "@/components/buttons";
import SearchBar from "@/components/SearchBar";
import { colors } from "@/stores/colors";
import { URL_AUTH_PROF, URL_BASE } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
export default function Home() {

  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<string[]>([]); 
  const token = useUserLogInStore((state) => state.token);
  
  const gotoStatsPatient = (patient: string) => {
    console.log("Ver paciente", patient);
    router.push({ pathname: "/screensOnlyProf/patientsDetail", params: { patientId: "2" } });
  }
  
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(URL_BASE + URL_AUTH_PROF + "/patients", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
      });

    if (!response.ok) {
      const errorText = await response.json();
      console.error("Error:", errorText.error);
      throw new Error(errorText.error);
    }

    const data = await response.json();
    console.log("Datos obtenidos:", data);
    const val = ["Juan Pérez", "María Gómez", "Carlos Ruiz"]
    setPatient(val)
    console.log("val: ", val);

    // const rutinasBack = Array.isArray(data) ? data : data.data || [];
    
    } catch (error) {
      console.error("Error al obtener medicaciones:", error);
      Alert.alert("Error", "No se pudo obtener la lista de medicaciones.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchData();
  }, [fetchData]);

  return (
    <LinearGradient
          colors={[colors.color5, colors.fondo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="w-full h-full"
        >
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-4 pb-20 py-10">
          <View className="space-y-5 mb-10">
            <SearchBar placeholder="Buscar rutinas, pacientes..." onChangeText={(text) => console.log(text)} />
          </View>

          {/* Tarjeta de Pacientes */}
        <View className="bg-white/30 rounded-3xl p-4 shadow-md">
          <Text className="text-center text-2xl font-bold text-oscuro mb-7">Pacientes</Text>

          {/* Lista de Pacientes */}
          {patient.map((nombre, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center justify-between bg-white/60 rounded-full px-4 py-4 mb-2"
              onPress={() => gotoStatsPatient(patient[index])}
            >
              <View className="flex-row items-center">
                <FontAwesome name="user" size={18} color="gray" />
                <Text className="ml-3 text-oscuro">{nombre}</Text>
              </View>
              <FontAwesome name="arrow-right" size={18} color="gray" />
            </TouchableOpacity>
          ))}

          <ButtonDark text="Ver todos" onPress={() => router.push("/screensOnlyProf/patientsList")}/>
          <ButtonAccept text="Nuevo" onPress={() => router.push("/enterCode")}/>
          
        </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
