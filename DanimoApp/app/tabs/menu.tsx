import { ButtonDark_small, ButtonLight_small } from "@/components/buttons";
import ProfilePhoto from "@/components/profilePhoto";
import TermsModal from "@/components/TermsModal";
import { colors } from "@/stores/colors";
import { URL_AUTH, URL_BASE } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { useTermsAndConditions } from "@/stores/useTermsAndConditions";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
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
      className=" bg-fondo px-4 py-3 rounded-full flex-row items-center justify-center "
      style={{
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Android
      }}
    >
      <FontAwesome
        name="refresh"
        size={16}
        color={colors.oscuro}
        style={{ marginRight: 8 }}
      />
      <Text
        className="text-sm font-semibold text-oscuro"
      >
        Cambiar a {userType === "profesional" ? "Usuario" : "Profesional"}
      </Text>
    </TouchableOpacity>
  );
};

export default function Profile() {

  const setUserLogIn = useUserLogInStore((state: { setUserLogIn: (userLogIn: true | false) => void }) => state.setUserLogIn);
  const userType = useUserLogInStore((state) => state.userType);
  const token = useUserLogInStore((state) => state.token);
  const [name, setName] = useState("");

  // Hook externo de términos
  const {
    showTermsModal,
    hasAcceptedTerms,
    loading,
    isReadOnlyMode,
    handleAcceptTerms,
    handleCloseModal,
    showTermsManually,
  } = useTermsAndConditions();

  const handleLogoff = () => {
    setUserLogIn(false);
    router.replace("../auth/LoginRegisterScreen");
  };

  useEffect(() => {
    if (!token) {
      return;
    }
    
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
          setName(userData.firstName || "Sin nombre")
        } else {
          console.error("Error al cargar perfil:", response.status);
        }

      } catch (error) {
        console.error("Error loading profile data:", error);
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
      {/* <ScrollView className="flex-1 px-5 py-5"> */}
      <ScrollView>
        <View className="flex-1 items-center justify-start space-y-15 px-6 py-10">
          <UserSwitcher />

          <View className="w-full flex-row items-center justify-center gap-2 px-2 py-6">
            <View className="rounded-full bg-color2 shadow-md w-16 h-16 items-center justify-center">
              <View style={{ transform: [{ scale: 1.3 }] }}>
                <ProfilePhoto />
              </View>
            </View>

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
          <ButtonLight_small onPress={() => (router.replace("/tabs/stats"))} text="Estadísticas" />
          <ButtonLight_small onPress={() => ("")} text="Eventos Significativos" />
          <ButtonLight_small onPress={() => (router.replace("/screensOnlyUser/emergencyContacts"))} text="Contactos de Emergencia" />
          <ButtonLight_small onPress={() => (router.replace("/screensOnlyUser/ascociatedProf"))} text="Profesionales Ascociados" />
          <ButtonLight_small onPress={() => (router.replace("/screensOnlyUser/medications"))} text="Medicación" />
          
          {userType === 'usuario' && (
            <ButtonLight_small 
              onPress={showTermsManually}
              text="Términos y Condiciones" 
            />
          )}
          
          <ButtonDark_small onPress={handleLogoff} text="Cerrar Sesión" />
        </View>
      </ScrollView>
      <TermsModal
        isVisible={showTermsModal}
        onAccept={handleAcceptTerms}
        onClose={handleCloseModal}
        loading={loading}
        isReadOnlyMode={isReadOnlyMode}
      />
    </LinearGradient>
  );
}