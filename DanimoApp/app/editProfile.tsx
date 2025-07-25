import { getProfileEditConfig, UserProfile } from "@/components/config/profileConfig";
import { URL_AUTH, URL_BASE } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import EditCardFromList from "./cards/editCardFromList";

export default function EditProfile() {
  const token = useUserLogInStore((state) => state.token);
  const { editing } = useLocalSearchParams();
  const userType = useUserLogInStore((state) => state.userType); 
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
  // Función específica para actualizar contacto
  const updateProfile = async (data: UserProfile, original: UserProfile) => {
    console.log("Updating profile with data:", data, "and original:", original);
    const bodyData = {
        firstName: data.name,
        lastName: data.lastName,
        birthDate: convertDateToISO(data.d_birth ?? ""),
        occupation: data.occupation,
        livesWith: data.livesWith,
      };
    console.log("Sending updated profile data:", bodyData);
    const response = await fetch(URL_BASE + URL_AUTH + "/update-profile" , {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      const errorText = await response.json();
      console.error("Error:", errorText.error);
      throw new Error(errorText.error);
    }
  };

  return (
    <EditCardFromList<UserProfile>
      screenTitle="Editar Perfil"
      goBackTo="/profile"
      createFunct={async () => {}}
      updateFunct={updateProfile}
      editConfig={getProfileEditConfig(userType ?? "")}
      editing={editing as string | undefined}
    />
  );
}