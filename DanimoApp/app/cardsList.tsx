import { ButtonDark, ButtonDark_add } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import ShowInfo from "@/components/showInfo";
import { colors } from "@/stores/colors";
import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import * as React from "react";
import { useEffect, useState } from "react";

import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Función para formatear fecha
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString('es-ES');
  } catch {
    return dateString;
  }
};

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
      
      // Detectar si es medicación
      const isMedicationEndpoint = endpoint.includes('/medication');
      
      if (isMedicationEndpoint) {
        const listResponse = await fetch(endpoint + "/obtain", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
        });

        if (!listResponse.ok) throw new Error(await listResponse.text());

        const listData = await listResponse.json();
        const medicationNames = listData.data || listData;
        console.log("Got", medicationNames.length, "medications to detail");
        // Obtener detalles de cada medicación
        const detailedMedications = [];
        for (let i = 0; i < medicationNames.length; i++) {
          const med = medicationNames[i];
          try {
            const detailResponse = await fetch(endpoint + "/detail", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
              },
              body: JSON.stringify({ name: med.name }),
            });

            if (detailResponse.ok) {
              const detailData = await detailResponse.json();
              const details = detailData.data || detailData;
              detailedMedications.push(details);
            } else {
              detailedMedications.push(med);
            }
          } catch (error) {
            detailedMedications.push(med);
          }
        }
        setElement(detailedMedications);
        
      } else {
        const response = await fetch(endpoint + "/obtain", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
        });

        if (!response.ok) throw new Error(await response.text());

        const data = await response.json();
        const arrayData = Array.isArray(data) ? data : (data.data || []);
        setElement(arrayData);
      }
      
    } catch (error) {
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
    const isContact = 'who' in item && 'phoneNumber' in item;
    const isMedication = 'name' in item && !('who' in item);

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
      // Ya tenemos todos los datos, navegar directamente
      router.push({
        pathname: goto as any,
        params: {
          name: item.name,
          dosage: item.dosage || "",
          startDate: item.startDate ? formatDate(item.startDate) : "",
          endDate: item.endDate ? formatDate(item.endDate) : "",
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
          name: "",
          dosage: "",
          startDate: "",
          endDate: "",
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
        colors={[colors.color5, colors.fondo]} 
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
              <>
                {element.map((el, index) => (
                  <Card
                    key={index}
                    element={el}
                    onButton={() => gotoEdit(el)}
                    onIcon={() => handleDelete(el)}
                    icon="trash"
                  />
                ))}
              </>
            ) : null}
            <ButtonDark_add onPress={() => gotoNew()} />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

function Card<T>({ element, onIcon, onButton, icon }: PropsCard<T>) {
  const e = element as any;
  
  const isContact = 'who' in e && 'phoneNumber' in e;
  const isMedication = 'name' in e && !('who' in e);
  
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
          {isContact ? e.who : isMedication ? e.name : 'Item'}
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
            <ShowInfo text={e.dosage || "Sin dosis registrada"} icon="tint" />
            {e.startDate && (
              <ShowInfo 
                text={`Inicio: ${formatDate(e.startDate)}`} 
                icon="calendar" 
              />
            )}
            {e.endDate && (
              <ShowInfo 
                text={`Fin: ${formatDate(e.endDate)}`} 
                icon="calendar" 
              />
            )}
          </>
        ) : (
          <Text>Elemento desconocido</Text>
        )}
        
        <ButtonDark text="Editar" onPress={onButton} />
      </View>
    </View>
  );
}