import { colors } from "@/stores/colors";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

export default function SearchBar({ 
  placeholder = "Buscar...", 
  onChangeText, 
  onSearch,
  value = ''
}: { 
  placeholder?: string; 
  onChangeText?: (text: string) => void;
  onSearch?: (text: string) => void;
  value?: string;
}) {
  const [searchText, setSearchText] = useState(value);

  // Sincronizar con el valor externo
  React.useEffect(() => {
    setSearchText(value);
  }, [value]);

  const handleTextChange = (text: string) => {
    setSearchText(text);
    onChangeText?.(text);
  };

  const handleSearch = () => {
    if (searchText.trim()) {
      onSearch?.(searchText);
    }
  };

  return (
    <View className="flex-row items-center bg-fondo px-4 rounded-xl border-gray-300 m-5"
     style={{
            shadowColor: "#000",
            elevation: 10, // Para Android
          }}> 
      <TouchableOpacity onPress={handleSearch}>
        <FontAwesome name="search" size={20} color={colors.color1} />
      </TouchableOpacity>
      <TextInput
        className="ml-2 flex-1"
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={searchText}
        onChangeText={handleTextChange}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
        style={{ color: colors.oscuro }}
      />
    </View>
  );
}
