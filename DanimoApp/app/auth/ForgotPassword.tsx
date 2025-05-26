import { router } from "expo-router";
import { StatusBar, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ButtonAccept, ButtonDark } from "../../components/buttons";
import Input from "../../components/input";

export default function ForgotPassword() {
  return (
    <SafeAreaProvider>
      <LinearGradient
          colors={["#D2A8D6", "#F4E1E6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="w-full h-full"
      >
      <StatusBar />
      <View className="flex-1 justify-center items-center px-4">
        <View
          className="w-full max-w-md rounded-2xl shadow-xl"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 10, // Para Android
          }}
        >
          <View className="py-6 bg-color1 rounded-t-2xl ">
            <Text className="text-3xl font-bold text-white text-center">
              Recuperar contraseña
            </Text>
          </View>

          <View className="p-6 bg-fondo rounded-b-2xl">

           
            <View className="mb-20">
              <Input
                icon="envelope"
                placeholder="Email"
                keyboardType="email-address"
                className="border-solid border-oscuro text-oscuro"
              />
              <ButtonDark text={"Enviar codigo"} onPress={()=>console.log("codigo")}/>
            </View>
            <Input
              icon="lock"
              placeholder="Codigo de verificación"
              secureTextEntry
              className="border-solid border-oscuro text-oscuro"
            />
            <ButtonAccept text="Verificar" onPress={() => router.push("/auth/NewPassword")} />
          </View>
        </View>
      </View>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

