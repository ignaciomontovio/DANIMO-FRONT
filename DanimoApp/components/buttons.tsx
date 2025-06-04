import { Text, TouchableOpacity } from "react-native";

export type ButtonProps = {
  text?: string;
  onPress?: () => void;
};

export function ButtonAccept({ text, onPress }: ButtonProps) {
  return (
    <TouchableOpacity onPress = {onPress} className="w-full bg-color1 py-3 rounded-md mt-2 shadow-2xl">
      <Text className="text-white text-center font-bold text-2xl">{text}</Text>
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
      <Text className="text-white text-center font-bold text-2xl">{text}</Text>
    </TouchableOpacity>
  );
}
export function ButtonLight_small({ text, onPress }: ButtonProps) {
  return (
    <TouchableOpacity onPress = {onPress} className="w-full bg-fondo py-2 rounded-md mt-2 shadow-2xl opacity-80 border border-oscuro">
      <Text className="text-oscuro text-left pl-10 font-bold text-xl">{text}</Text>
    </TouchableOpacity>
  );
}
export function ButtonDark_small({ text, onPress }: ButtonProps) {
  return (
    <TouchableOpacity onPress = {onPress} className="w-full bg-oscuro py-2 rounded-md mt-2 shadow-2xl opacity-80 border border-oscuro">
      <Text className="text-white text-left pl-10 font-bold text-xl">{text}</Text>
    </TouchableOpacity>
  );
}

export function ButtonDark_add({ onPress }: ButtonProps) {
  return (
    <TouchableOpacity onPress = {onPress} className="w-50 bg-oscuro py-3 rounded-md mt-2 shadow-2xl">
      <Text className="text-white text-left pl-10 font-bold text-xl">+</Text>
    </TouchableOpacity>
  );
}