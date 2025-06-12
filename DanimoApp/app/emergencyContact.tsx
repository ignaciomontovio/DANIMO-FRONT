import { ButtonDark, ButtonDark_add } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import ShowInfo from "@/components/showInfo";
import { URL_BASE, URL_CONTACT } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";

import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";


import type { FontAwesomeGlyphs } from "@expo/vector-icons/build/FontAwesome";
type Contact = {
  who: string;
  name: string;
  phoneNumber: string;
};

export default function EmergencyContact() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useUserLogInStore((state) => state.token);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(URL_BASE + URL_CONTACT + "/obtain", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          }
        });
       
        if (!response.ok) {
          throw new Error("Error al obtener contactos");
        }

        const data: Contact[] = await response.json();
        setContacts(data);        
      } catch (error) {
        Alert.alert("Error", "No se pudieron cargar los contactos.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contacts]);

  const handleDelete = (contactToDelete: Contact) => {
    Alert.alert(
      "Eliminar contacto",
      "¿Estás seguro que quieres eliminar este contacto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
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
            },
        },
      ]
    );
  };

  const gotoEdit = (contact: Contact) => router.push({
    pathname: "/editEmergencyContact",
    params: {
      who: contact.who,
      name: contact.name,
      phoneNumber: contact.phoneNumber,
      editing: "edit",
    },
  });
  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={["#D2A8D6", "#F4E1E6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full h-full"
      >
        <HeaderGoBack text="Contactos" onPress={() => router.replace("/tabs/home")} />
        <ScrollView className="flex-1 px-5 py-5">
          <View className="flex-1 justify-center items-center">
            {loading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : (
              contacts.map((contact, index) => (
                <ContactCard 
                  key={index}
                  contact={contact}
                  onButton={() => gotoEdit(contact)}
                  onIcon={() => handleDelete(contact)} 
                  icon="trash"/>
              ))
            )}
            <ButtonDark_add onPress={() => router.push("/editEmergencyContact")} />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

type PropsContactCard = {
  contact: Contact;
  onIcon: (arg0: Contact) => void;
  onButton: ()=>void;
  icon: FontAwesomeGlyphs;
};

export function ContactCard({ contact,onIcon,onButton,icon }: PropsContactCard) {

  return (
    <View
      className="w-full max-w-md rounded-2xl shadow-xl mb-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10,
      }}
    >
      
      <View className="py-3 bg-color1 rounded-t-2xl relative">
        <Text className="text-2xl font-bold text-white text-center">{contact.who}</Text>

        <TouchableOpacity
          onPress={() => onIcon(contact)}
          style={{
            position: "absolute",
            top: 10,
            right: 16,
            padding: 4,
          }}
        >
          <FontAwesome name={icon} size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View className="p-6 bg-fondo rounded-b-2xl">
        <ShowInfo text={contact.name} icon="id-card" />
        <ShowInfo text={contact.phoneNumber} icon="phone" />
        <ButtonDark
          text="Editar"
          onPress={onButton}
        />
      </View>
    </View>
  );
}
