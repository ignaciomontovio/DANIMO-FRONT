
import CardRutine, { Rutine } from "@/app/cards/cardRutine";
import { ButtonDark_add } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import { colors } from "@/stores/colors";
import { URL_BASE, URL_RUTINE } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  View
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Rutines() {
  const [loading, setLoading] = useState(true);
  const [rutines, setRutines] = useState<Rutine[]>([]);
  const token = useUserLogInStore((state) => state.token);

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
    
    const rutinasBack = Array.isArray(data) ? data : data.data || [];
    console.log(rutinasBack);
    setRutines(rutinasBack);

    } catch (error) {
      console.error("Error al obtener rutinas:", error);
      Alert.alert("Error", "No se pudo obtener la lista de rutinas.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

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
    // ir a pantalla de lista de pacientes 
    console.log("Rutine." + rutine);
    
  }

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
      </LinearGradient>
    </SafeAreaProvider>
  );
}
