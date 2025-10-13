import { ButtonAccept, ButtonDark } from "@/components/buttons";
import React from "react";
import { Modal, Text, View } from "react-native";

type CustomModalProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
  onConfirm?: () => void;
};

export function CustomModal({
  visible,
  onClose,
  title,
  message,
  buttonText = "Cerrar",
  onConfirm,
}: CustomModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/60 px-6">
        <View className="bg-fondo rounded-2xl p-6 w-full shadow-2xl">
          <Text className="text-xl font-extrabold text-center text-gray-800 mb-3">
            {title}
          </Text>
          <Text className="text-base text-center text-gray-700 mb-6">
            {message}
          </Text>
          <ButtonDark onPress={onConfirm} text={buttonText} />
          <ButtonAccept onPress={onClose} text={"Continuar en el chat"} />
        </View>
      </View>
    </Modal>
  );
}
