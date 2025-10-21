import { colors } from "@/stores/colors";
import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

// Componente del switcher de usuario para el navbar profesional

export default function TabsLayout() {
  const firstName = useUserLogInStore((state) => state.firstName);
  const lastName = useUserLogInStore((state) => state.lastName);
  const userMail = useUserLogInStore((state) => state.mail);
  
  // Priorizar nombre completo, luego firstName, luego email, luego fallback
  const displayName = firstName 
    ? `${firstName}${lastName ? ` ${lastName}` : ''}`
    : userMail 
      ? userMail.split('@')[0] 
      : "Perfil";

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any;
          if (route.name === "home") iconName = "home";
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
      <Tabs.Screen 
        name="home" 
        options={{
          title: "Inicio"
        }}
      />
      <Tabs.Screen 
        name="rutines" 
        options={{
          title: "Rutinas"
        }}
      />
      <Tabs.Screen 
        name="profile" 
        options={{
          title: displayName
        }}
      />
    </Tabs>
    
  );
}