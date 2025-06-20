import { ButtonDark } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import Navbar from "@/components/navbar";
import ShowInfo from "@/components/showInfo";
import { colors } from "@/stores/colors";
import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";
import * as React from "react";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function profile() {
  const setUserLogIn = useUserLogInStore(
    (state: { setUserLogIn: (userLogIn: true | false) => void }) => state.setUserLogIn
  );

  const handleLogoff = () => {
    setUserLogIn(false);
    router.replace("../auth/LoginRegisterScreen");
  };

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={[colors.color5, colors.fondo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full h-full"
      >
        <View className="relative">
          <HeaderGoBack text="Perfil" onPress={() => router.replace("/tabs/home")} />
          <View 
            style={{ 
              position: 'absolute', 
              right: 16, 
              top: 4,
              zIndex: 10, 
              elevation: 10 
            }}
          >
            <ProfilePhoto />
          </View>
        </View>
        
        <ScrollView className="flex-1 px-5 py-5">
          <View className="mb-8">
            <ProfileCard
              profile={{
                name: "Juan",
                email: "juan.perez@email.com",
                d_birth: new Date("01-01-1990"),
                codigo: "PSI-12345"
              }}
            />
          </View>
        </ScrollView>
        <View className="absolute bottom-0 left-0 right-0">
          <Navbar
            tabs={[
              { name: "home", icon: "home", label: "Inicio" },
              { name: "stats", icon: "bar-chart", label: "Stats" },
              { name: "sos", icon: "exclamation-triangle" },
              { name: "rutines", icon: "newspaper-o", label: "Rutinas" },
              { name: "menu", icon: "bars", label: "Menú" },
            ]}
          />
        </View>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

// Componente de foto de perfil con funcionalidad completa
function ProfilePhoto() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Cargar imagen guardada al montar el componente
  useEffect(() => {
    loadSavedImage();
  }, []);

  // Cargar imagen desde AsyncStorage
  const loadSavedImage = async () => {
    try {
      const savedImageUri = await AsyncStorage.getItem('profileImage');
      if (savedImageUri) {
        // Verificar si el archivo aún existe
        const fileInfo = await FileSystem.getInfoAsync(savedImageUri);
        if (fileInfo.exists) {
          setProfileImage(savedImageUri);
        } else {
          // Limpiar referencia si el archivo no existe
          await AsyncStorage.removeItem('profileImage');
        }
      }
    } catch (error) {
      console.error('Error cargando imagen:', error);
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
        aspect: [1, 1], // Cuadrada
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await saveImage(result.assets[0].uri);
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
        aspect: [1, 1], // Cuadrada
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await saveImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error seleccionando imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    } finally {
      setLoading(false);
    }
  };

  // Guardar imagen localmente
  const saveImage = async (uri: string) => {
    try {
      // Crear directorio para imágenes de perfil si no existe
      const profileDir = `${FileSystem.documentDirectory}profile/`;
      const dirInfo = await FileSystem.getInfoAsync(profileDir);
      
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(profileDir, { intermediates: true });
      }

      // Copiar imagen al directorio de la app
      const filename = `profile_${Date.now()}.jpg`;
      const newPath = `${profileDir}${filename}`;
      
      await FileSystem.copyAsync({
        from: uri,
        to: newPath,
      });

      // Eliminar imagen anterior si existe
      if (profileImage) {
        try {
          await FileSystem.deleteAsync(profileImage);
        } catch (error) {
          console.log('No se pudo eliminar imagen anterior:', error);
        }
      }

      // Guardar nueva ruta
      setProfileImage(newPath);
      await AsyncStorage.setItem('profileImage', newPath);
      
      Alert.alert('¡Éxito!', 'Foto de perfil actualizada');
      
    } catch (error) {
      console.error('Error guardando imagen:', error);
      Alert.alert('Error', 'No se pudo guardar la imagen');
    }
  };

  // Eliminar foto
  const removePhoto = async () => {
    try {
      if (profileImage) {
        await FileSystem.deleteAsync(profileImage);
        await AsyncStorage.removeItem('profileImage');
        setProfileImage(null);
        Alert.alert('Foto eliminada', 'Tu foto de perfil ha sido eliminada');
      }
    } catch (error) {
      console.error('Error eliminando imagen:', error);
      Alert.alert('Error', 'No se pudo eliminar la imagen');
    }
  };

  // Manejar selección de opción
  const handleImagePress = () => {
    if (profileImage) {
      // Si ya tiene imagen, mostrar opciones adicionales
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

type UserProfile = {
  email: string;
  name: string;
  d_birth: Date;
  codigo: string;
};

type PropsProfileCard = {
  profile: UserProfile;
};

function ShowInfo_edit({ 
  icon, 
  text, 
  onChangeText,
  placeholder,
  label
}: {
  icon: keyof typeof FontAwesome.glyphMap;
  text: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
}) {
  return (
    <View className="mb-3">
      {label && (
        <Text style={{ 
          color: colors.oscuro,
          fontSize: 14, 
          marginBottom: 4,
          fontWeight: '500'
        }}>
          {label}
        </Text>
      )}
      <View className="flex-row items-center p-3 bg-gray-50 rounded-lg">
        <FontAwesome name={icon} size={16} color="#666" />
        <TextInput
          value={text}
          onChangeText={onChangeText}
          className="flex-1 text-base text-gray-800 ml-3"
          placeholder={placeholder || "Ingresa valor..."}
          placeholderTextColor="#999"
          style={{
            minHeight: 24,
            borderBottomWidth: 1,
            borderBottomColor: '#ddd',
            paddingBottom: 2,
          }}
        />
      </View>
    </View>
  );
}

export function ProfileCard({ profile }: PropsProfileCard) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: profile.name,
    email: profile.email,
    d_birth: profile.d_birth.toISOString().split('T')[0],
  });

  const handleFieldChange = (field: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      console.log("Guardando perfil:", editedProfile);
      // Simulación de guardado (reemplazar con llamada a backend)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO:
      // const response = await fetch(URL_BASE + "/profile/update", {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Authorization": "Bearer " + token,
      //   },
      //   body: JSON.stringify(editedProfile),
      // });
      
      Alert.alert("Éxito", "Perfil actualizado correctamente");
      setIsEditing(false);
      
    } catch (error) {
      console.error("Error guardando perfil:", error);
      Alert.alert("Error", "No se pudo guardar el perfil");
    }
  };

  const handleCancel = () => {
    setEditedProfile({
      name: profile.name,
      email: profile.email,
      d_birth: profile.d_birth.toISOString().split('T')[0],
    });
    setIsEditing(false);
  };

  return (
    <View
      className="w-full max-w-md rounded-2xl shadow-xl mb-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10,
      }}
    >
      <View className="py-3 bg-color1 rounded-t-2xl relative">
        <Text className="text-2xl font-bold text-white text-center">Perfil</Text>
      </View>

      <View className="p-6 bg-fondo rounded-b-2xl">
        {isEditing ? (
          <ShowInfo_edit
            icon="user"
            text={editedProfile.name}
            onChangeText={(text) => handleFieldChange('name', text)}
            label="Nombre completo"
          />
        ) : (
          <ShowInfo text={profile.name} icon="user" />
        )}

        {isEditing ? (
          <ShowInfo_edit
            icon="envelope"
            text={editedProfile.email}
            onChangeText={(text) => handleFieldChange('email', text)}
            label="Correo electrónico"
          />
        ) : (
          <ShowInfo text={profile.email} icon="envelope" />
        )}

        {isEditing ? (
          <ShowInfo_edit
            icon="calendar"
            text={editedProfile.d_birth}
            onChangeText={(text) => handleFieldChange('d_birth', text)}
            label="Fecha de nacimiento"
          />
        ) : (
          <ShowInfo text={profile.d_birth.toLocaleDateString()} icon="calendar" />
        )}

        <ShowInfo text={profile.codigo} icon="share" />
        {isEditing ? (
          <View className="flex-row gap-2 mt-4">
            <View className="flex-1">
              <ButtonDark
                text="Guardar"
                onPress={handleSave}
              />
            </View>
            <View className="flex-1">
              <ButtonDark
                text="Cancelar"
                onPress={handleCancel}
              />
            </View>
          </View>
        ) : (
          <ButtonDark
            text="Editar"
            onPress={() => setIsEditing(true)}
          />
        )}
      </View>
    </View>
  );
}