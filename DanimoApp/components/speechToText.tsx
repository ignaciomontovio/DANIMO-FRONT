 
import { FontAwesome } from "@expo/vector-icons";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";

export default function SpeechToText() {
  const [transcript, setTranscript] = useState("Mantén para hablar");
  const [recognizing, setRecognizing] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Hooks de eventos (nivel superior ✅)
  useSpeechRecognitionEvent("start", () => {
    setRecognizing(true);
  });

  useSpeechRecognitionEvent("end", () => {
    setRecognizing(false);
  });

  useSpeechRecognitionEvent("result", (event) => {
    if (event.results && event.results.length > 0) {
      setTranscript(event.results[0].transcript);
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    console.error("Speech recognition error:", event.error, event.message);
    setRecognizing(false);
  });

  const startRecognition = async () => {
    const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!perm.granted) {
      console.warn("Permiso para micrófono / reconocimiento de voz denegado");
      return;
    }
    setPermissionGranted(true);

    ExpoSpeechRecognitionModule.start({
      lang: "es-AR",
      interimResults: true,
      continuous: false,
    });
  };

  const stopRecognition = () => {
    ExpoSpeechRecognitionModule.stop();
  };

  const abortRecognition = () => {
    ExpoSpeechRecognitionModule.abort();
  };

  return (
    <>
      <TouchableOpacity
        onPressIn={startRecognition}
        style={{
          flexDirection: "row",
          backgroundColor: "#222",
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 50,
          alignItems: "center",
        }}
      >
        <FontAwesome
          name="microphone"
          size={24}
          color={recognizing ? "red" : "white"}
        />
        <Text style={{ color: "white", marginLeft: 8 }}>
          <Text>{transcript}</Text>
        </Text>
      </TouchableOpacity>
    </>
  );
}
