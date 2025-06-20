import ShowInfo from "@/components/showInfo";
import React from 'react';
import { Text, View } from 'react-native';

// TIPOS ESPECÍFICOS DE MEDICACIÓN
export interface Medication extends Record<string, string | undefined> {
  name: string;
  dosage?: string;
  startDate?: string;
  endDate?: string;
}

// TIPOS GENÉRICOS PARA CONFIGURACIÓN
export interface FieldConfig {
  key: string;
  icon: string;
  placeholder?: string;
}

export interface FetchConfig<T> {
  endpoint: string;
  fetchStrategy: (endpoint: string, token: string) => Promise<T[]>;
}

export interface NavigationConfig<T> {
  goto: string;
  getEditParams: (item: T) => Record<string, any>;
  getNewParams: () => Record<string, any>;
}

export interface CardConfig<T> {
  getTitle: (item: T) => string;
  renderContent: (item: T) => React.ReactNode;
}

export interface EditConfig {
  fields: FieldConfig[];
  titleField: string;
}

// UTILIDADES ESPECÍFICAS DE MEDICACIÓN
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString('es-ES');
  } catch {
    return dateString;
  }
};

export const medicationFetchStrategy = async (endpoint: string, token: string): Promise<Medication[]> => {
  console.log("Fetching medications from:", endpoint + "/obtain");
  
  // Obtener lista de medicaciones
  const listResponse = await fetch(endpoint + "/obtain", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    },
  });

  if (!listResponse.ok) throw new Error(await listResponse.text());

  const listData = await listResponse.json();
  console.log("Raw list response:", JSON.stringify(listData, null, 2));
  
  const medicationNames = listData.data || listData;
  console.log("Medication names array:", medicationNames);
  console.log("Got", medicationNames.length, "medications to detail");

  // Obtener detalles de cada medicación
  const detailedMedications = [];
  for (let i = 0; i < medicationNames.length; i++) {
    const med = medicationNames[i];
    console.log(`Getting details for medication ${i + 1}:`, med);
    
    try {
      const detailResponse = await fetch(endpoint + "/detail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({ name: med.name }),
      });

      if (detailResponse.ok) {
        const detailData = await detailResponse.json();
        console.log(`Detail response for ${med.name}:`, JSON.stringify(detailData, null, 2));
        
        const details = detailData.data || detailData;
        console.log(`Final details for ${med.name}:`, details);
        console.log(`Active status:`, details.active);

        detailedMedications.push(details);
      } else {
        console.log(`Failed to get details for ${med.name}:`, detailResponse.status);
        detailedMedications.push(med);
      }
    } catch (error) {
      console.log(`Error getting details for ${med.name}:`, error);
      detailedMedications.push(med);
    }
  }

  console.log("Final medications array:", detailedMedications);
  console.log("Total medications returned:", detailedMedications.length);

  return detailedMedications;
};

// CONFIGURACIÓN DE NAVEGACIÓN PARA MEDICACIÓN
export const medicationNavigationConfig: NavigationConfig<Medication> = {
  goto: "/editMedication",
  getEditParams: (item: Medication) => ({
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
export const medicationCardConfig: CardConfig<Medication> = {
  getTitle: (item: Medication) => item.name,
  renderContent: (item: Medication) => {
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
            icon="tint" 
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
    { key: "name", icon: "pills", placeholder: "Nombre del medicamento" },
    { key: "dosage", icon: "tint", placeholder: "Dosis del medicamento" },
    { key: "startDate", icon: "calendar", placeholder: "Fecha de inicio" },
    { key: "endDate", icon: "calendar", placeholder: "Fecha de fin" },
  ],
};

//evitar warning
export default function MedicationConfigDummy() {
  return null;
}