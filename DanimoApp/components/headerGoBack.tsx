import { colors } from "@/stores/colors";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export type Props = {
  text: string;
  onPress: () => void;
  img?: number | string | null; 
};

export default function HeaderGoBack({ text, onPress, img }: Props) {
  return (
    <SafeAreaView className="pt-10 bg-oscuro">
      <View className="relative flex-row items-center justify-center px-5 py-2">

        <TouchableOpacity onPress={onPress} className="absolute left-5">
          <FontAwesome name="arrow-left" size={24} color={colors.color1} />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-white">{text}</Text>

        {/* Imagen a la derecha */}
        {img != null ? (
          <Image
            source={typeof img === "string" ? { uri: img } : img}
            className="absolute right-5 w-10 h-10 rounded-full"
          />
        ) : (
          <View className="absolute right-5 w-10 h-10" />
        )}
      </View>
    </SafeAreaView>
  );
}
