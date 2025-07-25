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
    <Stack screenOptions={{ headerShown: false }} />
  );
}
