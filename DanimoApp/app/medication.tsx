import { URL_BASE, URL_MEDICATION } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import * as React from "react";
import { Alert } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CardsList from "./cardsList";
import {
  FetchConfig,
  Medication,
  medicationCardConfig,
  medicationFetchStrategy,
  medicationNavigationConfig
} from "./medicationConfig";

export default function medicationList() {
  const token = useUserLogInStore((state) => state.token);
  
  // Función específica de eliminación de medicación
  const deleteMedication = async (medicationToDelete: Medication) => {
    try {
      const response = await fetch(URL_BASE + URL_MEDICATION + "/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({ name: medicationToDelete.name }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
    } catch (error) {
      console.error("Error al eliminar medicación:", error);
      Alert.alert("Error", "No se pudo eliminar la medicación.");
      throw error;
    }
  };

  // Configuración de fetch específica para medicación
  const fetchConfig: FetchConfig<Medication> = {
    endpoint: URL_BASE + URL_MEDICATION,
    fetchStrategy: medicationFetchStrategy,
  };

  return (
    <SafeAreaProvider>
      <CardsList<Medication>  
        name="Medicaciones"
        fetchConfig={fetchConfig}
        navigationConfig={medicationNavigationConfig}
        cardConfig={medicationCardConfig}
        deleteFunct={deleteMedication}
      />
    </SafeAreaProvider>
  );
}