import React from "react";

import { URL_BASE, URL_CONTACT } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { Alert } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CardsList from "./cardsList";


type Contact = {
  who: string;
  name: string;
  phoneNumber: string;
};

export default function EmergencyContact() {
  const token = useUserLogInStore((state) => state.token);
  const deleteContact = async (contactToDelete: Contact) => {
    try {
      const response = await fetch(URL_BASE + URL_CONTACT + "/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({phoneNumber: contactToDelete.phoneNumber}),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
    } catch (error) {
      console.error("Error al eliminar contacto:", error);
      Alert.alert("Error", "No se pudo eliminar el contacto.");
    }
  }
  return (
    <SafeAreaProvider>
      <CardsList<Contact>  endpoint={URL_BASE + URL_CONTACT} name={"Contacto"} goto={"/editEmergencyContact"} deleteFunct={deleteContact}/>
    </SafeAreaProvider>
  );
}

