import { ButtonDark_small, ButtonLight_small, } from "@/components/buttons";
import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

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
    <LinearGradient
      colors={["#D2A8D6", "#F4E1E6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full h-full"
    >
      <View className="flex-1 items-center justify-start pt-12 space-y-15 px-6"> 
        <View className="bg-white w-full py-50 flex-row">
          <FontAwesome name="user" size={70} color="#000" />
          <View className="flex-column">
            <Text> Juan Perez </Text>
            <Text> Perfil </Text>
          </View>
          
        </View>
        {/*  poner un componente profile */}

        <ButtonLight_small onPress={()=>("")} text="Recomendacion"/>
        <ButtonLight_small onPress={()=>("")} text="Rutinas"/>
        <ButtonLight_small onPress={()=>("")} text="Estadisticas"/>
        <ButtonLight_small onPress={()=>("")} text="Eventos Significativos"/>
        <ButtonLight_small onPress={()=>("")} text="Contactos de Emergencia"/>
        <ButtonLight_small onPress={()=>("")} text="Profesionales Ascociados"/>
        <ButtonDark_small onPress={handleLogoff} text="Cerrar Sesion"/>
      </View>
    </LinearGradient>
  );
}
