import { ButtonDark } from "@/components/buttons";
import ShowInfo from "@/components/showInfo";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { WebView } from "react-native-webview";

export const RutineTypes = ["Video", "Pasos" , "Texto" , ""];

// Tipo para los pasos
interface Paso {
  id: string;
  titulo: string;
  descripcion: string;
}

export type Rutine = {
  body: string; // JSON con estructura
  createdBy: string;
  emotion: string[];
  id: string;
  name: string;
  type: "Video"| "Pasos" | "Texto" | "";
  Users?: string[]; // Array de IDs de usuarios asignados
};

type PropsCard = {
  element: Rutine;
  pov: "profesional" | "user";
  delIcon?: (item: Rutine) => void;
  addIcon?: (item: Rutine) => void;
  onButton?: () => void;
};

export default function CardRutine({ element, delIcon, addIcon ,onButton,pov }: PropsCard) {
  const content = element;
  const [showFullContent, setShowFullContent] = useState(false);

  // Función para renderizar los pasos
  const renderPasos = (body: string) => {
    try {
      // Intentar parsear como JSON primero (rutinas creadas por usuarios)
      const pasos: Paso[] = JSON.parse(body);
      
      if (!Array.isArray(pasos)) {
        return <ShowInfo text={body} icon="file-text" />;
      }

      if (pasos.length === 0) {
        return <ShowInfo text="No hay pasos definidos" icon="file-text" />;
      }

      // Renderizar pasos como objetos JSON
      return (
        <View className="mt-4">
          {pasos.map((paso, index) => (
            <View 
              key={paso.id || index}
              className="mb-3 p-4 rounded-xl bg-color1"
            >
              <Text className="text-white font-bold text-lg mb-2">
                {paso.titulo || `Paso ${index + 1}`}
              </Text>
              <Text className="text-white text-base">
                {paso.descripcion || "Sin descripción"}
              </Text>
            </View>
          ))}
        </View>
      );
    } catch (error) {
      // Si no es JSON válido, tratarlo como texto plano (rutinas del sistema)
      console.log(error);
      
      const pasosTexto = body.split('\n').filter(paso => paso.trim() !== '');
      
      if (pasosTexto.length === 0) {
        return <ShowInfo text="No hay pasos definidos" icon="file-text" />;
      }

      // Renderizar pasos como texto plano
      return (
        <View className="mt-4">
          {pasosTexto.map((paso, index) => (
            <View 
              key={index}
              className="mb-3 p-4 rounded-xl bg-color1"
            >
              <Text className="text-white font-bold text-lg mb-2">
                {`Paso ${index + 1}`}
              </Text>
              <Text className="text-white text-base">
                {paso.replace(/^\d+\.\s*/, '')} {/* Remover numeración si existe */}
              </Text>
            </View>
          ))}
        </View>
      );
    }
  };

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
      <View className="py-3 bg-color1 rounded-t-2xl px-4">
        <View className="flex-row items-center justify-between">
          {pov === "profesional" && element.createdBy !== "system" && element.Users && (
            <TouchableOpacity onPress={() => addIcon?.(element)} className="p-2">
                <FontAwesome name="plus" size={20} color="white" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setShowFullContent(!showFullContent)} className="flex-1 items-center max-w-20">
              <Text className="text-2xl font-bold text-white text-center">{element.name}</Text>
          </TouchableOpacity>
          {pov === "profesional" && element.createdBy !== "system" && (
            <TouchableOpacity onPress={() => delIcon?.(element)} className="p-2">
              <FontAwesome name="trash" size={20} color="white" />
            </TouchableOpacity>
          )}
          
        </View>
      </View>
      {showFullContent && (
      <View className="p-6 bg-fondo rounded-b-2xl">
        <ShowInfo text={element.type} icon="link" />
        {/* <ShowInfo text={element.emotion} icon="smile-o" /> */}
        <View className="flex-col mb-2">
          {Array.isArray(element.emotion) && element.emotion.length > 0 ? (
            element.emotion.map((emo, idx) => (
              <ShowInfo key={idx} text={emo} icon="smile-o" />
            ))
          ) : (
            <ShowInfo text="Sin emoción asociada" icon="smile-o" />
          )}
        </View>
        
        {/* Debug temporal */}
        
        {element.type === "Video" ? (
          <View className="w-full aspect-video rounded-xl overflow-hidden mb-4 mt-4 justify-center item-center">
            <WebView
              source={{ uri: getEmbeddedYoutubeUrl(content.body) }}
              style={{ flex: 1 }}
              allowsFullscreenVideo
            />
          </View>
        ) : element.type === "Pasos" ? (
          renderPasos(content.body)
        ) : (
          <ShowInfo text={content.body} icon="file-text" />
        )}

        {pov === "profesional" && element.createdBy !== "system" && <ButtonDark text="Editar" onPress={onButton} />}
      </View>
      )}
    </View>
  );
}

function getEmbeddedYoutubeUrl(url: string): string {
  const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
  const videoId = match?.[1];
  return `https://www.youtube.com/embed/${videoId}`;
}