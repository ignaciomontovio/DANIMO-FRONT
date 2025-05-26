import React from "react";
import { View } from "react-native";

type MiniMetricsProps = {
  onPress?: () => void;
};

export default function MiniMetrics( { onPress }: MiniMetricsProps) {
  return (
    <View
        className="w-[180px] h-[264px] bg-color5 rounded-lg p-5 relative m-2"
        style={{
            shadowColor: "#000",
            shadowOffset: { width: 8, height: 0 }, // solo a la derecha
            shadowOpacity: 0.4,
            shadowRadius: 10,
            elevation: 10, // para Android
        }}
        onTouchEnd={onPress} 
    >
    </View>
  );
}
