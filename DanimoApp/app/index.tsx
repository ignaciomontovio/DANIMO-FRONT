import { ButtonAccept, ButtonDark } from "@/components/buttons";
import LoaderDanimo from "@/components/LoaderDanimo";
import { colors } from "@/stores/colors";
import { URL_BASE, URL_EMOTION, URL_NOTIFICATION, URL_SLEEP } from "@/stores/consts";
import { useEmotionStore } from "@/stores/emotions";
import { useSleepStore } from "@/stores/sleeps";
import { useUserLogInStore } from "@/stores/userLogIn";
import { getApp } from "@react-native-firebase/app";
import { getMessaging, getToken, onMessage, registerDeviceForRemoteMessages } from "@react-native-firebase/messaging";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  PermissionsAndroid,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default function Index() {
  const setUserType = useUserLogInStore((state) => state.setUserType);
  const [showLoader, setShowLoader] = useState(true);
  const token = useUserLogInStore((state) => state.token);

  const requestPermission = async () => {
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        requestToken();
      } else {
        Alert.alert("Permiso denegado");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const requestToken = async () => {
    try {
      const app = getApp();
      const messaging = getMessaging(app);
      await registerDeviceForRemoteMessages(messaging);
      const notifToken = await getToken(messaging);
      console.log("token**", notifToken);
      await fetch(URL_BASE + URL_NOTIFICATION + "/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ token: notifToken }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    const app = getApp();
    const messaging = getMessaging(app);

    const unsubscribe = onMessage(messaging, async (remoteMessage) => {
      Alert.alert("Nuevo mensaje FCM!", JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  const fetchEmotions = async () => {
    try {
      const response = await fetch(URL_BASE + URL_EMOTION + "/types");
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      useEmotionStore.getState().setEmotions(data);
    } catch (error) {
      console.error("Error al obtener emociones:", error);
    }
  };

  const fetchSleeps = async () => {
    try {
      const response = await fetch(URL_BASE + URL_SLEEP + "/types");
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      useSleepStore.getState().setEmotions(data);
    } catch (error) {
      console.error("Error al obtener sueños:", error);
    }
  };

  const handleUsuario = () => {
    fetchEmotions();
    fetchSleeps();
    setUserType("usuario");
    router.replace("/auth/LoginRegisterScreen");
  };

  const handleProfesional = () => {
    fetchEmotions();
    fetchSleeps();
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
          <Text className="text-oscuro text-4xl font-bold mb-6 text-center">
            Bienvenido a Danimo
          </Text>
          <Image
            source={require("../assets/images/logo.png")}
            className="w-[250px] h-[250px] mb-5"
          />
          <ButtonAccept text={"Usuario"} onPress={handleUsuario} />
          <ButtonDark text={"Profesional"} onPress={handleProfesional} />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
