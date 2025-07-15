// import { ButtonDark_small, ButtonLight_small, } from "@/components/buttons";
// import { colors } from "@/stores/colors";
// import { URL_AUTH, URL_BASE } from "@/stores/consts";
// import { useUserLogInStore } from "@/stores/userLogIn";
// import { FontAwesome } from "@expo/vector-icons";
// import { router } from "expo-router";
// import React, { useEffect, useState } from "react";
// import { Alert, Pressable, Text, View } from "react-native";
// import LinearGradient from "react-native-linear-gradient";


// export default function Profile() {
   
//   const setUserLogIn = useUserLogInStore((state: { setUserLogIn: (userLogIn: true | false) => void }) => state.setUserLogIn);
  
//   const token = useUserLogInStore((state) => state.token);

//   const [name, setName] = useState("")
  
//   const handleLogoff = () => {
//     setUserLogIn(false);
//     router.replace("../auth/LoginRegisterScreen");
//   };
//   useEffect(() => {
//     const getProfile = async () => {
//       try {
//         const response = await fetch(URL_BASE + URL_AUTH + "/profile", {
//           method: "GET",
//           headers: {
//             "Authorization": "Bearer " + token,
//           },
//         });

//         if (response.ok) {
//           const userData = await response.json();
//           console.log("Datos del perfil recibidos:", userData);
//           console.log("Todos los campos:", Object.keys(userData));
//           setName(userData.firstName || "Sin nombre")
//         } else {
//           console.error("Error al cargar perfil:", response.status);
//           Alert.alert("Error", "No se pudieron cargar los datos del perfil");
//         } 
//       } catch (error) {
//         console.error("Error loading profile data:", error);
//         Alert.alert("Error", "Error de conexión al cargar el perfil");
//       }
//     };
//     getProfile();
//   }, [token]);
  
//   return (
//     <LinearGradient
//       colors={[colors.color5, colors.fondo]}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 0, y: 1 }}
//       className="w-full h-full"
//     >
//       <View className="flex-1 items-center justify-start space-y-15 px-6 py-10">
//         <View className="w-full flex-row items-center justify-center gap-2 px-2 py-6">
//           {/* Ícono de usuario */}
//           <View className="rounded-full p-4 border-2 border-oscuro bg-colo2 shadow-md">
//             <FontAwesome name="user" size={60} color={colors.oscuro} />
//           </View>

//           {/* Info del usuario */}
//           <View className="flex-1">
//             <View className="bg-fondo px-4 py-2 rounded-full border border-oscuro shadow-sm">
//               <Text className="text-oscuro text-center font-bold text-lg">{name}</Text>
//             </View>
//             <Pressable onPress={() => router.replace("/profile")}>
//               <Text className="text-right text-oscuro font-bold mt-1 text-xl">
//                 Perfil &gt;
//               </Text>
//             </Pressable>
//           </View>
//         </View>

//         <ButtonLight_small onPress={() => ("")} text="Rutinas" />
//         <ButtonLight_small onPress={() => ("")} text="Pacientes Ascociados" />
//         <ButtonDark_small onPress={handleLogoff} text="Cerrar Sesión" />
//       </View>
//     </LinearGradient>
//   );
// }
import React from "react";
import Profile from "../profile";


export default function Menu() {
  return (
    <Profile/>
  );
}
