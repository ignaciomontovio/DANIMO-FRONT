 
import EmotionStatsScreen from "@/app/tabs/stats";
import { useLocalSearchParams } from "expo-router";
import React from "react";
export default function statsPatient() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  return (
    <EmotionStatsScreen userId={patientId} />
  );
}