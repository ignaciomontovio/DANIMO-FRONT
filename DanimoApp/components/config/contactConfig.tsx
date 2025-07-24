import ShowInfo from "@/components/showInfo";
import React from 'react';
import { CardConfig, EditConfig, NavigationConfig } from "./configGeneric";


export interface Contact extends Record<string, string | undefined> {
  who: string;
  name: string;
  phoneNumber: string;
}

// CONFIGURACIÓN DE NAVEGACIÓN PARA CONTACTOS
export const contactNavigationConfig: NavigationConfig<Contact> = {
  goto: "/screensOnlyUser/editEmergencyContact",
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
    { key: "who", placeholder: "¿Quién es?", type: "text" },
    { key: "name", icon: "id-card", placeholder: "Nombre", type: "text" },
    { key: "phoneNumber", icon: "phone", placeholder: "Número de teléfono", type: "phone" },
  ],
};

//evitar warning
export default function ContactConfigDummy() {
  return (
    <>
    </>
  );
}