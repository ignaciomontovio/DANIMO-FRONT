import { colors } from "@/stores/colors";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
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
  type?: "text" | "phone" | "date" | "picklist";
  picklistOptions?: string[];
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
  type,
  picklistOptions,
}: ShowInfoEditProps) {
  // console.log("ShowInfo_edit: " + text + " type " + type);

  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => setModalVisible(!isModalVisible);
  return (
    <View className="mb-3">
      {label && (
        <Text className="text-[14px] font-medium mb-1 text-oscuro">
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
            multiline
            textAlignVertical="top"
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
      {type === "picklist" && (
        <>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="w-full py-3 px-5 rounded-md mt-2 shadow-2xl border border-oscuro flex-row items-center justify-between"
          >
            <FontAwesome name={icon} size={30} color={colors.oscuro} />
            <Text className="text-oscuro px-5 font-bold text-lg flex-1">
              {text || placeholder || "Seleccionar..."}
            </Text>
          </TouchableOpacity>

          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={toggleModal}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={toggleModal}
              className="flex-1 justify-center items-center bg-black/50"
            >
              <View
                className="bg-fondo rounded-xl p-4"
                style={{ minWidth: 250 }}
                // Prevent closing when pressing inside the modal content
                onStartShouldSetResponder={() => true}
              >
                <Text className="text-lg font-bold mb-2">
                  Selecciona el tipo de rutina
                </Text>
                {picklistOptions &&
                  picklistOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => {
                        onChangeText(option);
                        setModalVisible(false);
                      }}
                      className="py-2"
                    >
                      <Text className="text-base">{option}</Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </TouchableOpacity>
          </Modal>
        </>
      )}

    </View>
  );
}