



import { URL_BASE, URL_SOS } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import React, { useRef, useState } from "react";

import { Alert, Text, TouchableHighlight } from "react-native";
export default function Sos() {
   
  const [, setPressing] = useState(false);
        
   
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const token = useUserLogInStore((state) => state.token);

  const onActivate = async () => {
    console.log("activado");
    
    try {
      const response = await fetch(URL_BASE + URL_SOS, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          }
      });
        
        if (!response.ok) {
          throw new Error("Error al enviar SMS");
        }
      Alert.alert("SMS", "El mensaje de emergencia fue enviado correctamente.");
    } catch (error) {
      console.error("Error", error);
    }
  };


  const handlePressIn = () => {
    setPressing(true);
    timeoutRef.current = setTimeout(() => {
      setPressing(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      onActivate(); 
    }, 4000);
  };

  const handlePressOut = () => {
    setPressing(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <>
      <TouchableHighlight
        onPressIn = {handlePressIn} 
        onPressOut={handlePressOut}
        className="absolute -top-[30px] justify-center items-center w-[70px] h-[70px] rounded-full bg-[#f44336] shadow-2xl border-2 border-fondo"
      >
        <Text className="text-fondo font-bold text-lg">SOS</Text>
      </TouchableHighlight>
    </>
  );
}