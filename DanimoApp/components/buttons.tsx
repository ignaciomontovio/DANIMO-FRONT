import { useRef, useState } from "react";
import { Text, TouchableOpacity } from "react-native";

export type ButtonProps = {
  text: string;
  onPress: () => void;
};

export function ButtonAccept({ text, onPress }: ButtonProps) {
  return (
    <TouchableOpacity onPress = {onPress} className="w-full bg-success py-3 rounded-md mt-2">
      <Text className="text-white text-center font-bold text-lg">{text}</Text>
    </TouchableOpacity>
  );
}

export function ButtonInfo({ text, onPress }: ButtonProps) {
  return (
    <TouchableOpacity onPress = {onPress} className="w-full bg-accent py-3 rounded-md mt-2">
      <Text className="text-white text-center font-bold text-lg">{text}</Text>
    </TouchableOpacity>
  );
}


type ButtonEmergencyProps = {
  text: string;
  onActivate: () => void;
};

export function ButtonEmergency({ text, onActivate }: ButtonEmergencyProps) {
  const [pressing, setPressing] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handlePressIn = () => {
    setPressing(true);
    timeoutRef.current = setTimeout(() => {
      setPressing(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      onActivate(); // se activa después de 5 segundos
    }, 5000);
  };

  const handlePressOut = () => {
    setPressing(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <TouchableOpacity 
      onPressIn = {handlePressIn} 
      onPressOut={handlePressOut} className="w-full bg-success py-3 rounded-md mt-2"
      style={{ backgroundColor: pressing ? "#fc1b1b" : "#fc1b1b" }} // Cambia el color de fondo
    >
      <Text className="text-white text-center font-bold text-lg">{text}</Text>
    </TouchableOpacity>
  );
}
