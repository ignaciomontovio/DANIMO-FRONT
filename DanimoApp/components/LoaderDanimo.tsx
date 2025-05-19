import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

export const LoaderDanimo = () => {
  const letters = 'Danimo'.split('');
  const animations = useRef(letters.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animationsSequence = letters.map((_, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 100),
          Animated.timing(animations[index], {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(animations[index], {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      )
    );
    Animated.stagger(100, animationsSequence).start();
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <View className="flex-row space-x-1">
        {letters.map((letter, index) => (
          <Animated.Text
            key={index}
            className="text-4xl font-bold text-color1"
            style={{
              transform: [
                {
                  translateY: animations[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -10],
                  }),
                },
              ],
              opacity: animations[index].interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
            }}
          >
            {letter}
          </Animated.Text>
        ))}
      </View>
      <Text className="text-lg text-gray-500 mt-3">Cargando...</Text>
    </View>
  );
};

export default LoaderDanimo;
