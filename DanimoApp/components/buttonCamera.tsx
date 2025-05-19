import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity } from "react-native";

type ButtonCameraProps = {
  onImageTaken?: (uri: string) => void;
};

export default function ButtonCamera({ onImageTaken }: ButtonCameraProps) {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Necesitamos acceso a la cámara.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      onImageTaken?.(uri); // llamamos al callback si lo pasa
      Alert.alert("Foto tomada", "La foto ha sido guardada.");
      // enviar al servidor
      // await uploadImage(uri);
    }
  };

  return (
    <ScrollView>
      <TouchableOpacity
        onPress={openCamera}
        className="flex-row items-center justify-center bg-color5 py-3 rounded-lg mb-4"
      >
        <FontAwesome name="camera" size={20} color="#fff" />
        <Text className="text-white font-bold ml-2 text-xl">Tomar Foto</Text>
      </TouchableOpacity>

      {/* {imageUri && (
        <Image
          source={{ uri: imageUri }}
          className="w-full h-48 rounded-lg mb-4"
          resizeMode="cover"
        />
      )} */}
    </ScrollView>
  );
}
