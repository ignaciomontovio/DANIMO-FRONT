// app/_layout.tsx
import { Stack } from "expo-router";
import React from "react";
import { Platform } from "react-native";
export default function Layout() {
   if (Platform.OS === "web") {
    if (typeof document !== 'undefined') {
      import("../index.css");
    } 
  }
  
  return (
    // <LinearGradient
    //       colors={[colors.color5, colors.fondo]}
    //       start={{ x: 0, y: -1 }}
    //       end={{ x: 0, y: 1 }}
    //       className="w-full h-full"
    //     >
      <Stack />
    // </LinearGradient>
  );
}
