import { ButtonDark } from "@/components/buttons";
import ShowInfo from "@/components/showInfo";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { WebView } from "react-native-webview";

type Rutine = {
  title: string;
  type: "Video" | "Pasos" | "Texto";
  content: string; // JSON con estructura
};

type PropsCard = {
  element: Rutine;
  pov: "profesional" | "user";
  delIcon: (item: Rutine) => void;
  addIcon: (item: Rutine) => void;
  onButton: () => void;
};

export default function CardRutine({ element, delIcon, addIcon ,onButton,pov }: PropsCard) {
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
      <View className="py-3 bg-color1 rounded-t-2xl px-4">
        <View className="flex-row items-center justify-between">
          {pov === "profesional" && (
            <TouchableOpacity onPress={() => addIcon(element)} className="p-2">
                <FontAwesome name="plus" size={20} color="white" />
            </TouchableOpacity>
          )}
          <Text className="text-2xl font-bold text-white text-center">{element.title}</Text>
          {pov === "profesional" && (
            <TouchableOpacity onPress={() => delIcon(element)} className="p-2">
              <FontAwesome name="trash" size={20} color="white" />
            </TouchableOpacity>
          )}
          
        </View>
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
