import { URL_BASE, URL_CONTACT } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import React from "react";
import { Alert } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  Contact,
  contactCardConfig,
  contactNavigationConfig
} from "../../components/config/contactConfig";
import CardsList from "../cards/cardsList";

export default function EmergencyContact() {
  const token = useUserLogInStore((state) => state.token);
  
  // Función específica de eliminación de contacto
  const deleteContact = async (contactToDelete: Contact) => {
    try {
      const response = await fetch(URL_BASE + URL_CONTACT + "/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({ phoneNumber: contactToDelete.phoneNumber }),
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

  const getContact = async (): Promise<Contact[]> => {
    const response = await fetch(URL_BASE + URL_CONTACT + "/obtain", {
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
    return Array.isArray(data) ? data : (data.data || []);
  };

  return (
    <SafeAreaProvider>
      <CardsList<Contact>  
        name="Contacto"
        fetchConfig={getContact}
        navigationConfig={contactNavigationConfig}
        cardConfig={contactCardConfig}
        deleteFunct={deleteContact}
      />
    </SafeAreaProvider>
  );
}