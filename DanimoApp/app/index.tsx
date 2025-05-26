// import { useUserLogInStore } from "@/stores/userLogIn";
 
import { ButtonAccept, ButtonDark } from "@/components/buttons";
import LoaderDanimo from "@/components/LoaderDanimo";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useUserStore } from "../stores/userType";

export default function Index() {
  const setUserType = useUserStore((state) => state.setUserType);
  const [showLoader, setShowLoader] = useState(true);
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
  if (showLoader) {
    setTimeout(() => {
      setShowLoader(false);
    }, 1500);
    return <LoaderDanimo />;
  }
  return (
    <LinearGradient
      colors={["#D2A8D6", "#F4E1E6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full h-full"
    >
      <View className="flex-1 justify-center items-center  px-6">
        <Text className="text-oscuro text-3xl font-bold mb-6">Bienvenido a Danimo</Text>
        <ButtonAccept text={"Usuario"} onPress={() => handleUsuario()}></ButtonAccept>
        <ButtonDark text={"Profesional"} onPress={() => handleProfesional()}></ButtonDark>
      </View>
    </LinearGradient>
  );
}

