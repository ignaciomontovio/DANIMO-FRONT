import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, View } from "react-native";
export type ShowInfoProps = {
  text: string;
  icon: keyof typeof FontAwesome.glyphMap;
  onChangeText?: (text: string) => void;
};
export default function ShowInfo({ text, icon }: ShowInfoProps) {
  return (
    <View className="w-full py-3 px-5 rounded-md mt-2 shadow-2xl border border-oscuro flex-row items-center justify-start">
        <FontAwesome name={icon} size={30} color="#595154" />
        <Text className="text-oscuro px-5 font-bold text-lg">{text}</Text>
    </View>
  );
}
export function ShowInfo_edit({ text, icon, onChangeText }: ShowInfoProps) {
  return (
    <View className="w-full py-3 px-5 rounded-md mt-2 shadow-2xl border border-oscuro flex-row items-center justify-start">
        <FontAwesome name={icon} size={30} color="#595154" />
        <TextInput 
          className="text-oscuro px-5 font-bold text-lg"
          value={text}
          onChangeText={onChangeText}/>
    </View>
  );
}
