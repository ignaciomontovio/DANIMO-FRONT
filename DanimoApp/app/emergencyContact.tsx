import { ButtonDark, ButtonDark_add } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import ShowInfo from "@/components/showInfo";
import { useUserLogInStore } from "@/stores/userLogIn";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";

import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";

type Contact = {
  who: string;
  name: string;
  phone: string;
};

export default function EmergencyContact() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useUserLogInStore((state) => state.token);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("https://danimo.onrender.com/contact/obtain", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          }
        });
        console.log(response);        
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
  }, []);

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
                <ContactCard key={index} contact={contact} />
                // boton de delete
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
};

export function ContactCard({ contact }: PropsContactCard) {
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
      <View className="py-3 bg-color1 rounded-t-2xl">
        <Text className="text-2xl font-bold text-white text-center">{contact.who}</Text>
      </View>

      <View className="p-6 bg-fondo rounded-b-2xl">
        <ShowInfo text={contact.name} icon="id-card" />
        <ShowInfo text={contact.phone} icon="phone" />
        <ButtonDark
          text="Editar"
          onPress={() => router.push({ pathname: "/editEmergencyContact", params: contact })}
        />
      </View>
    </View>
  );
}
