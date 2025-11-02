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
import { Pressable, ScrollView, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default function Profile() {

  const setUserLogIn = useUserLogInStore((state: { setUserLogIn: (userLogIn: true | false) => void }) => state.setUserLogIn);
  const setUserType = useUserLogInStore((state) => state.setUserType);
  const setUserSession = useUserLogInStore((state) => state.setUserSession);
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
    setUserSession("", "");
    setUserType(null);
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-1 items-center justify-start px-6 pt-16 pb-8">
          
          {/* Tarjeta de Perfil Mejorada */}
          <Pressable 
            onPress={() => router.replace("/profile")}
            className="w-full mb-8 mt-4"
            style={({ pressed }: { pressed: boolean }) => ({
              opacity: pressed ? 0.95 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <View 
              className="bg-fondo rounded-3xl p-6 shadow-lg border-2"
              style={{ 
                borderColor: colors.color1 + '30',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <View className="flex-row items-center space-x-4">
                <View 
                  className="rounded-full shadow-lg w-20 h-20 items-center justify-center"
                  style={{ backgroundColor: colors.color2 + '40' }}
                >
                  <View style={{ transform: [{ scale: 1.5 }] }}>
                    <ProfilePhoto />
                  </View>
                </View>

                <View className="flex-1">
                  <Text 
                    className="text-2xl font-bold mb-1"
                    style={{ color: colors.oscuro }}
                  >
                    {name || "Cargando..."}
                  </Text>
                  <View className="flex-row items-center space-x-2">
                    <Text 
                      className="text-base font-medium"
                      style={{ color: colors.color1 }}
                    >
                      Ver mi perfil
                    </Text>
                    <FontAwesome 
                      name="chevron-right" 
                      size={16} 
                      color={colors.color1} 
                    />
                  </View>
                </View>
              </View>
            </View>
          </Pressable>

          {/* Sección de Opciones */}
          <View className="w-full space-y-4">
            {/* <ButtonLight_small onPress={() => (router.replace("/screensOnlyUser/recomendation"))} text="Recomendación" /> */}
            <ButtonLight_small onPress={() => (router.replace("/tabs/rutines"))} text="Rutinas" />
            <ButtonLight_small onPress={() => (router.replace("/tabs/stats"))} text="Estadísticas" />
            {/* <ButtonLight_small onPress={() => ("")} text="Eventos Significativos" /> */}
            <ButtonLight_small onPress={() => (router.replace("/screensOnlyUser/emergencyContacts"))} text="Contactos de Emergencia" />
            <ButtonLight_small onPress={() => (router.replace("/screensOnlyUser/ascociatedProf"))} text="Profesionales Asociados" />
            <ButtonLight_small onPress={() => (router.replace("/screensOnlyUser/medications"))} text="Medicación" />
            
            {userType === 'usuario' && (
              <ButtonLight_small 
                onPress={showTermsManually}
                text="Términos y Condiciones" 
              />
            )}
            
            <ButtonDark_small onPress={handleLogoff} text="Cerrar Sesión" />
          </View>
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