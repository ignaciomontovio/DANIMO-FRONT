import CardRutine, { Rutine } from "@/app/cards/cardRutine";
import HeaderGoBack from "@/components/headerGoBack";
import { colors } from "@/stores/colors";
import { ALL_EMOTIONS, URL_BASE, URL_RUTINE } from "@/stores/consts";
import { useUserLogInStore } from "@/stores/userLogIn";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Rutines() {
  const { emotionFromChat } =
    useLocalSearchParams<{ emotionFromChat: string }>();

  const [loading, setLoading] = useState(true);
  const [rutinas, setRutinas] = useState<Rutine[]>([]);
  const token = useUserLogInStore((state) => state.token);

  // Emociones seleccionadas (pills)
  const [emotions, setEmotions] = useState<Record<string, boolean>>({});

  // Tipo de rutinas: Sistema / Profesional (pills)
  const [type, setType] = useState<Record<string, boolean>>({
    Sistema: true,
    Profesional: true,
  });

  // Evita inicializar varias veces
  const [initialized, setInitialized] = useState(false);

  // Inicializar emociones y aplicar posible emotionFromChat solo 1 vez
  useEffect(() => {
    if (initialized) return;

    // inicializamos emociones (por defecto Tristeza true como pedías antes)
    const initialEmotions = Object.fromEntries(
      ALL_EMOTIONS.filter((emotion) => emotion !== "Alegría").map((emotion) => [
        emotion,
        false,
      ])
    );
    initialEmotions["Tristeza"] = true;

    // si llega emotionFromChat, activala
    if (emotionFromChat) {
      initialEmotions[emotionFromChat] = true;
    }

    setEmotions(initialEmotions);

    // inicializamos tipos (ambos true por defecto para ver todo)
    setType({ Sistema: true, Profesional: true });

    setInitialized(true);
  }, [initialized, emotionFromChat]);

  // Si en algún momento llega emotionFromChat después (casos raros), lo aplicamos
  useEffect(() => {
    if (!emotionFromChat) return;
    // si no está inicializado aún, el primer useEffect se encargará
    if (!initialized) return;
    setEmotions((prev) => ({ ...prev, [emotionFromChat]: true }));
  }, [emotionFromChat, initialized]);

  // fetchData: solo obtiene rutinas y las setea
  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setLoading(true);
        const response = await fetch(URL_BASE + URL_RUTINE + "/obtain", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          signal,
        });

        if (!response.ok) {
          const errorText = await response.json();
          console.error("Error:", errorText.error);
          throw new Error(errorText.error);
        }

        const data = await response.json();
        const rutinasBack = Array.isArray(data) ? data : data.data || [];

        // Transformamos las rutinas para que Users sea un array de emails
        const rutinasConEmails = rutinasBack.map((rutina: { Users: any[] }) => ({
          ...rutina,
          Users: Array.isArray(rutina.Users)
            ? rutina.Users.map((user) => user.email)
            : [],
        }));

        setRutinas(rutinasConEmails);
      } catch (error) {
        // si fue abort, no mostrar alerta
        if ((error as any)?.name === "AbortError") return;
        console.error("Error al obtener rutinas:", error);
        Alert.alert("Error", "No se pudo obtener la lista de rutinas.");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // Llamamos fetchData cuando token cambie / componente monte
  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData, token]);

  // Toggle helper
  const toggle = (
    key: string,
    state: Record<string, boolean>,
    setState: (val: Record<string, boolean>) => void
  ) => {
    setState({ ...state, [key]: !state[key] });
  };

  // Pill container como componente (no invocarlo como función)
  const PILL_STYLE =
    "pl-2 pr-3 py-2 rounded-r-full text-sm font-semibold mr-2 mb-2 flex-row space-x-1";
  const ACTIVE_PILL_STYLE = "bg-color1 text-white shadow-lg";
  const INACTIVE_PILL_STYLE = "bg-gray-200 text-gray-400 opacity-50";

  const PillContainer = ({
    list,
    setList,
    title,
  }: {
    list: Record<string, boolean>;
    setList: (val: Record<string, boolean>) => void;
    title?: string;
  }) => (
    <View className="relative mt-5">
      <View className="absolute top-0 left-0 right-0 bottom-0 bg-fondo rounded-2xl opacity-70 shadow-xl shadow-black/20" />
      <View className="p-2 rounded-2xl">
        {title ? (
          <Text className="text-sm font-semibold mb-2 text-center">{title}</Text>
        ) : null}
        <View className="flex-row flex-wrap justify-center">
          {Object.entries(list).map(([key, selected]) => (
            <TouchableOpacity
              key={key}
              className={`${PILL_STYLE} ${
                selected ? ACTIVE_PILL_STYLE : INACTIVE_PILL_STYLE
              }`}
              onPress={() => toggle(key, list, setList)}
            >
              <Text className={selected ? "text-white font-bold" : "text-gray-400"}>
                {key}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  // Derivados: filtramos rutinas según emociones seleccionadas y tipo
  const filteredRutinas = useMemo(() => {
    // Si no hay emociones marcadas, devolvemos array vacío
    const activeEmotions = Object.entries(emotions)
      .filter(([, v]) => v)
      .map(([k]) => k);

    if (!activeEmotions.length) return [] as Rutine[];

    return rutinas.filter((rutina) =>
      (rutina.emotion || []).some((e) => activeEmotions.includes(e))
    );
  }, [rutinas, emotions]);

  const rutinasSistema = useMemo(() => {
    if (!type["Sistema"]) return [];
    return filteredRutinas.filter((r) => r.createdBy === "system");
  }, [filteredRutinas, type]);

  const rutinasPersonalizadas = useMemo(() => {
    if (!type["Profesional"]) return [];
    return filteredRutinas.filter((r) => r.createdBy !== "system");
  }, [filteredRutinas, type]);

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={[colors.color5, colors.fondo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full h-full"
      >
        <HeaderGoBack text="Rutinas" onPress={() => router.replace("/tabs/home")} />

        {/* Emotions pills */}
        <PillContainer list={emotions} setList={setEmotions} />

        {/* Type pills (Sistema / Profesional) */}
        {/* <PillContainer list={type} setList={setType} title="Tipo" /> */}

        <ScrollView className="flex-1 px-5 py-5">
          <View className="flex-1 items-center pb-20 pt-5">
            {loading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : rutinas.length === 0 ? (
              <Text className="text-center text-lg text-gray-600">No hay rutinas disponibles.</Text>
            ) : (
              <>
                {/* 👤 Rutinas personalizadas */}
                {rutinasPersonalizadas.length > 0 && (
                  <View className="w-full">
                    <Text className="text-lg font-bold text-gray-700 mb-3 text-center">
                      Rutinas personalizadas 👤
                    </Text>

                    {rutinasPersonalizadas.map((el, index) => (
                      <CardRutine key={`usr-${el.id ?? index}`} element={el} pov="user" />
                    ))}
                  </View>
                )}

                {/* ⭐ Rutinas del sistema */}
                {rutinasSistema.length > 0 && (
                  <View className="w-full mb-8">
                    <Text className="text-lg font-bold text-gray-700 mb-3 text-center">
                      Rutinas de Danimo ⭐
                    </Text>

                    {rutinasSistema.map((el, index) => (
                      <CardRutine key={`sys-${el.id ?? index}`} element={el} pov="user" />
                    ))}
                  </View>
                )}

                {/* Si no hay ninguna rutina tras filtrar */}
                {rutinasSistema.length === 0 && rutinasPersonalizadas.length === 0 && (
                  <Text className="text-center text-lg text-gray-600">
                    No hay rutinas para las emociones seleccionadas.
                  </Text>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}
