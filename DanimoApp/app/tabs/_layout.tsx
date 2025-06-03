import Sos from "@/app/tabs/sos";
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
            else if (route.name === "rutines") iconName = "newspaper-o";
            else if (route.name === "menu") iconName = "bars";
  
            if (route.name === "sos") return null;

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
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="stats" />
        <Tabs.Screen
          name="sos"
          options={{
            tabBarButton: () => (
              <Sos/>
            ),
          }}
        />
        <Tabs.Screen name="rutines" />
        <Tabs.Screen name="menu" />
        <Tabs.Screen
          name="chat"
          options={{
            tabBarButton: () => null, //  oculta el botón 
            tabBarStyle: { display: "none" }, // esto elimina el espacio
          }}
        />
      </Tabs>

  );
}
