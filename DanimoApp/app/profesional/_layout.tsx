import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any;
          if (route.name === "home") iconName = "home";
          else if (route.name === "stats") iconName = "bar-chart";
          else if (route.name === "rutines") iconName = "medkit";
          else if (route.name === "profile") iconName = "user";

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#d2a8d6",
        tabBarInactiveTintColor: "#f4e1e6",
        tabBarStyle: {
          backgroundColor: "#595154",
          height: 70,
          paddingBottom: 10,
        },
        headerShown: false,
      })}
    />
  );
}
