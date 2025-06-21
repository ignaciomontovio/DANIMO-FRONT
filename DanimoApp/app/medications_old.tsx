import { ButtonDark, ButtonDark_add } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import { colors } from "@/stores/colors";
import { URL_BASE, URL_MEDICATION } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import * as React from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  MedicationType,
  medicationCardConfig,
  medicationFetchStrategy,
  medicationNavigationConfig
} from "../components/config/medicationConfig";

export default function Medications() {
  const [element, setElement] = React.useState<MedicationType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const token = useUserLogInStore((state) => state.token);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await medicationFetchStrategy(URL_BASE + URL_MEDICATION, token ?? "");
      setElement(data);
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
      setElement([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  // Función específica de eliminación de medicación
  const deleteMedication = async (medicationToDelete: MedicationType) => {
    // No eliminar si ya está inactiva
    if ((medicationToDelete as any).active === false) {
      Alert.alert("Información", "Esta medicación ya está eliminada");
      return;
    }

    Alert.alert("Eliminar", "¿Estás seguro que quieres eliminar?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            console.log("Deleting medication:", medicationToDelete);
            
            const deleteData = { name: medicationToDelete.name };
            
            const response = await fetch(URL_BASE + URL_MEDICATION + "/delete", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
              },
              body: JSON.stringify(deleteData),
            });

            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(errorText);
            }

            console.log("Medication deleted successfully");
            await fetchData(); // Refrescar lista
          } catch (error) {
            console.error("Error al eliminar medicación:", error);
            Alert.alert("Error", "No se pudo eliminar la medicación.");
          }
        },
      },
    ]);
  };

  const gotoEdit = (item: MedicationType) => {
    const params = medicationNavigationConfig.getEditParams(item);
    router.push({
      pathname: medicationNavigationConfig.goto as any,
      params: { ...params, editing: "edit" },
    });
  };

  const gotoNew = () => {
    const params = medicationNavigationConfig.getNewParams();
    router.push({
      pathname: medicationNavigationConfig.goto as any,
      params,
    });
  };

  return (
    <SafeAreaProvider>
      <LinearGradient 
        colors={[colors.color5, colors.fondo]} 
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full h-full"
      >
        <HeaderGoBack text="Medicaciones" onPress={() => router.replace("/tabs/home")} />
        <ScrollView className="flex-1 px-5 py-5">
          <View className="flex-1 justify-center items-center">
            {loading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : element && element.length > 0 ? (
              <>
                {element.map((el, index) => (
                  <MedicationCard
                    key={index}
                    element={el}
                    onButton={() => gotoEdit(el)}
                    onIcon={() => deleteMedication(el)}
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

// Card específica para medicación que maneja el estado inactivo
function MedicationCard({ 
  element, 
  onIcon, 
  onButton 
}: {
  element: MedicationType;
  onIcon: () => void;
  onButton: () => void;
}) {
  const isInactive = (element as any).active === false;

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
          {element.name}
        </Text>
        
        {/* Solo mostrar tacho si NO está inactiva */}
        {!isInactive && (
          <TouchableOpacity 
            onPress={onIcon} 
            style={{ 
              position: "absolute", 
              top: 10, 
              right: 16,
              padding: 4,
            }}
          >
            <FontAwesome name="trash" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
      
      <View className="p-6 bg-fondo rounded-b-2xl">
        {medicationCardConfig.renderContent(element)}
        <ButtonDark text="Editar" onPress={onButton} />
      </View>
    </View>
  );
}