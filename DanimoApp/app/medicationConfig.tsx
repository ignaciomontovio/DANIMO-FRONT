import ShowInfo from "@/components/showInfo";
import React from 'react';

// TIPOS ESPECÍFICOS DE MEDICACIÓN
export interface Medication extends Record<string, string> {
  name: string;
  dosage: string;
  startDate: string;
  endDate: string;
}

// TIPOS GENÉRICOS PARA CONFIGURACIÓN
export interface FieldConfig {
  key: string;
  label: string;
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

// ESTRATEGIA DE FETCH PARA MEDICACIÓN
export const medicationFetchStrategy = async (endpoint: string, token: string): Promise<Medication[]> => {
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
  const medicationNames = listData.data || listData;
  console.log("Got", medicationNames.length, "medications to detail");

  // Obtener detalles de cada medicación
  const detailedMedications = [];
  for (let i = 0; i < medicationNames.length; i++) {
    const med = medicationNames[i];
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
        const details = detailData.data || detailData;
        detailedMedications.push(details);
      } else {
        detailedMedications.push(med);
      }
    } catch (error) {
      detailedMedications.push(med);
    }
  }
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
  renderContent: (item: Medication) => (
    <>
      <ShowInfo text={item.dosage} icon="tint" />
      {item.startDate && (
        <ShowInfo 
          text={"Inicio: " + formatDate(item.startDate)} 
          icon="calendar" 
        />
      )}
      {item.endDate && (
        <ShowInfo 
          text={"Fin: " + formatDate(item.endDate)} 
          icon="calendar" 
        />
      )}
    </>
  ),
};

// CONFIGURACIÓN DE EDICIÓN PARA MEDICACIÓN
export const medicationEditConfig: EditConfig = {
  titleField: "name",
  fields: [
    { key: "name", label: "Nombre", icon: "pills", placeholder: "Nombre del medicamento" },
    { key: "dosage", label: "Dosis", icon: "tint", placeholder: "Dosis del medicamento" },
    { key: "startDate", label: "Fecha inicio", icon: "calendar", placeholder: "Fecha de inicio" },
    { key: "endDate", label: "Fecha fin", icon: "calendar", placeholder: "Fecha de fin" },
  ],
};

//esto se agrega para evitar el warning
export default function MedicationConfigDummy() {
  return null;
}