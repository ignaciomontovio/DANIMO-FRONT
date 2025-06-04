import HeaderGoBack from "@/components/headerGoBack";
import { router } from 'expo-router';
import LinearGradient from "react-native-linear-gradient";
export default function EmergencyContact() {
  return (
    <LinearGradient
              colors={["#D2A8D6", "#F4E1E6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              className="w-full h-full"
    >
    <HeaderGoBack
            text="Contactos"
            onPress={() => router.push("/tabs/home")}
            />
    </LinearGradient>
  );
}
