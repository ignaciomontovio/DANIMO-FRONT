import Sos from "@/app/tabs/sos";
import { ChatBubble } from '@/components/chatBubble';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
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
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-2 bg-oscuro">
          <TouchableOpacity onPress={()=>router.push("/tabs/home")}>
            <FontAwesome name="arrow-left" size={24} color="#f7a1b2" />
          </TouchableOpacity>
          <Text className="text-xlg font-bold text-white">DANI.AI</Text>
          <Image
            source={require('../assets/images/logo.png')} 
            className="w-10 h-10 rounded-full"
          />
        </View>

        {/* Chat */}
        <ScrollView className="flex-1 px-4 pt-4">
          <ChatBubble type="received" text="Lorem ipsum dolor sit" />
          <ChatBubble type="sent" text="Lorem ipsum dolor sit" />
          <ChatBubble type="received" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit" />
          <ChatBubble type="sent" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit" />
        </ScrollView>
        
        {/* TabBar manual (visual) */}
        
        <View className="flex-row justify-around items-center h-[50px]">
          <Sos/>
          {/* <FontAwesome name="home" size={24} color="#f4e1e6" onPress={() => router.push("/tabs/home")} />
          <FontAwesome name="bar-chart" size={24} color="#f4e1e6" onPress={() => router.push("/tabs/stats")} /> */}
          {/* <View className="justify-center items-center -mt-6">
            <TouchableOpacity className="w-[70px] h-[70px] bg-[#f44336] rounded-full justify-center items-center border-2 border-[#f4e1e6]">
              <Text className="text-[#f4e1e6] font-bold">SOS</Text>
            </TouchableOpacity>
          </View> */}
          {/* <FontAwesome name="newspaper-o" size={24} color="#f4e1e6" onPress={() => router.push("/tabs/rutines")} />
          <FontAwesome name="bars" size={24} color="#f4e1e6" onPress={() => router.push("/tabs/menu")} /> */}
        </View>
      </View>
    </LinearGradient>
  );
}
