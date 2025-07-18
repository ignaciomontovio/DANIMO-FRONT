import CardsList from "@/app/cards/cardsList";
import { medicationCardConfig, medicationNavigationConfig, MedicationType } from "@/components/config/medicationConfig";
import { URL_BASE, URL_MEDICATION } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import React from "react";
import { Alert } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Medication() {
  const token = useUserLogInStore((state) => state.token);
  
  // Función específica de eliminación de contacto
  const deleteMedication = async (deleteData: MedicationType) => {
    console.log("deleteMedication: ",deleteData);
    
    try {
      const response = await fetch(URL_BASE + URL_MEDICATION + "/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({ "name": deleteData.name }),
      });

      if (!response.ok) {
        const errorText = await response.json();
        console.error("Error:", errorText.error);
        throw new Error(errorText.error);
      }
    } catch (error) {
      console.error("Error al eliminar contacto:", error);
      Alert.alert("Error", "No se pudo eliminar el contacto.");
      throw error;
    }
  };
  
  const getMedication = async (): Promise<MedicationType[]> => {
    const endpoint = URL_BASE + "/medication";
    
    // Obtener lista de medicaciones
    const response = await fetch(endpoint + "/obtain", {
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
    return Array.isArray(data) ? data : (data.data || [])
  };
  return (
    <SafeAreaProvider>
      {/* togle para elejir  filta o no filta */}
      <CardsList<MedicationType>  
        name="Medication"
        fetchConfig={getMedication}
        navigationConfig={medicationNavigationConfig}
        cardConfig={medicationCardConfig}
        deleteFunct={deleteMedication}
      />
    </SafeAreaProvider>
  );
}