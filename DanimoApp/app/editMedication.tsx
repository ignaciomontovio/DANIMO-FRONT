import { URL_BASE } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { useLocalSearchParams } from "expo-router";
import * as React from "react";
import EditCardFromList from "./editCardFromList";

type Medication = {
  drug: string;
  grams: string;
  frecuency: string;
};

export default function EditMedication() {
  const token = useUserLogInStore((state) => state.token);
  const { editing } = useLocalSearchParams();

  const createMedication = async (data: Medication) => {
    console.log("Creating medication with data:", data);
    
    const response = await fetch(URL_BASE + "/medication/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
      body: JSON.stringify({
        drug: data.drug,
        grams: parseFloat(data.grams),
        frecuency: parseInt(data.frecuency),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Error al crear medicación");
    }
  };

  const updateMedication = async (data: Medication, original: Medication) => {
    console.log("Updating medication with data:", data, "and original:", original);
    
    const response = await fetch(URL_BASE + "/medication/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
      body: JSON.stringify({
        originalDrug: original.drug,
        drug: data.drug,
        grams: parseFloat(data.grams),
        frecuency: parseInt(data.frecuency),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Error al actualizar medicación");
    }
  };

  return (
    <EditCardFromList<Medication>
      screenTitle="Editar medicamento"
      goBackTo="/medication"
      createFunct={createMedication}
      updateFunct={updateMedication}
      editing={editing as string | undefined}
    />
  );
}