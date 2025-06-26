import { ButtonAccept } from "@/components/buttons";
import Input, { Input_date } from "@/components/input";
import { colors } from "@/stores/colors";
import { URL_AUTH, URL_BASE } from "@/stores/consts";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Modal from "react-native-modal";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function DetailRegister() {
  const { email, password } = useLocalSearchParams<{ email: string; password: string }>();
  const [userName, setUserName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userSex, setUserSex] = useState<"Masculino" | "Femenino" | "Otro" | undefined>(undefined);
  const [userBirth, setUserBirth] = useState<Date | undefined>(undefined);
  const [isModalVisible, setModalVisible] = useState(false);
  const genderOptions = ["Masculino", "Femenino", "Otro"];
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const toggleModal = () => setModalVisible(!isModalVisible);

  function isAdult(date: Date): boolean {
    const today = new Date();
    const adultDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    
    return date <= adultDate;
  }

  const handleRegister = async () => {
    if (!userBirth) {
      alert("Debe seleccionar una fecha de nacimiento");
      return;
    }
    console.log("userBirth " + userBirth);
    
    if (!isAdult(userBirth)) {
      alert("Debes tener al menos 18 años para registrarte");
      return;
    }

    try {
      const response = await fetch(URL_BASE + URL_AUTH + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: userName.trim(),
          lastName: userLastName.trim(),
          email: email.trim(),
          password: password.trim(),
          birthDate: userBirth.toISOString().split("T")[0],
          gender: userSex ? userSex.trim() : "",
        }),
      });
      
      console.log("REGISTER");
      console.log(response);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error:", errorText);
        throw new Error("Error:" + errorText);
      }

      const data = await response.json();
      console.log("Register:", data);
      router.replace("/auth/LoginRegisterScreen");

    } catch (error) {
      console.error("Register error:", error);
      alert(error);
    }

  };

  function selectSex() {
    return (
      <View>
        <View className="relative mb-4">
          <FontAwesome name="male" size={18} color="gray" style={{ position: "absolute", top: 16, left: 12 }} />
          <TouchableOpacity
            onPress={toggleModal}
            className="w-full pl-10 pr-4 py-3 border border-oscuro rounded-md"
          >
            <Text className="text-oscuro">{userSex ?? "Selecciona tu sexo"}</Text>
          </TouchableOpacity>
        </View>

        <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
          <View className="bg-fondo rounded-xl p-4">
            <Text className="text-lg font-bold mb-2">Selecciona tu sexo</Text>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  setUserSex(option as typeof userSex);
                  setModalVisible(false);
                }}
                className="py-2"
              >
                <Text className="text-base">{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <LinearGradient colors={[colors.color5, colors.fondo]} className="w-full h-full">
        <StatusBar />
        <View className="flex-1 justify-center items-center px-4">
          <View className="w-full max-w-md rounded-2xl shadow-xl">
            <View className="py-6 bg-color1 rounded-t-2xl">
              <Text className="text-3xl font-bold text-white text-center">Registrar</Text>
            </View>

            <View className="p-6 bg-fondo rounded-b-2xl">
              <Input icon="user" placeholder="Nombre" value={userName} onChangeText={setUserName} />
              <Input icon="user" placeholder="Apellido" value={userLastName} onChangeText={setUserLastName} />

              {selectSex()}

              <Input_date setDate={setUserBirth} date={new Date}/>
              
              <ButtonAccept text="Sign Up" onPress={handleRegister} />
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaProvider>
  );
}
