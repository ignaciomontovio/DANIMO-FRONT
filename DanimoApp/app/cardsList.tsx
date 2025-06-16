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
  deleteFunct: (item: T) => Promise<void>;
};

type PropsCard<T> = {
  element: T;
  onIcon: (item: T) => void;
  onButton: () => void;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
};

export default function CardsList<T>({endpoint, name, goto, deleteFunct }: Props<T>) {
  const [element, setElement] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useUserLogInStore((state) => state.token);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Fetching from:", endpoint + "/obtain"); // Debug
      
      const response = await fetch(endpoint + "/obtain", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
      });

      console.log("Response status:", response.status); // Debug
      
      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      console.log("Data received:", data); // Debug
      console.log("Is array:", Array.isArray(data)); // Debug
      
      const arrayData = Array.isArray(data) ? data : [];
      setElement(arrayData);
      
    } catch (error) {
      console.error("🔍 Fetch error:", error);
      Alert.alert("Error", (error as Error).message);
      setElement([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (item: T) => {
    Alert.alert("Eliminar", "¿Estás seguro que quieres eliminar?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteFunct(item);
            await fetchData();
          } catch (error) {
            console.error("Delete error:", error);
            Alert.alert("Error", "No se pudo eliminar.");
          }
        },
      },
    ]);
  };


  const gotoEdit = (item: any) => {
    // Detectar si es contacto o medicación
    const isContact = 'who' in item && 'name' in item && 'phoneNumber' in item;
    const isMedication = 'drug' in item && 'grams' in item && 'frecuency' in item;
    
    if (isContact) {
      router.push({
        pathname: goto as any,
        params: {
          who: item.who,
          name: item.name,
          phoneNumber: item.phoneNumber,
          editing: "edit",
        },
      });
    } else if (isMedication) {
      router.push({
        pathname: goto as any,
        params: {
          drug: item.drug,
          grams: item.grams,
          frecuency: item.frecuency,
          editing: "edit",
        },
      });
    }
  };


  const gotoNew = () => {
    // Detectar tipo basado en la ruta
    const isMedicationRoute = goto.includes('Medication') || goto.includes('medication');
    
    if (isMedicationRoute) {
      router.push({
        pathname: goto as any,
        params: {
          drug: "",
          grams: "",
          frecuency: "",
        },
      });
    } else {
      // Default para contactos
      router.push({
        pathname: goto as any,
        params: {
          who: "",
          name: "",
          phoneNumber: "",
        },
      });
    }
  };

  return (
    <SafeAreaProvider>
      <LinearGradient 
        colors={["#D2A8D6", "#F4E1E6"]} 
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full h-full"
      >
        <HeaderGoBack text={name} onPress={() => router.replace("/tabs/home")} />
        <ScrollView className="flex-1 px-5 py-5">
          <View className="flex-1 justify-center items-center">
            {loading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : element && element.length > 0 ? (
              element.map((el, index) => (
                <Card
                  key={index}
                  element={el}
                  onButton={() => gotoEdit(el)}
                  onIcon={() => handleDelete(el)}
                  icon="trash"
                />
              ))
            ) : (
              <Text className="text-gray-600 text-center">
              </Text>
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
  
  const isContact = 'who' in e && 'name' in e && 'phoneNumber' in e;
  const isMedication = 'drug' in e && 'grams' in e && 'frecuency' in e;
  
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
        <Text className="text-2xl font-bold text-white text-center">
          {isContact ? e.who : isMedication ? e.drug : 'Item'}
        </Text>
        <TouchableOpacity 
          onPress={() => onIcon(element)} 
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
        {isContact ? (

          <>
            <ShowInfo text={e.name} icon="id-card" />
            <ShowInfo text={e.phoneNumber} icon="phone" />
          </>
        ) : isMedication ? (
          <>
            <ShowInfo text={"e.grams" + " gramo/s"} icon="medkit" />
            <ShowInfo text={"e.frecuency" + " veces al día"} icon="clock-o" />
          </>
        ) : (

          <Text>Elemento desconocido</Text>
        )}
        
        <ButtonDark text="Editar" onPress={onButton} />
      </View>
    </View>
  );
}