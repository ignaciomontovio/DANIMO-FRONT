import { colors } from "@/stores/colors";
import { URL_AUTH, URL_BASE } from "@/stores/consts";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { StatusBar, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ButtonAccept } from "../../components/buttons";
import Input from "../../components/input";

export default function NewPassword() {

  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const { token } = useLocalSearchParams<{ token: string }>();

  const validatePass = async () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!passwordRegex.test(pass)) {
      alert("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.");
      return;
    }

    if(pass!==pass2){
      alert("Las contraseñas deben ser iguales")
      return
    }
    try {
      const response = await fetch(URL_BASE + URL_AUTH +"/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId:token, password: pass2 }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error:", errorText);
        throw new Error(errorText);
      // mejorar salida es json
      }
      
      
      const data = await response.json();
      console.log("RTA VALIDAR CODE: ", data);
      
      router.push("/auth/LoginRegisterScreen")

    } catch (error) {
      console.error("Code error:", error);
      alert(error);
      // router.push("/auth/NewPassword")
    }
    // router.push("/auth/LoginRegisterScreen")
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
              Nueva contraseña
            </Text>
          </View>

          <View className="p-6 bg-fondo rounded-b-2xl">

            <View className="">
              <Input
                icon="lock"
                placeholder="Contraseña nueva"
                secureTextEntry
                className="border-solid border-oscuro text-oscuro"
                onChange={e => setPass(e.nativeEvent.text)}
              />
            </View>
            <Input
              icon="lock"
              placeholder="Confirmar contraseña"
              secureTextEntry
              className="border-solid border-oscuro text-oscuro"
                onChange={e => setPass2(e.nativeEvent.text)}
            />
            {/* agregar ojo para ver como en las otras pantallas */}
            <ButtonAccept text="Login" onPress={validatePass} />
            {/* no habilitar hasta que pass cumpla regex y pass==pass2 */}
          </View>
        </View>
      </View>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

