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


export type Rutine = {
  body: string; // JSON con estructura
  createdBy: string;
  emotion: string;
  id: string;
  name: string;
  type: "Video"| "Pasos" | "Texto" | "";
  Users?: string[]; // Array de IDs de usuarios asignados
};

type PropsCard = {
  element: Rutine;
  pov: "profesional" | "user";
  delIcon: (item: Rutine) => void;
  addIcon: (item: Rutine) => void;
  onButton: () => void;
};

export default function CardRutine({ element, delIcon, addIcon ,onButton,pov }: PropsCard) {
  // console.log("CardRutine element:", element);
  const content = element;
  // console.log("CardRutine content:", content);
  const [showFullContent, setShowFullContent] = useState(false);
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
          {pov === "profesional" && element.Users && (
            <TouchableOpacity onPress={() => addIcon(element)} className="p-2">
                <FontAwesome name="plus" size={20} color="white" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setShowFullContent(!showFullContent)} className="flex-1 items-center max-w-20">
              <Text className="text-2xl font-bold text-white text-center">{element.name}</Text>
          </TouchableOpacity>
          {pov === "profesional" && (
            <TouchableOpacity onPress={() => delIcon(element)} className="p-2">
              <FontAwesome name="trash" size={20} color="white" />
            </TouchableOpacity>
          )}
          
        </View>
      </View>
      {showFullContent && (
      <View className="p-6 bg-fondo rounded-b-2xl">
        <ShowInfo text={element.type} icon="link" />
        <ShowInfo text={element.emotion} icon="smile-o" />
        {element.type === "Video" ? (
          <View className="w-full aspect-video rounded-xl overflow-hidden mb-4 mt-4 justify-center item-center">
            <WebView
              source={{ uri: getEmbeddedYoutubeUrl(content.body) }}
              style={{ flex: 1 }}
              allowsFullscreenVideo
            />
          </View>
        ) : (
          <ShowInfo text={content.body} icon="file-text" />
        )}

        <ButtonDark text="Editar" onPress={onButton} />
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
