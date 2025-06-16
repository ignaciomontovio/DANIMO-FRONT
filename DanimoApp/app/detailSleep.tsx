import { ButtonDark } from "@/components/buttons";
import React from "react";
import { SafeAreaView, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default function DetailSleepScreen() {

  const submitSleep = async () => 
  {                   
    console.log("submitSleep");
  };

  const handleRegister = async () => {
    console.log("handleRegister");
    console.log("sleepTime");
    submitSleep()
  };

  return (
    <LinearGradient
      colors={["#D2A8D6", "#F4E1E6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full h-full"
    >
      <SafeAreaView className="flex-1">
        {/* <CircularSlider onChange={value => console.log(value)} /> */}
        <View className="mb-20">
          <ButtonDark text="Registrar" onPress={handleRegister} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
