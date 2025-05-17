import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginRegisterScreen() {
  const [tab, setTab] = useState<"login" | "signup">("signup");

  return (
    <View className="flex-1 justify-center items-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 px-4">
      <View className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <View className="py-6 bg-gradient-to-r from-blue-500 to-purple-600">
          <Text className="text-3xl font-bold text-white text-center">Welcome</Text>
          <Text className="text-white text-center mt-2">Join our amazing community</Text>
        </View>

        <View className="p-6">
          <View className="flex-row justify-center mb-6">
            <TouchableOpacity
              onPress={() => setTab("signup")}
              className={`px-4 py-2 rounded-l-md ${
                tab === "signup" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              <Text className="font-semibold">Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTab("login")}
              className={`px-4 py-2 rounded-r-md ${
                tab === "login" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              <Text className="font-semibold">Login</Text>
            </TouchableOpacity>
          </View>

          {tab === "signup" ? (
            <>
              <Input icon="user" placeholder="Full Name" />
              <Input icon="envelope" placeholder="Email" keyboardType="email-address" />
              <Input icon="lock" placeholder="Password" secureTextEntry />
              <Button text="Sign Up" />
            </>
          ) : (
            <>
              <Input icon="envelope" placeholder="Email" keyboardType="email-address" />
              <Input icon="lock" placeholder="Password" secureTextEntry />
              <Button text="Login" />
            </>
          )}

          <Text className="text-center text-gray-600 mt-6 mb-4">Or continue with</Text>
          <View className="flex-row justify-center space-x-4">
            <SocialButton bg="bg-blue-600" icon="facebook-f" text="Facebook" />
            <SocialButton bg="bg-red-600" icon="google" text="Google" />
          </View>
        </View>
      </View>
    </View>
  );
}

function Input({ icon, ...props }) {
  return (
    <View className="relative mb-4">
      <FontAwesome name={icon} size={18} color="gray" style={{ position: "absolute", top: 16, left: 12 }} />
      <TextInput
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md text-gray-700"
        placeholderTextColor="#999"
        {...props}
      />
    </View>
  );
}

function Button({ text }) {
  return (
    <TouchableOpacity className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-md mt-2">
      <Text className="text-white text-center font-bold text-lg">{text}</Text>
    </TouchableOpacity>
  );
}

function SocialButton({ bg, icon, text }) {
  return (
    <TouchableOpacity className={`${bg} px-4 py-2 rounded-md flex-row items-center`}>
      <FontAwesome name={icon} size={16} color="white" />
      <Text className="text-white ml-2">{text}</Text>
    </TouchableOpacity>
  );
}
