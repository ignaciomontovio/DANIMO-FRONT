import { FontAwesome } from "@expo/vector-icons";
import { Text, View } from "react-native";

export type ShowInfoProps = {
  text: string;
  icon: string;
};
export default function ShowInfo({ text, icon }: ShowInfoProps) {
  return (
    <View className="w-full py-3 px-5 rounded-md mt-2 shadow-2xl border border-oscuro flex-row items-center justify-start">
        <FontAwesome name={icon} size={30} color="#595154" />
        <Text className="text-oscuro px-5 font-bold text-lg">{text}</Text>
    </View>
  );
}
