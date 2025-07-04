import SearchBar from "@/components/SearchBar";
import { colors } from "@/stores/colors";
import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
export default function Home() {
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
              <SearchBar placeholder="Buscar rutinas, pacientes..." onChangeText={(text) => console.log(text)} />
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
}
