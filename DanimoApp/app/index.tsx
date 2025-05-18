import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useUserStore } from "../stores/userType";

export default function Index() {
  const setUserType = useUserStore((state) => state.setUserType);

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-3xl font-bold mb-6">Bienvenido a Danimo</Text>
      <TouchableOpacity
        onPress={handleUser()}
        className="w-full bg-success py-3 rounded-md mt-2"
      >
        <Text className="text-white text-center font-bold text-lg">Usuario</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleProfesional()}
        className="w-full bg-success py-3 rounded-md mt-2"
      >
        <Text className="text-white text-center font-bold text-lg">Profesional</Text>
      </TouchableOpacity>
    </View>
  );

  function handleProfesional() {
    return () => {
      setUserType('profesional');
      router.push("/LoginRegisterScreen");
    };
  }
  function handleUser() {
    return () => {
      setUserType('usuario');
      router.push("/LoginRegisterScreen");
    };
  }
  }

