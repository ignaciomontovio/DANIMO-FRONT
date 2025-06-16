import Navbar from "@/components/navbar";
import { URL_BASE } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import * as React from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CardsList from "./cardsList";

type Medication = {
  drug: string;
  grams: string;
  frecuency: string;
};

export default function Medication() {
  const token = useUserLogInStore((state) => state.token);
  
  const deleteMedication = async (medication: Medication) => {
    const response = await fetch(URL_BASE + "/medication/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
      body: JSON.stringify({
        drug: medication.drug,
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }
  };

  return (
    <SafeAreaProvider>
      <CardsList<Medication> 
        endpoint={URL_BASE + "/medication"}
        name="Medicación" 
        goto="/editMedication" 
        deleteFunct={deleteMedication}
      />
      
      <View className="absolute bottom-0 left-0 right-0">
        <Navbar
          tabs={[
            { name: "home", icon: "home", label: "Inicio" },
            { name: "stats", icon: "bar-chart", label: "Stats" },
            { name: "sos", icon: "exclamation-triangle" },
            { name: "rutines", icon: "newspaper-o", label: "Rutinas" },
            { name: "menu", icon: "bars", label: "Menú" },
          ]}
        />
      </View>
    </SafeAreaProvider>
  );
}