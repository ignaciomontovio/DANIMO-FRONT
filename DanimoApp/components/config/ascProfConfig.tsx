import ShowInfo from "@/components/showInfo";
import React from 'react';
import { CardConfig, EditConfig, NavigationConfig } from "./configGeneric";


export interface Profesional extends Record<string, string | undefined> {
  occupation: string;
  name: string;
  id: string;
}

// CONFIGURACIÓN DE NAVEGACIÓN PARA CONTACTOS
export const contactNavigationConfig: NavigationConfig<Profesional> = {
  goto: "/screensOnlyUser/editEmergencyContact",
  getEditParams: (item: Profesional) => ({
    occupation: item.occupation,
    name: item.name,
  }),
  getNewParams: () => ({
    occupation: "",
    name: "",
  }),
};

// CONFIGURACIÓN DE CARD PARA CONTACTOS
export const contactCardConfig: CardConfig<Profesional> = {
  getTitle: (item: Profesional) => item.occupation,
  renderContent: (item: Profesional) => (
    <>
      <ShowInfo text={item.name} icon="id-card" />
    </>
  ),
};

// CONFIGURACIÓN DE EDICIÓN PARA CONTACTOS
export const contactEditConfig: EditConfig = {
  titleField: "occupation",
  fields: [
    { key: "occupation", placeholder: "¿Quién es?", type: "text" },
    { key: "name", icon: "id-card", placeholder: "Nombre", type: "text" },
  ],
};

//evitar warning
export default function ContactConfigDummy() {
  return (
    <>
    </>
  );
}