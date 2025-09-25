import { ButtonDark } from "@/components/buttons";
import { ChatBubble } from "@/components/chatBubble";
import HeaderGoBack from "@/components/headerGoBack";
import Navbar from "@/components/navbar";
import { colors } from "@/stores/colors";
import { URL_BASE, URL_CHAT } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import LinearGradient from "react-native-linear-gradient";




// 🎤 imports de speech
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

export default function Chat() {
  const scrollRef = useRef<ScrollView>(null);
  const [message, setMessage] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [isKeyboarVisible, setIsKeyboarVisible] = useState(false);
  const [chat, setChat] = useState<
    { type: "sent" | "received" | "system"; text: string }[]
  >([]);
  const { 
    EmotionSleep, 
    activities,
    type 
    } = useLocalSearchParams<{ 
      EmotionSleep: string; 
      activities:string[];
      type: string  }>();

  const [recognizing, setRecognizing] = useState(false);


  useSpeechRecognitionEvent("start", () => {
    setRecognizing(true);
  });

  useSpeechRecognitionEvent("end", () => {
    setRecognizing(false);
  });

  useSpeechRecognitionEvent("result", (event) => {
    if (event.results && event.results.length > 0) {
      setMessage(event.results[0].transcript); // 👈 texto directo al input
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    console.error("Speech recognition error:", event.error, event.message);
    setRecognizing(false);
  });

  const startRecognition = async () => {
    const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!perm.granted) {
      console.warn("Permiso micrófono denegado");
      return;
    }

    ExpoSpeechRecognitionModule.start({
      lang: "es-AR",
      interimResults: true,
      continuous: false,
    });
  };

  const stopRecognition = () => {
    ExpoSpeechRecognitionModule.stop();
  };

  const token = useUserLogInStore((state) => state.token);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newChat = [...chat, { type: "sent" as const, text: message }];
    setChat(newChat);
    setMessage("");

    try {
      const response = await fetch(URL_BASE + URL_CHAT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ message: message }),
      });

      if (!response.ok) {
        const errorText = await response.json();
        console.error("Error:", errorText.error || errorText);
        throw new Error(errorText.error || "Error desconocido");
      }

      const data = await response.json();

      setChat((prev) => [
        ...prev,
        { type: "received", text: data.message || JSON.stringify(data) },
      ]);
      console.log(data);
      
    } catch (error: any) {
      console.error("Chat error:", error);
      alert(error.message || "Error al enviar el mensaje");
    }
  };

  useEffect(() => {
    const sendFirstMessage = async () => {
      console.log("type: " + type);
      console.log("EmotionSleep: " + EmotionSleep);
      console.log("activities: " + activities);
      
      let msjInit = "";
      if (type === "Emotion") {
        msjInit = `Hola, me siento con ${EmotionSleep}.`;
      } else {
        msjInit = `Dormí ${EmotionSleep}`;
      }
      console.log("msjInit: ", msjInit);

      setChat([{ type: "system", text: "Dani está escribiendo..." }]);

      try {
        const response = await fetch(URL_BASE + URL_CHAT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
          body: JSON.stringify({ message: msjInit }),
        });

        const data = await response.json();
        console.log("respuesta del backend:", data);

        if (!response.ok) {
          throw new Error(data.error || "Error desconocido");
        }

        // Reemplazamos el mensaje "Dani está escribiendo..." por la respuesta real
        setChat([
          { type: "received", text: data.message || JSON.stringify(data) },
        ]);
        
        setShowWarning(data.warningConversationLimit)

      } catch (error: any) {
        console.error("Chat error:", error);
        alert(error.message || "Error al enviar el mensaje");
      }
    };
    console.log("first mesaje");
    
    sendFirstMessage();
  }, []);




  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [chat]);

  useEffect(() => {
    const showSubs = Keyboard.addListener("keyboardDidShow", handleKeyboardShow);
    const hideSubs = Keyboard.addListener("keyboardDidHide", handleKeyboardHide);// no hace falta pero esta por las dudas
    console.log("entra a chat");
    return () => {
      showSubs.remove();
      hideSubs.remove();
    }
  }, []);

  const handleKeyboardShow = (event: any) => {
    setIsKeyboarVisible(true);
  }
  const handleKeyboardHide = (event: any) => {
    setIsKeyboarVisible(false);
  }

  return (
    <LinearGradient
      colors={[colors.color5, colors.fondo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full h-full"
    >
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={"height"}>
        <HeaderGoBack
          text="DANI.AI"
          onPress={() => router.push("/tabs/home")}
          img={require("../../assets/images/logo.png")}
        />

        {/* Mensajes */}
        <ScrollView
          ref={scrollRef}
          className="flex-1 px-4 pt-4"
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          {chat.map((msg, idx) => (
            <ChatBubble key={idx} type={msg.type} text={msg.text} />
          ))}
        </ScrollView>

        {/* Input + micrófono */}
        <View className="flex-row items-center p-3 pb-8 bg-white border-t border-gray-300">
          <TextInput
            className="flex-1 bg-oscuro rounded-full px-4 py-2 text-white font-bold"
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#aaa"
            value={message}
            onChangeText={setMessage}
          />

          {/* Botón micrófono */}
          <TouchableOpacity
            onPressIn={startRecognition}
            onPressOut={stopRecognition}
            className="ml-2"
          >
            <FontAwesome
              name="microphone"
              size={24}
              color={recognizing ? "red" : colors.color1}
            />
          </TouchableOpacity>

          {/* Botón enviar */}
          <TouchableOpacity onPress={sendMessage} className="ml-2">
            <FontAwesome name="send" size={24} color={colors.color1} />
          </TouchableOpacity>
        </View>

        {/* Modal warning */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showWarning}
          onRequestClose={() => setShowWarning(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/60 px-6">
            <View className="bg-fondo rounded-2xl p-6 w-full shadow-2xl">
              <Text className="text-xl font-extrabold text-center text-gray-800 mb-3">
                Alerta SOS
              </Text>
              <Text className="text-base text-center text-gray-700 mb-6">
                Registramos un uso excesivo, de la aplicacion.
              </Text>
              <ButtonDark onPress={() => setShowWarning(false)} text="Cerrar" />
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>

      {/* Navbar */}
      <Navbar
        tabs={[
          { name: "home", icon: "home", label: "Inicio" },
          { name: "stats", icon: "bar-chart", label: "Stats" },
          { name: "sos", icon: "exclamation-triangle" },
          { name: "rutines", icon: "newspaper-o", label: "Rutinas" },
          { name: "menu", icon: "bars", label: "Menú" },
        ]}
      />
    </LinearGradient>
  );
}
