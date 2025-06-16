import { ButtonDark, ButtonDark_add } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import ShowInfo from "@/components/showInfo";
import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";

import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";

type Props<T> = {
  endpoint: string;
  name: string;
  goto: string;
  deleteFunct: (arg0: T) => void;
};

type PropsCard<T> = {
  element: T;
  onIcon: (arg0: T) => void;
  onButton: () => void;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
};

export default function CardsList<T>({endpoint, name, goto, deleteFunct }: Props<T>) {
  const [element, setElement] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useUserLogInStore((state) => state.token);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(endpoint + "/obtain", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
        });

        if (!response.ok) throw new Error(await response.text());

        const data: T[] = await response.json();
        setElement(data);
      } catch (Error) {
        Alert.alert("Error", (Error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element]);

  const handleDelete = (item: T) => {
    Alert.alert("Eliminar", "¿Estás seguro que quieres eliminar?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteFunct(item);
            // refrescar datos aquí si es necesario
          } catch (error) {
            Alert.alert("Error", "No se pudo eliminar.");
          }
        },
      },
    ]);
  };

  const gotoEdit = (contact: any) => router.push({
    pathname: goto as any,
    params: {
      who: contact.who,
      name: contact.name,
      phoneNumber: contact.phoneNumber,
      editing: "edit",
    },
  });
  const gotoNew = () => {
    router.push({
    pathname: goto as any,
    params: {
      who: "",
      name: "",
      phoneNumber:"",
      },
    });
  }

  return (
    <SafeAreaProvider>
      <LinearGradient colors={["#D2A8D6", "#F4E1E6"]} className="w-full h-full">
        <HeaderGoBack text={name} onPress={() => router.replace("/tabs/home")} />
        <ScrollView className="flex-1 px-5 py-5">
          <View className="flex-1 justify-center items-center">
            {loading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : (
              element.map((el, index) => (
                <Card
                  key={index}
                  element={el}
                  onButton={() => gotoEdit(el)}
                  onIcon={() => handleDelete(el)}
                  icon="trash"
                />
              ))
            )}
            <ButtonDark_add onPress={() => gotoNew()} />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

function Card<T>({ element, onIcon, onButton, icon }: PropsCard<T>) {
  const e = element as any;
  return (
    <View className="w-full max-w-md rounded-2xl shadow-xl mb-4">
      <View className="py-3 bg-color1 rounded-t-2xl relative">
        <Text className="text-2xl font-bold text-white text-center">{e.who}</Text>
        <TouchableOpacity onPress={() => onIcon(element)} style={{ position: "absolute", top: 10, right: 16 }}>
          <FontAwesome name={icon} size={20} color="white" />
        </TouchableOpacity>
      </View>
      <View className="p-6 bg-fondo rounded-b-2xl">
        <ShowInfo text={e.name} icon="id-card" />
        <ShowInfo text={e.phoneNumber} icon="phone" />
        <ButtonDark text="Editar" onPress={onButton} />
      </View>
    </View>
  );
}
