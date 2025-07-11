// import { useUserLogInStore } from "@/stores/userLogIn";
 
import { ButtonAccept, ButtonDark } from "@/components/buttons";
import LoaderDanimo from "@/components/LoaderDanimo";
import { colors } from "@/stores/colors";
import { URL_BASE, URL_EMOTION, URL_SLEEP } from "@/stores/consts";
import { useEmotionStore } from "@/stores/emotions";
import { useSleepStore } from "@/stores/sleeps";
import { useUserLogInStore } from "@/stores/userLogIn";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, SafeAreaView, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default function Index() {
  const setUserType = useUserLogInStore((state) => state.setUserType);
  const [showLoader, setShowLoader] = useState(true);

  const fetchEmotions = async () => {
    try {
      const response = await fetch(URL_BASE + URL_EMOTION + "/types");
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error:", errorText);
        throw new Error(errorText);
      }

      const data = await response.json();
      console.log("Emociones recibidas:", data);

      useEmotionStore.getState().setEmotions(data);

    } catch (error) {
      console.error("Error al obtener emociones:", error);
    }
  };
  const fetchSleeps = async () => {
    try {
      const response = await fetch(URL_BASE + URL_SLEEP + "/types");
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error:", errorText);
        throw new Error(errorText);
      }

      const data = await response.json();
      console.log("Sueños recibidos:", data);

      useSleepStore.getState().setEmotions(data);

    } catch (error) {
      console.error("Error al obtener Sueños:", error);
    }
  };
  const handleUsuario = () => {
    fetchEmotions()
    fetchSleeps()
    setUserType("usuario");
    router.replace("/auth/LoginRegisterScreen");
  };
  const handleProfesional = () => {
    setUserType("profesional");
    router.replace("/auth/LoginRegisterScreen");
  };

  if (showLoader) {
    setTimeout(() => {
      setShowLoader(false);
    }, 1500);
    return <LoaderDanimo />;
  }
  return (
  <SafeAreaView>
      <LinearGradient
        colors={[colors.color5, colors.fondo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full h-full"
      >
        <View className="flex-1 justify-top items-center px-6 mt-10 py-20">
          <Text className="text-oscuro text-4xl font-bold mb-6 text-center">Bienvenido a Danimo</Text>       
          <Image 
            source={require('../assets/images/logo.png')} 
            className="w-[250px] h-[250px] mb-5"
          />
          <ButtonAccept text={"Usuario"} onPress={() => handleUsuario()}></ButtonAccept>
          <ButtonDark text={"Profesional"} onPress={() => handleProfesional()}></ButtonDark>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

