import { colors } from "@/stores/colors";
import { URL_AUTH, URL_BASE } from "@/stores/consts";
import { router } from "expo-router";
import React, { useState } from "react";
import { StatusBar, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ButtonAccept, ButtonDark } from "../../components/buttons";
import Input from "../../components/input";



export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");


  const sendCode = async () => {
    try {
      const response = await fetch(URL_BASE + URL_AUTH + "/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase()}),});

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error:", errorText);
        throw new Error(errorText);
      // mejorar salida es json
      }

      const data = await response.json();
      console.log("RTA FORGOT PASS: ", data);

    } catch (error) {
      console.error("Code error:", error);
      alert(error);
    }
  }
  const validateCode = async () => {
    try {
      const response = await fetch(URL_BASE + URL_AUTH +"/validate-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId:code.trim().toUpperCase(), email: email.trim().toLowerCase()}),});

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error:", errorText);
        alert(errorText);
        throw new Error(errorText);
      // mejorar salida es json
      }

      const data = await response.json();
      console.log("RTA VALIDAR CODE: ", data);
      console.log("RTA VALIDAR CODE: ", code);
      router.push({ pathname: "/auth/NewPassword", params: { token: code } });
       

    } catch (error) {
      console.error("Code error:", error);
      alert(error);
    }
    
  }

  return (
    <SafeAreaProvider>
      <LinearGradient
          colors={[colors.color5, colors.fondo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="w-full h-full"
      >
        <StatusBar />
          <View className="flex-1 justify-center items-center px-4">
            <View
              className="w-full max-w-md rounded-2xl shadow-xl"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 10, // Para Android
              }}
            >
              <View className="py-6 bg-color1 rounded-t-2xl ">
                <Text className="text-3xl font-bold text-white text-center">
                  Recuperar contraseña
                </Text>
              </View>

              <View className="p-6 bg-fondo rounded-b-2xl">
              
                <View className="mb-20">
                  <Input
                    icon="envelope"
                    placeholder="Email"
                    keyboardType="email-address"
                    className="border-solid border-oscuro text-oscuro"
                    onChange={e => setEmail(e.nativeEvent.text)}
                    // no permitir cambiar ?
                  />
                  <ButtonDark text={"Enviar codigo"} onPress={sendCode}/>
                </View>
                <Input
                  icon="lock"
                  placeholder="Codigo de verificación"
                  className="border-solid border-oscuro text-oscuro"
                  onChangeText={setCode}
                />
                <ButtonAccept text="Verificar" onPress={validateCode} />
              </View>
            </View>
          </View>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

