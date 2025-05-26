import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ButtonAccept } from "../../components/buttons";
import Input from "../../components/input";
import { useUserStore } from "../../stores/userType";
const handleLogin = (
  userType: string | null,
  setUserLogIn: { (userLogIn: true | false): void; (arg0: boolean): void }
) => {
  //  validar el login }
  setUserLogIn(true);
};
export default function LoginRegisterScreen() {
  const [tab, setTab] = useState<"login" | "signup">("signup");
  const userType: string | null = useUserStore(
    (state: { userType: string | null }) => state.userType
  );
  const UserLogIn = useUserLogInStore((state) => state.userLogIn);
  const setUserLogIn = useUserLogInStore(
    (state: { setUserLogIn: (userLogIn: true | false) => void }) =>
      state.setUserLogIn
  );

  useEffect(() => {
    if (UserLogIn) {
      if (userType === "profesional") {
        router.push("/profesional/home");
      } else {
        router.push("/tabs/home");
      }
    }
  }, [UserLogIn, userType]);

  return (
    <SafeAreaProvider>
      <LinearGradient
                colors={["#D2A8D6", "#F4E1E6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="w-full h-full"
      >
      <StatusBar />
      <View className="flex-1 justify-center items-center px-4 ">
        <View
          className="w-full max-w-md rounded-2xl shadow-xl"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 10, // Para Android
          }}
        >
          <View className="py-6 bg-color1 rounded-t-2xl ">
            <Text className="text-3xl font-bold text-white text-center">
              Bienvenido a Danimo
            </Text>
          </View>

          <View className="p-6 bg-fondo rounded-b-2xl">
            <View className="flex-row justify-center mb-6">
              <TouchableOpacity
                onPress={() => setTab("signup")}
                className={`px-4 py-2 rounded-l-md ${
                  tab === "signup"
                    ? "bg-color5 text-white"
                    : "bg-gray-200 text-oscuro"
                }`}
              >
                <Text className="font-semibold">Sign Up</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTab("login")}
                className={`px-4 py-2 rounded-r-md ${
                  tab === "login"
                    ? "bg-color5 text-white"
                    : "bg-gray-200 text-oscuro"
                }`}
              >
                <Text className="font-semibold">Login</Text>
              </TouchableOpacity>
            </View>
            <Input
              icon="envelope"
              placeholder="Email"
              keyboardType="email-address"
              className="border-solid border-oscuro text-oscuro"
            />
            <Input
              icon="lock"
              placeholder="Contraseña"
              secureTextEntry
              className="border-solid border-oscuro text-oscuro"
            />
            
            {tab === "signup" ? (
              <>
                {userType === "profesional" && (
                  <Input
                    icon="info"
                    placeholder="Matrícula profesional"
                    keyboardType="default"
                  />
                )}
                <ButtonAccept text="Sign Up" onPress={() => setTab("login")} />
              </>
            ) : (
              <>
                <Text
                  className=" text-oscuro text-right mb-2 underline"
                  onPress={() => router.push("/auth/ForgotPassword")}
                >
                  Olvido su contraseña
                </Text>
                <ButtonAccept
                  text="Login"
                  onPress={() => handleLogin(userType, setUserLogIn)}
                />
              </>
            )}
            <Text className="text-center text-oscuro mt-6 mb-4">
              Continuar con
            </Text>
            <View className="flex-row justify-center space-x-4">
              <SocialButton bg="bg-red-600" icon="google" text="Google" />
            </View>
          </View>
        </View>
      </View>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

type SocialButtonProps = {
  bg: string;
  icon: React.ComponentProps<typeof FontAwesome>["name"];
  text: string;
};

function SocialButton({ bg, icon, text }: SocialButtonProps) {
  return (
    <TouchableOpacity
      className={`${bg} px-4 py-2 rounded-md flex-row items-center`}
    >
      <FontAwesome name={icon} size={16} color="white" />
      <Text className="text-white ml-2">{text}</Text>
    </TouchableOpacity>
  );
}
