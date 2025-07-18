import e1 from "@/assets/Emojis/emojis/mios/alegria.svg";
import e2 from "@/assets/Emojis/emojis/mios/ansiedad.svg";
import e3 from "@/assets/Emojis/emojis/mios/enojo.svg";
import e4 from "@/assets/Emojis/emojis/mios/miedo.svg";
import e5 from "@/assets/Emojis/emojis/mios/tristeza.svg";
import { ButtonDark } from '@/components/buttons';
import { colors } from "@/stores/colors";
import { useEmotionStore } from "@/stores/emotions";
import { useSleepStore } from "@/stores/sleeps";
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef } from "react";
import { Animated, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import s5 from "@/assets/Emojis/emojis sueño/mios/sueño1.svg";
import s4 from "@/assets/Emojis/emojis sueño/mios/sueño2.svg";
import s3 from "@/assets/Emojis/emojis sueño/mios/sueño3.svg";
import s2 from "@/assets/Emojis/emojis sueño/mios/sueño4.svg";
import s1 from "@/assets/Emojis/emojis sueño/mios/sueño5.svg";
import { FontAwesome } from "@expo/vector-icons";
import LinearGradient from "react-native-linear-gradient";

export default function Prechat() {
  const router = useRouter();
  const bounceAnim = useRef(new Animated.Value(0)).current;
  
  const { 
    sleepEmotionNum: sleepEmotionNum, 
    detailType, 
    extraData 
    } = useLocalSearchParams<{ 
      sleepEmotionNum: string; 
      detailType: string, 
      extraData:string[] }>();

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

  // Animación de rebote para el personaje
  useEffect(() => {
    const startBounce = () => {
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => startBounce());
    };
    
    startBounce();
  }, [bounceAnim]);

  const gotoChat = () => {
    if (detailType === "Emotion"){
      router.push({ pathname: "/screensOnlyUser/chat", params: { EmotionSleep: emotion?.name, activities: extraData, type: "Emotion" } })
    }
    else {
      router.push({ pathname: "/screensOnlyUser/chat", params: { EmotionSleep: sleep?.name, activities: [] , type: "Sleep"} })
    }
  };

  return (
    <LinearGradient
      colors={[colors.color5, colors.fondo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full h-full"
    >
      <SafeAreaView className="flex-1">
        {/* Tarjeta principal de emoción */}
        <View className="px-6 pt-16 pb-4">
          <View 
            className="rounded-2xl p-6 shadow-lg"
            style={{
              backgroundColor: colors.fondo,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 10,
            }}
          >
            <View className="flex-row items-center space-x-4">
              {Icon && <Icon width={60} height={60} />}
              <Text 
                className="text-3xl font-bold flex-1"
                style={{ color: colors.oscuro }}
              >
                {emotionSleep?.name}
              </Text>
            </View>
          </View>
        </View>

        {/* Descripción */}
        <View className="px-6 pb-6">
          <View 
            className="rounded-2xl p-4 shadow-lg"
            style={{
              backgroundColor: colors.fondo,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text 
              className="text-base leading-relaxed"
              style={{ color: colors.oscuro }}
            >
              {emotionSleep?.description || "No hay descripción disponible para esta emoción."}
            </Text>
          </View>
        </View>

        {/* Espaciador para empujar contenido hacia abajo */}
        <View className="flex-1 justify-center items-center">
          {/* Personaje animado */}
          <Animated.View
            style={{
              transform: [{ translateY: bounceAnim }],
            }}
          >
            <Image
              source={require('../../assets/images/bicho-transparent.png')}
              className="w-32 h-32"
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        {/* Sección de chat */}
        <View className="px-6 pb-6">
          {/* Burbuja de chat mejorada */}
          <View 
            className="w-full rounded-3xl px-5 py-4 shadow-lg mb-4"
            style={{
              backgroundColor: colors.color5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 12,
              borderBottomRightRadius: 8,
            }}
          >
            <View className="flex-row items-start mb-3">
              <View className="flex-1">
                <Text className="text-white font-medium text-base leading-relaxed">
                  {msj}
                </Text>
              </View>
            </View>
            
            <View className="flex-row items-center justify-between">
              <View className="flex-1" />
              <TouchableOpacity 
                onPress={gotoChat} 
                className="bg-white/20 rounded-full px-4 py-2 shadow-sm"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.15,
                  shadowRadius: 3,
                  elevation: 4,
                }}
              >
                <View className="flex-row items-center">
                  <Text className="text-white font-bold text-base mr-2">
                    Charlar
                  </Text>
                  <FontAwesome name="arrow-right" size={14} color="white" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Botón volver */}
        <View className="px-6 pb-6">
          <ButtonDark
            text="Volver"
            onPress={() => router.replace("/tabs/home")}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}