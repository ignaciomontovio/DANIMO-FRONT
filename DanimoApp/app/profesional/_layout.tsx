import { colors } from "@/stores/colors";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any;
          if (route.name === "home") iconName = "home";
          else if (route.name === "stats") iconName = "bar-chart";
          else if (route.name === "rutines") iconName = "medkit";
          else if (route.name === "profile") iconName = "user";

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.color5,
        tabBarInactiveTintColor: colors.fondo,
        tabBarStyle: {
          backgroundColor: colors.oscuro,
          height: 70,
          paddingBottom: 10,
        },
        headerShown: false,
      })}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="stats" /> 
      <Tabs.Screen name="rutines" />
      <Tabs.Screen name="profile" />
    </Tabs>
    
  );
}
