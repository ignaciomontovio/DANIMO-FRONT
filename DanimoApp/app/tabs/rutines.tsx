
import CardRutine, { Rutine } from "@/app/cards/cardRutine";
import HeaderGoBack from "@/components/headerGoBack";
import { colors } from "@/stores/colors";
import { ALL_EMOTIONS, URL_BASE, URL_RUTINE } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Rutines() {
  const [loading, setLoading] = useState(true);
  const [rutines, setRutines] = useState<Rutine[]>([]);
  const token = useUserLogInStore((state) => state.token);
  const [emotions, setEmotions] = useState<Record<string, boolean>>({});

  const PILL_STYLE = "pl-2 pr-3 py-2 rounded-r-full text-sm font-semibold mr-2 mb-2 flex-row space-x-1";
  const ACTIVE_PILL_STYLE = "bg-color1 text-white";
  const INACTIVE_PILL_STYLE = "bg-color5 text-oscuro";


  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(URL_BASE + URL_RUTINE + "/obtain", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
      });

    if (!response.ok) {
      const errorText = await response.json();
      console.error("Error:", errorText.error);
      throw new Error(errorText.error);
    }

    const data = await response.json();
    const rutinasBack = Array.isArray(data) ? data : data.data || [];

    // Transformamos las rutinas para que Users sea un array de emails
    const rutinasConEmails = rutinasBack.map((rutina: { Users: any[]; }) => ({
      ...rutina,
      Users: Array.isArray(rutina.Users)
        ? rutina.Users.map((user) => user.email)
        : [], 
    }));


    setRutines(rutinasConEmails);

    console.log("Rutinas con emails:", JSON.stringify(rutinasConEmails, null, 2));

    } catch (error) {
      console.error("Error al obtener rutinas:", error);
      Alert.alert("Error", "No se pudo obtener la lista de rutinas.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchData();
    const initialEmotions = Object.fromEntries(
      ALL_EMOTIONS
        .filter(emotion => emotion !== "Alegria")
        .map(emotion => [emotion, false])
    );
    initialEmotions["Tristeza"] = true
    setEmotions(initialEmotions);

  }, [fetchData]);

  const toggle = (key: string, state: Record<string, boolean>, setState: (val: Record<string, boolean>) => void) => {
    setState({ ...state, [key]: !state[key] });
  };
  const PillContainer = ({
      list,
      setList,
    }: {
      list: Record<string, boolean>;
      setList: (val: Record<string, boolean>) => void;
    }) => (
      <View className="relative mt-5">
        <View
          className="absolute top-0 left-0 right-0 bottom-0 bg-fondo rounded-2xl"
          style={{
            opacity: 0.7,
            shadowColor: "#000",
            elevation: 10,
          }}
        />
        <View className="p-2 rounded-2xl">
          <View className="flex-row flex-wrap justify-center">
            {Object.entries(list).map(([key, selected]) => (
              <TouchableOpacity
                key={key}
                className={`${PILL_STYLE} ${selected ? ACTIVE_PILL_STYLE : INACTIVE_PILL_STYLE}`}
                onPress={() => toggle(key, list, setList)}
              >
                {/* <FontAwesome name="tag" size={20} color={colors.oscuro} /> */}
                <Text>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={[colors.color5, colors.fondo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full h-full"
      >
        <HeaderGoBack
          text="Rutinas"
          onPress={() => router.replace("/tabs/home")}
        />
        
        {PillContainer({
          list: emotions,
          setList: setEmotions,
        })}


        <ScrollView className="flex-1 px-5 py-5">
          <View className="flex-1 items-center pb-20 pt-5">
            {loading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : rutines.length > 0 ? (
              rutines.filter((rutines) => emotions[rutines.emotion[0]]).map((el, index) => (
                <CardRutine
                  key={index}
                  element={el}
                  pov="user"
                />
              ))
            ) : (
              <Text className="text-center text-lg text-gray-600">
                No hay rutinas disponibles.
              </Text>
            )}
          </View>
        </ScrollView>

      </LinearGradient>
    </SafeAreaProvider>
  );
}
