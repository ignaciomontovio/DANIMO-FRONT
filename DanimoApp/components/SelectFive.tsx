import { Text, TouchableOpacity, View } from "react-native";

type SelectFiveProps = {
  message: string;
};

export default function SelectFive({ message }: SelectFiveProps) {
  return (
    <View className="w-full max-w-md bg-primary rounded-2xl p-6 items-center justify-between min-h-[150px] min-w-[150px]">
      <Text className="mb-4 text-white text-xl font-bold text-center">{message}</Text>
      <View className="flex-row justify-center space-x-6">
        {[1, 2, 3, 4, 5].map((num) => (
          <TouchableOpacity key={num}>
            <Text className="text-white text-2xl m">{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
