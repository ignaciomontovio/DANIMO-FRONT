import { ButtonAccept, ButtonEmergency } from "@/components/buttons";
import QuoteCard from "@/components/QuoteCard";
import SelectFive from "@/components/SelectFive";
import { router } from "expo-router";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
 
import MiniMetrics from "../../components/MiniMetrics";
export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-fondo">
      <View className="flex-1">
        {/* Contenido scrollable */}
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <View className="space-y-8">
            <SelectFive goto="/detailEmotion" message="¿Cuál es tu estado de ánimo?" />
            <SelectFive goto="/detailSleep" message="¿Cómo dormiste?" />
            <ButtonAccept text="Recomendacion profesional" onPress={()=>{}} />
            <View className="flex-row justify-center">
              <TouchableOpacity onPress={() => router.push("../detailQuote")}>
                <QuoteCard />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push("/tabs/stats")}>
                <MiniMetrics/>
              </TouchableOpacity>
            </View>
          </View>
          {/* Botón de emergencia */}
          <View className="bottom-0 flex-1 justify-end items-center px-4 pb-0 pt-10">
          <ButtonEmergency
            text="Boton de Emergencia"
            onActivate={() => router.push("../profesional/home")}
          />
        </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
