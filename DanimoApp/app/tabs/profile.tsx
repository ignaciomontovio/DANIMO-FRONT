import { ButtonAccept } from "@/components/buttons";
import { useUserLogInStore } from "@/stores/userLogIn";
import { router } from "expo-router";
import { Text, View } from "react-native";
export default function profile() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const setUserLogIn = useUserLogInStore((state: { setUserLogIn: (userLogIn: true | false) => void }) => state.setUserLogIn);
  const handleLogoff = () => {
    setUserLogIn(false);
    router.replace("../auth/LoginRegisterScreen");
    // Aquí puedes agregar la lógica para cerrar sesión, como limpiar el estado del usuario o eliminar tokens de autenticación.
    // Por ejemplo:
    // setUser(null);
    // setToken(null);
  };
  return (
    <View className="flex-1 items-center justify-start pt-12 bg-white space-y-8">
      <Text> profile </Text>
      <ButtonAccept onPress={handleLogoff} text="LogOff"/>
    </View>
  );
}
