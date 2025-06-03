import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { TextInput, View } from "react-native";

export default function SearchBar({ placeholder = "Buscar...", onChangeText }: { placeholder?: string; onChangeText?: (text: string) => void }) {
  return (
    <View className="flex-row items-center bg-fondo px-4 rounded-xl border-gray-300 m-5"
     style={{
            shadowColor: "#000",
            elevation: 10, // Para Android
          }}> 
      <FontAwesome name="search" size={20} color="#999" />
      <TextInput
        className="ml-2 flex-1 text-base "
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        onChangeText={onChangeText}
      />
    </View>
  );
}
