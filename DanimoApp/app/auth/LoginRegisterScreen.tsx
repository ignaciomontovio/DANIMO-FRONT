import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ButtonAccept } from "../../components/buttons";
import Input from "../../components/input";
import { useUserStore } from "../../stores/userType";
const handleLogin = (userType: string | null, setUserLogIn: { (userLogIn: true | false): void; (arg0: boolean): void; }) => {
    //  validar el login }
    setUserLogIn(true);
  };
export default function LoginRegisterScreen() {
  const [tab, setTab] = useState<"login" | "signup">("signup");
  const userType: string | null = useUserStore((state: { userType: string | null }) => state.userType);
  const UserLogIn = useUserLogInStore(state => state.userLogIn);
  const setUserLogIn = useUserLogInStore((state: { setUserLogIn: (userLogIn: true | false) => void }) => state.setUserLogIn);

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
      <StatusBar />
      <View className="flex-1 justify-center items-center px-4">
        <View className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
          
          <View className="py-6 bg-color1">
            <Text className="text-3xl font-bold text-white text-center">Bienvenido a Danimo</Text>
          </View>


          <View className="p-6 bg-fondo">
            <View className="flex-row justify-center mb-6">
              <TouchableOpacity
                onPress={() => setTab("signup")}
                className={`px-4 py-2 rounded-l-md ${
                  tab === "signup" ? "bg-color5 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                <Text className="font-semibold">Sign Up</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTab("login")}
                className={`px-4 py-2 rounded-r-md ${
                  tab === "login" ? "bg-color5 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                <Text className="font-semibold">Login</Text>
              </TouchableOpacity>
            </View>
              <Input icon="envelope" placeholder="Email" keyboardType="email-address" />
              <Input icon="lock" placeholder="Password" secureTextEntry />
            {tab === "signup" ? (  
              <>        
                {userType === "profesional" && ( 
                  <Input icon="info" placeholder="Matrícula profesional" keyboardType="default" />
                )}
                <ButtonAccept text="Sign Up" onPress={()=>setTab("login")} />
              </>
            ) : (
                <ButtonAccept text="Login" onPress={() => handleLogin(userType,setUserLogIn)}/>
            )}
            <Text className="text-center text-gray-600 mt-6 mb-4">Or continue with</Text>
            <View className="flex-row justify-center space-x-4">
              <SocialButton bg="bg-red-600" icon="google" text="Google" />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaProvider>
  );
}


type SocialButtonProps = {
  bg: string;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  text: string;
};

function SocialButton({ bg, icon, text }: SocialButtonProps) {
  return (
    <TouchableOpacity className={`${bg} px-4 py-2 rounded-md flex-row items-center`}>
      <FontAwesome name={icon} size={16} color="white" />
      <Text className="text-white ml-2">{text}</Text>
    </TouchableOpacity>
  );
}

