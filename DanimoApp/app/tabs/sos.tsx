



import { useRef, useState } from "react";
import { Alert, Text, TouchableHighlight } from "react-native";

export default function sos() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [, setPressing] = useState(false);
        
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onActivate = async () => {
    console.log("activado");
    
    try {
      const response = await fetch("https://19ee-190-188-54-47.ngrok-free.app/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "+541139330921",
          message: "¡Emergencia! Se ha activado el botón SOS.",
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("SMS enviado con SID:", data.sid);
      } else {
        console.error("Error al enviar SMS:", data.error);
      }
      Alert.alert("SMS", "El mensaje de emergencia fue enviado correctamente.");
    } catch (error) {
      console.error("Error de red:", error);
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