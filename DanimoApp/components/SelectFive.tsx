// import Alegria from "@/assets/Emojis/emojis/alegria.svg";
import Alegria from "@/assets/Emojis/emojis/mios/alegria.svg";
import Ansiedad from "@/assets/Emojis/emojis/mios/ansiedad.svg";
import Enojo from "@/assets/Emojis/emojis/mios/enojo.svg";
import Miedo from "@/assets/Emojis/emojis/mios/miedo.svg";
import Tristeza from "@/assets/Emojis/emojis/mios/tristeza.svg";

import s1 from "@/assets/Emojis/emojis sueño/mios/sueño1.svg";
import s2 from "@/assets/Emojis/emojis sueño/mios/sueño2.svg";
import s3 from "@/assets/Emojis/emojis sueño/mios/sueño3.svg";
import s4 from "@/assets/Emojis/emojis sueño/mios/sueño4.svg";
import s5 from "@/assets/Emojis/emojis sueño/mios/sueño5.svg";
import { Animated, Text, TouchableWithoutFeedback, View } from "react-native";


import { router } from "expo-router";
import React, { useRef } from "react";


type AllowedRoutes = "/DetailSleep" | "/detailEmotion";

type SelectFiveProps = {
  message: string;
  goto: AllowedRoutes;
  type: "Emocion" | "Sueño"
};

const goToDetail = (num: number, goto: AllowedRoutes) => {
  router.push({ pathname: goto, params: { value: num.toString() } });
};

export default function SelectFive({ message, goto, type }: SelectFiveProps) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const scales = Array(5).fill(0).map(() => useRef(new Animated.Value(1)).current);

  const animatePress = (index: number, num: number) => {
    Animated.sequence([
      Animated.spring(scales[index], {
        toValue: 1.3,
        useNativeDriver: true,
      }),
      Animated.spring(scales[index], {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start(() => goToDetail(num, goto));
  };
  let icons;
  if (type === "Emocion") {
    icons = [Alegria, Ansiedad, Enojo, Miedo, Tristeza];
  } else {
    icons = [s5, s4, s3, s2, s1];
  }
  return (
    <View
      className="w-full mb-5 rounded-2xl p-6"
      style={{
          backgroundColor: '#F4E1E680',
          }}
    >
      <Text className="text-oscuro text-xl font-bold text-center">
        {message}
      </Text>
      <View className="flex-row justify-center space-x-10">
        {[1, 2, 3, 4, 5].map((num, idx) => {
          const Icon = icons[idx];
          return (
            <TouchableWithoutFeedback key={num} onPress={() => animatePress(idx, num)}>
              <Animated.View 
                className="mr-2"
                style={{ transform: [{ scale: scales[idx] },] }}
                >
                <Icon width={45} height={45} />
              </Animated.View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    </View>
  );
}
