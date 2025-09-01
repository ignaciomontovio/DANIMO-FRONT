import CardsList from "@/app/cards/cardsList";
import { profileCardConfigProfesional, profileCardConfigUsuario, profileNavigationConfig, UserProfile } from "@/components/config/profileConfig";
import HeaderGoBack from "@/components/headerGoBack";
import ProfilePhoto from "@/components/profilePhoto";
import { URL_AUTH, URL_AUTH_PROF, URL_BASE } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { router } from "expo-router";
import React from "react";
import { Alert, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";



export default function Profile() {
    const token = useUserLogInStore((state) => state.token);
    const userEmail = useUserLogInStore((state) => state.mail); 
    const userType = useUserLogInStore((state) => state.userType); 
    const homePath = userType === "profesional"? "/profesional/home" : "/tabs/home"
    const profileCardConfig = userType === "profesional"? profileCardConfigProfesional : profileCardConfigUsuario
   
    const getProfile = async (): Promise<UserProfile[]> => {
      let profile: UserProfile | null = null;
      

      try {
        const response = await fetch(URL_BASE + (userType === "profesional" ? URL_AUTH_PROF : URL_AUTH) + "/profile", {
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
  const setUserLogIn = useUserLogInStore((state: { setUserLogIn: (userLogIn: true | false) => void }) => state.setUserLogIn);
  const handleLogoff = () => {
    setUserLogIn(false);
    router.replace("../auth/LoginRegisterScreen");
    };

  return(
    <SafeAreaProvider>
      {/* Header original con foto agregada */}
      <View className="relative">
        <HeaderGoBack text="Perfil" onPress={() => router.replace(homePath)} />
        
        {/* Foto de perfil posicionada absolutamente */}
        <View 
          style={{ 
            position: 'absolute', 
            right: 16, 
            top: 30,
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
        showCloseSession={true}
        onCloseSession={handleLogoff}
      />
    </SafeAreaProvider>
  );
}
