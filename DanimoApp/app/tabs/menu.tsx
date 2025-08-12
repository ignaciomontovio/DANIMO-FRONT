import { ButtonDark_small, ButtonLight_small } from "@/components/buttons";
import ProfilePhoto from "@/components/profilePhoto";
import { colors } from "@/stores/colors";
import { URL_AUTH, URL_BASE } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

// Componente para el switcher de usuario
const UserSwitcher = () => {
  const userType = useUserLogInStore((state) => state.userType);
  const setUserLogIn = useUserLogInStore((state) => state.setUserLogIn);
  const setUserSession = useUserLogInStore((state) => state.setUserSession);
  const setUserType = useUserLogInStore((state) => state.setUserType);

  const handleChangeUserType = () => {
    Alert.alert(
      "¿Está seguro?",
      "Se cerrará la sesión",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Continuar",
          onPress: () => {
            setUserLogIn(false);
            setUserSession("", "");
            setUserType(null);
            router.replace("/");
          }
        }
      ]
    );
  };

  return (
    <TouchableOpacity
      onPress={handleChangeUserType}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <FontAwesome 
        name="refresh" 
        size={16} 
        color={colors.oscuro}
        style={{ marginRight: 8 }}
      />
      <Text style={{
        color: colors.oscuro,
        fontSize: 14,
        fontWeight: '600'
      }}>
        Cambiar a {userType === "profesional" ? "Usuario" : "Profesional"}
      </Text>
    </TouchableOpacity>
  );
};

