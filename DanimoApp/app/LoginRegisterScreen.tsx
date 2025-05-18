import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useUserStore } from "../stores/userType";
const handleLogin = (userType: string | null) => {
    //  validar el login 
    if(userType === "profesional"){
      router.push("/homeProf");  
    }
    else{
      router.push("/home"); 
    }
  };
export default function LoginRegisterScreen() {
  const [tab, setTab] = useState<"login" | "signup">("signup");
  const userType = useUserStore((state) => state.userType);

  return (
    <View className="flex-1 justify-center items-center px-4">
      <View className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        <View className="py-6 bg-primary">
          <Text className="text-3xl font-bold text-white text-center">Bienvenido a Danimo</Text>
        </View>


        <View className="p-6">
          <View className="flex-row justify-center mb-6">
            <TouchableOpacity
              onPress={() => setTab("signup")}
              className={`px-4 py-2 rounded-l-md ${
                tab === "signup" ? "bg-accent text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              <Text className="font-semibold">Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTab("login")}
              className={`px-4 py-2 rounded-r-md ${
                tab === "login" ? "bg-accent text-white" : "bg-gray-200 text-gray-700"
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
              <Button text="Sign Up" onPress={()=>setTab("login")} />
            </>
          ) : (
              <Button text="Login" onPress={() => handleLogin(userType)}/>
          )}
          <Text className="text-center text-gray-600 mt-6 mb-4">Or continue with</Text>
          <View className="flex-row justify-center space-x-4">
            <SocialButton bg="bg-red-600" icon="google" text="Google" />
          </View>
        </View>
      </View>
    </View>
  );
}

type InputProps = {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
} & React.ComponentProps<typeof TextInput>;

function Input({ icon, ...props }: InputProps) {
  return (
    <View className="relative mb-4">
      <FontAwesome name={icon} size={18} color="gray" style={{ position: "absolute", top: 16, left: 12 }} />
      <TextInput
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md text-gray-700"
        placeholderTextColor="#999"
        {...props}
      />
    </View>
  );
}

type ButtonProps = {
  text: string;
  onPress: () => void;
};

function Button({ text, onPress }: ButtonProps) {
  return (
    <TouchableOpacity onPress = {onPress} className="w-full bg-success py-3 rounded-md mt-2">
      <Text className="text-white text-center font-bold text-lg">{text}</Text>
    </TouchableOpacity>
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
