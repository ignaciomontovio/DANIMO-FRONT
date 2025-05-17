import { FontAwesome } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from "react-native";

const handleLoginGoogle = () => {};

export default function GoogleSession(){
    return (
        <View>
            <TouchableOpacity
            className="bg-white py-2 rounded-xl mb-4"
            onPress={handleLoginGoogle}
            >
            <Text className="text-center text-black text-lg">
                <FontAwesome name="google" size={24} color="black" /> Inicie sesion con Google
            </Text>
            </TouchableOpacity>
        </View>
    );
}