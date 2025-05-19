import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

type AllowedRoutes = "/detailSleep" | "/detailEmotion"

type SelectFiveProps = {
  message: string;
  goto: AllowedRoutes;
};

const goToDetail = (num: number, goto: AllowedRoutes) => {
  router.push({ pathname: goto, params: { value: num.toString() } });
};

export default function SelectFive({ message, goto }: SelectFiveProps) {

  return (
    <View className="w-full bg-primary rounded-2xl p-6 items-center justify-between shadow-2xl">
      <Text className="mb-4 text-white text-xl font-bold text-center">{message}</Text>
      <View className="flex-row justify-center space-x-6">
        {[1, 2, 3, 4, 5].map((num) => (
          <TouchableOpacity onPress={() => goToDetail(num,goto)} key={num}>
            <Text className="text-white text-2xl m">{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
