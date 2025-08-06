// app/_layout.tsx
import { Stack } from "expo-router";
import * as SystemUI from 'expo-system-ui';
import React, { useEffect } from "react";
import { BackHandler, Platform } from "react-native";

export default function Layout() {
   if (Platform.OS === "web") {
    if (typeof document !== 'undefined') {
      import("../index.css");
    } 
  }
  useEffect(() => {
    SystemUI.setBackgroundColorAsync('transparent');
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      return true;
    });

    return () => backHandler.remove();
  }, []);
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
