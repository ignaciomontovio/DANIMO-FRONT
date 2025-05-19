import { useRef, useState } from "react";
import { Text, TouchableHighlight, TouchableOpacity } from "react-native";

export type ButtonProps = {
  text: string;
  onPress: () => void;
};

export function ButtonAccept({ text, onPress }: ButtonProps) {
  return (
    <TouchableOpacity onPress = {onPress} className="w-full bg-color1 py-3 rounded-md mt-2 shadow-2xl">
      <Text className="text-oscuro text-center font-bold text-xl">{text}</Text>
    </TouchableOpacity>
  );
}

export function ButtonInfo({ text, onPress }: ButtonProps) {
  return (
    <TouchableOpacity onPress = {onPress} className="w-full bg-oscuro py-3 rounded-md mt-2 shadow-2xl">
      <Text className="text-oscuro text-center font-bold text-lg">{text}</Text>
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
    <TouchableHighlight
      onPressIn = {handlePressIn} 
      onPressOut={handlePressOut} className="w-full py-3 rounded-md mt-2 shadow-2xl"
      style={{ backgroundColor: pressing ? "#f93636" : "#f93636" }} 
    >
      <Text className="text-white text-center font-bold text-lg">{text}</Text>
    </TouchableHighlight>
  );
}
