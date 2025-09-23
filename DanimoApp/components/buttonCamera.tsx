import Alegria from "@/assets/Emojis/emojis/mios/alegria.svg";
import Ansiedad from "@/assets/Emojis/emojis/mios/ansiedad.svg";
import Enojo from "@/assets/Emojis/emojis/mios/enojo.svg";
import Miedo from "@/assets/Emojis/emojis/mios/miedo.svg";
import Tristeza from "@/assets/Emojis/emojis/mios/tristeza.svg";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Animated, Dimensions, Image, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get('window');
const MAX_CARD_WIDTH = Math.min(width - 48, 400);

export type ButtonCameraProps = {
  onImageTaken?: (uri: string) => void;
  onEmotionDetected?: (emotion: string) => void;
};

const emotionSvgs = {
  alegria: Alegria,
  ansiedad: Ansiedad,
  enojo: Enojo,
  miedo: Miedo,
  tristeza: Tristeza,
};

const emotionColors = {
  alegria: "#FDE846",
  tristeza: "#057BC4", 
  enojo: "#EA2718",
  miedo: "#d150da",
  ansiedad: "#FF872E",
};

export default function ButtonCamera({ onImageTaken, onEmotionDetected }: ButtonCameraProps) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [flashAnim] = useState(new Animated.Value(0));

  // Animar aparición de emoción
  React.useEffect(() => {
    if (detectedEmotion) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]),
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.05,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
      pulseAnim.setValue(1);
    }
  }, [detectedEmotion]);

  // Simula el upload y detección de emoción
  const uploadImage = async (uri: string) => {
    setIsProcessing(true);
    
    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const emotions = ["Alegria", "Tristeza", "Enojo", "Miedo", "Ansiedad"];
    const mockEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    
    setDetectedEmotion(mockEmotion);
    setIsProcessing(false);
    onEmotionDetected?.(mockEmotion);
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Necesitamos acceso a la cámara.");
      return;
    }

    // Efecto flash antes de abrir la cámara
    Animated.sequence([
      Animated.timing(flashAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
      aspect: [16, 9],
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      setDetectedEmotion(null);
      onImageTaken?.(uri);
      await uploadImage(uri);
    }
  };

  const getEmotionKey = (name: string): keyof typeof emotionColors & keyof typeof emotionSvgs => {
    const map: Record<string, keyof typeof emotionColors & keyof typeof emotionSvgs> = {
      Alegria: "alegria",
      Ansiedad: "ansiedad",
      Enojo: "enojo",
      Miedo: "miedo",
      Tristeza: "tristeza",
    };
    return map[name] || "alegria";
  };

  const retakePhoto = () => {
    setImageUri(null);
    setDetectedEmotion(null);
    setIsProcessing(false);
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 16, paddingHorizontal: 8 }}>
      {/* Botón de cámara */}
      <TouchableOpacity
        onPress={openCamera}
        disabled={isProcessing}
        style={{
          backgroundColor: '#4B3F3F',
          borderRadius: 40,
          width: 80,
          height: 80,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <FontAwesome name="camera" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Foto capturada */}
      {imageUri && (
        <View style={{ width: MAX_CARD_WIDTH, alignItems: 'center', marginBottom: 18 }}>
          <View style={{ position: 'relative', width: MAX_CARD_WIDTH, aspectRatio: 4/3, borderRadius: 18, overflow: 'hidden', backgroundColor: '#F7E6F7', marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, elevation: 6 }}>
            <Image
              source={{ uri: imageUri }}
              style={{ width: '100%', height: '100%', borderRadius: 18 }}
              resizeMode="cover"
            />
            {/* Botón de retomar foto */}
            <TouchableOpacity
              onPress={retakePhoto}
              style={{ position: 'absolute', top: 8, right: 8, backgroundColor: '#0008', borderRadius: 16, padding: 4 }}
            >
              <FontAwesome name="times" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Resultado de emoción detectada */}
          {detectedEmotion && (
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }, { scale: pulseAnim }],
                width: MAX_CARD_WIDTH,
                alignSelf: 'center',
              }}
            >
              <View style={{
                backgroundColor: '#F7E6F7',
                borderRadius: 18,
                padding: 20,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.10,
                shadowRadius: 6,
                elevation: 4,
                borderWidth: 1,
                borderColor: '#E0B7E0',
                marginTop: 0,
                width: MAX_CARD_WIDTH,
                alignSelf: 'center',
              }}>
                <Text style={{ color: '#4B3F3F', fontWeight: '500', fontSize: 17, marginBottom: 10, textAlign: 'center' }}>
                  Tu rostro refleja la emoción:
                </Text>
                <View style={{ marginBottom: 10, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  <View 
                    style={{
                      backgroundColor: emotionColors[getEmotionKey(detectedEmotion)] + '30',
                      borderRadius: 40,
                      width: 80,
                      height: 80,
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowColor: '#000',
                      shadowOpacity: 0.10,
                      shadowRadius: 6,
                      elevation: 3,
                    }}
                  >
                    {React.createElement(
                      emotionSvgs[getEmotionKey(detectedEmotion)],
                      { width: 48, height: 48 }
                    )}
                  </View>
                </View>
                <Text 
                  style={{ color: emotionColors[getEmotionKey(detectedEmotion)], fontWeight: 'bold', fontSize: 22, textAlign: 'center' }}
                >
                  {detectedEmotion}
                </Text>
              </View>
            </Animated.View>
          )}
        </View>
      )}
    </View>
  );
}