export default function Profile() {
  const setUserLogIn = useUserLogInStore((state: { setUserLogIn: (userLogIn: true | false) => void }) => state.setUserLogIn);
  const token = useUserLogInStore((state) => state.token);
  const [name, setName] = useState("")

  const handleLogoff = () => {
    setUserLogIn(false);
    router.replace("../auth/LoginRegisterScreen");
  };

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await fetch(URL_BASE + URL_AUTH + "/profile", {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          console.log("Datos del perfil recibidos:", userData);
          console.log("Todos los campos:", Object.keys(userData));
          setName(userData.firstName || "Sin nombre")
        } else {
          console.error("Error al cargar perfil:", response.status);
          Alert.alert("Error", "No se pudieron cargar los datos del perfil");
        }

      } catch (error) {
        console.error("Error loading profile data:", error);
        Alert.alert("Error", "Error de conexión al cargar el perfil");
      }
    };
    getProfile();
  }, [token]);

  return (
    <LinearGradient
      colors={[colors.color5, colors.fondo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full h-full"
    >
      <View className="flex-1 items-center justify-start space-y-15 px-6 py-10">
        {/* SWITCHER DE USUARIO - Arriba de todo */}
        <UserSwitcher />

        <View className="w-full flex-row items-center justify-center gap-2 px-2 py-6">
          {/* Foto de perfil */}
          <View className="rounded-full bg-color2 shadow-md w-16 h-16 items-center justify-center">
            <View style={{ transform: [{ scale: 1.3 }] }}>
              <ProfilePhoto />
            </View>
          </View>

          {/* Info del usuario */}
          <View className="flex-1">
            <View className="bg-fondo px-4 py-2 rounded-full border border-oscuro shadow-sm">
              <Text className="text-oscuro text-center font-bold text-lg">{name}</Text>
            </View>
            <Pressable onPress={() => router.replace("/profile")}>
              <Text className="text-right text-oscuro font-bold mt-1 text-xl">
                Perfil &gt;
              </Text>
            </Pressable>
          </View>
        </View>

        <ButtonLight_small onPress={() => (router.replace("/screensOnlyUser/recomendation"))} text="Recomendación" />
        <ButtonLight_small onPress={() => (router.replace("/tabs/rutines"))} text="Rutinas" />
        <ButtonLight_small onPress={() => ("")} text="Estadísticas" />
        <ButtonLight_small onPress={() => ("")} text="Eventos Significativos" />
        <ButtonLight_small onPress={() => (router.replace("/screensOnlyUser/emergencyContacts"))} text="Contactos de Emergencia" />
        <ButtonLight_small onPress={() => (router.replace("/screensOnlyUser/ascociatedProf"))} text="Profesionales Ascociados" />
        <ButtonLight_small onPress={() => (router.replace("/screensOnlyUser/medications"))} text="Medicación" />
        <ButtonDark_small onPress={handleLogoff} text="Cerrar Sesión" />
      </View>
    </LinearGradient>
  );
}

// VERSIÓN ALTERNATIVA: Switcher más discreto
export function ProfileWithDiscreetSwitcher() {
  const setUserLogIn = useUserLogInStore((state: { setUserLogIn: (userLogIn: true | false) => void }) => state.setUserLogIn);
  const userType = useUserLogInStore((state) => state.userType);
  const setUserSession = useUserLogInStore((state) => state.setUserSession);
  const setUserType = useUserLogInStore((state) => state.setUserType);
  const token = useUserLogInStore((state) => state.token);
  const [name, setName] = useState("");

  const handleLogoff = () => {
    setUserLogIn(false);
    router.replace("../auth/LoginRegisterScreen");
  };

  const handleChangeUser = () => {
    setUserLogIn(false);
    setUserSession("", "");
    setUserType(null);
    router.replace("/");
  };

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await fetch(URL_BASE + URL_AUTH + "/profile", {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setName(userData.firstName || "Sin nombre");
        } else {
          Alert.alert("Error", "No se pudieron cargar los datos del perfil");
        }
      } catch (error) {
        Alert.alert("Error", "Error de conexión al cargar el perfil");
      }
    };
    getProfile();
  }, [token]);

  return (
    <LinearGradient
      colors={[colors.color5, colors.fondo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full h-full"
    >
      <View className="flex-1 items-center justify-start space-y-15 px-6 py-10">
        <View className="w-full flex-row items-center justify-center gap-2 px-2 py-6">
          {/* Foto de perfil */}
          <View className="rounded-full bg-color2 shadow-md w-16 h-16 items-center justify-center">
            <View style={{ transform: [{ scale: 1.3 }] }}>
              <ProfilePhoto />
            </View>
          </View>

          {/* Info del usuario CON SWITCHER INTEGRADO */}
          <View className="flex-1">
            {/* Switcher discreto arriba del nombre */}
            <TouchableOpacity onPress={handleChangeUser} style={{ marginBottom: 8 }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255,255,255,0.3)',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}>
                <FontAwesome name="refresh" size={12} color={colors.oscuro} style={{ marginRight: 4 }} />
                <Text style={{ fontSize: 11, color: colors.oscuro, fontWeight: '500' }}>
                  {userType === "profesional" ? "Psicólogo" : "Usuario"}
                </Text>
              </View>
            </TouchableOpacity>

            <View className="bg-fondo px-4 py-2 rounded-full border border-oscuro shadow-sm">
              <Text className="text-oscuro text-center font-bold text-lg">{name}</Text>
            </View>
            <Pressable onPress={() => router.replace("/profile")}>
              <Text className="text-right text-oscuro font-bold mt-1 text-xl">
                Perfil &gt;
              </Text>
            </Pressable>
          </View>
        </View>

        <ButtonLight_small onPress={() => (router.replace("/screensOnlyUser/recomendation"))} text="Recomendación" />
        <ButtonLight_small onPress={() => (router.replace("/tabs/rutines"))} text="Rutinas" />
        <ButtonLight_small onPress={() => ("")} text="Estadísticas" />
        <ButtonLight_small onPress={() => ("")} text="Eventos Significativos" />
        <ButtonLight_small onPress={() => (router.replace("/screensOnlyUser/emergencyContacts"))} text="Contactos de Emergencia" />
        <ButtonLight_small onPress={() => (router.replace("/screensOnlyUser/ascociatedProf"))} text="Profesionales Ascociados" />
        <ButtonLight_small onPress={() => (router.replace("/screensOnlyUser/medications"))} text="Medicación" />
        <ButtonDark_small onPress={handleLogoff} text="Cerrar Sesión" />
      </View>
    </LinearGradient>
  );
}