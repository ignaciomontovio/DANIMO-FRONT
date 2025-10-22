import { ButtonAccept, ButtonDark } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import { colors } from "@/stores/colors";
import { URL_BASE, URL_DANI } from "@/stores/consts";
import { patientProfile, usePatientStore } from "@/stores/patientStore";
import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Animated, Easing, ScrollView, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { cardRiskMsj, riskMessagesType } from "./historicPatient";
export default function HistorialDeChat() {
  const token = useUserLogInStore((state) => state.token);
  const [weekResume, setWeekResume] = useState("");
  const [loading, setLoading] = useState(false);
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  const patients = usePatientStore((state: { patients: any }) => state.patients);
  const patient = patients.find((p: patientProfile) => p.id === patientId);
  const [riskMessages, setRiskMessages] = useState<riskMessagesType[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  // Animación de rotación
  const spinValue = useRef(new Animated.Value(0)).current;
  const startSpin = () => {
    spinValue.setValue(0);
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };
  const stopSpin = () => spinValue.stopAnimation();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const fetchData = useCallback(
    async (refreshCache = false) => {
      setLoading(true);
      refreshCache && setWeekResume("");

      try {
        const response = await fetch(URL_BASE + URL_DANI + "/weeklySummary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            userId: patientId,
            refreshCache,
          }),
        });

        if (!response.ok && response.status !== 500) {
          const errorText = await response.json();
          throw new Error(errorText.error);
        }

        const data = await response.json();        
        setWeekResume(data.summary);
        setRiskMessages(Array.isArray(data.riskMessages) ? data.riskMessages : []);
      } catch (error) {
        console.error("Error al obtener resumen de paciente:", error);
        Alert.alert("Error", "No se pudo obtener resumen de paciente.");
      } finally {
        setLoading(false);
        stopSpin();
      }
    },
    [patientId, token]
  );

  useEffect(() => {
    fetchData();
    console.log("FIRST RENDER");
  }, [fetchData]);

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={[colors.color5, colors.fondo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full h-full"
      >
        <HeaderGoBack
          text={"Resumen " + patient.firstName + " " + patient.lastName}
          onPress={() => router.replace("/profesional/home")}
        />

        <ScrollView 
          className="flex-1 px-5 py-5"
          ref={scrollRef}
        >
          {cardRiskMsj(riskMessages)}
          {/* Tarjeta resumen */}
          <View className="bg-fondo rounded-2xl p-4 shadow-md">
            <View className="flex-row items-center justify-center">
              <Text className="text-xl font-bold text-pink-500 ">
                Semana
              </Text>
              <View className="ml-5">
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <FontAwesome
                    name="refresh"
                    size={20}
                    color={colors.color5}
                    onPress={() => {
                      if (!loading) {
                        startSpin();
                        fetchData(true);
                      }
                    }}
                  />
                </Animated.View>
              </View>
            </View>

            {weekResume === "" && (
              <View className="self-center bg-gray-200 px-4 py-2 rounded-full my-2">
                <Text className="text-gray-600 italic">
                  Generando Resumen ...
                </Text>
              </View>
            )}

            <Text className="text-sm text-oscuro font-bold">{weekResume}{weekResume}</Text>
          </View>

          <View className="justify-end mt-8 space-y-4 mb-20">
            <ButtonAccept
              text="Reportes"
              onPress={() => console.log("Ver detalles")}
            />
            <ButtonDark
              text="Personalizado"
              onPress={() => {
                router.push({
                  pathname: "/screensOnlyProf/personaliseResume",
                  params: { patientId },
                });
              }}
            />
            <ButtonDark
              text="Historico"
              onPress={() => {
                router.push({
                  pathname: "/screensOnlyProf/historicPatient",
                  params: { patientId },
                });
              }}
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}
