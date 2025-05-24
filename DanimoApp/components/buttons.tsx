import { Text, TouchableOpacity } from "react-native";

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

export function ButtonDark({ text, onPress }: ButtonProps) {
  return (
    <TouchableOpacity onPress = {onPress} className="w-full bg-oscuro py-3 rounded-md mt-2 shadow-2xl">
      <Text className="text-fondo text-center font-bold text-xl">{text}</Text>
    </TouchableOpacity>
  );
}

