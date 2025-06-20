import ShowInfo from "@/components/showInfo";
import React from 'react';

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

// TIPOS ESPECÍFICOS DE CONTACTO
export interface Contact extends Record<string, string | undefined> {
  who: string;
  name: string;
  phoneNumber: string;
}

// ESTRATEGIA DE FETCH PARA CONTACTOS (GENÉRICA)
export const contactFetchStrategy = async (endpoint: string, token: string): Promise<Contact[]> => {
  const response = await fetch(endpoint + "/obtain", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    },
  });

  if (!response.ok) throw new Error(await response.text());

  const data = await response.json();
  return Array.isArray(data) ? data : (data.data || []);
};

// CONFIGURACIÓN DE NAVEGACIÓN PARA CONTACTOS
export const contactNavigationConfig: NavigationConfig<Contact> = {
  goto: "/editEmergencyContact",
  getEditParams: (item: Contact) => ({
    who: item.who,
    name: item.name,
    phoneNumber: item.phoneNumber,
  }),
  getNewParams: () => ({
    who: "",
    name: "",
    phoneNumber: "",
  }),
};

// CONFIGURACIÓN DE CARD PARA CONTACTOS
export const contactCardConfig: CardConfig<Contact> = {
  getTitle: (item: Contact) => item.who,
  renderContent: (item: Contact) => (
    <>
      <ShowInfo text={item.name} icon="id-card" />
      <ShowInfo text={item.phoneNumber} icon="phone" />
    </>
  ),
};

// CONFIGURACIÓN DE EDICIÓN PARA CONTACTOS
export const contactEditConfig: EditConfig = {
  titleField: "who",
  fields: [
    { key: "who", label: "¿Quién es?", icon: "user", placeholder: "Ej: Hermana, Doctor, etc." },
    { key: "name", label: "Nombre completo", icon: "id-card", placeholder: "Nombre y apellido" },
    { key: "phoneNumber", label: "Teléfono", icon: "phone", placeholder: "Número de teléfono" },
  ],
};