import HeaderGoBack from "@/components/headerGoBack";
import { colors } from "@/stores/colors";
import { FontAwesome } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Animated,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export default function RecomendacionScreen() {
  
  const floatAnim = React.useRef(new Animated.Value(0)).current;
  const [currentLocation, setCurrentLocation] = React.useState<{lat: number, lng: number} | null>(null);
  const [mapUrl, setMapUrl] = React.useState<string>("");

  // Función para obtener la ubicación actual
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== "granted") {
        Alert.alert(
          "Permiso requerido",
          "Esta app necesita acceso a la ubicación para mostrar centros médicos cercanos.",
          [{ text: "OK" }]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const newLocation = {
        lat: location.coords.latitude,
        lng: location.coords.longitude
      };

      setCurrentLocation(newLocation);
      setMapUrl("https://www.google.com/maps/@" + newLocation.lat + "," + newLocation.lng + ",15z");
      
    } catch (error) {
      console.error("Error obteniendo ubicación:", error);
    }
  };

  // Efecto para obtener ubicación inicial
  React.useEffect(() => {
    getCurrentLocation();
  }, []);

  React.useEffect(() => {
    const startFloating = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    startFloating();
  }, [floatAnim]);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });
  
  const showPsicologos = () => {
    if (!currentLocation) {
      Alert.alert("Ubicación no disponible", "Esperando ubicación actual...");
      return;
    }
    const url = "https://www.google.com/maps/search/psicologos/@" + currentLocation.lat + "," + currentLocation.lng + ",15z";
    setMapUrl(url);
  };

  const showCentrosMedicos = () => {
    if (!currentLocation) {
      Alert.alert("Ubicación no disponible", "Esperando ubicación actual...");
      return;
    }
    const url = "https://www.google.com/maps/search/centro+medico+psicologico/@" + currentLocation.lat + "," + currentLocation.lng + ",15z";
    setMapUrl(url);
  };

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={[colors.color2, colors.fondo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full h-full"
      >
        <HeaderGoBack
          text="Recomendación"
          onPress={() => router.back()}
        />

        <ScrollView className="flex-1 px-5 py-5">
          {/* Mapa con WebView */}
          <View 
            className="w-full h-96 rounded-xl mb-4 overflow-hidden"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
          {mapUrl ? (
            <WebView
              source={{ uri: mapUrl }}
              style={{ flex: 1 }}
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              startInLoadingState={true}
              key={mapUrl}
              renderLoading={() => (
                <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.color4 }}>
                  <FontAwesome name="map" size={40} color={colors.oscuro} />
                  <Text className="text-center mt-2 text-sm" style={{ color: colors.oscuro }}>
                    Cargando mapa...
                  </Text>
                </View>
              )}
            />
          ) : (
            <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.color4 }}>
              <FontAwesome name="location-arrow" size={40} color={colors.oscuro} />
              <Text className="text-center mt-2 text-sm" style={{ color: colors.oscuro }}>
                Obteniendo ubicación...
              </Text>
            </View>
          )}
          </View>

          {/* Botones para cambiar vista del mapa */}
          <View className="mb-6">
            <TouchableOpacity
              onPress={showPsicologos}
              className="mb-3 p-4 rounded-xl flex-row items-center justify-center"
              style={{ backgroundColor: colors.color1 }}
            >
              <FontAwesome name="user-md" size={24} color="white" className="mr-3" />
              <Text className="text-white font-bold text-lg ml-3">
                Ver Psicólogos Cercanos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={showCentrosMedicos}
              className="p-4 rounded-xl flex-row items-center justify-center"
              style={{ backgroundColor: colors.color5 }}
            >
              <FontAwesome name="hospital-o" size={24} color="white" className="mr-3" />
              <Text className="text-white font-bold text-lg ml-3">
                Ver Centros Médicos Psicológicos
              </Text>
            </TouchableOpacity>
          </View>

          <View className="items-center mb-6">
            <Animated.View style={{ transform: [{ translateY }] }}>
              <Image
                source={require("../../assets/images/bicho-transparent.png")}
                className="w-32 h-32"
                resizeMode="contain"
              />
            </Animated.View>
          </View>

        </ScrollView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}