import TermsModal from "@/components/TermsModal";
import { Stack } from "expo-router";
import * as SystemUI from 'expo-system-ui';
import React, { useEffect } from "react";
import { BackHandler, Platform } from "react-native";
import { useTermsAndConditions } from '../stores/useTermsAndConditions';
import { useUserLogInStore } from '../stores/userLogIn';

export default function Layout() {
  //hook personalizado
  const {
    showTermsModal,
    hasAcceptedTerms,
    handleAcceptTerms,
    handleCloseModal
  } = useTermsAndConditions();

  // Obtener el userType del store de Zustand
  const userType = useUserLogInStore(state => state.userType);
  const userLogIn = useUserLogInStore(state => state.userLogIn);

  // Solo mostrar para usuarios (pacientes) que estén logueados
  const shouldShowTerms = userType === 'usuario' && userLogIn && showTermsModal;

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
    <>
      <Stack screenOptions={{ headerShown: false }} />
      
      {/* Modal de términos y condiciones - Solo para usuarios logueados */}
      <TermsModal
        isVisible={!!shouldShowTerms}
        onAccept={handleAcceptTerms}
        onClose={handleCloseModal}
      />
    </>
  );
}