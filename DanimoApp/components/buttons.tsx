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
    <TouchableOpacity
      onPress={onPress}
      className="w-16 h-16 bg-oscuro rounded-full items-center justify-center shadow-lg mt-4 mb-20"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 10, // Android
      }}
    >
      <Text className="text-white font-bold text-3xl">+</Text>
    </TouchableOpacity>
  );
}