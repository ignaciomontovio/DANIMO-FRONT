import Sos from "@/app/tabs/sos";
import { colors } from "@/stores/colors";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
// MANUAL para pantallas fuera de carpeta TAB

type TabItem = {
  name: string;
  icon: keyof typeof FontAwesome.glyphMap;
  label?: string;
};

type NavbarProps = {
  tabs: TabItem[];
};


export default function Navbar({ tabs }: NavbarProps) {
  const router = useRouter();

  return (
    <View className="flex-row justify-center items-center bg-oscuro h-[70px] px-2 space-x-7">
      {tabs.map((tab, index) =>
        tab.name === "sos" ? (
                // <Sos key={tab.name}/>
                <View key={tab.name} className="w-16" />
        ) : (
          <Pressable
            key={tab.name}
            onPress={() => router.push(`tabs/${tab.name}`as any)}
            className="flex-1 items-center"
          >
            <FontAwesome name={tab.icon} size={24} color={colors.fondo} />
            <Text className="text-xs text-fondo">{tab.label ?? tab.name}</Text>
          </Pressable>
        )
      )}
      <Sos/>
    </View>
  );
}
