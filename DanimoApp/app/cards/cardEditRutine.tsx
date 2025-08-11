import { Rutine, RutineTypes } from "@/app/cards/cardRutine";
import { ButtonDark, ButtonDark_small } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import { ShowInfo_edit } from "@/components/showInfo";
import { colors } from "@/stores/colors";
import { URL_BASE, URL_RUTINE } from "@/stores/consts";
import { useEmotionStore } from "@/stores/emotions";
import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";

import {
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Tipo para los pasos
interface Paso {
  id: string;
  titulo: string;
  descripcion: string;
}

export default function CardRutineEdit() {
  const { rutineParam } = useLocalSearchParams();
  const token = useUserLogInStore((state) => state.token);
  const [pasos, setPasos] = useState<Paso[]>([]);
  const emotions = useEmotionStore((state) => state.emotions);
  
  // Determinar si estamos en modo edición
  const editMode = !!rutineParam;
  
  // Guardar el nombre original para updates
  const [originalName, setOriginalName] = useState<string>("");

  const [rutine, setRutine] = useState<Rutine>(() => {
    const emptyRutine: Rutine = {
      body: "",
      createdBy: "",
      emotion: [""],
      id: "",
      name: "",
      type: "",
    };
    if (rutineParam) {
      if (typeof rutineParam === "string") {
        try {
          const parsedRutine = JSON.parse(rutineParam) as Rutine;
          
          // Si es una rutina de pasos, intentar cargar los pasos desde el body
          if (parsedRutine.type === "Pasos" && parsedRutine.body) {
            try {
              const pasosFromBody = JSON.parse(parsedRutine.body);
              if (Array.isArray(pasosFromBody)) {
                setPasos(pasosFromBody);
              }
            } catch (error) {
              console.error("Error parseando pasos del body:", error);
            }
          }
          
          // Guardar el nombre original
          setOriginalName(parsedRutine.name);
          
          return parsedRutine;
        } catch (error) {
          console.error("Error parsing rutineParam:", error);
          return emptyRutine;
        }
      }
    }
    return emptyRutine;
  });

  // console.log("Rutina cargada:", rutine);
  // console.log("Pasos:", pasos);

  const save = async () => {
    // Validar que si es tipo "Pasos" tenga al menos un paso
    if (rutine.type === "Pasos" && pasos.length === 0) {
      Alert.alert("Error", "Debe agregar al menos un paso para guardar la rutina.");
      return;
    }

    // Validar campos obligatorios
    if (!rutine.name.trim()) {
      Alert.alert("Error", "El nombre de la rutina es obligatorio.");
      return;
    }

    if (!rutine.type) {
      Alert.alert("Error", "Debe seleccionar un tipo de rutina.");
      return;
    }

    // console.log("Rutina guardada:", rutine);
    // console.log("Pasos guardados:", pasos);
    
    const url_edit = editMode ? "/update" : "/create";
    let bodyJson = "";
    let rutineBody = "";

    // Si es tipo "Pasos", serializar los pasos en el body
    if (rutine.type === "Pasos") {
      rutineBody = JSON.stringify(pasos);
    } else {
      rutineBody = rutine.body;
    }

    if (editMode) {
      // Convertir emotion string a número para el servidor
      let emotionNumber = [1]; // Default
      
      bodyJson = JSON.stringify({ 
        body: rutineBody,
        name: rutine.name,
        type: rutine.type,
        emotion: emotionNumber,
        currentName: originalName,
      });
    } else {
      let emotionNumber = [1]; // Default
      // console.log("EMOCIONES: ", rutine.emotion);
      emotionNumber = rutine.emotion.map((e: string) => emotions.find(em => em.name === e)?.number ?? 1)
      bodyJson = JSON.stringify({ 
        body: rutineBody,
        name: rutine.name,
        emotion: emotionNumber,
        type: rutine.type,
      });
    }

    try {

      const response = await fetch(URL_BASE + URL_RUTINE + url_edit, {
        method: editMode ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: bodyJson,
      });

      if (!response.ok) {
        const errorText = await response.json();
        console.error("Error del servidor:", errorText);
        throw new Error(errorText.error || "Error desconocido del servidor");
      }

      const result = await response.json();
      
      Alert.alert("Éxito", "Rutina guardada correctamente", [
        { text: "OK", onPress: () => router.replace("/profesional/rutines") }
      ]);

    } catch (error) {
      console.error("Error al guardar rutina:", error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      Alert.alert("Error", `No se pudo guardar la rutina: ${errorMessage}`);
    } 
  };

  const addPaso = () => {
    const nuevoPaso: Paso = {
      id: Date.now().toString(),
      titulo: "Paso " + (pasos.length + 1).toString(),
      descripcion: ""
    };
    setPasos([...pasos, nuevoPaso]);
  };

  const editPaso = (id: string, field: keyof Paso, value: string) => {
    setPasos(pasos.map(paso => 
      paso.id === id ? { ...paso, [field]: value } : paso
    ));
  };

  const deletePaso = (id: string) => {
    setPasos(pasos.filter(paso => paso.id !== id));
  };

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
            <View className="py-3 rounded-t-2xl" style={{ backgroundColor: colors.color1 }}>
              <TextInput
                className="text-2xl font-bold text-white text-center"
                value={rutine.name || ""}
                onChangeText={(text) => {
                  // console.log("Cambiando nombre a:", text);
                  setRutine({ ...rutine, name: text });
                }}
                placeholder="Título"
                placeholderTextColor="rgba(255,255,255,0.7)"
                editable={true}
                selectTextOnFocus={true}
              />
            </View>

            <View className="p-6 rounded-b-2xl" style={{ backgroundColor: colors.fondo }}>
              {/* Selector de tipo */}
              <ShowInfo_edit 
                icon="edit"
                text={rutine.type || ""}
                onChangeText={(text) =>
                  setRutine({ ...rutine, type: (RutineTypes as Rutine["type"][]).includes(text as Rutine["type"]) ? (text as Rutine["type"]) : "" })
                }
                placeholder="tipo"
                type="picklist"
                picklistOptions={RutineTypes}
              />
              {/* Selector de EMOCIONES */}

              {rutine.emotion.map((emo, idx) => (
                <ShowInfo_edit
                  key={idx}
                  icon="smile-o"
                  text={
                    emotions.find((e) => e.number.toString() === emo)?.name || emo
                  }
                  onChangeText={(text) => {
                    const updated = [...rutine.emotion];
                    updated[idx] = text; // Guardamos el nombre directamente
                    setRutine({ ...rutine, emotion: updated });
                  }}
                  placeholder={`Emoción ${idx + 1}`}
                  type="picklist"
                  picklistOptions={emotions.map((e) => e.name)}
                />
              ))}

              {/* Botón para agregar nueva emoción */}
              <ButtonDark_small
                text="+ Agregar emoción"
                onPress={() => {
                  setRutine({ ...rutine, emotion: [...rutine.emotion, ""] });
                }}
              />
                

              {/* <ShowInfo_edit
                icon="smile-o"
                text={
                  // Siempre mostrar el nombre de la emoción
                  typeof rutine.emotion === "string" 
                    ? rutine.emotion
                    : emotions.find((e) => e.number.toString() === rutine.emotion)?.name || ""
                }
                onChangeText={(text) => {
                  // Guardar directamente el nombre de la emoción como string
                  setRutine({ ...rutine, emotion: text });
                }}
                placeholder="Emoción asociada"
                type="picklist"
                picklistOptions={emotions.map((e) => e.name)}
              /> */}
              {/* Contenido */}
              {rutine.type === "Pasos" ? (
                <View className="mt-4">
                  {/* Lista de pasos */}
                  {pasos.map((paso, index) => (
                    <View 
                      key={paso.id}
                      className="mb-3 p-4 rounded-xl"
                      style={{ backgroundColor: colors.color1 }}
                    >
                      <View className="flex-row items-center justify-between mb-2">
                        <TextInput
                          className="text-white font-bold text-lg flex-1"
                          value={paso.titulo}
                          onChangeText={(text) => editPaso(paso.id, "titulo", text)}
                          placeholder={`Paso ${index + 1}`}
                          placeholderTextColor="rgba(255,255,255,0.7)"
                        />
                        <TouchableOpacity 
                          onPress={() => deletePaso(paso.id)}
                          className="ml-2"
                        >
                          <FontAwesome name="trash" size={16} color="white" />
                        </TouchableOpacity>
                      </View>
                      <TextInput
                        className="text-white text-base"
                        value={paso.descripcion}
                        onChangeText={(text) => editPaso(paso.id, "descripcion", text)}
                        placeholder="Descripción del paso..."
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        multiline
                        numberOfLines={3}
                      />
                    </View>
                  ))}

                  {/* Botón Agregar Paso */}
                  <View className="mb-4">
                    <ButtonDark text="Agregar Paso" onPress={addPaso} />
                  </View>
                </View>
              ) : (
                <View className="mt-4">
                  <ShowInfo_edit 
                    icon="edit"
                    text={rutine.body || ""}
                    onChangeText={(text) =>
                      setRutine({ ...rutine, body: text })
                    }
                    placeholder="Contenido"
                    type="text"
                  />
                </View>
              )}
              
              <ButtonDark text="Guardar" onPress={save} />
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}