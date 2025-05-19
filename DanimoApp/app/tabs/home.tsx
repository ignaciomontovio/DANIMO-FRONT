import { ButtonAccept, ButtonEmergency } from "@/components/buttons";
import SelectFive from "@/components/SelectFive";
import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-color3">
      <View className="flex-1">
        {/* Contenido scrollable */}
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <View className="space-y-8">
            <SelectFive goto="/detailEmotion" message="¿Cuál es tu estado de ánimo?" />
            <SelectFive goto="/detailSleep" message="¿Cómo dormiste?" />
            <ButtonAccept text="Recomendacion profesional" onPress={()=>{}} />
          </View>
        </ScrollView>
        {/* Botón fijo abajo */}
      
        <View className="flex-1 justify-end items-center px-4 pb-4">
          <ButtonEmergency
            text="Boton de Emergencia"
            onActivate={() => router.push("../profesional/home")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
