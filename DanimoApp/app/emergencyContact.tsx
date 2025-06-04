import { ButtonDark, ButtonDark_add } from "@/components/buttons";
import HeaderGoBack from "@/components/headerGoBack";
import ShowInfo from "@/components/showInfo";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";

type Contact = {
  who: string;
  name: string;
  phone: string;
};

const contacts: Contact[] = [
  { who: "Mamá", name: "Ana López", phone: "+54 911 3933 0921" },
  { who: "Papá", name: "Carlos López", phone: "+54 911 3933 0922" },
  { who: "Amigo", name: "Juan Pérez", phone: "+54 911 3933 0923" },
];

export default function EmergencyContact() {

  return (
    <SafeAreaProvider>
        <LinearGradient
          colors={["#D2A8D6", "#F4E1E6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="w-full h-full"
        >
          <HeaderGoBack text="Contactos" onPress={() => router.push("/tabs/home")} />
          <ScrollView className="flex-1 px-5 py-5">
            <View className="flex-1 justify-center items-center">
              {contacts.map((contact, index) => (
                <ContactCard key={index} {...contact} />
              ))}
              <ButtonDark_add onPress={()=>("")}/>
                {/* ir a una pantalla o a una funcion de ac que sea una card donde los  ShowInfo sean inputs y si le mando igo es por que toque editar y sino por que toque add*/}
            </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

type PropsContactCard = {
  who: string;
  name: string;
  phone: string;
};

function ContactCard({ who, name, phone }: PropsContactCard) {
  return (
    <View className="w-full max-w-md rounded-2xl shadow-xl mb-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10,
      }}
    >
      <View className="py-3 bg-color1 rounded-t-2xl">
        <Text className="text-2xl font-bold text-white text-center">{who}</Text>
      </View>

      <View className="p-6 bg-fondo rounded-b-2xl">
        <ShowInfo text={name} icon="id-card" />
        <ShowInfo text={phone} icon="phone" />
        <ButtonDark text="Editar" onPress={() => console.log(`Editar ${name}`)} />
      </View>
    </View>
  );
}
