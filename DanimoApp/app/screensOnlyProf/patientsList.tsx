import HeaderGoBack from "@/components/headerGoBack";
import SearchBar from "@/components/SearchBar";
import { colors } from "@/stores/colors";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default function PatientsListScreen() {
  // Datos de ejemplo - conectar con API
  const [allPatients] = useState([
    { id: 1, name: "Mateo González" },
    { id: 2, name: "Juan Pérez" },
    { id: 3, name: "María García" },
    { id: 4, name: "Carlos Ruiz" },
    { id: 5, name: "Ana López" },
    { id: 6, name: "Pedro Martínez" },
    { id: 7, name: "Lucía Fernández" },
    { id: 8, name: "Sofía Torres" },
    { id: 9, name: "Diego Ramírez" },
    { id: 10, name: "Valentina Díaz" },
 
  ]);

  const [searchText, setSearchText] = useState("");
  const [filteredPatients, setFilteredPatients] = useState(allPatients);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === "") {
      setFilteredPatients(allPatients);
    } else {
      const filtered = allPatients.filter(patient =>
        patient.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  };

  const handlePatientPress = (patient: {
    id: string | number | (string | number)[] | null | undefined; name: any; 
}) => {
    console.log("Paciente seleccionado:", patient.name);
    // detalle del paciente
    router.push({ pathname: "/screensOnlyProf/patientsDetail", params: { patientId: patient.id } });
  };

  const renderPatientItem = ({ item }: { item: { id: number; name: string } }) => (
    <TouchableOpacity
      onPress={() => handlePatientPress(item)}
      className="mx-4 mb-3"
    >
      <View 
        className="flex-row items-center justify-between p-4 rounded-xl"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
      >
        <View className="flex-row items-center flex-1">
          <View 
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
          >
            <FontAwesome name="user" size={18} color={colors.oscuro} />
          </View>
          <Text 
            className="text-base font-medium flex-1"
            style={{ color: colors.oscuro }}
          >
            {item.name}
          </Text>
        </View>
        <FontAwesome name="chevron-right" size={16} color={colors.oscuro} />
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={[colors.color5, colors.fondo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full h-full"
    >
      <HeaderGoBack 
        text="Pacientes" 
        onPress={() => router.back()} 
      />
      
      <SafeAreaView className="flex-1">
        {/* Barra de búsqueda */}
        <View className="px-4 pt-4 pb-2">
          <SearchBar
            placeholder="Buscar pacientes..."
            onChangeText={handleSearch}
          />
        </View>

        {filteredPatients.length > 0 ? (
          <FlatList
            data={filteredPatients}
            renderItem={renderPatientItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
              paddingTop: 10,
              paddingBottom: 20,
            }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="flex-1 justify-center items-center px-6">
            <FontAwesome name="users" size={60} color={colors.oscuro} style={{ opacity: 0.5 }} />
            <Text 
              className="text-lg font-medium text-center mt-4 mb-2"
              style={{ color: colors.oscuro }}
            >
              {searchText ? "No se encontraron pacientes" : "No hay pacientes registrados"}
            </Text>
            <Text 
              className="text-sm text-center opacity-70"
              style={{ color: colors.oscuro }}
            >
              {searchText ? "Intenta con otro nombre" : "Los pacientes aparecerán aquí cuando se registren"}
            </Text>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}