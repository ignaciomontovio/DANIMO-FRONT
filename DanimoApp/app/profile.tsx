import { profileCardConfig, profileNavigationConfig, UserProfile } from "@/components/config/profileConfig";
import HeaderGoBack from "@/components/headerGoBack";
import ProfilePhoto from "@/components/profilePhoto";
import { URL_AUTH, URL_BASE } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { router } from "expo-router";
import React from "react";
import { Alert, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CardsList from "./cards/cardsList";



export default function Profile() {
    const token = useUserLogInStore((state) => state.token);
    const userEmail = useUserLogInStore((state) => state.mail); 

    const getProfile = async (): Promise<UserProfile[]> => {
      let profile: UserProfile | null = null;

      try {
        const response = await fetch(URL_BASE + URL_AUTH + "/profile", {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          console.log("Datos del perfil recibidos:", userData);
          console.log("Todos los campos:", Object.keys(userData));

          profile = {
            name: userData.firstName || "Sin nombre",
            lastName: userData.lastName || "Sin apellido",
            email:
              userEmail ||
              userData.email ||
              userData.userEmail ||
              userData.emailAddress ||
              "Sin email",
            d_birth: userData.birthDate
              ? new Date(userData.birthDate).toISOString()
              : new Date().toISOString(),
            occupation: userData.occupation || "Sin ocupación",
            livesWith: userData.livesWith || "Sin especificar",
            code:
              userData.codigo ||
              userData.code ||
              userData.id ||
              userData.userId ||
              "Sin código",
          };
        } else {
          console.error("Error al cargar perfil:", response.status);
          Alert.alert("Error", "No se pudieron cargar los datos del perfil");
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
        Alert.alert("Error", "Error de conexión al cargar el perfil");
      }

      // Retornar como array, aunque solo haya un perfil
      return profile ? [profile] : [];
    };


  return(
    <SafeAreaProvider>
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
      <CardsList<UserProfile>  
        name="Contacto"
        fetchConfig={getProfile}
        navigationConfig={profileNavigationConfig}
        cardConfig={profileCardConfig}
        deleteFunct={async () => {}}
        showDeleteIcon={false}
        keepAdding={false}
        showHeader={false}
      />
    </SafeAreaProvider>
  );
}
