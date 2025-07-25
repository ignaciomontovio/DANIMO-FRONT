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

  // Convertir imagen a base64 con mejor manejo de errores
  const convertToBase64 = async (uri: string): Promise<string> => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      
      if (!fileInfo.exists) {
        throw new Error("El archivo no existe en la ruta especificada");
      }
      
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Determinar el tipo MIME basado en la extensión
      let mimeType = 'image/jpeg';
      if (uri.toLowerCase().includes('.png')) {
        mimeType = 'image/png';
      } else if (uri.toLowerCase().includes('.jpg') || uri.toLowerCase().includes('.jpeg')) {
        mimeType = 'image/jpeg';
      }
      
      const dataUri = `data:${mimeType};base64,${base64}`;
      return dataUri;
    } catch (error: any) {
      console.error('Error converting to base64:', error);
      throw new Error(`Error al convertir imagen: ${error.message || error}`);
    }
  };

  // Subir imagen al backend usando FormData
  const uploadToBackend = async (uri: string) => {
    try {
      const formData = new FormData();
      
      // Sintaxis correcta para React Native
      formData.append('profilePic', {
        uri: uri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);

      const response = await fetch(URL_BASE + URL_AUTH + "/update-profile", {
        method: "PATCH",
        headers: {
          "Authorization": "Bearer " + token,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        // Si profilePic no es permitido, intentar con otros nombres
        if (errorText.includes("profilePic is not allowed")) {
          return await tryDifferentFieldNames(uri);
        }
        
        throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
      }
      
      Alert.alert("¡Éxito!", "Foto de perfil actualizada");
    } catch (error: any) {
      console.error('Error uploading to backend:', error);
      throw error;
    }
  };

  // Intentar con diferentes nombres de campo
  const tryDifferentFieldNames = async (uri: string) => {
    const fieldNames = ['avatar', 'photo', 'image', 'profile_pic', 'profile_picture', 'profileImage'];
    
    for (const fieldName of fieldNames) {
      try {
        const formData = new FormData();
        formData.append(fieldName, {
          uri: uri,
          type: 'image/jpeg',
          name: 'profile.jpg',
        } as any);

        const response = await fetch(URL_BASE + URL_AUTH + "/update-profile", {
          method: "PATCH",
          headers: {
            "Authorization": "Bearer " + token,
          },
          body: formData,
        });

        if (response.ok) {
          Alert.alert("¡Éxito!", "Foto de perfil actualizada");
          return;
        }
      } catch (error: any) {
        // Continuar con el siguiente nombre
      }
    }
    
    throw new Error("No se pudo encontrar el nombre de campo correcto para la imagen");
  };

  // Pedir permisos
  const requestPermissions = async () => {
    try {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      return {
        camera: cameraStatus === 'granted',
        mediaLibrary: mediaLibraryStatus === 'granted'
      };
    } catch (error: any) {
      console.error('Error requesting permissions:', error);
      throw new Error("Error al solicitar permisos");
    }
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
        quality: 0.3,
      });

      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch (error: any) {
      console.error('Error tomando foto:', error);
      Alert.alert('Error', `No se pudo tomar la foto: ${error.message || error}`);
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
        quality: 0.3,
      });

      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch (error: any) {
      console.error('Error seleccionando imagen:', error);
      Alert.alert('Error', `No se pudo seleccionar la imagen: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  // Procesar imagen y subirla al backend
  const processImage = async (uri: string) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      
      if (!fileInfo.exists) {
        throw new Error("El archivo no existe");
      }
      
      if ('size' in fileInfo && typeof fileInfo.size === 'number') {
        // Si el archivo es muy grande, alertar
        if (fileInfo.size > 2000000) { // 2MB
          Alert.alert(
            "Imagen muy grande",
            `La imagen es de ${Math.round(fileInfo.size / 1024)}KB. Esto podría causar problemas. ¿Continuar?`,
            [
              { text: "Cancelar", style: "cancel" },
              { text: "Continuar", onPress: async () => await uploadToBackend(uri) }
            ]
          );
          return;
        }
      }
      
      // Subir directamente el archivo
      await uploadToBackend(uri);
      
      // Actualizar la imagen local (convertir a base64 solo para mostrar)
      const base64Image = await convertToBase64(uri);
      setProfileImage(base64Image);
      
    } catch (error: any) {
      console.error('Error processing image:', error);
      Alert.alert('Error', `No se pudo procesar la imagen: ${error.message || error}`);
    }
  };

  // Manejar selección de opción
  const handleImagePress = () => {
    showImageOptions();
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