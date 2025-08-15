import SelectFive from "@/components/SelectFive";
import { router } from "expo-router";
import { SafeAreaView, ScrollView, View } from "react-native";

import { ButtonDark } from "@/components/buttons";
import QuoteCard from "@/components/QuoteCard";
import SearchBar from "@/components/SearchBar";
import { colors } from "@/stores/colors";
import React from "react";
import LinearGradient from "react-native-linear-gradient";
import MiniMetrics from "../../components/MiniMetrics";
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
            <SearchBar placeholder="Buscar eventos o métricas..." onChangeText={(text) => console.log(text)} />
            <SelectFive goto="/screensOnlyUser/detailEmotion" message="¿Cuál es tu estado de ánimo?" type="Emocion"/>
            <SelectFive goto="/screensOnlyUser/detailSleep" message="¿Cómo dormiste?" type="Sueño" />
            <ButtonDark text="Registrar evento importante" onPress={()=>{}} />
            <View className="flex-row justify-center items-center">
              <QuoteCard/>   
              <MiniMetrics onPress={() => router.push("/tabs/stats")}/>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}