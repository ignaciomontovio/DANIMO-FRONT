import { URL_BASE, URL_MEDICATION } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { useLocalSearchParams } from "expo-router";
import * as React from "react";
import EditCardFromList from "./editCardFromList";

type Medication = {
  name: string;
  dosage: string;
  startDate: string;
  endDate: string;
};

export default function EditMedication() {
  const token = useUserLogInStore((state) => state.token);
  const { editing } = useLocalSearchParams();
  
  const createMedication = async (data: Medication) => {
    console.log("Creating medication:", data);
    const response = await fetch(URL_BASE + URL_MEDICATION + "/entry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }
  };

  const updateMedication = async (data: Medication, original: Medication) => {
    console.log("Updating medication:", data, "Original:", original);
    const response = await fetch(URL_BASE + URL_MEDICATION + "/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        ...data,
        currentName: original.name,
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }
  };

  return (
    <EditCardFromList<Medication>
      screenTitle="Medicación"
      goBackTo="/medication"
      createFunct={createMedication}
      updateFunct={updateMedication}
      editing={editing as string | undefined}
    />
  );
}