import { ButtonDark } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import { Input_time } from "@/components/input";
import { colors } from "@/stores/colors";
import { URL_BASE, URL_SLEEP } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, SafeAreaView, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default function DetailSleepScreen() {

  const [sleepTime, setSleepTime] = useState<Date>(new Date());
  const [wakeTime, setWakeTime] = useState<Date>(new Date());
  const token = useUserLogInStore((state) => state.token);
  const { value } = useLocalSearchParams<{ value: string }>();
  
  const submitSleep = async (sleepHours: number) => 
  {                   
    try {
      const response = await fetch(URL_BASE + URL_SLEEP + "/entry", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hoursOfSleep: sleepHours, 
          sleep: value,
        }),
      });

      if (!response.ok) {
          const errorText = await response.json();
          console.error("Error:", errorText.error);
          throw new Error(errorText.error);
        }

      console.log("Registro exitoso");
      router.push({ pathname: "/prechat", params: { sleepEmotionNum: value, detailType: "Sleep", extraData:[]} });

    } catch (error) {
      console.error("Error al registrar sueño:", error);
      Alert.alert("Error al registrar la emoción: " + error);
    }
  };

  const handleRegister = async () => {
    const st = sleepTime.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    const wt = wakeTime.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    console.log("handleRegister");
    console.log("sleepTime: " + st + " wakeTime: " + wt);
    console.log("sleepTime: " + sleepTime + " wakeTime: " + wakeTime);
    const sleepDurationMs = Math.abs(wakeTime.getTime() - sleepTime.getTime());
    const sleepHours = sleepDurationMs / (1000 * 60 * 60);
    console.log("sleepHours: " + sleepHours);
    submitSleep(sleepHours)
  };

  return (
    <LinearGradient
      colors={[colors.color5, colors.fondo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full h-full"
    >
      <HeaderGoBack text="Sueño" onPress={() => router.replace("/tabs/home")} />
      <SafeAreaView className="flex-1 px-6">
        <View className="relative mb-10 mt-40">
          <View
            className="absolute top-0 left-0 right-0 bottom-0 bg-fondo rounded-2xl"
            style={{
              opacity: 0.7,
              shadowColor: "#000",
              elevation: 10,
            }}
          />
          <View className="p-4 rounded-2xl">
            <Text className="text-2xl font-bold text-center justify-center text-oscuro mb-4">Horas de Sueño</Text>
            <View className="flex-column justify-center text-center">

              <Input_time
                time={sleepTime || new Date()}
                setTime={setSleepTime}
                handleFieldChange={(k, v) => console.log("sleepTime:", v)}
              />

              <Input_time
                time={wakeTime || new Date()}
                setTime={setWakeTime}
                handleFieldChange={(k, v) => console.log("wakeTime:", v)}
              />
            </View>
          </View>
        </View>
        <View className="mb-20 absolute left-6 right-6 bottom-0">          
          <ButtonDark text="Registrar" onPress={handleRegister} />   
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
