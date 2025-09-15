import { Profesional } from "@/components/config/ascProfConfig";
import { URL_AUTH, URL_BASE } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, TextInput, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import HeaderGoBack from "@/components/headerGoBack";
import { colors } from "@/stores/colors";
import { router } from "expo-router";
import LinearGradient from "react-native-linear-gradient";

import { ButtonDark, ButtonDark_add } from "@/components/buttons";
import { ShowInfo_edit } from "@/components/showInfo";

export default function AsocociatedProf() {
  const token = useUserLogInStore((state) => state.token);
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);

  const getProf = async (): Promise<Profesional[]> => {
    const response = await fetch(URL_BASE + URL_AUTH + "/professionals", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
    });

    if (!response.ok) {
      const errorText = await response.json();
      console.error("Error:", errorText.error);
      throw new Error(errorText.error);
    }

    const data = await response.json();
    const profesionales = Array.isArray(data) ? data : data.data || [];

    return profesionales.map((p: any) => ({
      id: p.id,
      name: `${p.firstName} ${p.lastName}`,
      occupation: p.occupation,
    }));
  };

  const confirmDeleteProf = (profToDelete: Profesional) => {
    Alert.alert(
      "Confirmar desvinculación",
      `¿Estás seguro de que deseas desvincular a ${profToDelete.name}?\n\nEsta acción no se puede deshacer.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Desvincular",
          style: "destructive",
          onPress: () => deleteProf(profToDelete),
        },
      ],
      { cancelable: true }
    );
  };

  const deleteProf = async (profToDelete: Profesional) => {
    try {
      const response = await fetch(URL_BASE + URL_AUTH + "/unlink-professional", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({ professionalId: profToDelete.id }), 
      });

      if (!response.ok) {
        const errorText = await response.json();
        throw new Error(errorText.error);
      }

      setProfesionales((prev) => prev.filter(p => p.id !== profToDelete.id));

      // Confirmación de éxito
      Alert.alert(
        "Desvinculación exitosa",
        `${profToDelete.name} ha sido desvinculado correctamente.`,
        [{ text: "OK" }]
      );

    } catch (error) {
      console.error("Error al sacar permisos:", error);
      Alert.alert("Error", "No se pudo desvincular al profesional. Inténtalo nuevamente.");
    }
  };

  useEffect(() => {
    getProf().then(setProfesionales).catch(console.error);
  }, []);

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={[colors.color5, colors.fondo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full h-full"
      >
        <HeaderGoBack text="Profesionales" onPress={() => router.push("/tabs/home")} />

        <ScrollView className="flex-1 px-5 py-5 item-center">
          {profesionales.map((prof) => (
            <View
              key={prof.id}
              className="w-full max-w-md rounded-2xl shadow-xl mb-4"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 10,
              }}
            >
              <View className="py-3 bg-color1 rounded-t-2xl">
                <TextInput
                  className="text-2xl font-bold text-white text-center"
                  value={"Psicologo"}
                  editable={false}
                  placeholder="Nombre del profesional"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                />
              </View>
              <View className="p-6 bg-fondo rounded-b-2xl space-y-2">
                <ShowInfo_edit
                  icon="id-card"
                  text={prof.name || ""}
                  onChangeText={() => {}}
                  placeholder="name"
                  type="text"
                />

                <ButtonDark text="Sacar permisos" onPress={() => confirmDeleteProf(prof)} />
              </View>
            </View>
          ))}

          <View className="mt-4 items-center">
            <ButtonDark_add onPress={() =>router.push("/screensOnlyUser/shareCode")} />
          </View>            
        </ScrollView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}