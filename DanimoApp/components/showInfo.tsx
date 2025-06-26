import { colors } from "@/stores/colors";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, View } from "react-native";
import { Input_date_big } from "./input";

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
  type?: "text" | "phone" | "date";
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
  label, 
  type
}: ShowInfoEditProps) {
  console.log("ShowInfo_edit: " + text + " type " + type);

  
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
      {type === "date" && (        
        <Input_date_big
          setDate={(newDate: Date | undefined) => {
            if (!newDate) return;
            const dateString = newDate.toISOString().split('T')[0];
            onChangeText(dateString);
          }}
          date={
            !text || text === ""
              ? new Date()
              : (() => {
                  const [day, month, year] = text.split("/").map(Number); 
                  return new Date(year, month - 1, day);
                })()
          }
        />
      )}

      {type === "text" && (
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
      )}
      {type === "phone" && (
        // validar que sea numero de telefono poner un +54 al principio
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
      )}

    </View>
  );
}