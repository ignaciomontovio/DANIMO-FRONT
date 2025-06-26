import { ButtonDark } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import { ShowInfo_edit } from "@/components/showInfo";
import { colors } from "@/stores/colors";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, TextInput, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";

// TIPOS GENÉRICOS LOCALES (para evitar conflictos)
interface FieldConfig {
  key: string;
  label: string;
  icon: string;
  placeholder?: string;
}

interface EditConfig {
  fields: FieldConfig[];
  titleField: string;
}

// TIPOS GENÉRICOS
type Props<T extends Record<string, string | undefined>> = {
  screenTitle: string;
  goBackTo: string;
  createFunct: (data: T) => Promise<void>;
  updateFunct: (data: T, originalData: T) => Promise<void>;
  editConfig: any; // Cambiar a any temporalmente para evitar conflictos
  editing?: string;
};

// COMPONENTE PRINCIPAL GENÉRICO
export default function EditCardFromList<T extends Record<string, string | undefined>>({
  screenTitle,
  goBackTo,
  createFunct,
  updateFunct,
  editConfig,
  editing,
}: Props<T>) {
  const params = useLocalSearchParams();
  const isEditing = editing === "edit";
  
  // Extraer datos iniciales de los parámetros
  const initialData = Object.keys(params)
    .filter((key) => key !== "editing")
    .reduce((acc, key) => {
      const value = params[key];
      if (typeof value === "string") {
        acc[key] = value;
      } else if (Array.isArray(value)) {
        acc[key] = value[0];
      }
      return acc;
    }, {} as Record<string, string>) as T;
  
  const [formData, setFormData] = useState<T>(initialData);

  // Función para obtener el placeholder del campo título
  const getTitlePlaceholder = () => {
    return editConfig.fields.find((field: { key: any; }) => field.key === editConfig.titleField)?.placeholder || "Ingrese nombre...";
  };

  const handleChange = (key: keyof T, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const save = async () => {
    console.log("-------------");
    console.log("formData: ", formData);
    console.log("initialData: ", initialData);
    console.log("-------------");
    
    try {
      if (isEditing) {
        await updateFunct(formData, initialData);
      } else {
        await createFunct(formData);
      }
      router.replace(goBackTo as any);
    } catch (error) {
      console.error("Error al guardar:", error);
      Alert.alert("Error", error instanceof Error ? error.message : String(error));
    }
  };

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
                value={formData[editConfig.titleField as keyof T] || ""}
                onChangeText={(text) => handleChange(editConfig.titleField as keyof T, text)}
                placeholder={getTitlePlaceholder()}
                placeholderTextColor="rgba(255,255,255,0.7)"
              />
            </View>
            <View className="p-6 bg-fondo rounded-b-2xl">
              {editConfig.fields
                .filter((field: { key: any; }) => field.key !== editConfig.titleField)
                .map((field: { key: keyof T | React.Key | null | undefined; icon: any; placeholder: string | undefined; label: string | undefined; type: "text" | "phone" | "date"; }) => (
                  <ShowInfo_edit
                    key={String(field.key)}
                    icon={field.icon as any}
                    text={formData[field.key as keyof T] || ""}
                    onChangeText={(text) => handleChange(field.key as keyof T, text)}
                    placeholder={field.placeholder}
                    label={field.label}
                    type={field.type || "text"} // Asignar tipo por defecto
                  />
                ))}
              <ButtonDark text="Guardar" onPress={save} />
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}