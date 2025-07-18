import { ButtonDark } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import { Input_time } from "@/components/input";
import { colors } from "@/stores/colors";
import { URL_BASE, URL_SLEEP } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default function DetailSleepScreen() {

  const [sleepTime, setSleepTime] = useState<Date>(new Date());
  const [wakeTime, setWakeTime] = useState<Date>(new Date());
  const [sleepDuration, setSleepDuration] = useState<string>("0h 0m");
  const token = useUserLogInStore((state) => state.token);
  const { value } = useLocalSearchParams<{ value: string }>();

  const calculateSleepDuration = (sleep: Date, wake: Date) => {
    let sleepMs = sleep.getTime();
    let wakeMs = wake.getTime();
    
    if (wakeMs < sleepMs) {
      wakeMs += 24 * 60 * 60 * 1000;
    }
    
    const durationMs = wakeMs - sleepMs;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes, durationMs };
  };

  useEffect(() => {
    const { hours, minutes } = calculateSleepDuration(sleepTime, wakeTime);
    const durationText = `${hours}h ${minutes}m`;
    setSleepDuration(durationText);
  }, [sleepTime, wakeTime]);
  
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
      router.push({ pathname: "/prechat" as any, params: { sleepEmotionNum: value, detailType: "Sleep", extraData:[]} });

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

        <View className="items-center mt-4 mb-4">
          <Ionicons name="moon-outline" size={28} color={colors.oscuro} style={{ marginBottom: 4 }} />
          <Text className="text-lg font-bold text-oscuro text-center">
            Registra tu Sueño
          </Text>
          <Text className="text-xs text-oscuro/70 text-center mt-1">
            Cuéntanos sobre tu descanso de anoche
          </Text>
        </View>

        <View className="relative mb-6 mt-2">
          <View
            className="absolute top-0 left-0 right-0 bottom-0 bg-fondo rounded-2xl"
            style={{
              opacity: 0.7,
              shadowColor: "#000",
              elevation: 10,
            }}
          />
          <View className="p-4 rounded-2xl">
            <Text className="text-base font-semibold text-center text-oscuro mb-4">Horarios de Sueño</Text>
            <View className="space-y-2">

              <View className="bg-white/60 rounded-xl p-3">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="bed-outline" size={14} color={colors.oscuro} style={{ marginRight: 6 }} />
                  <Text className="text-xs font-medium text-oscuro/80">
                    Me dormí a las:
                  </Text>
                </View>
                <Input_time
                  time={sleepTime || new Date()}
                  setTime={setSleepTime}
                  handleFieldChange={(k, v) => console.log("sleepTime:", v)}
                />
              </View>

              <View className="bg-white/60 rounded-xl p-3">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="sunny-outline" size={14} color={colors.oscuro} style={{ marginRight: 6 }} />
                  <Text className="text-xs font-medium text-oscuro/80">
                    Me desperté a las:
                  </Text>
                </View>
                <Input_time
                  time={wakeTime || new Date()}
                  setTime={setWakeTime}
                  handleFieldChange={(k, v) => console.log("wakeTime:", v)}
                />
              </View>

              <View className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-3 mt-2">
                <View className="flex-row items-center justify-center mb-1">
                  <Ionicons name="time-outline" size={14} color="white" style={{ marginRight: 6 }} />
                  <Text className="text-white text-center text-xs font-medium">
                    Duración Total del Sueño
                  </Text>
                </View>
                <Text className="text-white text-center text-2xl font-bold">
                  {sleepDuration}
                </Text>
                <Text className="text-white/80 text-center text-xs mt-1">
                  {sleepDuration.includes('8h') || sleepDuration.includes('7h') 
                    ? "¡Excelente duración!" 
                    : sleepDuration.includes('6h') || sleepDuration.includes('5h')
                    ? "Un poco corto, pero no está mal"
                    : "Considera ajustar tus horarios"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <View className="rounded-xl p-3 mb-4 mx-2" style={{ backgroundColor: colors.color5 }}>
          <View className="flex-row items-center justify-center">
            <Ionicons name="bulb-outline" size={14} color={colors.oscuro} style={{ marginRight: 6 }} />
            <Text className="text-xs text-center" style={{ color: colors.oscuro }}>
              <Text className="font-semibold">Tip:</Text> Los adultos necesitan entre 7-9 horas de sueño para un descanso óptimo
            </Text>
          </View>
        </View>

        <View className="mb-16 absolute left-6 right-6 bottom-0">          
          <ButtonDark text="Registrar" onPress={handleRegister} />   
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}