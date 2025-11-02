import ButtonCamera from "@/components/buttonCamera";
import { ButtonDark } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import { colors } from "@/stores/colors";
import { ALL_EMOTIONS, URL_ACTIVITY, URL_BASE, URL_EMOTION } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

// Mapeo de actividades y hobbies a iconos representativos
const ACTIVITY_ICONS: { [key: string]: keyof typeof FontAwesome.glyphMap } = {
  // Deportes y ejercicio
  'correr': 'heart',
  'caminar': 'street-view',
  'nadar': 'tint',
  'ciclismo': 'bicycle',
  'fútbol': 'futbol-o',
  'básquet': 'circle',
  'tenis': 'circle-o',
  'gimnasio': 'male',
  'yoga': 'leaf',
  'pilates': 'heart',
  'boxeo': 'hand-rock-o',
  'escalada': 'arrow-up',
  'deportes': 'trophy',
  'ejercicio': 'heartbeat',
  
  // Actividades creativas
  'leer': 'book',
  'escribir': 'pencil',
  'dibujar': 'paint-brush',
  'pintar': 'paint-brush',
  'fotografía': 'camera',
  'música': 'headphones',
  'musica': 'headphones',
  'tocar instrumento': 'music',
  'cantar': 'microphone',
  'bailar': 'music',
  'cocinar': 'cutlery',
  'jardineria': 'tree',
  'jardinería': 'tree',
  'jardin': 'tree',
  'jardín': 'tree',
  'limpiar': 'home',
  'limpieza': 'home',
  'ordenar': 'check-square',
  'compras': 'shopping-cart',
  'investigar': 'search',
  'resumir': 'file-text',
  'finanzas': 'money',
  'television': 'tv',
  'televisión': 'tv',
  'televios': 'tv',
  'tv': 'tv',
  
  // Actividades sociales
  'amigos': 'users',
  'amistades': 'users',
  'pareja': 'heart',
  'familia': 'home',
  'salir': 'glass',
  'cine': 'film',
  'teatro': 'eye',
  'concierto': 'music',
  'fiesta': 'birthday-cake',
  'reunión': 'comments',
  
  // Tecnología y entretenimiento
  'videojuegos': 'gamepad',
  'netflix': 'tv',
  'youtube': 'play',
  'redes sociales': 'share-alt',
  'internet': 'wifi',
  'podcast': 'headphones',
  
  // Trabajo y estudio
  'trabajar': 'briefcase',
  'estudiar': 'graduation-cap',
  'reunión laboral': 'users',
  'presentación': 'bar-chart',
  
  // Relajación y bienestar
  'meditar': 'leaf',
  'relajarse': 'bed',
  'masaje': 'hand-peace-o',
  'spa': 'heart',
  'dormir': 'moon-o',
  'descansar': 'bed',
  
  // Viajes y aventura
  'viajar': 'plane',
  'pasear': 'map-marker',
  'playa': 'sun-o',
  'montaña': 'arrow-up',
  'parque': 'tree',
  
  // Por defecto
  'default': 'star'
};

// Función para obtener el icono apropiado
const getActivityIcon = (activityName: string): keyof typeof FontAwesome.glyphMap => {
  const normalizedName = activityName.toLowerCase();
  
  // Buscar coincidencia exacta
  if (ACTIVITY_ICONS[normalizedName]) {
    return ACTIVITY_ICONS[normalizedName];
  }
  
  // Buscar coincidencia parcial
  for (const [key, icon] of Object.entries(ACTIVITY_ICONS)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return icon;
    }
  }
  
  // Icono por defecto
  return ACTIVITY_ICONS.default;
};

const PILL_STYLE = "pl-2 pr-3 py-2 rounded-r-full text-sm font-semibold mr-2 mb-2 flex-row space-x-1";
const ACTIVE_PILL_STYLE = "bg-color1 text-white";
const INACTIVE_PILL_STYLE = "bg-color5 text-oscuro";

