import { ButtonDark, ButtonDark_add } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import ShowInfo from "@/components/showInfo";
import { colors } from "@/stores/colors";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

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

  const handleCreate = () => {
    // router.push("/profesional/nuevaRutina");
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
                <Card
                  key={index}
                  element={el}
                  onButton={() => handleEdit(el)}
                  onIcon={() => handleDelete(el)}
                  icon="trash"
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

type PropsCard = {
  element: Rutine;
  onIcon: (item: Rutine) => void;
  onButton: () => void;
  icon: React.ComponentProps<typeof FontAwesome>["name"];
};

function Card({ element, onIcon, onButton, icon }: PropsCard) {
  const content = JSON.parse(element.content);

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
          {element.title}
        </Text>
        <TouchableOpacity 
          onPress={() => onIcon(element)} 
          style={{ position: "absolute", top: 10, right: 16, padding: 4 }}
        >
          <FontAwesome name={icon} size={20} color="white" />
        </TouchableOpacity>
      </View>
      
      <View className="p-6 bg-fondo rounded-b-2xl">
        <ShowInfo text={element.type} icon="link" />

        {element.type === "Video" ? (
          <View className="w-full aspect-video rounded-xl overflow-hidden mb-4 mt-4 justify-center item-center">
            <WebView
              source={{ uri: getEmbeddedYoutubeUrl(content.content) }}
              style={{ flex: 1 }}
              allowsFullscreenVideo
            />
          </View>
        ) : (
          <ShowInfo text={content.content} icon="file-text" />
        )}

        <ButtonDark text="Editar" onPress={onButton} />
      </View>
    </View>
  );
}

function getEmbeddedYoutubeUrl(url: string): string {
  const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
  const videoId = match?.[1];
  return `https://www.youtube.com/embed/${videoId}`;
}

  