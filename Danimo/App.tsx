import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableHighlight,
  TouchableOpacity,
  Pressable,
} from "react-native";

import icon from "./assets/icon.png";
import { useState } from "react";

export default function App() {
  const [timesPressed, setTimesPressed] = useState(0);

  let textLog = "";
  if (timesPressed > 1) {
    textLog = timesPressed + "x onPress";
  } else if (timesPressed > 0) {
    textLog = "onPress";
  }
  return (
    <View style={styles.container}>
      <Text style={{ color: "black" }}>
        {" "}
        Open up App.tsx to start working on your app!
      </Text>
      {/* StatusBar no es react native*/}
      <StatusBar style="auto" />
      <Image source={icon} style={styles.icon1} />
      <Image source={icon} style={styles.icon2} />
      <Image source={icon} style={styles.icon1} />
      <Image source={icon} style={styles.icon2} />
      <Button title="Pulsa aqui" onPress={() => alert("hola")} />
      {/* Button no tiene style */}
      <TouchableHighlight
        underlayColor={"#09f"}
        onPress={() => alert("hola")}
        style={{ width: 200, height: 100, backgroundColor: "red" }}
      >
        <Text style={{ color: "black" }}> Pulsa aqui</Text>
      </TouchableHighlight>
      <TouchableOpacity
        // underlayColor={''} NO HACE FALTA CAMBIA OPACIDAD SOLA
        onPress={() => alert("hola")}
        style={{ width: 200, height: 100, backgroundColor: "black" }}
      >
        <Text style={{ color: "white" }}> Pulsa aqui</Text>
      </TouchableOpacity>
      {/* Pressable es muucho mas personalizable */}
      <Pressable
        onPress={() => {
          setTimesPressed((current) => current + 1);
        }}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
          },
          styles.wrapperCustom,
        ]}
      >
        {({ pressed }) => (
          <Text style={styles.text}>{pressed ? "Pressed!" : "Press Me"}</Text>
        )}
      </Pressable>
      <View style={styles.logBox}>
        <Text testID="pressable_press_console">{textLog}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  icon1: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  icon2: {
    width: 300,
    height: 100,
    resizeMode: "repeat",
  },
  wrapperCustom: {
    borderRadius: 8,
    padding: 6,
  },
  text: {
    fontSize: 16,
  },
  logBox: {
    padding: 20,
    margin: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#f0f0f0",
    backgroundColor: "#f9f9f9",
  },
});
