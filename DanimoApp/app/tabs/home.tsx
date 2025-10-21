
import SelectFive from "@/components/SelectFive";
import { router } from "expo-router";
import { SafeAreaView, ScrollView, View } from "react-native";

import { ButtonDark } from "@/components/buttons";
import QuoteCard from "@/components/QuoteCard";
import SearchBar from "@/components/SearchBar";
import TermsModal from "@/components/TermsModal";
import { colors } from "@/stores/colors";
import { useUserLogInStore } from "@/stores/userLogIn";
import { useTermsAndConditions } from "@/stores/useTermsAndConditions";
import React, { useEffect, useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import MiniMetrics from "../../components/MiniMetrics";

export default function Home() {
  // Estado para controlar si ya se mostró en esta sesión
  const [hasShownInSession, setHasShownInSession] = useState(false);

  // Estados del usuario
  const userType = useUserLogInStore((state) => state.userType);
  const userLogIn = useUserLogInStore((state) => state.userLogIn);
  const token = useUserLogInStore((state) => state.token);

  // Hook de términos y condiciones
  const {
    showTermsModal,
    hasAcceptedTerms,
    loading,
    isReadOnlyMode,
    handleAcceptTerms,
    handleCloseModal,
  } = useTermsAndConditions();

  // Verificar si estamos en las condiciones correctas para mostrar el modal
  const isUserReady = userLogIn && token && userType === 'usuario';

  // Marcar como mostrado cuando el modal se muestre
  useEffect(() => {
    if (Boolean(showTermsModal) && !hasShownInSession && isUserReady) {
      setHasShownInSession(true);
    }
  }, [showTermsModal, hasShownInSession, isUserReady]);

  // Solo mostrar el modal si:
  // 1. El usuario está logueado
  // 2. Es tipo "usuario" (no profesional)  
  // 3. El hook dice que debe mostrarse
  // 4. No se ha mostrado ya en esta sesión
  const shouldShowModal = isUserReady && Boolean(showTermsModal) && !hasShownInSession;

  // Manejar el cierre del modal
  const handleModalClose = () => {
    setHasShownInSession(true); // Marcar como mostrado
    handleCloseModal(); // Ejecutar el close original
  };

  // Manejar la aceptación
  const handleModalAccept = () => {
    setHasShownInSession(true); // Marcar como mostrado
    handleAcceptTerms(); // Ejecutar la aceptación original
  };

  return (
    <LinearGradient
      colors={[colors.color5, colors.fondo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full h-full"
    >
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-4 pb-20 py-10">
          <View className="space-y-5 mb-10">
            <SearchBar placeholder="Buscar eventos o métricas..." onChangeText={(text) => console.log(text)} />
            
            {/* <SpeechToText/> */}

            <SelectFive goto="/screensOnlyUser/detailEmotion" message="¿Cuál es tu estado de ánimo?" type="Emocion"/>
            <SelectFive goto="/screensOnlyUser/detailSleep" message="¿Cómo dormiste?" type="Sueño" />
            <ButtonDark text="Profesionales Asociados" onPress={()=>{router.replace("/screensOnlyUser/ascociatedProf")}} />
            <View className="flex-row justify-center items-center">
              <QuoteCard/>   
              <MiniMetrics onPress={() => router.push("/tabs/stats")}/>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Modal de términos y condiciones - Solo para usuarios logueados como "usuario" */}
      <TermsModal
        isVisible={Boolean(shouldShowModal)}
        onAccept={handleModalAccept}
        onClose={handleModalClose}
        loading={Boolean(loading)}
        isReadOnlyMode={Boolean(isReadOnlyMode)}
      />
    </LinearGradient>
  );
}