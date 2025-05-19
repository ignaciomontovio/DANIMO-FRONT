import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
export default function detailEmotion() {
  const { value } = useLocalSearchParams();

  return (
    <View className="flex-1 justify-start items-center pt-12 bg-white space-y-8 ">
      {/* <Text className="text-2xl font-bold">Seleccionaste: {value}</Text> */}
        <View className="w-full py-6 bg-primary rounded-2xl shadow-2xl overflow-hidden">
					<Text className="text-3xl font-bold text-white text-center">Actividades que hiciste</Text>
				</View>
    </View>
  );
}
