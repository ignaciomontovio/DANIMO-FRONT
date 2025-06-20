import { ButtonDark } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import { ShowInfo_edit } from "@/components/showInfo";
import { colors } from "@/stores/colors";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, TextInput, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";

type Props<T extends Record<string, string>> = {
  screenTitle: string;
  goBackTo: string;
  createFunct: (data: T) => Promise<void>;
  updateFunct: (data: T, originalData: T) => Promise<void>;
  editing?: string;
};

export default function EditCardFromList<T extends Record<string, string>>({
        screenTitle,
        goBackTo,
        createFunct,
        updateFunct,
        editing,
        }: Props<T>) {
  const params = useLocalSearchParams();
  const isEditing = editing === "edit";
  
  // ver de hacer mas lindo / legible
  const initialData = Object.keys(params).filter((key) => key !== "editing").reduce((acc, key) => {
    const value = params[key];
    if (typeof value === "string") {
      acc[key] = value;
    } else if (Array.isArray(value)) {
      acc[key] = value[0];
    }
    return acc;
  }, {} as Record<string, string>) as T;
  
  const [formData, setFormData] = useState<T>(initialData);

  const handleChange = (key: keyof T, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const save = async () => {
    try {
      if (isEditing) {
        await updateFunct(formData, initialData);
      } else {
        console.log("initialData: ",initialData);
        
        await createFunct(formData);
      }
      router.replace(goBackTo as any);
    } catch (error) {
      console.error("Error al guardar:", error);
      Alert.alert("Error", error instanceof Error ? error.message : String(error));
    }
  };

  const keys = Object.keys(formData) as (keyof T)[];

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={[colors.color5, colors.fondo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full h-full"
      >
        <HeaderGoBack text={screenTitle} onPress={() => router.push(goBackTo as any)} />
        <ScrollView className="flex-1 px-5 py-5">
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
            <View className="py-3 bg-color1 rounded-t-2xl">
              <TextInput
                className="text-2xl font-bold text-white text-center"
                value={formData[keys[0]]}
                onChangeText={(text) => handleChange(keys[0], text)}
              />
            </View>

            <View className="p-6 bg-fondo rounded-b-2xl">
              <ShowInfo_edit
                  icon="pencil"
                  text={formData[keys[1]]}
                  onChangeText={(text) => handleChange(keys[1], text)}
                />
                <ShowInfo_edit
                  icon="pencil"
                  text={formData[keys[2]]}
                  onChangeText={(text) => handleChange(keys[2], text)}
                />

                 {keys[3] && (
                <ShowInfo_edit
                  icon="pencil"
                  text={formData[keys[3]]}
                  onChangeText={(text) => handleChange(keys[3], text)}
                />
              )}
              <ButtonDark text="Guardar" onPress={save} />
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}
