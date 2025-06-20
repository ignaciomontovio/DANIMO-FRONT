import { colors } from "@/stores/colors";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, View } from "react-native";

export type ShowInfoProps = {
  text: string;
  icon: keyof typeof FontAwesome.glyphMap;
  onChangeText?: (text: string) => void;
};

export type ShowInfoEditProps = {
  text: string;
  icon: keyof typeof FontAwesome.glyphMap;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
};

export default function ShowInfo({ text, icon }: ShowInfoProps) {
  return (
    <View className="w-full py-3 px-5 rounded-md mt-2 shadow-2xl border border-oscuro flex-row items-center justify-start">
        <FontAwesome name={icon} size={30} color={colors.oscuro} />
        <Text className="text-oscuro px-5 font-bold text-lg">{text}</Text>
    </View>
  );
}

export function ShowInfo_edit({ 
  text, 
  icon, 
  onChangeText, 
  placeholder, 
  label 
}: ShowInfoEditProps) {
  return (
    <View className="mb-3">
      {label && (
        <Text style={{ 
          color: colors.oscuro, 
          fontSize: 14, 
          marginBottom: 4,
          fontWeight: '500'
        }}>
          {label}
        </Text>
      )}
      
      <View className="w-full py-3 px-5 rounded-md mt-2 shadow-2xl border border-oscuro flex-row items-center justify-start">
        <FontAwesome name={icon} size={30} color={colors.oscuro} />
        <TextInput
          className="text-oscuro px-5 font-bold text-lg flex-1"
          value={text}
          onChangeText={onChangeText}
          placeholder={placeholder || "Ingresa valor..."}
          placeholderTextColor={colors.oscuro + "80"}
        />
      </View>
    </View>
  );
}