import ShowInfo from "@/components/showInfo";
import React from 'react';
import { Text, View } from 'react-native';
import { CardConfig, EditConfig, NavigationConfig } from "./configGeneric";

// TIPOS ESPECÍFICOS DE MEDICACIÓN
export interface MedicationType extends Record<string, string | undefined> {
  name: string;
  dosage?: string;
  startDate?: string;
  endDate?: string;
}


export interface FetchConfig<T> {
  endpoint: string;
  fetchStrategy: (endpoint: string, token: string) => Promise<T[]>;
}


// sacar
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString('es-ES');
  } catch {
    return dateString;
  }
};

// CONFIGURACIÓN DE NAVEGACIÓN PARA MEDICACIÓN
export const medicationNavigationConfig: NavigationConfig<MedicationType> = {
  goto: "/editMedication",
  getEditParams: (item: MedicationType) => ({
    name: item.name,
    dosage: item.dosage || "",
    startDate: item.startDate ? formatDate(item.startDate) : "",
    endDate: item.endDate ? formatDate(item.endDate) : "",
  }),
  getNewParams: () => ({
    name: "",
    dosage: "",
    startDate: "",
    endDate: "",
  }),
};

// CONFIGURACIÓN DE CARD PARA MEDICACIÓN
export const medicationCardConfig: CardConfig<MedicationType> = {
  getTitle: (item: MedicationType) => item.name,
  renderContent: (item: MedicationType) => {
    const isInactive = (item as any).active === false;
    
    return (
      <>
        {isInactive && (
          <View style={{ 
            backgroundColor: 'rgba(0,0,0,0.1)', 
            padding: 8, 
            borderRadius: 8, 
            marginBottom: 8 
          }}>
            <Text style={{ 
              color: '#666', 
              fontSize: 12, 
              fontStyle: 'italic',
              textAlign: 'center' 
            }}>
              Medicación eliminada
            </Text>
          </View>
        )}
        
        <View style={{ opacity: isInactive ? 0.5 : 1 }}>
          <ShowInfo 
            text={item.dosage || "Sin dosis registrada"} 
            icon="medkit" 
          />
          {item.startDate && (
            <ShowInfo 
              text={`Inicio: ${formatDate(item.startDate)}`} 
              icon="calendar" 
            />
          )}
          {item.endDate && (
            <ShowInfo 
              text={`Fin: ${formatDate(item.endDate)}`} 
              icon="calendar" 
            />
          )}
        </View>
      </>
    );
  },
};

// CONFIGURACIÓN DE EDICIÓN PARA MEDICACIÓN
export const medicationEditConfig: EditConfig = {
  titleField: "name",
  fields: [
    { key: "name", placeholder: "Nombre del medicamento", type: "text" },
    { key: "dosage", icon: "medkit", placeholder: "Dosis", type: "text" },
    { key: "startDate", icon: "calendar", placeholder: "Fecha de inicio", type: "date" },
    { key: "endDate", icon: "calendar", placeholder: "Fecha de fin", type: "date" },
  ],
};

//evitar warning
export default function MedicationConfigDummy() {
  return null;
}