export default function DetailEmotionScreen() {
  const [activities, setActivities] = useState<Record<string, boolean>>({});
  const [hobbies, setHobbies] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const token = useUserLogInStore((state) => state.token);
  const { value } = useLocalSearchParams<{ value: string }>();

  useEffect(() => {
    const fetchActivityTypes = async () => {
      try {
        const response = await fetch(URL_BASE + URL_ACTIVITY + "/types");

        if (!response.ok) {
          const errorText = await response.json();
          console.error("Error:", errorText.error);
          throw new Error(errorText.error);
        }

        const data = await response.json();
        const activityState: Record<string, boolean> = {};
        const hobbieState: Record<string, boolean> = {};

        data.forEach((item: { name: string; category: string }) => {
          if (item.category.toLowerCase() === "hobby") {
            hobbieState[item.name] = false;
          } else {
            activityState[item.name] = false;
          }
        });

        setActivities(activityState);
        setHobbies(hobbieState);
      } catch (error) {
        console.error("Error al cargar tipos de actividad:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityTypes();
  }, []);

  const toggle = (key: string, state: Record<string, boolean>, setState: (val: Record<string, boolean>) => void) => {
    setState({ ...state, [key]: !state[key] });
  };

  const PillContainer = ({
    title,
    list,
    setList,
  }: {
    title: string;
    list: Record<string, boolean>;
    setList: (val: Record<string, boolean>) => void;
  }) => (
    <View className="relative mb-10">
      <View
        className="absolute top-0 left-0 right-0 bottom-0 bg-fondo rounded-2xl"
        style={{
          opacity: 0.7,
          shadowColor: "#000",
          elevation: 10,
        }}
      />
      <View className="p-4 rounded-2xl">
        <Text className="text-2xl font-bold text-center text-oscuro mb-4">{title}</Text>
        <View className="flex-row flex-wrap justify-left">
          {Object.entries(list).map(([key, selected]) => (
            <TouchableOpacity
              key={key}
              className={`${PILL_STYLE} ${selected ? ACTIVE_PILL_STYLE : INACTIVE_PILL_STYLE}`}
              onPress={() => toggle(key, list, setList)}
            >
              <FontAwesome 
                name={getActivityIcon(key)} 
                size={20} 
                color={selected ? colors.fondo : colors.oscuro} 
              />
              <Text className={selected ? 'text-white' : 'text-oscuro'}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const submitEmotion = async (
                                isPredominant: boolean,
                                token: string | null,
                                activitiesToSend: string[]
                              ) => 
  {                   
    try {
      const response = await fetch(URL_BASE + URL_EMOTION + "/entry", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emotion: value, 
          isPredominant,
          activities: activitiesToSend,
        }),
      });

      if (!response.ok) {
          const errorText = await response.json();
          console.error("Error:", errorText.error);
          throw new Error(errorText.error);
        }

      console.log("Registro exitoso");
      router.push({ pathname: "/screensOnlyUser/prechat", params: { sleepEmotionNum: value, detailType: "Emotion", extraData: activitiesToSend  } });
    } catch (error) {
      console.error("Error al registrar emoción:", error);
      Alert.alert("Error al registrar la emoción");
    }
  };

  const handleRegister = async () => {
    
    const activitiesToSend = [
      ...Object.entries(activities)
      .filter(([_, selected]) => selected)
      .map(([name]) => name),
      ...Object.entries(hobbies)
      .filter(([_, selected]) => selected)
      .map(([name]) => name),
    ];
    console.log(activitiesToSend);
    console.log(ALL_EMOTIONS[Number(value) - 1]);
    

    if (activitiesToSend.length === 0) {
      Alert.alert("Selecciona al menos una actividad o hobbie");
      return;
    }
    
    
    try {

      
      const checkResponse = await fetch(URL_BASE + URL_EMOTION + "/predominant", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
      });
      
      if (!checkResponse.ok) {
        const errorText = await checkResponse.text();

        
        // Manejo específico para errores del servidor
        if (checkResponse.status >= 500) {
          throw new Error('El servidor no está disponible en este momento.');
        } else if (checkResponse.status === 401) {
          throw new Error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
        } else {
          throw new Error(`Error del servidor (${checkResponse.status})`);
        }
      }
      
      const responseText = await checkResponse.text();
      
      let alreadyRegistered;
      try {
        alreadyRegistered = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error('El servidor está experimentando problemas.');
      }

      if (alreadyRegistered.emotion !== null) {        
        if(alreadyRegistered.emotion.emotionName === ALL_EMOTIONS[Number(value) - 1]) {
          console.log("Ya registraste la misma emoción hoy");
          submitEmotion(true, token, activitiesToSend);
          return;
        }
       
        // si ya regitro preguntar si es la misma
        Alert.alert(
          "Registro de emoción",
          "Ya registraste la emoción " + 
          alreadyRegistered.emotion.emotionName + 
          " hoy como principal, ¿quieres cambiarla por esta?",
          [
            {
              text: "Cancelar",
              onPress: () => submitEmotion(false, token, activitiesToSend),
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => submitEmotion(true, token, activitiesToSend),
            },
          ],
          { cancelable: true }
        );
      } else {
        submitEmotion(true, token, activitiesToSend);
      }
    } catch (error) {
      console.error("Error al consultar emoción predominante:", error);
      
      const errorMessage = error instanceof Error ? error.message : 'Error al consultar emoción previa';
      
      Alert.alert(
        "Error de conexión", 
        errorMessage,
        [
          { text: "Continuar sin consultar", onPress: () => submitEmotion(true, token, activitiesToSend) },
          { text: "Cancelar", style: "cancel" }
        ]
      );
    }
  };

  return (
    <LinearGradient
      colors={[colors.color5, colors.fondo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full h-full"
    >
      <HeaderGoBack text="Emoción" onPress={() => router.replace("/tabs/home")} />
      <SafeAreaView className="flex-1">
        <ScrollView 
          className="flex-1 px-6 pt-10" 
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <Text className="text-center text-lg text-oscuro">Cargando datos...</Text>
          ) : (
            <>
              {PillContainer({
                title: "Actividades",
                list: activities,
                setList: setActivities,
              })}

              {PillContainer({
                title: "Hobbies",
                list: hobbies,
                setList: setHobbies,
              })}

              <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 20, paddingHorizontal: 8 }}>
                <ButtonCamera onImageTaken={(uri) => console.log("Imagen tomada:", uri)} />
                <View style={{ marginTop: 16, width: '100%', maxWidth: 300, paddingHorizontal: 16 }}>
                  <ButtonDark text="Registrar" onPress={handleRegister} />
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
