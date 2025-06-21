import { colors } from "@/stores/colors";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export type Props = {
  text: string;
  onPress: () => void;
  img?: number | string | null; 
};

export default function HeaderGoBack({ text, onPress, img }: Props) {
  return (
    <View className="flex-row items-center justify-between px-5 py-2 bg-oscuro">
      <TouchableOpacity onPress={onPress}>
        <FontAwesome name="arrow-left" size={24} color={colors.color1} />
      </TouchableOpacity>
      <Text className="text-xl font-bold text-white">{text}</Text>
      {img != null ? (
        <Image
          source={typeof img === "string" ? { uri: img } : img}
          className="w-10 h-10 rounded-full"
        />
      ) : <View className="w-10 h-10"> {/* para que este centrado sin foto */}</View> }
      
    </View>
  );
}