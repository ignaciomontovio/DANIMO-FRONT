import { URL_AUTH, URL_BASE } from "@/stores/consts";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Platform, StatusBar, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Modal from "react-native-modal";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ButtonAccept } from "../../components/buttons";
import Input from "../../components/input";
export default function DetailRegister() {
  const [userName, setUserName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userSex, setUserSex] = useState<"Masculino"|"Femenino"|"Otro" | undefined>(undefined);
  const [userBirth, setUserBirth] = useState<Date | undefined>(undefined);
  const [showPicker, setShowPicker] = useState(false);
  const { email, password } = useLocalSearchParams<{ email: string; password: string }>();
  const [isModalVisible, setModalVisible] = useState(false);
  const genderOptions = ["Masculino", "Femenino", "Otro"];

  const toggleModal = () => setModalVisible(!isModalVisible);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) setUserBirth(selectedDate);
  };

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

    if (!isAdult(userBirth)) {
      alert("Debes tener al menos 18 años para registrarte");
      return;
    }
    
    // Continuar con el registro
    try {
      const response = await fetch(URL_BASE + URL_AUTH + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          firstName: userName.trim(), 
          lastName: userLastName.trim(), 
          email:email.trim(), 
          password:password.trim(), 
          birthDate: userBirth.toISOString().split("T")[0], 
          gender: userSex ? userSex.trim() : "" }),});

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error:", errorText);
        throw new Error("Error al registrar");
      }

      const data = await response.json();
      console.log("Register:", data);
    } catch (error) {
      console.error("Register error:", error);
      alert("Register error: " + error);
    }


    router.replace("/auth/LoginRegisterScreen");
  }

  function selectSex(){
    return(
      <>
      {/* Campo de selección de sexo */}
      <View className="relative mb-4">
        <FontAwesome name="male" size={18} color="gray" style={{ position: "absolute", top: 16, left: 12 }} />
        <TouchableOpacity
          onPress={toggleModal}
          className="w-full pl-10 pr-4 py-3 border border-oscuro rounded-md"
        >
          <Text className="text-oscuro">
            {userSex ?? "Selecciona tu sexo"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de selección */}
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
    </>
    );
  }


  return (
    <SafeAreaProvider>
      <LinearGradient colors={["#D2A8D6", "#F4E1E6"]} className="w-full h-full">
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
              
              {/* Selector de fecha */}
              <TouchableOpacity
                onPress={() => setShowPicker(true)}
                className="w-full pl-10 pr-4 py-3 border border-oscuro rounded-md text-oscuro"
              >
                {/* <FontAwesome name="calendar" size={16} color="#666" /> */}
                <FontAwesome name="calendar" size={18} color="gray" style={{ position: "absolute", top: 16, left: 12 }} />
                <Text className="ml-2 text-oscuro">
                  {userBirth ? userBirth.toLocaleDateString() : "Fecha de nacimiento"}
                </Text>
              </TouchableOpacity>

              {showPicker && (
                <DateTimePicker
                  value={userBirth || new Date(2000, 0, 1)}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
              <ButtonAccept text="Sign Up" onPress={handleRegister} />
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaProvider>
  );
}
