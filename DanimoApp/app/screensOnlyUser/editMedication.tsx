import EditCardFromList from "@/app/cards/editCardFromList";
import { MedicationType, medicationEditConfig } from "@/components/config/medicationConfig";
import { URL_BASE, URL_MEDICATION } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { useLocalSearchParams } from "expo-router";
import * as React from "react";

export default function EditMedication() {
  const token = useUserLogInStore((state) => state.token);
  const { editing } = useLocalSearchParams();
  
  // Función para convertir fecha de formato DD/MM/YYYY a YYYY-MM-DD
  const convertDateToISO = (dateStr: string): string => {
    console.log("Converting date:", dateStr);
    
    if (!dateStr || dateStr.trim() === "") {
      console.log("Empty date, returning empty string");
      return "";
    }
    
    try {
      // Si ya está en formato ISO (YYYY-MM-DD), devolverla tal como está
      if (dateStr.includes("-") && dateStr.length === 10) {
        console.log("Already in ISO format:", dateStr);
        return dateStr;
      }
      
      // Si está en formato DD/MM/YYYY, convertir a YYYY-MM-DD
      if (dateStr.includes("/")) {
        const parts = dateStr.split("/");
        
        if (parts.length === 3) {
          const day = parts[0].padStart(2, "0");
          const month = parts[1].padStart(2, "0");
          const year = parts[2];
          const isoDate = year + "-" + month + "-" + day;
          return isoDate;
        }
      }
      
      console.log("Could not convert, returning original:", dateStr);
      return dateStr; // Si no se puede convertir, devolver original
    } catch (error) {
      console.error("Error converting date:", error);
      return dateStr;
    }
  };

  // Función específica para crear medicación
  const createMedication = async (data: MedicationType) => {
    console.log("Creating medication:", data);
    
    // Crear objeto sin endDate si está vacío
    const medicationData: any = {
      name: data.name,
      dosage: data.dosage,
      startDate: convertDateToISO(data.startDate || "")
    };
    
    // Solo agregar endDate si tiene un valor válido
    if (data.endDate && data.endDate.trim() !== "") {
      medicationData.endDate = convertDateToISO(data.endDate);
    }
    
    console.log("Sending medication data:", medicationData);
    
    const response = await fetch(URL_BASE + URL_MEDICATION + "/entry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(medicationData),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }
  };

  // Función específica para actualizar medicación
  const updateMedication = async (data: MedicationType, original: MedicationType) => {
    console.log("Updating medication:", data, "Original:", original);
    
    // Crear objeto sin endDate si está vacío
    const medicationData: any = {
      currentName: original.name,  // Campo requerido por el backend
      name: data.name,
      dosage: data.dosage,
      startDate: convertDateToISO(data.startDate || "")
    };
    
    // Solo agregar endDate si tiene un valor válido
    if (data.endDate && data.endDate.trim() !== "") {
      medicationData.endDate = convertDateToISO(data.endDate);
    }
    
    console.log("Sending updated medication data:", medicationData);
    
    const response = await fetch(URL_BASE + URL_MEDICATION + "/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(medicationData),
    });

    if (!response.ok) {
          const errorText = await response.json();
          console.error("Error:", errorText.error);
          throw new Error(errorText.error);
    }
  };

  return (
    <EditCardFromList<MedicationType>
      screenTitle="Medicación"
      goBackTo="/medications"
      createFunct={createMedication}
      updateFunct={updateMedication}
      editConfig={medicationEditConfig}
      editing={editing as string | undefined}
    />
  );
}