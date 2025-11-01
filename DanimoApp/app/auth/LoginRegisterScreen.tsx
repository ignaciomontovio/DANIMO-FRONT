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

  const currentUserType = userType || "usuario";
  let url_auth = currentUserType === "profesional" ? URL_AUTH_PROF : URL_AUTH;

  const toggleUserType = () => {
    const newType =
      currentUserType === "profesional" ? "usuario" : "profesional";
    setUserType(newType);
  };

  useEffect(() => {
    const validateToken = async (token: string | null, email: string | null) => {
      try {
        const response = await fetch(URL_BASE + url_auth + "/token-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ email: (email ?? "").trim().toLowerCase() }),
        });

        if (response.status === 401) throw new Error("Registrese Nuevamente");
        if (response.status === 403) throw new Error("Inicie sesion Nuevamente");
        if (response.status === 404) throw new Error("Registrese Nuevamente");

        if (!response.ok) {
          const errorText = await response.json();
          throw new Error("Error: " + errorText.error);
        }

        return true;
      } catch (error: any) {
        console.error("Login error:", error);

        if (error.message.includes("Network request failed")) {
          alert("No hay conexión a internet. Verifique su conexión.");
        } else {
          alert("Error al validar el token: " + error.message);
        }

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
            router.replace("/profesional/home");
          } else {
            router.replace("/tabs/home");
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
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password: passw.trim(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.json();
      throw new Error(errorText.error);
    }

    const data = await response.json();
    
    // Decodificar el token JWT para extraer el userId
    let userId: string | undefined;
    
    try {
      const tokenParts = data.token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        userId = payload.userId;
      }
    } catch (decodeError) {
      console.error("Error al decodificar el token:", decodeError);
    }
    
    // Fallback: intentar obtener userId de la respuesta directa
    if (!userId) {
      userId = data.userId || data.id || data.user?.id || data.user?._id || data._id;
    }
    
    setUserSession(email, data.token, userId);
    setUserLogIn(true);
  } catch (error) {
    console.error("Login error:", error);
    alert("Email o contraseña incorrecta");
  }
};

  const handleRegister = async () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!passwordRegex.test(passw)) {
      alert(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial."
      );
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

  function renderPasswordInput(
    value: string,
    onChange: (text: string) => void,
    showPassword: boolean,
    setShowPassword: (v: boolean) => void
  ) {
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
          className="absolute right-3 top-3"
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
              <Text className="text-3xl font-bold text-white text-center">
                Bienvenido a Danimo
              </Text>
            </View>

            {/* SWITCHER DE TIPO DE USUARIO */}
            <View className="px-5 py-4 bg-fondo border-b border-white/20">
              <Text className="text-center text-sm font-medium text-oscuro mb-3">
                {currentUserType === "usuario"
                  ? "¿Eres profesional?"
                  : "¿Eres paciente?"}
              </Text>
              <TouchableOpacity
                onPress={toggleUserType}
                className="bg-color1 px-4 py-2 rounded-full self-center flex-row items-center shadow-md active:opacity-80"
              >
                <FontAwesome
                  name="refresh"
                  size={14}
                  color="white"
                  style={{ marginRight: 6 }}
                />
                <Text className="font-semibold text-white text-sm text-center">
                  {currentUserType === "usuario"
                    ? "Soy profesional"
                    : "Soy paciente"}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="px-6 py-2 bg-fondo rounded-b-2xl">
              <Text className="text-center text-lg mb-4 text-oscuro">
                {tab === "login" ? "Iniciar sesión" : "Registrarse"} como{" "}
                <Text className="font-bold">
                  {currentUserType === "profesional"
                    ? "Profesional"
                    : "Paciente"}
                </Text>
              </Text>

              <View className="flex-row justify-center mb-6">
                <TouchableOpacity
                  onPress={() => setTab("login")}
                  className={`px-4 py-2 rounded-l-md ${
                    tab === "login" ? "bg-color5" : "bg-gray-200"
                  }`}
                >
                  <Text className={`${tab === "login" ? "text-white" : "text-oscuro"} font-semibold`}>
                    Login
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setTab("signup")}
                  className={`px-4 py-2 rounded-r-md ${
                    tab === "signup" ? "bg-color5" : "bg-gray-200"
                  }`}
                >
                  <Text className={`${tab === "signup" ? "text-white" : "text-oscuro"} font-semibold`}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>

              <Input
                icon="envelope"
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              {renderPasswordInput(passw, setPassw, showPassword, setShowPassword)}

              {tab === "signup" ? (
                <>
                  {renderPasswordInput(
                    passw2,
                    setPassw2,
                    showPassword,
                    setShowPassword
                  )}
                  <ButtonAccept text="Sign Up" onPress={handleRegister} />
                </>
              ) : (
                <>
                  <Text
                    className="text-right mb-2 underline"
                    onPress={() => router.push("/auth/ForgotPassword")}
                  >
                    Olvido su contraseña
                  </Text>
                  <ButtonAccept text="Login" onPress={handleLogin} />
                </>
              )}

              <View className="mt-4 p-3 rounded-lg border-l-4 border-color5 bg-fondo">
                <Text className="text-sm text-center text-oscuro">
                  {currentUserType === "profesional"
                    ? "Acompañá y guiá el bienestar emocional de tus pacientes"
                    : "Explorá y comprendé tus emociones cada día"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

