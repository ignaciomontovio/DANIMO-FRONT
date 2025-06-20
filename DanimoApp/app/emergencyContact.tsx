import { URL_BASE, URL_CONTACT } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import React from "react";
import { Alert } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CardsList from "./cardsList";
import {
  Contact,
  contactCardConfig,
  contactFetchStrategy,
  contactNavigationConfig,
  FetchConfig
} from "./contactConfig";

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
        const errorText = await response.text();
        throw new Error(errorText);
      }
    } catch (error) {
      console.error("Error al eliminar contacto:", error);
      Alert.alert("Error", "No se pudo eliminar el contacto.");
      throw error;
    }
  };

  // Configuración de fetch específica para contactos
  const fetchConfig: FetchConfig<Contact> = {
    endpoint: URL_BASE + URL_CONTACT,
    fetchStrategy: contactFetchStrategy,
  };

  return (
    <SafeAreaProvider>
      <CardsList<Contact>  
        name="Contacto"
        fetchConfig={fetchConfig}
        navigationConfig={contactNavigationConfig}
        cardConfig={contactCardConfig}
        deleteFunct={deleteContact}
      />
    </SafeAreaProvider>
  );
}