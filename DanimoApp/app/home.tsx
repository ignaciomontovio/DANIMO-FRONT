import { View } from "react-native";
import SelectFive from "../components/SelectFive";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-start pt-12 bg-white space-y-8">
      <SelectFive message="¿Cuál es tu estado de ánimo?" />
      <SelectFive message="¿Cómo dormiste?" />
    </View>
  );
}
