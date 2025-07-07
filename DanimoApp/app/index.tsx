// import { useUserLogInStore } from "@/stores/userLogIn";
 
import { ButtonAccept, ButtonDark } from "@/components/buttons";
import { LoaderDanimo } from "@/components/LoaderDanimo";
import { colors } from "@/stores/colors";
import { URL_BASE, URL_EMOTION, URL_NOTIFICATION, URL_SLEEP } from "@/stores/consts";
import { useEmotionStore } from "@/stores/emotions";
import { useSleepStore } from "@/stores/sleeps";
import { useUserLogInStore } from "@/stores/userLogIn";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, SafeAreaView, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});


export default function Index() {
  const setUserType = useUserLogInStore((state) => state.setUserType);
  const [showLoader, setShowLoader] = useState(true);
  
  const token = useUserLogInStore((state) => state.token);

  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      if (!Device.isDevice) {
        Alert.alert("Solo funciona en dispositivos físicos");
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert("Permisos de notificación denegados");
        return;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync();
      const expoPushToken = tokenData.data;
      console.log("expoPushToken: " + expoPushToken);
      

      if (token) {
        console.log("token: " + token);
        try {
          await fetch(URL_BASE + URL_NOTIFICATION + "/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ token: expoPushToken }),
          });
        } catch (error) {
          console.error("Error enviando token al backend:", error);
        }
      }
    };

    registerForPushNotificationsAsync();

    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notificación recibida en foreground:", notification);
      // Podés hacer algo extra, como navegar o mostrar un modal
    });

    return () => subscription.remove();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const fetchEmotions = async () => {
    try {
      const response = await fetch(URL_BASE + URL_EMOTION + "/types");
      if (!response.ok) {
        const errorText = await response.json();
        console.error("Error:", errorText.error);
        throw new Error(errorText.error);
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
        const errorText = await response.json();
        console.error("Error:", errorText.error);
        throw new Error(errorText.error);
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

