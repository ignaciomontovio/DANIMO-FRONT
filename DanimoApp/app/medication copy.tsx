import { ButtonDark } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import Navbar from "@/components/navbar";
import ShowInfo from "@/components/showInfo";
import { colors } from "@/stores/colors";
import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";

type Medication = {
  drug:string;
  grams: number;
  frecuency: number;
};

export default function medication() {
  const setUserLogIn = useUserLogInStore(
    (state: { setUserLogIn: (userLogIn: true | false) => void }) => state.setUserLogIn
  );

  const handleLogoff = () => {
    setUserLogIn(false);
    router.replace("../auth/LoginRegisterScreen");
  };

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={[colors.color5, colors.fondo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full h-full"
      >
        <HeaderGoBack text="Medicación" onPress={() => router.replace("/tabs/home")} />
        <ScrollView className="flex-1 px-5 py-5">
          <View className="mb-8">
            <MedicationCard
              medication={{
                drug: "Clonazepam",
                grams: 0.5,
                frecuency: 2,
              }} onEdit={function (): void {
                throw new Error("Function not implemented.");
              } } icon={"sort"}            />
          </View>
        </ScrollView>
        <View className="absolute bottom-0 left-0 right-0">
          <Navbar
            tabs={[
              { name: "home", icon: "home", label: "Inicio" },
              { name: "stats", icon: "bar-chart", label: "Stats" },
              { name: "sos", icon: "exclamation-triangle" },
              { name: "rutines", icon: "newspaper-o", label: "Rutinas" },
              { name: "menu", icon: "bars", label: "Menú" },
            ]}
          />
        </View>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

type PropsMedicationCard = {
  medication: Medication;
  onEdit: () => void;
 icon: keyof typeof FontAwesome.glyphMap;
};

export function MedicationCard({ medication, icon }: PropsMedicationCard) {
  return (
    <View
      className="w-full max-w-md rounded-2xl shadow-xl mb-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10,
      }}
    >
      <View className="py-3 bg-color1 rounded-t-2xl relative">
        <Text className="text-2xl font-bold text-white text-center">{medication.drug}</Text>
      </View>
      <View className="p-6 bg-fondo rounded-b-2xl">
        <ShowInfo text={`${medication.grams} gramo/s`} icon="medkit" />
        <ShowInfo text={`${medication.frecuency} veces al día`} icon="clock-o" />
        
        <ButtonDark
          text="Editar"
        />
      </View>
    </View>
  );
}