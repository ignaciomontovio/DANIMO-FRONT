
import Profile from "@/app/profile";
import { ButtonDark_small } from "@/components/buttons";
import { useUserLogInStore } from "@/stores/userLogIn";
import { router } from "expo-router";
import React from "react";


export default function Menu() {
  const setUserLogIn = useUserLogInStore((state: { setUserLogIn: (userLogIn: true | false) => void }) => state.setUserLogIn);
  const handleLogoff = () => {
    setUserLogIn(false);
    router.replace("../auth/LoginRegisterScreen");
    };
  return (
    <>
      <Profile/>
      <ButtonDark_small onPress={handleLogoff} text="Cerrar Sesión" />
    </>
  );
}


