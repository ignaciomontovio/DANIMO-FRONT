
import SelectFive from "@/components/SelectFive";
import { router, useFocusEffect } from "expo-router";
import { FlatList, Modal, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { ButtonDark } from "@/components/buttons";
import QuoteCard from "@/components/QuoteCard";
import SearchBar from "@/components/SearchBar";
import TermsModal from "@/components/TermsModal";
import { colors } from "@/stores/colors";
import { useUserLogInStore } from "@/stores/userLogIn";
import { useTermsAndConditions } from "@/stores/useTermsAndConditions";
import { FontAwesome } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import MiniMetrics from "../../components/MiniMetrics";

// Datos de búsqueda
const SEARCH_ITEMS = [
  // Navegación principal
  { id: '1', title: 'Estadísticas', subtitle: 'Ver mis métricas', route: '/tabs/stats', icon: 'bar-chart', category: 'navegacion' },
  { id: '2', title: 'Rutinas', subtitle: 'Gestionar rutinas', route: '/tabs/rutines', icon: 'list', category: 'navegacion' },
  { id: '3', title: 'Menú', subtitle: 'Configuración y perfil', route: '/tabs/menu', icon: 'bars', category: 'navegacion' },
  { id: '4', title: 'SOS', subtitle: 'Ayuda de emergencia', route: '/tabs/sos', icon: 'exclamation-triangle', category: 'navegacion' },
  
  // Funcionalidades
  { id: '5', title: 'Registrar Emoción', subtitle: 'Como me siento ahora', route: '/screensOnlyUser/detailEmotion', icon: 'heart', category: 'registro' },
  { id: '6', title: 'Registrar Sueño', subtitle: 'Como dormí', route: '/screensOnlyUser/detailSleep', icon: 'moon-o', category: 'registro' },
  { id: '7', title: 'Profesionales', subtitle: 'Ver profesionales asociados', route: '/screensOnlyUser/ascociatedProf', icon: 'user-md', category: 'profesionales' },
  { id: '8', title: 'Chat', subtitle: 'Hablar con profesional', route: '/screensOnlyUser/chat', icon: 'comments', category: 'profesionales' },
  { id: '9', title: 'Medicaciones', subtitle: 'Gestionar medicamentos', route: '/screensOnlyUser/medications', icon: 'medkit', category: 'salud' },
  { id: '10', title: 'Contactos de Emergencia', subtitle: 'Configurar contactos', route: '/screensOnlyUser/emergencyContacts', icon: 'phone', category: 'salud' },
  
  // Emociones para búsqueda rápida
  { id: '11', title: 'Alegría', subtitle: 'Registrar emoción alegre', route: '/screensOnlyUser/detailEmotion', params: { value: '1' }, icon: 'smile-o', category: 'emociones' },
  { id: '12', title: 'Tristeza', subtitle: 'Registrar emoción triste', route: '/screensOnlyUser/detailEmotion', params: { value: '2' }, icon: 'frown-o', category: 'emociones' },
  { id: '13', title: 'Enojo', subtitle: 'Registrar emoción de enojo', route: '/screensOnlyUser/detailEmotion', params: { value: '3' }, icon: 'angry', category: 'emociones' },
  { id: '14', title: 'Miedo', subtitle: 'Registrar emoción de miedo', route: '/screensOnlyUser/detailEmotion', params: { value: '4' }, icon: 'exclamation', category: 'emociones' },
  { id: '15', title: 'Ansiedad', subtitle: 'Registrar emoción de ansiedad', route: '/screensOnlyUser/detailEmotion', params: { value: '5' }, icon: 'bolt', category: 'emociones' },
];

export default function Home() {
  // Estados de búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [filteredItems, setFilteredItems] = useState(SEARCH_ITEMS);

  // Estado para controlar si ya se mostró en esta sesión
  const [hasShownInSession, setHasShownInSession] = useState(false);

  // Resetear búsqueda cada vez que la pantalla gane foco
  useFocusEffect(
    useCallback(() => {
      setSearchQuery('');
      setShowSearchResults(false);
      setFilteredItems(SEARCH_ITEMS);
    }, [])
  );

  // Estados del usuario
  const userType = useUserLogInStore((state) => state.userType);
  const userLogIn = useUserLogInStore((state) => state.userLogIn);
  const token = useUserLogInStore((state) => state.token);

  // Hook de términos y condiciones
  const {
    showTermsModal,
    hasAcceptedTerms,
    loading,
    isReadOnlyMode,
    handleAcceptTerms,
    handleCloseModal,
  } = useTermsAndConditions();

  // Verificar si estamos en las condiciones correctas para mostrar el modal
  const isUserReady = userLogIn && token && userType === 'usuario';

  // Marcar como mostrado cuando el modal se muestre
  useEffect(() => {
    if (Boolean(showTermsModal) && !hasShownInSession && isUserReady) {
      setHasShownInSession(true);
    }
  }, [showTermsModal, hasShownInSession, isUserReady]);

  // Solo mostrar el modal si:
  // 1. El usuario está logueado
  // 2. Es tipo "usuario" (no profesional)  
  // 3. El hook dice que debe mostrarse
  // 4. No se ha mostrado ya en esta sesión
  const shouldShowModal = isUserReady && Boolean(showTermsModal) && !hasShownInSession;

  // Manejar el cierre del modal
  const handleModalClose = () => {
    setHasShownInSession(true); // Marcar como mostrado
    handleCloseModal(); // Ejecutar el close original
  };

  // Manejar la aceptación
  const handleModalAccept = () => {
    setHasShownInSession(true); // Marcar como mostrado
    handleAcceptTerms(); // Ejecutar la aceptación original
  };

  // Función para cambiar texto (sin abrir modal)
  const handleTextChange = (query: string) => {
    setSearchQuery(query);
  };

  // Función de búsqueda (abrir modal)
  const handleSearch = (query: string) => {
    if (query.trim() === '') {
      setShowSearchResults(false);
      setFilteredItems(SEARCH_ITEMS);
    } else {
      const filtered = SEARCH_ITEMS.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredItems(filtered);
      setShowSearchResults(true);
    }
  };

  // Manejar selección de item de búsqueda
  const handleSelectSearchItem = (item: typeof SEARCH_ITEMS[0]) => {
    // Limpiar búsqueda completamente
    setSearchQuery('');
    setShowSearchResults(false);
    setFilteredItems(SEARCH_ITEMS);
    
    if (item.params) {
      router.push({ pathname: item.route as any, params: item.params });
    } else {
      router.push(item.route as any);
    }
  };

  // Renderizar item de búsqueda
  const renderSearchItem = ({ item }: { item: typeof SEARCH_ITEMS[0] }) => (
    <TouchableOpacity
      onPress={() => handleSelectSearchItem(item)}
      className="flex-row items-center p-4 border-b border-gray-100"
    >
      <View className="w-10 h-10 rounded-full items-center justify-center mr-3" 
            style={{ backgroundColor: colors.color1 + '20' }}>
        <FontAwesome name={item.icon as any} size={18} color={colors.color1} />
      </View>
      <View className="flex-1">
        <Text className="text-oscuro font-semibold text-base">{item.title}</Text>
        <Text className="text-oscuro opacity-60 text-sm">{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={[colors.color5, colors.fondo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-full h-full"
    >
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-4 pb-20 py-10">
          <View className="space-y-5 mb-10">
            <SearchBar 
              placeholder="Buscar funciones, emociones..." 
              value={searchQuery}
              onChangeText={handleTextChange}
              onSearch={handleSearch}
            />
            
            {/* <SpeechToText/> */}

            <SelectFive goto="/screensOnlyUser/detailEmotion" message="¿Cuál es tu estado de ánimo?" type="Emoción"/>
            <SelectFive goto="/screensOnlyUser/detailSleep" message="¿Cómo dormiste?" type="Sueño" />
            <ButtonDark text="Profesionales Asociados" onPress={()=>{router.replace("/screensOnlyUser/ascociatedProf")}} />
            <View className="flex-row justify-center items-center">
              <QuoteCard/>   
              <MiniMetrics onPress={() => router.push("/tabs/stats")}/>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Modal de términos y condiciones - Solo para usuarios logueados como "usuario" */}
      <TermsModal
        isVisible={Boolean(shouldShowModal)}
        onAccept={handleModalAccept}
        onClose={handleModalClose}
        loading={Boolean(loading)}
        isReadOnlyMode={Boolean(isReadOnlyMode)}
      />

      {/* Modal de resultados de búsqueda */}
      <Modal
        visible={showSearchResults}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSearchResults(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowSearchResults(false)}
          className="flex-1 bg-black/50 justify-start pt-32"
        >
          <View
            className="bg-white mx-4 rounded-2xl max-h-96"
            style={{
              shadowColor: colors.oscuro,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            }}
            onStartShouldSetResponder={() => true}
          >
            <View className="p-4 border-b border-gray-100">
              <Text className="text-lg font-bold text-oscuro">
                Resultados ({filteredItems.length})
              </Text>
            </View>
            
            {filteredItems.length > 0 ? (
              <FlatList
                data={filteredItems}
                renderItem={renderSearchItem}
                keyExtractor={(item) => item.id}
                maxToRenderPerBatch={10}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View className="p-8 items-center">
                <FontAwesome name="search" size={40} color={colors.oscuro + '30'} />
                <Text className="text-oscuro opacity-60 text-center mt-2">
                  No se encontraron resultados para "{searchQuery}"
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </LinearGradient>
  );
}