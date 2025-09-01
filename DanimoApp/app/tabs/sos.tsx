import { URL_BASE, URL_SOS } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import React, { useRef, useState } from "react";
import { Modal, Text, TouchableHighlight, View } from "react-native";
import { ButtonDark } from "@/components/buttons";

export default function Sos() {
  const [, setPressing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [msjModal, setMsjModal] = useState(
    "El mensaje de emergencia fue enviado correctamente."
  );

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const token = useUserLogInStore((state) => state.token);

  const onActivate = async () => {
    try {
      const response = await fetch(URL_BASE + URL_SOS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (!response.ok) {
        throw new Error("Error al enviar SMS");
      }
      setMsjModal("✅ El mensaje de emergencia fue enviado correctamente.");
    } catch (error) {
      console.error("Error", error);
      setMsjModal("⚠️ El mensaje de emergencia no pudo ser enviado.");
    }
    finally{
      setModalVisible(true);
    }
  };

  const handlePressIn = () => {
    setPressing(true);
    timeoutRef.current = setTimeout(() => {
      setPressing(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      onActivate();
    }, 4000);
  };

  const handlePressOut = () => {
    setPressing(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <>
      {/* Modal mejorado */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/60 px-6">
          <View className="bg-fondo rounded-2xl p-6 w-full shadow-2xl">
            <Text className="text-xl font-extrabold text-center text-gray-800 mb-3">
              Alerta SOS
            </Text>
            <Text className="text-base text-center text-gray-700 mb-6">
              {msjModal}
            </Text>
            <ButtonDark
              onPress={() => setModalVisible(false)}
              text="Cerrar"
            />
          </View>
        </View>
      </Modal>

      {/* Botón flotante SOS */}
      <TouchableHighlight
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="absolute -top-[30px] justify-center items-center w-[80px] h-[80px] rounded-full bg-[#e53935] shadow-2xl border-4 border-white"
      >
        <Text className="text-white font-extrabold text-lg tracking-wide">
          SOS
        </Text>
      </TouchableHighlight>
    </>
  );
}
