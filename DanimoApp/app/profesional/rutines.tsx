
import CardRutine from "@/app/cards/cardRutine";
import { ButtonDark_add } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import { colors } from "@/stores/colors";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  View
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";
type Rutine = {
  title: string;
  type: "Video" | "Pasos" | "Texto";
  content: string; // JSON con estructura
};

export default function Rutines() {
  const [loading, setLoading] = useState(true);
  const [rutines, setRutines] = useState<Rutine[]>([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Simulación
      const mockData: Rutine[] = [
        { title: "Relajación", type: "Texto", content: '{"content": "Respirá hondo y solta el aire lentamente."}' },
        { title: "Furia", type: "Video", content: '{"content": "https://www.youtube.com/watch?v=EGO5m_DBzF8"}' },
        // { title: "Ataque de ansiedad", type: "Pasos", content: '{"content": [{"1":"pensa en otra cosa", "2":"controla la respiracion"}]}' },
      ];
      setRutines(mockData);
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEdit = (rutine: Rutine) => {
    // Redirigir a pantalla de edición con datos
    // router.push({ pathname: "/profesional/editarRutina", params: { rutine: JSON.stringify(rutine) } });
  };

  const handleDelete = (rutine: Rutine) => {
    Alert.alert("Eliminar rutina", `¿Estás seguro de eliminar "${rutine.title}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          setRutines((prev) => prev.filter((r) => r.title !== rutine.title));
        },
      },
    ]);
  };
  const handleAddPatient = (rutine: Rutine) => {
    // ir a pantalla de lista de pacientes 

  }
  

  const handleCreate = () => {
    router.push("/cards/cardEditRutine");
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={[colors.color5, colors.fondo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full h-full"
      >
        <HeaderGoBack
          text="Rutinas"
          onPress={() => router.replace("/profesional/home")}
        />
        <ScrollView className="flex-1 px-5 py-5">
          <View className="flex-1 items-center">
            {loading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : rutines.length > 0 ? (
              rutines.map((el, index) => (
                <CardRutine
                  key={index}
                  element={el}
                  onButton={() => handleEdit(el)}
                  delIcon={() => handleDelete(el)}
                  addIcon={() => handleAddPatient(el)}
                  pov="profesional"
                />
              ))
            ) : (
              <Text className="text-center text-lg text-gray-600">
                No hay rutinas disponibles.
              </Text>
            )}

            <View className="mt-4">
              <ButtonDark_add onPress={handleCreate} />
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}
