import React from "react";
import ShowInfo from "../showInfo";
import { CardConfig, EditConfig, formatDate, NavigationConfig } from "./configGeneric";


export interface UserProfile extends Record<string, string | undefined> {
  email: string;
  name: string;
  lastName: string;
  d_birth: string;
  occupation: string;
  livesWith: string;
  code: string;
}

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
    name:"",
    lastName: "",
    d_birth: "",
    occupation: "",
    livesWith: "",
  }),
};

export const profileCardConfig: CardConfig<UserProfile> = {
  getTitle: (item: UserProfile) => "Perfil",
  renderContent: (item: UserProfile) => (
    <>
      <ShowInfo text={item.name} icon="user" />
      <ShowInfo text={item.lastName} icon="user" />
      <ShowInfo text={item.email} icon="envelope" />
      <ShowInfo text={formatDate(item.d_birth)} icon="calendar" />
      <ShowInfo text={item.livesWith} icon="home" />
      <ShowInfo text={item.occupation} icon="briefcase" />
      <ShowInfo text={item.code} icon="share" />
    </>
  ),
};

export const profileEditConfig: EditConfig = {
  titleField: "Perfil",
  fields: [
    { key: "Perfil",                        placeholder: "Perfil",              type: "text" },
    { key: "name",       icon: "user",      placeholder:"Nombre",               type: "text"},
    { key: "lastName",   icon: "user",      placeholder:"Apellido",             type: "text"},
    // { key: "email",      icon: "envelope",  placeholder:"Email",                type: "text"},
    { key: "d_birth",    icon: "calendar",  placeholder:"Fecha de nacimiento",  type: "date"},
    { key: "livesWith",  icon: "home",      placeholder:"Vive con",             type: "text"},
    { key: "occupation", icon: "briefcase", placeholder:"Ocupacion",            type: "text"},
  ],
};


//evitar warning
export default function profileConfigDummy() {
  return (
    <>
    </>
  );
}