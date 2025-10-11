import Alegria from "@/assets/Emojis/emojis/mios/alegria.svg";
import Ansiedad from "@/assets/Emojis/emojis/mios/ansiedad.svg";
import Enojo from "@/assets/Emojis/emojis/mios/enojo.svg";
import Miedo from "@/assets/Emojis/emojis/mios/miedo.svg";
import Tristeza from "@/assets/Emojis/emojis/mios/tristeza.svg";
import { URL_BASE, URL_EMOTION } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
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
  const [spinAnim] = useState(new Animated.Value(0));
  const token = useUserLogInStore((state) => state.token);

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
  }, [detectedEmotion, fadeAnim, pulseAnim, scaleAnim]);

  // Detección de emoción con fallback (real + simulación si falla)
  const uploadImage = async (uri: string) => {
    setIsProcessing(true);
    
    // Iniciar animación de spinner
    const spinAnimation = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();
    
    try {
      // Intentar conexión real al backend primero
      const formData = new FormData();
      formData.append('photo', {
        uri: uri,
        type: 'image/jpeg',
        name: 'emotion_photo.jpg',
      } as any);



      const response = await fetch(URL_BASE + URL_EMOTION + '/photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        // Si el servidor está caído (503, 500, etc.), usar simulación
        if (response.status >= 500 || errorText.includes('Web App - Unavailable')) {
          throw new Error('SERVER_DOWN');
        } else if (response.status === 401) {
          throw new Error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
        } else {
          throw new Error(`Error del servidor (${response.status}).`);
        }
      }

      const responseText = await response.text();
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        // Si no puede parsear como JSON, probablemente es HTML (servidor caído)
        Alert.alert('Error', String(parseError));
        throw new Error('SERVER_DOWN');
      }
      const detectedEmotionName = result.emotion || result.detectedEmotion || result.emotionName;
      
      if (detectedEmotionName) {
        setDetectedEmotion(detectedEmotionName);
        onEmotionDetected?.(detectedEmotionName);
      } else {
        throw new Error('SERVER_DOWN');
      }
      
    } catch (error) {
      console.error('Error al detectar emoción:', error);
      
      console.error('Error al detectar emoción:', error);
      
      // Mostrar mensaje específico basado en el tipo de error
      const errorMessage = error instanceof Error ? error.message : 'No se pudo analizar la emoción en la foto. Inténtalo de nuevo.';
      
      Alert.alert(
        'Error al detectar emoción', 
        errorMessage,
        [
          { text: 'Reintentar', onPress: () => uploadImage(uri) },
          { text: 'Cancelar', onPress: () => setImageUri(null), style: 'cancel' }
        ]
      );
    } finally {
      setIsProcessing(false);
      // Detener animación de spinner
      spinAnim.stopAnimation();
      spinAnim.setValue(0);
    }
  };

  const openCamera = async () => {
    setImageUri(null);
    setDetectedEmotion(null);
    setIsProcessing(false);
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
      aspect: [1, 1], // Aspecto cuadrado, mejor para selfies de rostro
      cameraType: ImagePicker.CameraType.front, // Cámara frontal por defecto para selfies
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      setDetectedEmotion(null);
      onImageTaken?.(uri);
      await uploadImage(uri);
    }
  };

  const openGallery = async () => {
    setImageUri(null);
    setDetectedEmotion(null);
    setIsProcessing(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Necesitamos acceso a la galería de fotos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      aspect: [1, 1], // Aspecto cuadrado, mejor para rostros
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      setDetectedEmotion(null);
      onImageTaken?.(uri);
      await uploadImage(uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      "Seleccionar imagen",
      "¿Cómo quieres agregar tu foto?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Cámara", onPress: openCamera },
        { text: "Galería", onPress: openGallery },
      ]
    );
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
      {/* Botón de cámara/galería o eliminar foto */}
      <TouchableOpacity
        onPress={imageUri ? retakePhoto : showImageOptions}
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
        <FontAwesome 
          name={imageUri ? "trash" : "camera"} 
          size={32} 
          color="#fff" 
        />
      </TouchableOpacity>

      {/* Foto capturada */}
      {imageUri && (
        <View style={{ width: MAX_CARD_WIDTH, alignItems: 'center', marginBottom: 18 }}>
          <View 
            style={{ position: 'relative', width: MAX_CARD_WIDTH, aspectRatio: 4/3, borderRadius: 18, overflow: 'hidden', backgroundColor: '#F7E6F7', marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, elevation: 6 }}
          >
            <Image
              source={{ uri: imageUri }}
              style={{ width: '100%', height: '100%', borderRadius: 18 }}
              resizeMode="cover"
            />
            
            {/* Overlay de procesamiento */}
            {isProcessing && (
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 18,
              }}>
                <View style={{
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  padding: 16,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 8,
                }}>
                  <Text style={{ 
                    color: '#4B3F3F', 
                    fontSize: 16, 
                    fontWeight: '600',
                    marginBottom: 8 
                  }}>
                    Analizando emoción...
                  </Text>
                  <Animated.View 
                    style={{
                      width: 24,
                      height: 24,
                      borderWidth: 3,
                      borderColor: '#4B3F3F',
                      borderTopColor: 'transparent',
                      borderRadius: 12,
                      transform: [{
                        rotate: spinAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg']
                        })
                      }],
                    }}
                  />
                </View>
              </View>
            )}
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