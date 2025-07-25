import { ButtonAccept } from "@/components/buttons";
import Input, { Input_date } from "@/components/input";
import { colors } from "@/stores/colors";
import { URL_AUTH, URL_AUTH_PROF, URL_BASE } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Modal from "react-native-modal";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function DetailRegister() {
  const { email, password } = useLocalSearchParams<{ email: string; password: string }>();

  const [userName, setUserName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userSex, setUserSex] = useState<"Masculino" | "Femenino" | "Otro" | undefined>(undefined);
  const [userBirth, setUserBirth] = useState<Date | undefined>(undefined);
  const [userDNI, setUserDNI] = useState("");
  const [userLicence, setUserLicence] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const userType = useUserLogInStore((state) => state.userType);
  const genderOptions = ["Masculino", "Femenino", "Otro"];

  useEffect(() => {
    const showSubs = Keyboard.addListener("keyboardDidShow", () => setIsKeyboardVisible(true));
    const hideSubs = Keyboard.addListener("keyboardDidHide", () => setIsKeyboardVisible(false));
    return () => {
      showSubs.remove();
      hideSubs.remove();
    };
  }, []);

  const toggleModal = () => setModalVisible((prev) => !prev);

  const isAdult = (date: Date): boolean => {
    const today = new Date();
    const adultDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return date <= adultDate;
  };

  const handleRegisterCommon = async (isProf: boolean) => {
    if (!userBirth) return alert("Debe seleccionar una fecha de nacimiento");
    if (!isAdult(userBirth)) return alert("Debes tener al menos 18 años para registrarte");

    const payload: Record<string, any> = {
      firstName: userName.trim(),
      lastName: userLastName.trim(),
      email: email.trim(),
      password: password.trim(),
      birthDate: userBirth.toISOString().split("T")[0],
      gender: userSex ?? "",
    };

    if (isProf) {
      payload.license = userLicence.trim() || "";
      payload.dni = userDNI.trim() || "";
    }

    try {
      const url = URL_BASE + (isProf ? URL_AUTH_PROF : URL_AUTH) + "/register";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.json();
        throw new Error(errorText?.error || "Error al registrar");
      }

      const data = await response.json();
      console.log("Registro exitoso:", data);
      router.replace("/auth/LoginRegisterScreen");
    } catch (error: any) {
      console.error("Error de registro:", error);
      alert(error?.message || "Error inesperado");
    }
  };

  const renderGenderSelector = () => (
    <View>
      <View className="relative mb-4">
        <FontAwesome name="male" size={18} color="gray" style={{ position: "absolute", top: 16, left: 12 }} />
        <TouchableOpacity
          onPress={toggleModal}
          className="w-full pl-10 pr-4 py-3 border border-oscuro rounded-md"
          accessibilityRole="button"
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
                setUserSex(option as "Masculino" | "Femenino" | "Otro");
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

  return (
    <SafeAreaProvider>
      <LinearGradient colors={[colors.color5, colors.fondo]} className="w-full h-full">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ android: "height" })}
        keyboardVerticalOffset={0}
      >
          <StatusBar />
          <View className="flex-1 justify-center items-center px-4">
            <View className="w-full max-w-md rounded-2xl shadow-xl">
              <View className="py-6 bg-color1 rounded-t-2xl">
                <Text className="text-3xl font-bold text-white text-center">Registrar</Text>
              </View>

              <View className="p-6 bg-fondo rounded-b-2xl">
                <Input icon="user" placeholder="Nombre" value={userName} onChangeText={setUserName} />
                <Input icon="user" placeholder="Apellido" value={userLastName} onChangeText={setUserLastName} />
                {renderGenderSelector()}
                <Input_date setDate={setUserBirth} date={new Date()} />

                {userType === "profesional" && (
                  <>
                    <Input icon="id-card" placeholder="DNI" keyboardType="decimal-pad" value={userDNI} onChangeText={setUserDNI} />
                    <Input icon="id-card" placeholder="Matrícula profesional" value={userLicence} onChangeText={setUserLicence} />
                  </>
                )}

                <ButtonAccept
                  text="Sign Up"
                  onPress={() => handleRegisterCommon(userType === "profesional")}
                />
              </View>
            </View>
          </View>
      </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}
