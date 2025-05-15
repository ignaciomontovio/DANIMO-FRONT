import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-3xl font-bold mb-6">Bienvenido a Danimo</Text>
      <Link href="/login" className="text-blue-600 text-lg mb-2">Iniciar Sesión</Link>
      <Link href="/register" className="text-blue-600 text-lg">Registrarse</Link>
    </View>
  );
}
