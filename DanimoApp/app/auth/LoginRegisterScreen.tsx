import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";

import LoaderDanimo from "@/components/LoaderDanimo";
import { colors } from "@/stores/colors";
import { URL_AUTH, URL_AUTH_PROF, URL_BASE } from "@/stores/consts";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ButtonAccept } from "../../components/buttons";
import Input from "../../components/input";

export default function LoginRegisterScreen() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [passw, setPassw] = useState("");
  const [passw2, setPassw2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const userType = useUserLogInStore((state) => state.userType);
  const setUserType = useUserLogInStore((state) => state.setUserType);
  const UserLogIn = useUserLogInStore((state) => state.userLogIn);
  const setUserLogIn = useUserLogInStore((state) => state.setUserLogIn);
  const setUserSession = useUserLogInStore((state) => state.setUserSession);
  const token = useUserLogInStore((state) => state.token);
  const mail = useUserLogInStore((state) => state.mail);
  
  // Usar valor por defecto si userType es null
  const currentUserType = userType || 'usuario';
  let url_auth = currentUserType === "profesional" ? URL_AUTH_PROF : URL_AUTH

  // Función para cambiar tipo de usuario
  const toggleUserType = () => {
    const newType = currentUserType === "profesional" ? "usuario" : "profesional";
    setUserType(newType);
  };

  useEffect(() => {
    const validateToken = async (token: string | null, email: string | null) => {
      try {
        const response = await fetch(URL_BASE + url_auth + "/token-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
          body: JSON.stringify({ email: (email ?? "").trim().toLowerCase() }),
        });

        if (response.status === 401) {
          const errorText = await response.text();
          console.error("Error:", errorText);
          throw new Error("Registrese Nuevamente por error del backend");
        }
        if (response.status === 403) {
          const errorText = await response.text();
          console.error("Error:", errorText);
          throw new Error("Inicie sesion Nuevamente");
        }
        if (response.status === 404) {
          const errorText = await response.text();
          console.error("Error:", errorText);
          throw new Error("Registrese Nuevamente por falla de token");
        }
        if (!response.ok) {
          const errorText = await response.json();
          console.error("Error:", errorText.error); 
          throw new Error("Error: " + errorText.error);
        }

        return true;
      } catch (error) {
        console.error("Login error:", error);
        alert("Error al validar el token: " + error);
        setUserLogIn(false);
        setUserSession("", "");
        return false;
      }
    };

    const checkLogin = async () => {
      if (UserLogIn) {
        const valid = await validateToken(token, mail);
        if (valid) {
          if (userType === "profesional") {
            router.push("/profesional/home");
          } else {
            router.push("/tabs/home");
          }
        }
      }
    };

    checkLogin();

  }, [UserLogIn, mail, setUserLogIn, setUserSession, token, url_auth, userType]);

  const handleLogin = async () => {
    try {
      const response = await fetch(URL_BASE + url_auth + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password: passw.trim() }),});

      if (!response.ok) {
        const errorText = await response.json();
        console.error("Error:", errorText.error);
        throw new Error(errorText.error);
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

  if (UserLogIn) {
      return <LoaderDanimo />;
  }

  function renderPasswordInput(value: string, onChange: (text: string) => void, showPassword: boolean, setShowPassword: (v: boolean) => void) {
    return (
      <View className="relative">
        <Input
          icon="lock"
          placeholder="Contraseña"
          secureTextEntry={!showPassword}
          value={value}
          onChangeText={onChange}
        />
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
    );
  }

  return (
    <SafeAreaProvider>
      <LinearGradient colors={[colors.color5, colors.fondo]} className="w-full h-full">
        <StatusBar />
        <View className="flex-1 justify-center items-center px-4">
          <View className="w-full max-w-md rounded-2xl shadow-xl">
            <View className="py-6 bg-color1 rounded-t-2xl">
              <Text className="text-3xl font-bold text-white text-center">Bienvenido a Danimo</Text>
            </View>

            {/* SWITCHER DE TIPO DE USUARIO */}
            <View style={{ 
              paddingHorizontal: 20, 
              paddingVertical: 16, 
              backgroundColor: colors.fondo, // Cambiado a colors.fondo (rosa clarito del card)
              borderBottomWidth: 1, 
              borderBottomColor: 'rgba(255, 255, 255, 0.2)' 
            }}>
              <Text style={{ 
                textAlign: 'center', 
                color: colors.oscuro || '#2D3748', // Cambiado el color del texto para mejor contraste
                fontSize: 14, 
                marginBottom: 12,
                fontWeight: '500'
              }}>
                {currentUserType === "usuario" ? "¿Eres psicólogo?" : "¿Eres paciente?"}
              </Text>
              <TouchableOpacity 
                onPress={toggleUserType}
                style={{ 
                  backgroundColor: colors.color1 || '#E91E63', 
                  paddingHorizontal: 16, 
                  paddingVertical: 10, 
                  borderRadius: 20, 
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 3
                }}
                activeOpacity={0.8}
              >
                <FontAwesome 
                  name="refresh" 
                  size={14} 
                  color="white"
                  style={{ marginRight: 6 }}
                />
                <Text style={{ 
                  fontWeight: '600', 
                  color: 'white',
                  fontSize: 14,
                  textAlign: 'center'
                }}>
                  {currentUserType === "usuario" ? "Soy psicólogo" : "Soy paciente"}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="p-6 bg-fondo rounded-b-2xl">
              {/* Título dinámico según el tipo de usuario */}
              <Text style={{ 
                textAlign: 'center', 
                fontSize: 18, 
                fontWeight: '600', 
                marginBottom: 16, 
                color: colors.oscuro || '#2D3748' 
              }}>
                {tab === "login" ? "Iniciar sesión" : "Registrarse"} como {currentUserType === "profesional" ? "Psicólogo" : "Paciente"}
              </Text>

              <View className="flex-row justify-center mb-6">
                <TouchableOpacity onPress={() => setTab("login")} className={`px-4 py-2 rounded-l-md ${tab === "login" ? "bg-color5 text-white" : "bg-gray-200 text-oscuro"}`}>
                  <Text className="font-semibold">Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setTab("signup")} className={`px-4 py-2 rounded-r-md ${tab === "signup" ? "bg-color5 text-white" : "bg-gray-200 text-oscuro"}`}>
                  <Text className="font-semibold">Sign Up</Text>
                </TouchableOpacity>
              </View>
              
              <Input icon="envelope" placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
              {renderPasswordInput(passw, setPassw, showPassword, setShowPassword)}
              
              {tab === "signup" ? (
                <>
                  {renderPasswordInput(passw2, setPassw2, showPassword, setShowPassword)}
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

              {/* Información adicional según el tipo de usuario */}
              <View style={{ 
                marginTop: 16, 
                padding: 12, 
                borderRadius: 8, 
                borderLeftWidth: 4, 
                borderLeftColor: colors.color5 || '#F8BBD9',
                backgroundColor: colors.fondo || '#FCE4EC'
              }}>
                <Text style={{ 
                  fontSize: 14, 
                  textAlign: 'center',
                  color: colors.oscuro || '#2D3748'
                }}>
                  {currentUserType === "profesional" 
                    ? "Acceso a herramientas profesionales y gestión de pacientes" 
                    : "Encuentra tu bienestar con apoyo profesional"
                  }
                </Text>
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