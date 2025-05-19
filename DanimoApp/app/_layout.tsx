// envuelve a toda la app
import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function RootLayout() {
  // Importa el CSS de NativeWind solo en el navegador
  if (Platform.OS === "web") {
    if (typeof document !== 'undefined') {
      import("../index.css");
    } 
  }
  // const [userType, setUserType] = useState<"user" | "pro" | null>(null);
  return <Stack />;
}
