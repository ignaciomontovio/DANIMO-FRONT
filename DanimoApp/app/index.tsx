// import { useUserLogInStore } from "@/stores/userLogIn";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useUserStore } from "../stores/userType";

export default function Index() {
  const setUserType = useUserStore((state) => state.setUserType);
  // const userType: string | null = useUserStore((state: { userType: string | null }) => state.userType);
  // const UserLogIn = useUserLogInStore(state => state.userLogIn);

  // useEffect(() => {
  //   if (UserLogIn !== null) {
  //   if (UserLogIn) {
  //     if (userType === "profesional") {
  //       router.replace("/profesional/home");
  //     } else {
  //     router.replace("/tabs/home");
  //     }
  //   } else if (userType !== null) {
  //     router.replace("/auth/LoginRegisterScreen");
  //   }
  //   }
  // }, [UserLogIn, userType]);
  
  const handleUsuario = () => {
    setUserType("usuario");
    router.replace("/auth/LoginRegisterScreen");
  };
  const handleProfesional = () => {
    setUserType("profesional");
    router.replace("/auth/LoginRegisterScreen");
  };
  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-3xl font-bold mb-6">Bienvenido a Danimo</Text>
      <TouchableOpacity
        onPress={() => handleUsuario()}
        className="w-full bg-color1 py-3 rounded-md mt-2"
      >
        <Text className="text-backGrounds text-center font-bold text-lg">Usuario</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleProfesional()}
        className="w-full bg-color1 py-3 rounded-md mt-2"
      >
        <Text className="text-backGrounds text-center font-bold text-lg">Profesional</Text>
      </TouchableOpacity>
    </View>
  );
}

