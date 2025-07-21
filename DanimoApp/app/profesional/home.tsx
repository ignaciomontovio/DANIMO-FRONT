import { ButtonAccept, ButtonDark } from "@/components/buttons";
import SearchBar from "@/components/SearchBar";
import { colors } from "@/stores/colors";
import { URL_AUTH_PROF, URL_BASE } from "@/stores/consts";
import { patientProfile, usePatientStore } from "@/stores/patientStore";
import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";


export default function Home() {
  const [loading, setLoading] = useState(true);
  const token = useUserLogInStore((state) => state.token);
  const patients = usePatientStore((state: { patients: any; }) => state.patients);
  const setPatientsStore = usePatientStore((state: { setPatients: any; }) => state.setPatients);

  const gotoStatsPatient = (patientId: string) => {
    router.push({
      pathname: "/screensOnlyProf/patientsDetail",
      params: { patientId },
    });
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(URL_BASE + URL_AUTH_PROF + "/patients", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (!response.ok) {
        const errorText = await response.json();
        throw new Error(errorText.error);
      }

      const data: patientProfile[] = await response.json();
      setPatientsStore(data); 
    } catch (error) {
      console.error("Error al obtener pacientes:", error);
      Alert.alert("Error", "No se pudo obtener la lista de pacientes.");
    } finally {
      setLoading(false);
    }
  }, [setPatientsStore, token]);

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
            <SearchBar
              placeholder="Buscar rutinas, pacientes..."
              onChangeText={(text) => console.log(text)}
            />
          </View>

          {/* Tarjeta de Pacientes */}
          <View className="bg-white/30 rounded-3xl p-4 shadow-md">
            <Text className="text-center text-2xl font-bold text-oscuro mb-7">
              Pacientes
            </Text>

            {/* Lista de Pacientes */}
            {patients.slice(0, 3).map((p:patientProfile) => (
              <TouchableOpacity
                key={p.id}
                className="flex-row items-center justify-between bg-white/60 rounded-full px-4 py-4 mb-2"
                onPress={() => gotoStatsPatient(p.id)}
              >
                <View className="flex-row items-center">
                  <FontAwesome name="user" size={18} color="gray" />
                  <Text className="ml-3 text-oscuro">
                    {p.firstName} {p.lastName}
                  </Text>
                </View>
                <FontAwesome name="arrow-right" size={18} color="gray" />
              </TouchableOpacity>
            ))}

            <ButtonDark
              text="Ver todos"
              onPress={() => router.push("/screensOnlyProf/patientsList")}
            />
            <ButtonAccept text="Nuevo" onPress={() => router.push("/screensOnlyProf/enterCode")} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
