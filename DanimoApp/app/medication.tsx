import { URL_BASE, URL_MEDICATION } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import * as React from "react";
import { Alert } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CardsList from "./cardsList";

type Medication = {
  name: string;
  dosage: string;
  startDate: string;
  endDate: string;
};

export default function MedicationList() {
  const token = useUserLogInStore((state) => state.token);
  
  const deleteMedication = async (medicationToDelete: Medication) => {
    try {
      const response = await fetch(URL_BASE + URL_MEDICATION + "/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({name: medicationToDelete.name}),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
    } catch (error) {
      console.error("Error al eliminar medicación:", error);
      Alert.alert("Error", "No se pudo eliminar la medicación.");
    }
  };

  return (
    <SafeAreaProvider>
      <CardsList<Medication>  
        endpoint={URL_BASE + URL_MEDICATION} 
        name={"Medicaciones"} 
        goto={"/editMedication"} 
        deleteFunct={deleteMedication}
      />
    </SafeAreaProvider>
  );
}