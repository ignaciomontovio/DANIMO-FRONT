import { colors } from "@/stores/colors";
import { URL_BASE, URL_EMOTION, URL_SLEEP } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default function Stats() {
  const token = useUserLogInStore((state) => state.token);
  const [loading, setLoading] = useState(true);
  const [sleep, setSleep] = useState<string>("");
  const [emotion, setEmotion] = useState<string>("");
  
  useEffect(() => {
      const fetchSleep = async () => {
        try {
          const response = await fetch(URL_BASE + URL_SLEEP + "/obtain", {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          });
  
          if (!response.ok) {
            const errorText = await response.text();
            console.error("Error:", errorText);
            throw new Error(errorText);
          }
  
          const data = await response.json();
          setSleep(data)
        } catch (error) {
          console.error("Error al cargar sleep:", error);
        } finally {
          setLoading(false);
        }
      };
      
      const fetchEmotion= async () => {
        try {
          const response = await fetch(URL_BASE + URL_EMOTION + "/obtain", {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          });
  
          if (!response.ok) {
            const errorText = await response.text();
            console.error("Error:", errorText);
            throw new Error(errorText);
          }
  
          const data = await response.json();
          setEmotion(data)
        } catch (error) {
          console.error("Error al cargar emotion:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchSleep();
      fetchEmotion()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


  return (
    <LinearGradient
      colors={[colors.color5, colors.fondo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full h-full"
    >
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-6 pt-10 pb-20">
          {loading ? (
            <Text className="text-center text-lg text-oscuro">Cargando datos...</Text>
          ) : (
            <View>
              <Text className="text-3xl font-bold"> SUEÑO </Text>
              <Text> {JSON.stringify(sleep, null, 2)} </Text>
               <Text className="text-3xl font-bold"> EMOCIONES </Text>
              <Text> {JSON.stringify(emotion, null, 2)} </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
