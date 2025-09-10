import { colors } from "@/stores/colors";
import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

// Componente del switcher de usuario para el navbar profesional
const ProfessionalUserSwitcher = () => {
  const userType = useUserLogInStore((state) => state.userType);
  const setUserLogIn = useUserLogInStore((state) => state.setUserLogIn);
  const setUserSession = useUserLogInStore((state) => state.setUserSession);
  const setUserType = useUserLogInStore((state) => state.setUserType);

  const handleChangeUser = () => {
    try {
      // Logout completo y volver al inicio
      setUserLogIn(false);
      setUserSession("", "");
      setUserType(null);
      router.replace("/");
    } catch (error) {
      console.error("Error en cambio de usuario:", error);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleChangeUser}
      className="flex-1 items-center justify-center py-8"
    >
      <FontAwesome 
        name="refresh" 
        size={24} 
        color={colors?.fondo || 'white'} 
      />
      
      {/* Texto mostrando el tipo actual */}
      <Text className="mt-2 text-xs text-fondo opacity-80">
        profesional
      </Text>
    </TouchableOpacity>
  );
};

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

          if (route.name === "user-switcher") return null;

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
        name="stats" 
        options={{
          title: "Reportes"
        }}
      /> 
      <Tabs.Screen 
        name="rutines" 
        options={{
          title: "Rutinas"
        }}
      />

      {/* SWITCHER */}
      <Tabs.Screen
        name="user-switcher"
        options={{
          tabBarButton: () => (
            <ProfessionalUserSwitcher />
          ),
        }}
      />
      
      <Tabs.Screen 
        name="profile" 
        options={{
          title: "Perfil"
        }}
      />
    </Tabs>
    
  );
}