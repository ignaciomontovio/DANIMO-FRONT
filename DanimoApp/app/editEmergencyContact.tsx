import { ButtonDark } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import { ShowInfo_edit } from "@/components/showInfo";
import { useUserLogInStore } from "@/stores/userLogIn";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, TextInput, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";

type Contact = {
  who: string;
  name: string;
  phone: string;
};

export default function EditEmergencyContact() {
  const params = useLocalSearchParams();

  const contact: Contact = {
    who: params.who?.toString() || "Quien",
    name: params.name?.toString() || "Nombre",
    phone: params.phone?.toString() || "Celular",
  };
  return (
  <SafeAreaProvider>
    <LinearGradient
      colors={["#D2A8D6", "#F4E1E6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full h-full"
    >
      <HeaderGoBack text="Contactos" onPress={() => router.push("/tabs/home")} />
      <ScrollView className="flex-1 px-5 py-5">
      <ContactCard contact={contact} />

    </ScrollView>
    </LinearGradient>
  </SafeAreaProvider>
  );
}

type PropsContactCard = {
  contact: Contact
};

export function ContactCard({ contact }: PropsContactCard) {
  const [newContact, setNewContact] = useState<Contact>({
    who: contact.who,
    name: contact.name,
    phone: contact.phone,
  });
  const token = useUserLogInStore((state) => state.token);

  const addNewContact = async () =>{
    try {
      const response = await fetch("https://danimo.onrender.com/contact/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
          name: newContact.name,
          phoneNumber: newContact.phone,
        }),
      });
      console.log(response);        
      if (!response.ok) {
        throw new Error("Error al obtener contactos");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los contactos.");
      console.error(error);
    } 
  }
  const editContact = async () =>{
    try {
      const response = await fetch("https://danimo.onrender.com/contact/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
          currentName:contact.name,
          name: newContact.name,
          phoneNumber: newContact.phone,
        }),
      });
      console.log(response);        
      if (!response.ok) {
        throw new Error("Error al obtener contactos");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los contactos.");
      console.error(error);
    }
  }
  const save = () => {
    console.log("save");
    console.log(contact.who);
    console.log(contact.name);
    console.log(contact.phone);
    if (contact.phone === "Celular"){
      addNewContact()
    }
    else{
      editContact()
    }
    router.replace("/emergencyContact") // si pongo back no vuelve a cargar por ser un useefect vacio
  }
  return (
  <View className="w-full max-w-md rounded-2xl shadow-xl mb-4"
    style={{
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    }}
  >
    <View className="py-3 bg-color1 rounded-t-2xl">
    <TextInput 
      className="text-2xl font-bold text-white text-center"
      value={newContact.who}
      onChangeText={(text) => setNewContact({ ...newContact, who: text })}
    />

    </View>

    <View className="p-6 bg-fondo rounded-b-2xl">
    <ShowInfo_edit text={newContact.name} icon="id-card" onChangeText={(text) => setNewContact({ ...newContact, name: text })}/>
    <ShowInfo_edit text={newContact.phone} icon="phone" onChangeText={(text) => setNewContact({ ...newContact, phone: text })}/>
    <ButtonDark text="Guardar" onPress={save} />
    </View>
  </View>
  );
}

