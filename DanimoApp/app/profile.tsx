import { ButtonDark } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import Navbar from "@/components/navbar";
import ShowInfo from "@/components/showInfo";
import { colors } from "@/stores/colors";
import { URL_AUTH, URL_BASE } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";
import * as React from "react";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";

type UserProfile = {
  email: string;
  name: string;
  lastName: string;
  d_birth: Date;
  occupation: string;
  livesWith: string;
  codigo: string;
};

// Componente editable que mantiene EXACTAMENTE el estilo de ShowInfo
function ShowInfoEditable({ 
  icon, 
  text, 
  onChangeText,
  placeholder
}: {
  icon: keyof typeof FontAwesome.glyphMap;
  text: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}) {
  return (
    <View className="w-full py-3 px-5 rounded-md mt-2 shadow-2xl border border-oscuro flex-row items-center justify-start">
      <FontAwesome name={icon} size={30} color={colors.oscuro} />
      <TextInput
        className="text-oscuro px-5 font-bold text-lg flex-1"
        value={text}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.oscuro + "80"}
        selectionColor={colors.color1}
      />
    </View>
  );
}

// Componente para date picker que mantiene EXACTAMENTE el estilo de ShowInfo
function ShowInfoDatePicker({ 
  icon, 
  text, 
  onPress
}: {
  icon: keyof typeof FontAwesome.glyphMap;
  text: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="w-full py-3 px-5 rounded-md mt-2 shadow-2xl border border-oscuro flex-row items-center justify-start">
        <FontAwesome name={icon} size={30} color={colors.oscuro} />
        <Text className="text-oscuro px-5 font-bold text-lg">{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function profile() {
  const setUserLogIn = useUserLogInStore(
    (state: { setUserLogIn: (userLogIn: true | false) => void }) => state.setUserLogIn
  );
  const token = useUserLogInStore((state) => state.token);
  const userEmail = useUserLogInStore((state) => state.mail); // ✅ Obtener email del store
  
  // Estados para los datos del perfil
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para la edición del perfil
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    gender: "",
    occupation: "",
    livesWith: "",
  });

  // Cargar datos del perfil al montar el componente
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const response = await fetch(URL_BASE + URL_AUTH + "/profile", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log("Datos del perfil recibidos:", userData);
        console.log("userData.email:", userData.email);
        console.log("userData.userEmail:", userData.userEmail);
        console.log("userData.emailAddress:", userData.emailAddress);
        console.log("Todos los campos:", Object.keys(userData));
        
        // Convertir los datos del backend al formato esperado
        const profile = {
          name: userData.firstName || "Sin nombre",
          lastName: userData.lastName || "Sin apellido", 
          email: userEmail || userData.email || userData.userEmail || userData.emailAddress || "Sin email", // ✅ Usar email del store primero
          d_birth: userData.birthDate ? new Date(userData.birthDate) : new Date(),
          occupation: userData.occupation || "Sin ocupación",
          livesWith: userData.livesWith || "Sin especificar",
          codigo: userData.codigo || userData.code || userData.id || userData.userId || "Sin código"
        };
        
        setProfileData(profile);
        
        // Inicializar datos de edición
        setEditedProfile({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userEmail || userData.email || "",
          birthDate: userData.birthDate || profile.d_birth.toISOString().split('T')[0],
          gender: userData.gender || "",
          occupation: userData.occupation || "",
          livesWith: userData.livesWith || "",
        });
      } else {
        console.error("Error al cargar perfil:", response.status);
        Alert.alert("Error", "No se pudieron cargar los datos del perfil");
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      Alert.alert("Error", "Error de conexión al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  // Funciones para editar perfil
  const handleFieldChange = (field: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      handleFieldChange('birthDate', dateString);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const formatDateForDisplay = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES');
    } catch {
      return dateString;
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log("Guardando perfil:", editedProfile);
      
      // Validar campos obligatorios
      if (!editedProfile.occupation || editedProfile.occupation.trim() === "") {
        Alert.alert("Campo obligatorio", "La ocupación es obligatoria");
        return;
      }
      
      if (!editedProfile.livesWith || editedProfile.livesWith.trim() === "") {
        Alert.alert("Campo obligatorio", "El campo 'Vive con' es obligatorio");
        return;
      }
      
      // Usar los campos correctos del backend
      const bodyData = {
        firstName: editedProfile.firstName,
        lastName: editedProfile.lastName,
        email: editedProfile.email,
        birthDate: editedProfile.birthDate,
        gender: editedProfile.gender,
        occupation: editedProfile.occupation,
        livesWith: editedProfile.livesWith,
      };
      
      console.log("Enviando datos:", bodyData);
      
      const response = await fetch(URL_BASE + URL_AUTH + "/update-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      
      Alert.alert("Éxito", "Perfil actualizado correctamente");
      setIsEditing(false);
      
      // Recargar datos del perfil
      await loadProfileData();
      
    } catch (error) {
      console.error("Error guardando perfil:", error);
      Alert.alert("Error", "No se pudo guardar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profileData) {
      // Resetear con los datos originales del backend
      loadProfileData();
    }
    setIsEditing(false);
  };

  const handleLogoff = () => {
    setUserLogIn(false);
    router.replace("../auth/LoginRegisterScreen");
  };

  // Mostrar loading mientras se cargan los datos
  if (loading) {
    return (
      <SafeAreaProvider>
        <LinearGradient
          colors={[colors.color5, colors.fondo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="w-full h-full flex items-center justify-center"
        >
          <ActivityIndicator size="large" color={colors.oscuro} />
          <Text className="text-center mt-4" style={{ color: colors.oscuro }}>
            Cargando perfil...
          </Text>
        </LinearGradient>
      </SafeAreaProvider>
    );
  }

  // Mostrar error si no se pudieron cargar los datos
  if (!profileData) {
    return (
      <SafeAreaProvider>
        <LinearGradient
          colors={[colors.color5, colors.fondo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="w-full h-full flex items-center justify-center"
        >
          <Text className="text-center text-red-500 mb-4">
            Error al cargar los datos del perfil
          </Text>
          <ButtonDark 
            text="Reintentar" 
            onPress={loadProfileData}
          />
        </LinearGradient>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={[colors.color5, colors.fondo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full h-full"
      >
        {/* Header original con foto agregada */}
        <View className="relative">
          <HeaderGoBack text="Perfil" onPress={() => router.replace("/tabs/home")} />
          
          {/* Foto de perfil posicionada absolutamente */}
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
        
        <ScrollView className="flex-1 px-5 py-1" style={{ paddingBottom: 130 }}>
          <View className="mb-1">
            {/* ProfileCard integrado */}
            <View
              className="w-full max-w-sm rounded-2xl shadow-xl mb-4"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 10,
              }}
            >
              <View className="py-2 bg-color1 rounded-t-2xl relative">
                <Text className="text-xl font-bold text-white text-center">Perfil</Text>
              </View>

              <View className="p-2 bg-fondo rounded-b-2xl">
                {/* Nombre */}
                {isEditing ? (
                  <ShowInfoEditable
                    text={editedProfile.firstName}
                    icon="user"
                    onChangeText={(text) => handleFieldChange('firstName', text)}
                  />
                ) : (
                  <ShowInfo text={profileData.name} icon="user" />
                )}

                {/* Apellido */}
                {isEditing ? (
                  <ShowInfoEditable
                    text={editedProfile.lastName}
                    icon="user"
                    onChangeText={(text) => handleFieldChange('lastName', text)}
                  />
                ) : (
                  <ShowInfo text={profileData.lastName} icon="user" />
                )}

                {/* Email */}
                {isEditing ? (
                  <ShowInfoEditable
                    text={editedProfile.email}
                    icon="envelope"
                    onChangeText={(text) => handleFieldChange('email', text)}
                  />
                ) : (
                  <ShowInfo text={profileData.email} icon="envelope" />
                )}

                {/* Ocupación */}
                {isEditing ? (
                  <ShowInfoEditable
                    text={editedProfile.occupation}
                    icon="briefcase"
                    placeholder="Ej: Desarrollador, Médico, Estudiante..."
                    onChangeText={(text) => handleFieldChange('occupation', text)}
                  />
                ) : (
                  <ShowInfo text={profileData.occupation} icon="briefcase" />
                )}

                {/* Vive con */}
                {isEditing ? (
                  <ShowInfoEditable
                    text={editedProfile.livesWith}
                    icon="home"
                    placeholder="Ej: Familia, Solo, Pareja, Amigos..."
                    onChangeText={(text) => handleFieldChange('livesWith', text)}
                  />
                ) : (
                  <ShowInfo text={profileData.livesWith} icon="home" />
                )}

                {/* Fecha de nacimiento */}
                {isEditing ? (
                  <ShowInfoDatePicker
                    text={formatDateForDisplay(editedProfile.birthDate)}
                    icon="calendar"
                    onPress={showDatePickerModal}
                  />
                ) : (
                  <ShowInfo text={profileData.d_birth.toLocaleDateString()} icon="calendar" />
                )}

                <ShowInfo text={profileData.codigo} icon="share" />
                
                {isEditing ? (
                  <View className="flex-row gap-1 mt-0">
                    <View className="flex-1">
                      <ButtonDark
                        text={saving ? "Guardando..." : "Guardar"}
                        onPress={handleSave}
                        disabled={saving}
                      />
                    </View>
                    <View className="flex-1">
                      <ButtonDark
                        text="Cancelar"
                        onPress={handleCancel}
                        disabled={saving}
                      />
                    </View>
                  </View>
                ) : (
                  <View className="mt-0">
                    <ButtonDark
                      text="Editar"
                      onPress={() => setIsEditing(true)}
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
        
        {/* DatePicker Modal */}
        {showDatePicker && (
          <DateTimePicker
            value={new Date(editedProfile.birthDate)}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
            minimumDate={new Date(1900, 0, 1)}
          />
        )}
        
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

// Componente de foto de perfil integrado con backend
function ProfilePhoto() {
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
      return `data:${mimeType};base64,${base64}`;
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
        const errorText = await response.text();
        throw new Error(errorText);
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
      console.log("Base64 size:", `${Math.round(base64Size / 1024)}KB`);
      
      if (base64Size > 100000) {
        Alert.alert(
          "Imagen muy grande", 
          `La imagen es de ${Math.round(base64Size / 1024)}KB. El servidor solo acepta imágenes muy pequeñas. Intenta con una imagen más pequeña o pide al administrador que aumente el límite del servidor.`
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