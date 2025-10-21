import HeaderGoBack from "@/components/headerGoBack";
import SearchBar from "@/components/SearchBar";
import { colors } from "@/stores/colors";
import { usePatientStore } from "@/stores/patientStore";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default function PatientsListScreen() {
  const patients = usePatientStore((state) => state.patients);
  const [searchText, setSearchText] = useState("");

  const filtered = patients.filter((p) =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchText.toLowerCase())
  );

  const handlePress = (p: { id: string; firstName: string }) => {
    console.log("Paciente seleccionado:", p.firstName);
    router.push({ pathname: "/screensOnlyProf/patientsDetail", params: { patientId: p.id } });
  };

  return (
    <LinearGradient
      colors={[colors.color5, colors.fondo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full h-full"
    >
      <HeaderGoBack text="Pacientes" onPress={() => router.push("/profesional/home")} />

      <SafeAreaView className="flex-1">
        <View className="px-4 pt-4 pb-2">
          <SearchBar placeholder="Buscar pacientes..." onChangeText={setSearchText} />
        </View>

        {filtered.length > 0 ? (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handlePress(item)} className="mx-4 mb-3">
                <View className="flex-row items-center justify-between p-4 rounded-xl bg-white/30">
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 rounded-full items-center justify-center mr-3 bg-white/50">
                      <FontAwesome name="user" size={18} color={colors.oscuro} />
                    </View>
                    <Text className="text-base font-medium flex-1 text-oscuro">
                      {item.firstName} {item.lastName}
                    </Text>
                  </View>
                  <FontAwesome name="chevron-right" size={16} color={colors.oscuro} />
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View className="flex-1 justify-center items-center px-6">
            <FontAwesome name="users" size={60} color={colors.oscuro} style={{ opacity: 0.5 }} />
            <Text className="text-lg font-medium text-center mt-4 mb-2 text-oscuro">
              {searchText ? "No se encontraron pacientes" : "No hay pacientes registrados"}
            </Text>
            <Text className="text-sm text-center opacity-70 text-oscuro">
              {searchText ? "Intenta con otro nombre" : "Los pacientes aparecerán aquí cuando se registren"}
            </Text>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}
