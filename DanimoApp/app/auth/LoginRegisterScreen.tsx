import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";

// import { GoogleSignin, statusCodes } from "react-native-google-signin";}
// import { makeRedirectUri } from "expo-auth-session";
import { URL_AUTH, URL_BASE } from "@/stores/consts";
import { makeRedirectUri } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ButtonAccept } from "../../components/buttons";
import Input from "../../components/input";
import { useUserStore } from "../../stores/userType";

export default function LoginRegisterScreen() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [passw, setPassw] = useState("");
  const [passw2, setPassw2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const userType = useUserStore((state) => state.userType);
  const UserLogIn = useUserLogInStore((state) => state.userLogIn);
  const setUserLogIn = useUserLogInStore((state) => state.setUserLogIn);
  const setUserSession= useUserLogInStore((state) => state.setUserSession);

  const redirectUri = makeRedirectUri({
    scheme: 'com.danimo.app',
  });
  // useEffect(() => {
  //   console.log("Redirect URI:", redirectUri);
  // }, []);


  const [request, response, promtAsync] = Google.useAuthRequest({
    androidClientId: '889596207544-ftgc2j4tr6nsi90bfs66ctoqnvjot5de.apps.googleusercontent.com',
    redirectUri: redirectUri,
    // clientId_old: '889596207544-irhl04qjt7t03t6e004iuk55afrb0tot.apps.googleusercontent.com',
  })

  const sendTokenGoogle = async (token:string) => {
    console.log(token)
    // send to back
  }

  useEffect(() => {
    console.log(response);
    
    if (response?.type === 'success') {
      console.log("Login Google exitoso:", response);
      const token = response.authentication?.idToken || '';
      sendTokenGoogle(token);
      setUserLogIn(true);
    } else if (response?.type === 'error') {
      console.error("Error autenticación Google:", response);
    }
  }, [response, setUserLogIn]);


  useEffect(() => {
    if (UserLogIn) {
      if (userType === "profesional") {
        router.push("/profesional/home");
      } else {
        router.push("/tabs/home");
      }
    }
  }, [UserLogIn, userType]);

  const handleLogin = async () => {
    try {
      const response = await fetch(URL_BASE + URL_AUTH + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password: passw.trim() }),});

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error:", errorText);
        throw new Error("Error al iniciar sesión");
      }

      const data = await response.json();
      console.log("Login:", data);
      console.log("token:", data.token);
      setUserSession(email, data.token)
      setUserLogIn(true);
    } catch (error) {
      console.error("Login error:", error);
      alert("Email o contraseña incorrecta");
    }
  };
  const handleLoginGoogle = async () => {
    promtAsync().catch((e)=> {console.error("Error inicio sesion google:",e);})
  }
  
  const handleRegister = async () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!passwordRegex.test(passw)) {
      alert("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.");
      return;
    }

    if (passw !== passw2) {
      alert("Las contraseñas no coinciden");
      return;
    }

    router.push({
      pathname: "/auth/DetailRegister",
      params: {
        email: email.trim(),
        password: passw.trim(),
      },
    });
  };


  // const handleGoogleSignIn = async () => {
  //     setEmail("ignaciomontovio@gmail.com")
  //     setPassw("abcd123")
  //     handleLogin()
  // }

  return (
    <SafeAreaProvider>
      <LinearGradient colors={["#D2A8D6", "#F4E1E6"]} className="w-full h-full">
        <StatusBar />
        <View className="flex-1 justify-center items-center px-4">
          <View className="w-full max-w-md rounded-2xl shadow-xl">
            <View className="py-6 bg-color1 rounded-t-2xl">
              <Text className="text-3xl font-bold text-white text-center">Bienvenido a Danimo</Text>
            </View>

            <View className="p-6 bg-fondo rounded-b-2xl">
              <View className="flex-row justify-center mb-6">
                <TouchableOpacity onPress={() => setTab("login")} className={`px-4 py-2 rounded-l-md ${tab === "login" ? "bg-color5 text-white" : "bg-gray-200 text-oscuro"}`}>
                  <Text className="font-semibold">Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setTab("signup")} className={`px-4 py-2 rounded-r-md ${tab === "signup" ? "bg-color5 text-white" : "bg-gray-200 text-oscuro"}`}>
                  <Text className="font-semibold">Sign Up</Text>
                </TouchableOpacity>
              </View>

              <Input icon="envelope" placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
              {/* <Input icon="lock" placeholder="Contraseña" secureTextEntry value={passw} onChangeText={setPassw} /> */}
              <View className="relative mb-4">
                <Input icon="lock" placeholder="Contraseña" secureTextEntry={!showPassword} value={passw} onChangeText={setPassw}/>
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 12, top: 12 }}
                >
                  <FontAwesome
                    name={showPassword ? "eye" : "eye-slash"}
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              {tab === "signup" ? (
                <>
                  {userType === "profesional" && (
                    <Input icon="info" placeholder="Matrícula profesional" />
                  )}
                  {/* <Input icon="lock" placeholder="Repita Contraseña" secureTextEntry value={passw2} onChangeText={setPassw2} /> */}
                  <View className="relative mb-4">
                    <Input icon="lock" placeholder="Contraseña" secureTextEntry={!showPassword} value={passw2} onChangeText={setPassw2}/>
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={{ position: "absolute", right: 12, top: 12 }}
                    >
                      <FontAwesome
                        name={showPassword ? "eye" : "eye-slash"}
                        size={20}
                        color="gray"
                      />
                    </TouchableOpacity>
                  </View>

                  <ButtonAccept text="Sign Up" onPress={handleRegister} />
                  
                </>
              ) : (
                <>
                  <Text className="text-right mb-2 underline" onPress={() => router.push("/auth/ForgotPassword")}>
                    Olvido su contraseña
                  </Text>
                  <ButtonAccept text="Login" onPress={handleLogin} />
                </>
              )}

              <Text className="text-center mt-6 mb-4">Continuar con</Text>
              <View className="flex-row justify-center space-x-4">
                <SocialButton 
                  bg="bg-red-600" 
                  icon="google" 
                  text="Google" 
                  // onPress={() => promtAsync().catch((e)=> {console.error("Error inicio sesion google:",e);} )} 
                  onPress={handleLoginGoogle} 
                />
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
  onPress: () => void;
};

function SocialButton({ bg, icon, text, onPress }: SocialButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} className={`${bg} px-4 py-2 rounded-md flex-row items-center`}>
      <FontAwesome name={icon} size={16} color="white" />
      <Text className="text-white ml-2">{text}</Text>
    </TouchableOpacity>
  );
}


