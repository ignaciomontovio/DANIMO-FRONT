import { colors } from "@/stores/colors";
import { URL_BASE, URL_QUOTE } from "@/stores/consts";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";

import { Alert, Text, View } from "react-native";
import { Path, Svg } from "react-native-svg";


export default function QuoteCard( ) {

  const [quote, setQuote] = useState("No hay nadie menos afortunado que el hombre a quien la adversidad olvida, pues no tiene oportunidad de ponerse a prueba"); 
  const [author, setAuthor] = useState("Seneca"); 

  useEffect(() => {
    const getQuote = async () => {                   
      try {
        const response = await fetch(URL_BASE + URL_QUOTE , {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });

        if (!response.ok) {
          const errorText = await response.json();
          console.error("Error:", errorText.error);
          throw new Error(errorText.error);
        }
        const data = await response.json();
        setQuote(data.quote)
        setAuthor(data.author)
      } catch (error) {
        console.error("Error al registrar sueño:", error);
        Alert.alert("Error al registrar la emoción: " + error);
      }
    };
    getQuote();
  }, []);

  const gotoDetail = () => {
    router.push({ pathname: "/screensOnlyUser/detailQuote", params: { quote: quote, author: author } });
  };

  return (
    <View
        className="w-[160px] h-[264px] bg-color1 rounded-lg p-5 relative m-2 ml-10"
        style={{
            shadowColor: "#000",
            shadowOffset: { width: 8, height: 0 }, // solo a la derecha
            shadowOpacity: 0.4,
            shadowRadius: 10,
            elevation: 10, // para Android
        }}
        onTouchEnd={gotoDetail} 
    >
      {/* Título */}
      <Text className="uppercase font-bold text-fondo leading-[23px]">Una cita para ti </Text>

      {/* Comilla SVG */}
      <View className="pl-7">
        <Svg height={80} width={80} viewBox="0 0 330 307" fill={colors.color4}>
          <Path d="M302.258 176.221C320.678 176.221 329.889 185.432 329.889 203.853V278.764C329.889 297.185 320.678 306.395 302.258 306.395H231.031C212.61 306.395 203.399 297.185 203.399 278.764V203.853C203.399 160.871 207.902 123.415 216.908 91.4858C226.323 59.1472 244.539 30.902 271.556 6.75027C280.562 -1.02739 288.135 -2.05076 294.275 3.68014L321.906 29.4692C328.047 35.2001 326.614 42.1591 317.608 50.3461C303.69 62.6266 292.228 80.4334 283.223 103.766C274.626 126.69 270.328 150.842 270.328 176.221H302.258ZM99.629 176.221C118.05 176.221 127.26 185.432 127.26 203.853V278.764C127.26 297.185 118.05 306.395 99.629 306.395H28.402C9.98126 306.395 0.770874 297.185 0.770874 278.764V203.853C0.770874 160.871 5.27373 123.415 14.2794 91.4858C23.6945 59.1472 41.9106 30.902 68.9277 6.75027C77.9335 -1.02739 85.5064 -2.05076 91.6467 3.68014L119.278 29.4692C125.418 35.2001 123.985 42.1591 114.98 50.3461C101.062 62.6266 89.6 80.4334 80.5942 103.766C71.9979 126.69 67.6997 150.842 67.6997 176.221H99.629Z" />
        </Svg>
      </View>

      {/* Cuerpo del texto */}
      <Text className="text-[20px] font-extrabold text-oscuro leading-[23px] mt-5 absolute top-[30px] left-4">
        {quote.length > 60 ? quote.substring(0, 60) + "..." : quote}
      </Text>

      {/* Autor */}
      <View className="absolute bottom-3 left-5 flex-row items-center space-x-2">
        <Text className="font-bold text-fondo">
          - Por {author}{"\n"}
        </Text>
      </View>
    </View>
  );
}
