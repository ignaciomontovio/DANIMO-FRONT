import { colors } from "@/stores/colors";
import { URL_AUTH, URL_BASE } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, TouchableOpacity, View } from "react-native";


export default function ProfilePhoto() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const token = useUserLogInStore((state) => state.token);

  // Cargar imagen del backend al montar el componente
  useEffect(() => {
    loadProfileFromBackend();
  }, []);

  // Cargar imagen desde el backend
  const loadProfileFromBackend = async () => {
    try {
      const response = await fetch(URL_BASE + URL_AUTH + "/profile", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        if (userData.profilePic) {
          setProfileImage(userData.profilePic);
        }
      }
    } catch (error) {
      console.error('Error loading profile from backend:', error);
    }
  };

  // Convertir imagen a base64
  const convertToBase64 = async (uri: string): Promise<string> => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Determinar el tipo MIME basado en la extensión
      const mimeType = uri.toLowerCase().includes('.png') ? 'image/png' : 'image/jpeg';
      return "data:" + mimeType + ";base64," + base64;
    } catch (error) {
      console.error('Error converting to base64:', error);
      throw error;
    }
  };

  // Subir imagen al backend
  const uploadToBackend = async (base64Image: string) => {
    try {
      console.log("Uploading image to backend...");

      const response = await fetch(URL_BASE + URL_AUTH + "/update-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
          profilePic: base64Image
        }),
      });

      if (!response.ok) {
        const errorText = await response.json();
        console.error("Error:", errorText.error);
        throw new Error(errorText.error);
      }

      console.log("Image uploaded successfully");
      Alert.alert("¡Éxito!", "Foto de perfil actualizada");
    } catch (error) {
      console.error('Error uploading to backend:', error);
      Alert.alert("Error", "No se pudo subir la imagen al servidor");
      throw error;
    }
  };

  // Pedir permisos
  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    return {
      camera: cameraStatus === 'granted',
      mediaLibrary: mediaLibraryStatus === 'granted'
    };
  };

  // Tomar foto con cámara
  const takePhoto = async () => {
    try {
      setLoading(true);
      const permissions = await requestPermissions();
      
      if (!permissions.camera) {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a la cámara para tomar fotos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.1,
      });

      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error tomando foto:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    } finally {
      setLoading(false);
    }
  };

  // Seleccionar de galería
  const pickImage = async () => {
    try {
      setLoading(true);
      const permissions = await requestPermissions();
      
      if (!permissions.mediaLibrary) {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tus fotos para seleccionar una imagen');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.1,
      });

      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error seleccionando imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    } finally {
      setLoading(false);
    }
  };

  // Procesar imagen y subirla al backend
  const processImage = async (uri: string) => {
    try {
      console.log("Processing image...");
      
      const fileInfo = await FileSystem.getInfoAsync(uri);
      console.log(
        "📄 Original file size:",
        'size' in fileInfo && typeof fileInfo.size === 'number'
          ? `${Math.round(fileInfo.size / 1024)}KB`
          : 'unknown'
      );
      
      const base64Image = await convertToBase64(uri);
      const base64Size = base64Image.length * 0.75;
      console.log("Base64 size: " + Math.round(base64Size / 1024) + "KB");
      
      if (base64Size > 100000) {
        Alert.alert(
          "Imagen muy grande", 
          "La imagen es de " + Math.round(base64Size / 1024) + "KB. El servidor solo acepta imágenes muy pequeñas. Intenta con una imagen más pequeña o pide al administrador que aumente el límite del servidor."
        );
        return;
      }
      
      await uploadToBackend(base64Image);
      setProfileImage(base64Image);
      
    } catch (error) {
      console.error('Error processing image:', error);
      
      if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as any).message === 'string' &&
        (error as any).message.includes('PayloadTooLargeError')
      ) {
        Alert.alert(
          'Imagen muy grande', 
          'La imagen es demasiado grande para el servidor. Intenta con una imagen más pequeña o contacta al administrador para aumentar el límite.'
        );
      } else {
        Alert.alert('Error', 'No se pudo procesar la imagen');
      }
    }
  };

  // Eliminar foto
  const removePhoto = async () => {
    try {
      setLoading(true);
      await uploadToBackend("");
      setProfileImage(null);
      Alert.alert('Foto eliminada', 'Tu foto de perfil ha sido eliminada');
    } catch (error) {
      console.error('Error eliminando imagen:', error);
      Alert.alert('Error', 'No se pudo eliminar la imagen');
    } finally {
      setLoading(false);
    }
  };

  // Manejar selección de opción
  const handleImagePress = () => {
    if (profileImage) {
      Alert.alert(
        "Foto de perfil",
        "¿Qué deseas hacer?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Cambiar foto", onPress: showImageOptions },
          { text: "Eliminar", style: "destructive", onPress: removePhoto },
        ]
      );
    } else {
      showImageOptions();
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      "Seleccionar imagen",
      "¿Cómo quieres agregar tu foto?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Cámara", onPress: takePhoto },
        { text: "Galería", onPress: pickImage },
      ]
    );
  };

  return (
    <TouchableOpacity onPress={handleImagePress} disabled={loading}>
      <View
        className="w-12 h-12 rounded-full border-2 items-center justify-center"
        style={{ 
          borderColor: colors.color1,
          backgroundColor: profileImage ? 'transparent' : colors.color2,
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={colors.color1} />
        ) : profileImage ? (
          <Image
            source={{ uri: profileImage }}
            className="w-full h-full rounded-full"
            style={{ resizeMode: 'cover' }}
          />
        ) : (
          <FontAwesome name="user" size={20} color={colors.color1} />
        )}
      </View>
    </TouchableOpacity>
  );
}