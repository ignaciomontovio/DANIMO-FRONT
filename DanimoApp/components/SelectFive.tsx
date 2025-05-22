import { router } from "expo-router";
import React, { useRef } from "react";
import { Animated, Text, TouchableWithoutFeedback, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

type AllowedRoutes = "/detailSleep" | "/detailEmotion";

type SelectFiveProps = {
  message: string;
  goto: AllowedRoutes;
};

const goToDetail = (num: number, goto: AllowedRoutes) => {
  router.push({ pathname: goto, params: { value: num.toString() } });
};

export default function SelectFive({ message, goto }: SelectFiveProps) {
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

  return (
    <LinearGradient
      colors={["#d2a8d6", "#e3c8e4", "#f6c6d7"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="w-full mt-3 rounded-2xl p-6 shadow-2xl"
    >
      <Text className="mb-4 text-oscuro text-xl font-bold text-center">
        {message}
      </Text>
      <View className="flex-row justify-center space-x-10">
        {[1, 2, 3, 4, 5].map((num, idx) => (
          <TouchableWithoutFeedback
            key={num}
            onPress={() => animatePress(idx, num)}
          >
            <Animated.Text
              style={{
                transform: [{ scale: scales[idx] }],
              }}
              className="text-oscuro text-3xl font-bold ml-4"
            >
              {num}
            </Animated.Text>
          </TouchableWithoutFeedback>
        ))}
      </View>
    </LinearGradient>
  );
}
