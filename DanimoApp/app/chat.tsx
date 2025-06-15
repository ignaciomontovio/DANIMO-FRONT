import { ChatBubble } from '@/components/chatBubble';
import HeaderGoBack from "@/components/headerGoBack";
import Navbar from '@/components/navbar';
import { router } from 'expo-router';
import React from "react";
import { ScrollView, View } from 'react-native';
import LinearGradient from "react-native-linear-gradient";

export default function chat() {
  return (
    <LinearGradient
              colors={["#D2A8D6", "#F4E1E6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              className="w-full h-full"
    >
      <View className="flex-1">
        <HeaderGoBack
          text="DANI.AI"
          onPress={() => router.push("/tabs/home")}
          img={require('../assets/images/logo.png')}
        />

        {/* Chat */}
        <ScrollView className="flex-1 px-4 pt-4">
          <ChatBubble type="received" text="Lorem ipsum dolor sit" />
          <ChatBubble type="sent" text="Lorem ipsum dolor sit" />
          <ChatBubble type="received" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit" />
          <ChatBubble type="sent" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit" />
        </ScrollView>
        
        <Navbar
          tabs={[
            { name: "home", icon: "home", label: "Inicio" },
            { name: "stats", icon: "bar-chart", label: "Stats" },
            { name: "sos", icon: "exclamation-triangle" },
            { name: "rutines", icon: "newspaper-o", label: "Rutinas" },
            { name: "menu", icon: "bars", label: "Menú" },
          ]}
        />
      </View>
    </LinearGradient>
  );
}
