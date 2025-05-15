// app/login.tsx
import { Link } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="flex-1 justify-center px-8 bg-white">
      <View className="bg-primary rounded-2xl p-6 shadow-lg">
        <Text className="text-3xl font-bold text-white mb-6 text-center">
          Iniciar Sesión
        </Text>

        <TextInput
          className="bg-white border border-primary p-4 rounded-xl mb-4 text-gray-700"
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          className="bg-white border border-primary p-4 rounded-xl mb-6 text-gray-700"
          placeholder="Contraseña"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />

        <TouchableOpacity className="bg-secondary py-3 rounded-xl mb-4">
          <Text className="text-center text-white font-bold text-lg">Entrar</Text>
        </TouchableOpacity>

        <Link href="/register" className="text-center text-white underline">
          ¿No tienes cuenta? Regístrate
        </Link>
      </View>
    </View>
  );
}
