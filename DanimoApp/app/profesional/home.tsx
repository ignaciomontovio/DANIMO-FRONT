import { ButtonAccept, ButtonDark } from "@/components/buttons";
import SearchBar from "@/components/SearchBar";
import { colors } from "@/stores/colors";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
export default function Home() {
    // Lista de pacientes de ejemplo
    const patient = ["Juan Pérez", "María Gómez", "Carlos Ruiz"]; // traer desde el back

  const gotoStatsPatient = (nombre: string) => {
    console.log("Ver paciente", nombre);
    // ir a una pantalla que haga stadisticas basado en la info de un paciente
  }
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
                onPress={() => gotoStatsPatient(nombre)}
              >
                <View className="flex-row items-center">
                  <FontAwesome name="user" size={18} color="gray" />
                  <Text className="ml-3 text-oscuro">{nombre}</Text>
                </View>
                <FontAwesome name="arrow-right" size={18} color="gray" />
              </TouchableOpacity>
            ))}

            <ButtonDark text="Ver todos" onPress={() => router.push("/patientsList")}/>
            <ButtonAccept text="Nuevo" onPress={() => router.push("/enterCode")}/>
            
          </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
}
