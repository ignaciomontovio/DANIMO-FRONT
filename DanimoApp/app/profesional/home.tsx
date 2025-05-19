import { Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-start pt-12 bg-white space-y-8">
      {["juan", "pepe", "diana", "agustin"].map((num) => (
        <TouchableOpacity key={num}>
            <Text className="text-white text-2xl m">{num}</Text>
        </TouchableOpacity>
        ))}
    </View>
  );
}
