import { FontAwesome } from "@expo/vector-icons";

export interface NavigationConfig<T> {
  goto: string;
  getEditParams: (item: T) => Record<string, any>;
  getNewParams: () => Record<string, any>;
}
export interface CardConfig<T> {
  getTitle: (item: T) => string;
  renderContent: (item: T) => React.ReactNode;
}
export interface FieldConfig {
  key: string;
  icon?: React.ComponentProps<typeof FontAwesome>['name'];
  placeholder?: string;
  type?: "text" | "phone" | "date" ;
}
export interface EditConfig {
  fields: FieldConfig[];
  titleField: string;
}