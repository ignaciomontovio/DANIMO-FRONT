import { ButtonDark, ButtonDark_add } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import { colors } from "@/stores/colors";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";

type Rutine = {
  title: string;
  type: "Video"|"Pasos"|"Texto";
  content: string; // json con estructura
};

export default function Rutines() {

  const [loading, setLoading] = useState(true);
  const [element, setElement] = useState<Rutine[]>([]);

  const fetchData = async () => {
      try {
        setLoading(true);
        
      } catch (error) {
        Alert.alert("Error", (error as Error).message);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);


  return (
      <SafeAreaProvider>
            <LinearGradient 
              colors={[colors.color5, colors.fondo]} 
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              className="w-full h-full"
            >
              <HeaderGoBack text="Rutinas" onPress={() => router.replace("/profesional/home")} />
              <ScrollView className="flex-1 px-5 py-5">
                <View className="flex-1 justify-center items-center">
                  {loading ? (
                    <ActivityIndicator size="large" color="#000" />
                  ) : element && element.length > 0 ? (
                    <>
                      {element.map((el, index) => (
                        <Card
                          key={index}
                          element={el}
                          onButton={() => "gotoEdit(el)"}
                          onIcon={() => "handleDelete(el)"}
                          icon="trash"
                        />
                      ))}
                    </>
                  ) : null}
                  <ButtonDark_add onPress={() => "gotoNew()"} /> 
                 
                </View>
              </ScrollView>
            </LinearGradient>
          </SafeAreaProvider>
  );
}
type PropsCard<T> = {
  element: T;
  onIcon: (item: T) => void;
  onButton: () => void;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
};

function Card<T>({ element, onIcon, onButton, icon }: PropsCard<T>) {
  return (
    <View 
      className="w-full max-w-md rounded-2xl shadow-xl mb-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10,
      }}
    >
      <View className="py-3 bg-color1 rounded-t-2xl relative">
        <Text className="text-2xl font-bold text-white text-center">
        </Text>
            <TouchableOpacity 
              onPress={() => onIcon(element)} 
              style={{ 
                position: "absolute", 
                top: 10, 
                right: 16,
                padding: 4,
              }}
            >
              <FontAwesome name={icon} size={20} color="white" />
            </TouchableOpacity>
      </View>
      
      <View className="p-6 bg-fondo rounded-b-2xl">
        <ButtonDark text="Editar" onPress={onButton} />
      </View>
    </View>
  );
}
