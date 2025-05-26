import ButtonCamera from "@/components/buttonCamera";
import { ButtonDark } from "@/components/buttons";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const PILL_STYLE = "px-3 py-2 rounded-r-full text-sm font-semibold mr-2 mb-2 flex-row space-x-2";
const ACTIVE_PILL_STYLE = "bg-color1 text-white";
const INACTIVE_PILL_STYLE = "bg-color5 text-oscuro";

export default function DetailEmotionScreen() {
  const [activities, setActivities] = useState<Record<string, boolean>>({});
  const [hobbies, setHobbies] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula una llamada al backend con 1 segundo de retraso
    setTimeout(() => {
      const fetchedActivities = ["Trabajo", "Gym", "Facultad", "Familia", "Amigos", "Pareja", "Mascota", "Estudio","Hogar", "Otro"];
      const fetchedHobbies = ["Deporte", "Lectura", "Videos", "Música", "Arte", "Cine", "Juegos", "Viajes", "Otro"];

      // Inicializamos todos como false
      const activityState: Record<string, boolean> = {};
      fetchedActivities.forEach((item) => (activityState[item] = false));

      const hobbieState: Record<string, boolean> = {};
      fetchedHobbies.forEach((item) => (hobbieState[item] = false));

      setActivities(activityState);
      setHobbies(hobbieState);
      setLoading(false);
    }, 1000);
  }, []);

  const toggle = (key: string, state: Record<string, boolean>, setState: (val: Record<string, boolean>) => void) => {
    setState({ ...state, [key]: !state[key] });
  };
    type sqare_pills_container_props = {
    title: string;
    list: Record<string, boolean>;
    setList: (val: Record<string, boolean>) => void;
  };
  function sqare_pills_container({title,list,setList}:sqare_pills_container_props) {
    return (
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
                <FontAwesome name="tag" size={20} color="#595154" />
                <Text>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
      </View>
    </View>
    )
  }

  return (
    <LinearGradient
      colors={["#D2A8D6", "#F4E1E6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full h-full"
    >
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-6 pt-10 pb-20">
          {loading ? (
            <Text className="text-center text-lg text-oscuro">Cargando datos...</Text>
          ) : (
            <>
                {/* Contenido de Actividades */}
                {sqare_pills_container({
                  title: "Actividades",
                  list: activities,
                  setList: setActivities
                })}

                {/* Contenido de Hobbies */}
                {sqare_pills_container({
                  title: "Hobbies",
                  list: hobbies,
                  setList: setHobbies
                })}

              {/* Botones */}
              <View className="">
                <ButtonCamera onImageTaken={(uri) => console.log("Imagen tomada:", uri)} />
                <ButtonDark text="Registrar" onPress={() => router.push("/detailEmotion")} />
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );

}
