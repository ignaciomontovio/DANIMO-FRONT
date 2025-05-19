import { FontAwesome } from "@expo/vector-icons";
import { TextInput, View } from "react-native";

export type InputProps = {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
} & React.ComponentProps<typeof TextInput>;

export default function Input({ icon, ...props }: InputProps) {
  return (
    <View className="relative mb-4">
      <FontAwesome name={icon} size={18} color="gray" style={{ position: "absolute", top: 16, left: 12 }} />
      <TextInput
        className="w-full pl-10 pr-4 py-3 border border-oscuro rounded-md text-oscuro"
        placeholderTextColor="#999"
        {...props}
      />
    </View>
  );
}