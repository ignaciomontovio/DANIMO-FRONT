
import { ButtonDark } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import Navbar from "@/components/navbar";
import ShowInfo from "@/components/showInfo";
import { useUserLogInStore } from "@/stores/userLogIn";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import * as React from "react";
import { useState } from "react";
import { Alert, ScrollView, Text, TextInput, View } from "react-native";
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
        colors={["#D2A8D6", "#F4E1E6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full h-full"
      >
        <HeaderGoBack text="Perfil" onPress={() => router.replace("/tabs/home")} />
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
  onChangeText 
}: {
  icon: keyof typeof FontAwesome.glyphMap;
  text: string;
  onChangeText: (text: string) => void;
}) {
  return (
    <View className="flex-row items-center mb-3 p-3 bg-gray-50 rounded-lg">
      <FontAwesome name={icon} size={16} color="#666" />
      <TextInput
        value={text}
        onChangeText={onChangeText}
        className="flex-1 text-base text-gray-800 ml-3"
        placeholder="Ingresa valor..."
        placeholderTextColor="#999"
        style={{
          minHeight: 24,
          borderBottomWidth: 1,
          borderBottomColor: '#ddd',
          paddingBottom: 2,
        }}
      />
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
          />
        ) : (
          <ShowInfo text={profile.name} icon="user" />
        )}

        {isEditing ? (
          <ShowInfo_edit
            icon="envelope"
            text={editedProfile.email}
            onChangeText={(text) => handleFieldChange('email', text)}
          />
        ) : (
          <ShowInfo text={profile.email} icon="envelope" />
        )}

        {isEditing ? (
          <ShowInfo_edit
            icon="calendar"
            text={editedProfile.d_birth}
            onChangeText={(text) => handleFieldChange('d_birth', text)}
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