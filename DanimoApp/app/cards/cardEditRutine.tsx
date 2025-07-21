import { Rutine, RutineTypes } from "@/app/cards/cardRutine";
import { ButtonDark } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import { ShowInfo_edit } from "@/components/showInfo";
import { colors } from "@/stores/colors";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  TextInput,
  View
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";

// 
export default function CardRutineEdit() {
  const { rutineParam } = useLocalSearchParams();

  // const rutineParam: Rutine = {
  //   title: title?.toString() ?? "",
  //   type: (RutineTypes.includes(type?.toString() ?? "") ? (type?.toString() as Rutine["type"]) : ""),
  //   content: content?.toString() ?? "",
  //   id: id?.toString() ?? "",
  //   createdBy: createdBy?.toString() ?? "",
  //   emotion: emotion?.toString() ?? "",
  // };

  // pasos : [{
  // "titulo_p1":"algo",
  // "titulo_p2":"otro"
  // }]
  const [rutine, setRutine] = useState<Rutine>(() => {
    const emptyRutine: Rutine = {
      body: "",
      createdBy:  "",
      emotion:  "",
      id:  "",
      title:  "",
      type:  "",
    };
    if (rutineParam ) {
      if (typeof rutineParam === "string") {
        try {
          
          return JSON.parse(rutineParam) as Rutine;
        } catch (error) {
          console.error("Error parsing rutineParam:", error);
          return emptyRutine;
        }
      }
      
    }
    return emptyRutine;
  });
  console.log("Rutina cargada:", rutine);
  
  const save = () => {
    // TODO: lógica de guardado con validación si es necesario
    console.log("Rutina guardada:", rutine);
    router.replace("/profesional/rutines");
  };

  const addPaso= () => {
    // ir hacia cardEditPaso
  }

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={[colors.color5, colors.fondo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full h-full"
      >
        <HeaderGoBack
          text="Editar Rutina"
          onPress={() => router.push("/profesional/rutines")}
        />

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
                value={rutine.title || ""}
                onChangeText={(text) =>
                  setRutine({ ...rutine, title: text })
                }
                placeholder={"Título"}
                placeholderTextColor="rgba(255,255,255,0.7)"
              />
            </View>

            <View className="p-6 bg-fondo rounded-b-2xl">
              {/* Selector de tipo */}
              <ShowInfo_edit 
                icon={"edit"}
                text={rutine.type|| ""}
                onChangeText={(text) =>
                  setRutine({ ...rutine, type: (RutineTypes as Rutine["type"][]).includes(text as Rutine["type"]) ? (text as Rutine["type"]) : "" })
                }
                placeholder={"tipo"}
                type={"picklist"}
                picklistOptions={RutineTypes}
              />
              {/*Contenido */}
              { rutine.type === "Pasos" ? 
                ( 
                  <ButtonDark text="Agregar Paso" onPress={addPaso} />
                ) 
                : (
                    <ShowInfo_edit 
                    icon={"edit"}
                    text={rutine.body || ""}
                    onChangeText={(text) =>
                      setRutine({ ...rutine, body: text })
                    }
                    placeholder={"Contenido"}
                    type={"text"}
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
