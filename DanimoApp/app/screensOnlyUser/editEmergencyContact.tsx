import { URL_BASE, URL_CONTACT } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Contact, contactEditConfig } from "../../components/config/contactConfig";
import EditCardFromList from "../cards/editCardFromList";

export default function EditEmergencyContact() {
  const token = useUserLogInStore((state) => state.token);
  const { editing } = useLocalSearchParams();
  
  // Función específica para crear contacto
  const createContact = async (data: Contact) => {
    console.log("Creating contact with data:", data);
    const response = await fetch(URL_BASE + URL_CONTACT + "/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
          const errorText = await response.json();
          console.error("Error:", errorText.error);
          throw new Error(errorText.error);
    }
  };

  // Función específica para actualizar contacto
  const updateContact = async (data: Contact, original: Contact) => {
    console.log("Updating contact with data:", data, "and original:", original);
    
    const response = await fetch(URL_BASE + URL_CONTACT + "/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        ...data,
        currentPhoneNumber: original.phoneNumber,
      }),
    });

    if (!response.ok) {
          const errorText = await response.json();
          console.error("Error:", errorText.error);
          throw new Error(errorText.error);
    }
  };

  return (
    <EditCardFromList<Contact>
      screenTitle="Editar contacto"
      goBackTo="/screensOnlyUser/emergencyContacts"
      createFunct={createContact}
      updateFunct={updateContact}
      editConfig={contactEditConfig}
      editing={editing as string | undefined}
    />
  );
}