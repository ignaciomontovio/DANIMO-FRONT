import { useUserStore } from "@/stores/userType";
import React from "react";
import ShowInfo from "../showInfo";
import { CardConfig, EditConfig, formatDate, NavigationConfig } from "./configGeneric";

// Interfaces
export interface UserProfile extends Record<string, string | undefined> {
  email: string;
  name: string;
  lastName: string;
  d_birth: string;
  occupation: string;
  livesWith: string;
}

export interface ProfProfile extends Record<string, string | undefined> {
  email: string;
  name: string;
  lastName: string;
  d_birth: string;
}

// Navegación
export const profileNavigationConfig: NavigationConfig<UserProfile> = {
  goto: "/editProfile",
  getEditParams: (item: UserProfile) => ({
    email: item.email,
    name: item.name,
    lastName: item.lastName,
    d_birth: item.d_birth ? formatDate(item.d_birth) : "",
    occupation: item.occupation,
    livesWith: item.livesWith,
  }),
  getNewParams: () => ({
    email: "",
    name: "",
    lastName: "",
    d_birth: "",
    occupation: "",
    livesWith: "",
  }),
};

// CardConfig para usuarios
export const profileCardConfigUsuario: CardConfig<UserProfile> = {
  getTitle: () => "Perfil de Usuario",
  renderContent: (item) => (
    <>
      <ShowInfo text={item.name} icon="user" />
      <ShowInfo text={item.lastName} icon="user" />
      <ShowInfo text={item.email} icon="envelope" />
      <ShowInfo text={formatDate(item.d_birth)} icon="birthday-cake" />
      <ShowInfo text={item.livesWith} icon="home" />
      <ShowInfo text={item.occupation} icon="briefcase" />
    </>
  ),
};

// CardConfig para profesionales
export const profileCardConfigProfesional: CardConfig<ProfProfile> = {
  getTitle: () => "Perfil Profesional",
  renderContent: (item) => (
    <>
      <ShowInfo text={item.name} icon="user" />
      <ShowInfo text={item.lastName} icon="user" />
      <ShowInfo text={item.email} icon="envelope" />
      <ShowInfo text={formatDate(item.d_birth)} icon="birthday-cake" />
    </>
  ),
};

// Configuración editable según tipo
export const getProfileEditConfig = (userType: string): EditConfig => {
  if (userType === "profesional") {
    return {
      titleField: "Perfil Profesional",
      fields: [
        { key: "name", icon: "user", placeholder: "Nombre", type: "text" },
        { key: "lastName", icon: "user", placeholder: "Apellido", type: "text" },
        { key: "d_birth", icon: "birthday-cake", placeholder: "Fecha de nacimiento", type: "date" },
      ],
    };
  } else {
    return {
      titleField: "Perfil de Usuario",
      fields: [
        { key: "name", icon: "user", placeholder: "Nombre", type: "text" },
        { key: "lastName", icon: "user", placeholder: "Apellido", type: "text" },
        { key: "d_birth", icon: "birthday-cake", placeholder: "Fecha de nacimiento", type: "date" },
        { key: "livesWith", icon: "home", placeholder: "Vive con", type: "text" },
        { key: "occupation", icon: "briefcase", placeholder: "Ocupación", type: "text" },
      ],
    };
  }
};

// Acceso unificado desde el componente
export const useProfileCardConfig = (): CardConfig<any> => {
  const userType = useUserStore((state) => state.userType);
  return userType === "profesional" ? profileCardConfigProfesional : profileCardConfigUsuario;
};

// Dummy para evitar warning de export default
export default function profileConfigDummy() {
  return <></>;
}