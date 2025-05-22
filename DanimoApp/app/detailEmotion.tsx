import ButtonCamera from "@/components/buttonCamera";
import Checkbox from "expo-checkbox"; // Asegurate de tener instalado `expo-checkbox`
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
export default function DetailEmotionScreen() {
  // get data from server
  const [activities, setActivities] = useState({
    "trabajo": false,
    "estudio": false,
    "hobbie": false,
    "tareas del Hogar": false,
  });

  const [hobbies, setHobbies] = useState({
    "deporte": false,
    "lectura": false,
    "multimedia": false,
    "relajamiento": false,
  });

  const toggleActivity = (key: string) => {
    setActivities({ ...activities, [key]: !activities[key] });
  };

  const toggleHobbie = (key: string) => {
    setHobbies({ ...hobbies, [key]: !hobbies[key] });
  };

  return (
    <ScrollView className="flex-1 bg-fondo p-4">
      <Text className="text-2xl font-bold mb-4 text-oscuro">Actividades que hiciste</Text>

      <View className="bg-color4 p-4 rounded-xl mb-4">
        {Object.entries(activities).map(([key, value]) => (
          <View key={key} className="flex-row items-center mb-2">
            <Checkbox
              value={value}
              onValueChange={() => toggleActivity(key)}
              color={value ? "#f7a1b2" : undefined}
            />
            <Text className="ml-2 capitalize text-base">{key}</Text>
          </View>
        ))}
      </View>

      <Text className="text-2xl font-bold mb-2 text-oscuro">Hobbie</Text>
      <View className="bg-color4 p-4 rounded-xl mb-4">
        {Object.entries(hobbies).map(([key, value]) => (
          <View key={key} className="flex-row items-center mb-2">
            <Checkbox
              value={value}
              onValueChange={() => toggleHobbie(key)}
              color={value ? "#f7a1b2" : undefined}
            />
            <Text className={"ml-2 capitalize text-base"}> {key} </Text>
          </View>
        ))}
      </View>
      {/* mejorar tema botones y hacerlo genericos */}

      <ButtonCamera onImageTaken={(uri) => console.log("Imagen tomada:", uri)} />

      <TouchableOpacity className="bg-color1 py-3 rounded-lg mb-4">
        <Text className="text-white text-center font-bold text-xl">Registrar</Text>
      </TouchableOpacity>

      <TouchableOpacity className="bg-color5 py-3 rounded-lg">
        <Text className="text-white text-center font-bold text-xl">Hablar con DANI</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
