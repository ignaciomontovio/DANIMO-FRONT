import SelectFive from "@/components/SelectFive";
import { router } from "expo-router";
import { SafeAreaView, ScrollView, View } from "react-native";

import { ButtonDark } from "@/components/buttons";
import QuoteCard from "@/components/QuoteCard";
import SearchBar from "@/components/SearchBar";
import LinearGradient from "react-native-linear-gradient";
import MiniMetrics from "../../components/MiniMetrics";
export default function Home() {
  return (
    <LinearGradient
          colors={["#D2A8D6", "#F4E1E6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="w-full h-full"
        >
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-4 pb-20">
          <View className="space-y-5 mb-10">
            <SearchBar placeholder="Buscar eventos o métricas..." onChangeText={(text) => console.log(text)} />
            <SelectFive goto="/detailEmotion" message="¿Cuál es tu estado de ánimo?" type="Emocion"/>
            <SelectFive goto="/detailSleep" message="¿Cómo dormiste?" type="Sueño" />
            <ButtonDark text="Registrar evento importante" onPress={()=>{}} />
            <View className="flex-row justify-center items-center">
              <QuoteCard onPress={() => router.push("../detailQuote")}/>   
              <MiniMetrics onPress={() => router.push("/tabs/stats")}/>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
