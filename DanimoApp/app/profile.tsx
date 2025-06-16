
import { ButtonDark } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import Navbar from "@/components/navbar";
import ShowInfo from "@/components/showInfo";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";

type UserProfile = {
  email: string;
  name: string;
  d_birth: Date;
  codigo: string;
};

export default function profile() {
  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={["#D2A8D6", "#F4E1E6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full h-full"
      >
        <HeaderGoBack text="Perfil" onPress={() => router.replace("/tabs/home")} />
        <ScrollView className="flex-1 px-5 py-5">
          <View className="mb-8">
            <ProfileCard
              profile={{
                name: "Juan",
                email: "juan.perez@email.com",
                d_birth: new Date("1990-01-01"),
                codigo: "PSI-12345",
              }}
              onEdit={() => {}} 
              icon="sign-out" // Agregado para logout
            />
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



type PropsProfileCard = {
  profile: UserProfile;
  onEdit: () => void;
  icon: keyof typeof FontAwesome.glyphMap;
};

export function ProfileCard({ profile, onEdit, icon = "user" }: PropsProfileCard) {
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
        <Text className="text-2xl font-bold text-white text-center">Perfil</Text>
      </View>

      <View className="p-6 bg-fondo rounded-b-2xl">
        <ShowInfo text={profile.name} icon="user" />

        <ShowInfo text={profile.email} icon="envelope" />

        <ShowInfo text={profile.d_birth.toLocaleDateString()} icon="calendar" />

        <ShowInfo text={profile.codigo} icon="share" />
        <ButtonDark
          text="Editar"
          onPress={onEdit}
        />
      </View>
    </View>
  );
}