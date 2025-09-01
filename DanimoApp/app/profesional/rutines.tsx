
import CardRutine, { Rutine } from "@/app/cards/cardRutine";
import { ButtonDark_add, ButtonDark_small } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import { colors } from "@/stores/colors";
import { URL_BASE, URL_RUTINE } from "@/stores/consts";
import { patientProfile, usePatientStore } from "@/stores/patientStore";
import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Rutines() {
  const [loading, setLoading] = useState(true);
  const [rutines, setRutines] = useState<Rutine[]>([]);
  const token = useUserLogInStore((state) => state.token);
  const [modalVisible, setModalVisible] = useState(false);
  const patients = usePatientStore((state: { patients: any; }) => state.patients);
  const [selectedPatients, setSelectedPatients] = useState<patientProfile[]>([]);
  const [selectedRutine, setSelectedRutine] = useState<Rutine | null>(null);


  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(URL_BASE + URL_RUTINE + "/obtain", {
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
    console.log("rutinesBack_raw:", data);
    const rutinesBack_raw = Array.isArray(data) ? data : data.data || [];

    const rutinesBack = rutinesBack_raw.map((rutina: { Users: any[]; }) => ({
      ...rutina,
      Users: Array.isArray(rutina.Users)
        ? rutina.Users.map((user) => user.email)
        : [], 
    }));


    setRutines(rutinesBack);

    // console.log("Rutinas con emails:", JSON.stringify(rutinesBack, null, 2));

    } catch (error) {
      console.error("Error al obtener rutinas:", error);
      Alert.alert("Error", "No se pudo obtener la lista de rutinas.");
      return [];
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleEdit = (rutine: Rutine) => {
    // Redirigir a pantalla de edición con datos
    console.log("handleEdit : " + rutine );

    router.push({ pathname: "/cards/cardEditRutine", params: { rutineParam: JSON.stringify(rutine) } });
  };

  const handleCreate = () => {
    router.push("/cards/cardEditRutine");
  };

  const deleteRutine = async (rutine: Rutine) => {
    try {
      const response = await fetch(URL_BASE + URL_RUTINE + "/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
          name: rutine.name,
        }),
      });

      if (!response.ok) {
        const errorText = await response.json();
        console.error("Error:", errorText.error);
        throw new Error(errorText.error);
      }

      // Optionally refresh the list after deletion
      fetchData();

    } catch (error) {
      console.error("Error al borrar la rutina:", error);
      Alert.alert("Error", "No se pudo borrar la rutina.");
      return [];
    }
  };

  const handleDelete = (rutine: Rutine) => {
    Alert.alert("Eliminar rutina", `¿Estás seguro de eliminar "${rutine.name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          deleteRutine(rutine);
        },
      },
    ]);
  };

  const handleAddPatient = (rutine: Rutine) => {
    if (!rutine.Users) {
      Alert.alert("Error", "No se puede asignar a pacientes una rutina de sistema.");
      return;
    }

    // Obtener objetos paciente completos desde patientStore usando rutine.Users
    // const associatedPatients = patients.filter((p: { id: string; }) => rutine.Users?.includes(p.id));

    const associatedPatients = patients.filter((p: patientProfile) =>
      rutine.Users?.some((u: string) => u === p.email || u === p.id)
    );
    console.log("associatedPatients: " + associatedPatients);
    console.log("rutine.Users: " + rutine.Users);
    
    
    setSelectedPatients(associatedPatients);
    setSelectedRutine(rutine);
    setModalVisible(true);
  };

  useEffect(() => { 
    fetchData();
  }, [fetchData]);

  const togglePatientSelection = (patient: patientProfile) => {
    setSelectedPatients((prevSelected) => {
      const alreadySelected = prevSelected.some(p => p.id === patient.id);
      if (alreadySelected) {
        return prevSelected.filter(p => p.id !== patient.id); // quitar
      } else {
        return [...prevSelected, patient]; // agregar
      }
    });
  };

  const handleSaveModal = async () => {
    console.log("Pacientes seleccionados:", selectedPatients.map(p => p.email));
    try {
      const response = await fetch(URL_BASE + URL_RUTINE + "/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
          name: selectedRutine?.name,
          emails: selectedPatients.map(p => p.email),
        }),
      });
      if (!response.ok) {
        const errorText = await response.json();
        console.error("Error:", errorText.error);
        throw new Error(errorText.error);
      }

      // Optionally refresh the list after deletion
      fetchData();

    } catch (error) {
      console.error("Error al asignar pacientes:", error);
      Alert.alert("Error", "No se pudo asignar la rutina.");
      return [];
    }
    setModalVisible(false);
  };
  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={[colors.color5, colors.fondo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full h-full"
      >
        <HeaderGoBack
          text="Rutinas"
          onPress={() => router.replace("/profesional/home")}
        />
        <ScrollView className="flex-1 px-5 py-5">
          <View className="flex-1 items-center">
            {loading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : rutines.length > 0 ? (
              rutines.map((el, index) => (
                <CardRutine
                  key={index}
                  element={el}
                  onButton={() => handleEdit(el)}
                  delIcon={() => handleDelete(el)}
                  addIcon={() => handleAddPatient(el)}
                  pov="profesional"
                />
              ))
            ) : (
              <Text className="text-center text-lg text-gray-600">
                No hay rutinas disponibles.
              </Text>
            )}

            <View className="mt-4">
              <ButtonDark_add onPress={handleCreate} />
            </View>
          </View>
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-fondo rounded-2xl p-5 w-11/12 max-h-[80%]">
              <Text className="text-lg font-bold mb-4">Agregar Pacientes </Text>
              <FlatList
                data={patients}
                keyExtractor={(item) => item.id}
                className="mb-4"
                renderItem={({ item }) => {
                  const isSelected = selectedPatients.some(p => p.email === item.email);
                  console.log("Pacientes del back: " + selectedPatients.map(p => p.email));
                  
                  return (
                    <TouchableOpacity
                      onPress={() => togglePatientSelection(item)}
                      className="mx-4 mb-3"
                    >
                      <View className="flex-row items-center justify-between rounded-xl">
                        <View className="flex-row items-center flex-1">
                          <View className="w-5 h-5 mr-3">
                            {isSelected ? (
                              <FontAwesome name="check-square-o" size={18} color={colors.oscuro} />
                            ) : (
                              <FontAwesome name="square-o" size={18} color={colors.oscuro} />
                            )}
                          </View>
                          <Text className="text-base font-medium flex-1 text-oscuro">
                            {item.firstName} {item.lastName}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
              
              <ButtonDark_small text="Guardar" 
                  onPress={handleSaveModal} />
            </View>
          </View>
        </Modal>

      </LinearGradient>
    </SafeAreaProvider>
  );
}
