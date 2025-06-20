import { ButtonDark_small, ButtonLight_small, } from "@/components/buttons";
import { colors } from "@/stores/colors";
import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default function profile() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const setUserLogIn = useUserLogInStore((state: { setUserLogIn: (userLogIn: true | false) => void }) => state.setUserLogIn);
  const handleLogoff = () => {
    setUserLogIn(false);
    router.replace("../auth/LoginRegisterScreen");
    // Aquí puedes agregar la lógica para cerrar sesión, como limpiar el estado del usuario o eliminar tokens de autenticación.
    // Por ejemplo:
    // setUser(null);
    // setToken(null);
  };
  return (
    <LinearGradient
      colors={[colors.color5, colors.fondo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full h-full"
    >
      <View className="flex-1 items-center justify-start space-y-15 px-6">
        <View className="w-full flex-row items-center justify-center gap-2 px-2 py-6">
          {/* Ícono de usuario */}
          <View className="rounded-full p-4 border-2 border-oscuro bg-colo2 shadow-md">
            <FontAwesome name="user" size={60} color={colors.oscuro} />
          </View>

          {/* Info del usuario */}
          <View className="flex-1">
            <View className="bg-fondo px-4 py-2 rounded-full border border-oscuro shadow-sm">
              <Text className="text-oscuro text-center font-bold text-lg">Juan Pérez</Text>
            </View>
            <Pressable onPress={() => router.replace("/profile")}>
              <Text className="text-right text-oscuro font-bold mt-1 text-xl">
                Perfil &gt;
              </Text>
            </Pressable>
          </View>
        </View>

        <ButtonLight_small onPress={() => ("")} text="Recomendación" />
        <ButtonLight_small onPress={() => ("")} text="Rutinas" />
        <ButtonLight_small onPress={() => ("")} text="Estadísticas" />
        <ButtonLight_small onPress={() => ("")} text="Eventos Significativos" />
        <ButtonLight_small onPress={() => (router.replace("/emergencyContact"))} text="Contactos de Emergencia" />
        <ButtonLight_small onPress={() => ("")} text="Profesionales Ascociados" />
        <ButtonLight_small onPress={() => (router.replace("/medication"))} text="Medicación" />
        <ButtonDark_small onPress={handleLogoff} text="Cerrar Sesión" />
      </View>
    </LinearGradient>
  );
}
