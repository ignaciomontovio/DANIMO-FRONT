import { FontAwesome } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { useRef, useState } from "react";
import { Text, TouchableHighlight } from "react-native";

export default function TabsLayout() {
   
    const [pressing, setPressing] = useState(false);
     
    const timeoutRef = useRef<number | null>(null);

    const onActivate = () => {
      // Aquí puedes definir la acción que se ejecuta al activar el botón SOS
      router.push("../profesional/home");
    }
    const handlePressIn = () => {
      setPressing(true);
      timeoutRef.current = setTimeout(() => {
        setPressing(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        onActivate(); 
      }, 4000);
    };
  
    const handlePressOut = () => {
      setPressing(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  return (
    // <LinearGradient
    //           colors={["#D2A8D6", "#F4E1E6"]}
    //           start={{ x: 0, y: -1 }}
    //           end={{ x: 0, y: 1 }}
    //           className="w-full h-full"
    //         >
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
              <TouchableHighlight
                onPressIn = {handlePressIn} 
                onPressOut={handlePressOut}
                className="absolute -top-[30px] justify-center items-center w-[70px] h-[70px] rounded-full bg-[#f44336] shadow-2xl border-2 border-fondo"
              >
                <Text className="text-fondo font-bold text-lg">SOS</Text>
              </TouchableHighlight>
            ),
          }}
        />
        <Tabs.Screen name="rutines" />
        <Tabs.Screen name="menu" />
      </Tabs>
    // </LinearGradient>
  );
}
