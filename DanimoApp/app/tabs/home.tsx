import QuoteCard from "@/components/QuoteCard";
import SelectFive from "@/components/SelectFive";
import { router } from "expo-router";
import { SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native";

import { ButtonDark } from "@/components/buttons";
import SearchBar from "@/components/SearchBar";
import LinearGradient from "react-native-linear-gradient";
import MiniMetrics from "../../components/MiniMetrics";
export default function Home() {
  return (
    <LinearGradient
          colors={["#D2A8D6", "#F4E1E6"]}
          start={{ x: 0, y: -1 }}
          end={{ x: 0, y: 1 }}
          className="w-full h-full"
        >
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-4 pb-[100px]">
          <View className="space-y-8">
            <SearchBar placeholder="Buscar eventos o métricas..." onChangeText={(text) => console.log(text)} />
            <SelectFive goto="/detailEmotion" message="¿Cuál es tu estado de ánimo?" />
            <SelectFive goto="/detailSleep" message="¿Cómo dormiste?" />
            <ButtonDark text="Registrar evento importante" onPress={()=>{}} />
            <View className="flex-row justify-center">
              <TouchableOpacity onPress={() => router.push("../detailQuote")} >
                <QuoteCard />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push("/tabs/stats")}>
                <MiniMetrics/>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
