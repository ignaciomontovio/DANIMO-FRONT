import { ButtonDark, ButtonDark_add } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import { colors } from "@/stores/colors";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import * as React from "react";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CardConfig, NavigationConfig } from '../../components/config/configGeneric';

// TIPOS GENÉRICOS
type Props<T> = {
  name: string;
  fetchConfig: () => Promise<T[]>;
  navigationConfig: NavigationConfig<T>;
  cardConfig: CardConfig<T>;
  deleteFunct: (item: T) => Promise<void>;
  showDeleteIcon?:boolean;
  keepAdding?: boolean;
  showHeader?: boolean;
  showCloseSession?: boolean;
  onCloseSession?: () => void;
};

type PropsCard<T> = {
  element: T;
  onIcon: (item: T) => void;
  onButton: () => void;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  cardConfig: CardConfig<T>;
  showDeleteIcon: boolean;
  showCloseSession?: boolean
  onCloseSession?: () => void;
};

// COMPONENTE PRINCIPAL GENÉRICO
export default function CardsList<T>({
  name,
  fetchConfig,
  navigationConfig,
  cardConfig,
  deleteFunct,
  showDeleteIcon,
  keepAdding,
  showHeader,
  showCloseSession,
  onCloseSession,
}: Props<T>) {
  const [element, setElement] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  showDeleteIcon = showDeleteIcon ?? true;
  keepAdding = keepAdding ?? true;
  showHeader = showHeader ?? true;
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchConfig();
      setElement(data);
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
      setElement([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (item: T) => {
    Alert.alert("Eliminar", "¿Estás seguro que quieres eliminar?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteFunct(item);
            await fetchData();
          } catch (error) {
            console.error("Delete error:", error);
            Alert.alert("Error", "No se pudo eliminar.");
          }
        },
      },
    ]);
  };

  const gotoEdit = (item: T) => {
    const params = navigationConfig.getEditParams(item);
    router.push({
      pathname: navigationConfig.goto as any,
      params: { ...params, editing: "edit" },
    });
  };

  const gotoNew = () => {
    const params = navigationConfig.getNewParams();
    router.push({
      pathname: navigationConfig.goto as any,
      params,
    });
  };

  return (
    <SafeAreaProvider>
      <LinearGradient 
        colors={[colors.color5, colors.fondo]} 
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full h-full"
      >
        {showHeader && <HeaderGoBack text={name} onPress={() => router.replace("/tabs/home")} />}
        <ScrollView className="flex-1 px-5 py-5">
          <View className="flex-1 justify-center items-center">
            {loading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : element && element.length > 0 ? (
              <>
                {element.map((el, index) => (
                  <Card
                    key={index}
                    element={el}
                    onButton={() => gotoEdit(el)}
                    onIcon={() => handleDelete(el)}
                    icon="trash"
                    cardConfig={cardConfig}
                    showDeleteIcon = {showDeleteIcon}
                    showCloseSession={showCloseSession}
                    onCloseSession={onCloseSession}
                  />
                ))}
              </>
            ) : null}
            {keepAdding ? 
              <ButtonDark_add onPress={() => gotoNew()} /> 
              : 
              <View className="w-16 h-16 mt-4 mb-20"></View>}
           
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

// COMPONENTE CARD GENÉRICO
function Card<T>({ element, onIcon, onButton, icon, cardConfig, showDeleteIcon,showCloseSession, onCloseSession }: PropsCard<T>) {
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
        <Text className="text-2xl font-bold text-white text-center">
          {cardConfig.getTitle(element)}
        </Text>
        {showDeleteIcon && 
            <TouchableOpacity 
              onPress={() => onIcon(element)} 
              style={{ 
                position: "absolute", 
                top: 10, 
                right: 16,
                padding: 4,
              }}
            >
              <FontAwesome name={icon} size={20} color="white" />
            </TouchableOpacity>
        }
      </View>
      
      <View className="p-6 bg-fondo rounded-b-2xl">
        {cardConfig.renderContent(element)}
        <ButtonDark text="Editar" onPress={onButton} />
        {showCloseSession && <ButtonDark text="Cerrar Sesión" onPress={onCloseSession} />}        
      </View>
    </View>
  );
}