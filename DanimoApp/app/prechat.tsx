import { ButtonDark } from '@/components/buttons';
import { useRouter } from 'expo-router';
import React from "react";
import { Image, Text, TouchableOpacity, View } from 'react-native';
// import Alegria from "@/assets/Emojis/emojis/mios/alegria.svg";
// import Ansiedad from "@/assets/Emojis/emojis/mios/ansiedad.svg";
// import Enojo from "@/assets/Emojis/emojis/mios/enojo.svg";
// import Miedo from "@/assets/Emojis/emojis/mios/miedo.svg";
// import Tristeza from "@/assets/Emojis/emojis/mios/tristeza.svg";

// import s1 from "@/assets/Emojis/emojis sueño/mios/sueño1.svg";
// import s2 from "@/assets/Emojis/emojis sueño/mios/sueño2.svg";
// import s3 from "@/assets/Emojis/emojis sueño/mios/sueño3.svg";
// import s4 from "@/assets/Emojis/emojis sueño/mios/sueño4.svg";
// import s5 from "@/assets/Emojis/emojis sueño/mios/sueño5.svg";





export default function Prechat() {
  const router = useRouter();
//   if (type === "Emocion") {
//     icons = [Alegria, Ansiedad, Enojo, Miedo, Tristeza];
//   } else {
//     icons = [s5, s4, s3, s2, s1];
//   }

  return (
    <View className="flex-1 bg-fondo items-center px-6 pt-12 space-y-5 pb-1">
      
      {/* Tarjeta de emoción */}
      <View className="w-full bg-color4 rounded-xl p-4 mb-4 shadow-lg items-center">
        <Image
          source={require('../assets/images/logo.png' )}
          className="w-12 h-12 mb-2"
          resizeMode="contain"
        />
        <Text className="text-lg font-bold text-oscuro">Bien</Text>
        <Text className="text-oscuro mt-2 text-center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </Text>
      </View>

      {/* Burbuja de charla */}
      <View className="w-full bg-color5 rounded-xl p-4 mb-4 shadow">
        <Text className="text-white font-semibold">
          ¿Tuviste algún sueño que me quieras contar?
        </Text>
        <TouchableOpacity onPress={() => router.push('/chat')}>
          <Text className="text-white font-bold text-right mt-2 underline">
            Charlar &gt;
          </Text>
        </TouchableOpacity>
      </View>

      {/* Imagen del personaje */}
      <Image
        source={require('../assets/images/bicho-transparent.png')}
        className="w-32 h-32 mb-6"
        resizeMode="contain"
      />

      {/* Botón volver */}
    <ButtonDark
        text="Volver"
        onPress={() => router.back()}
    />
    </View>
  );
}
