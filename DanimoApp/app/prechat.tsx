import e1 from "@/assets/Emojis/emojis/mios/alegria.svg";
import e2 from "@/assets/Emojis/emojis/mios/ansiedad.svg";
import e3 from "@/assets/Emojis/emojis/mios/enojo.svg";
import e4 from "@/assets/Emojis/emojis/mios/miedo.svg";
import e5 from "@/assets/Emojis/emojis/mios/tristeza.svg";
import { ButtonDark } from '@/components/buttons';
import { useEmotionStore } from "@/stores/emotions";
import { useSleepStore } from "@/stores/sleeps";
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from "react";
import { Image, Text, TouchableOpacity, View } from 'react-native';

import s1 from "@/assets/Emojis/emojis sueño/mios/sueño1.svg";
import s2 from "@/assets/Emojis/emojis sueño/mios/sueño2.svg";
import s3 from "@/assets/Emojis/emojis sueño/mios/sueño3.svg";
import s4 from "@/assets/Emojis/emojis sueño/mios/sueño4.svg";
import s5 from "@/assets/Emojis/emojis sueño/mios/sueño5.svg";
import LinearGradient from "react-native-linear-gradient";

export default function Prechat() {
  const router = useRouter();
  const { sleepEmotionNum: sleepEmotionNum, detailType } = useLocalSearchParams<{ sleepEmotionNum: string; detailType: string }>();
  const emotion = useEmotionStore((state) => state.getEmotionByNumber(parseInt(sleepEmotionNum)));
  const sleep = useSleepStore((state) => state.getSleepByNumber(parseInt(sleepEmotionNum)));
  const emotionSleep = detailType === "Emotion" ? emotion : sleep

  const msjEmotion = "Que fue lo que te hizo sentirte con " + emotion?.name + " ?"
  const msjSleep = "Tuviste algún sueño que me quieras contar?"
  const msj = detailType === "Emotion" ? msjEmotion : msjSleep

  const emotionIcons: Record<number, React.FC<{ width?: number; height?: number }>> = {
    1: e1, 2: e2, 3: e3, 4: e4, 5: e5,
  };
  const sleepIcons: Record<number, React.FC<{ width?: number; height?: number }>> = {
    1: s1, 2: s2, 3: s3, 4: s4, 5: s5,
  };

  const genericIcons = detailType === "Emotion" ? emotionIcons : sleepIcons;
  const Icon = emotionSleep ? genericIcons[emotionSleep.number] : null;

  return (
     <LinearGradient
          colors={["#D2A8D6", "#F4E1E6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="w-full h-full"
        >
      <View className="flex-1 px-6 pt-12 items-center">
        {/* Tarjeta principal */}
        <View className="w-full bg-fondo rounded-xl p-4 shadow-lg"
          style={{
              shadowColor: "#000",
              elevation: 10,
            }}>
          <View className="flex-row items-center mb-2 space-x-10">
            {Icon && <Icon width={80} height={80} />}
            <Text className="text-4xl font-bold text-oscuro shadow-lg">{emotionSleep?.name}</Text>
          </View>
        </View>
        <View className="bg-fondo rounded-lg p-3 shadow-xl ml-5 mr-5" 
          style={{
              opacity: 0.8,
              shadowColor: "#000",
              elevation: 10,
            }}>
            <Text className="text-oscuro text-base font-bold leading-relaxed text-left text-lg">
              {emotionSleep?.description || "No hay descripción disponible para esta emoción."}
            </Text>
          </View>
      </View>

        <View className="ml-6 mr-5">
          {/* Burbuja de charla */}
          <View className="w-[70%] self-end bg-color5 rounded-xl px-5 py-4 mb-3 shadow mt-7">
            <Text className="text-white font-medium text-base">
              {msj}
            </Text>
            <TouchableOpacity className="items-left" onPress={() => router.push('/chat')}>
              <Text className="text-white font-bold text-right mt-2 underline text-base">
                Charlar &gt;
              </Text>
            </TouchableOpacity>
          </View>
          {/* Imagen del personaje */}
          <Image
            source={require('../assets/images/bicho-transparent.png')}
            className="w-36 h-36 mb-6"
            resizeMode="center"
          />
        </View>
        
        {/* Botón volver */}
        <View className="pb-6 px-6 items-center">
          <ButtonDark
            text="Volver"
            onPress={() => router.replace("/tabs/home")}
          />
        </View>
        
    </LinearGradient>
  );
}
