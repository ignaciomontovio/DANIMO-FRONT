import { ButtonDark } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import { colors } from "@/stores/colors";
import { URL_AUTH, URL_BASE } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function ShareCode() {
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const token = useUserLogInStore((state) => state.token);
  useEffect(() => {
     const fetchData = async () => {
      try {
        const response = await fetch(URL_BASE + URL_AUTH + "/generate/professional-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
  
        if (!response.ok) {
          const errorText = await response.json();
          throw new Error(errorText.error);
        }
  
        const data = await response.json();
        console.log("CODIGO: " + data);

        setCode(data.token); 
      } catch (error) {
        console.error("Error al obtener codigo:", error);
        Alert.alert("Error", "No se pudo obtener codigo.");
      } finally {
        setLoading(false);
      }
     }
     fetchData();
  }, []);
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(code);
  };

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={[colors.color5, colors.fondo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full h-full"
      >
        <HeaderGoBack text="Compartir Código" onPress={() => router.replace("/tabs/home")} />
        <ScrollView className="px-5 py-5">
          <View className="flex-1 justify-center items-center">
            <View
              className="w-full max-w-md rounded-2xl shadow-xl mb-4"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 10,
              }}
            >
              {/* Header */}
              <View className="py-3 bg-color1 rounded-t-2xl">
                <Text className="text-2xl font-bold text-white text-center">Código</Text>
              </View>

              {/* Cuerpo */}
              <View className="p-6 bg-fondo rounded-b-2xl items-center space-y-4">
                <View className="flex-row items-center space-x-2">
                  <Text className="text-4xl font-extrabold text-oscuro tracking-widest">{code}</Text>
                  <TouchableOpacity onPress={copyToClipboard}>
                    <FontAwesome name="copy" size={24} color="gray" />
                  </TouchableOpacity>
                </View>

                <ButtonDark text="Compartir" onPress={() => Alert.alert("Funcionalidad en desarrollo")} />
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}
