import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Main } from "./components/Main";

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {/* StatusBar no es react native*/}
        <StatusBar style="auto" />
        <Main />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    // paddingTop: Constant.statusBarHeight, // para que no se vaya de la pantalla pero se ve feo
  },
});
