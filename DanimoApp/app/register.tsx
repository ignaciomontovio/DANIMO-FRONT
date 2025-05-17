// app/register.tsx
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const handleLogin = () => {
  router.replace("/login"); 
}

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="flex-1 justify-center px-8 bg-white">
      <View className="bg-accent rounded-2xl p-6 shadow-lg">
        <Text className="text-3xl font-bold text-white mb-6 text-center">
          Crear Cuenta
        </Text>

        <TextInput
          className="bg-white border border-accent p-4 rounded-xl mb-4 text-gray-700"
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          className="bg-white border border-accent p-4 rounded-xl mb-6 text-gray-700"
          placeholder="Contraseña"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />

        <TouchableOpacity className="bg-success py-3 rounded-xl mb-4">
          <Text className="text-center text-white font-bold text-lg">Registrarse</Text>
        </TouchableOpacity>

        <Text 
          className="text-center text-white underline"
          onPress={handleLogin}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
        
      </View>
    </View>
  );
}
