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
  };

  return (
    <LinearGradient
      colors={["#D2A8D6", "#F4E1E6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full h-full"
    >
      <SafeAreaView className="flex-1">
        {/* <CircularSlider
            label="savings"
            labelColor="#005a58"
            knobColor="#005a58"
            progressColorFrom="#00bfbd"
            progressColorTo="#009c9a"
            progressSize={24}
            trackColor="#eeeeee"
            trackSize={24}
            data={['1€', '2€']} // Custom data array
            dataIndex={10}
            onChange={value => console.log(value)}
          /> */}
        <View className="mb-20">
          <ButtonDark text="Registrar" onPress={handleRegister} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
