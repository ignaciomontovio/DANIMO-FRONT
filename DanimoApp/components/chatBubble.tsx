import { colors } from "@/stores/colors";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  type: 'sent' | 'received' | 'system';
  text: string;
};

export const ChatBubble = ({ type, text }: Props) => {
  const isSent = type === 'sent';
  const bubbleColor = isSent ? colors.color1 : colors.color5;

  if (type === "system") {
    return (
      <View className="self-center bg-gray-200 px-4 py-2 rounded-full my-2">
        <Text className="text-gray-600 italic">{text}</Text>
      </View>
    );
  }

  return (
    <View
      className={`max-w-[80%] rounded-xl px-4 py-2 my-2 ${
        isSent ? 'self-end' : 'self-start'
      }`}
      style={{
        backgroundColor: bubbleColor,
        borderWidth: 1,
        borderColor: '#fff',
      }}
    >
      <Text className="text font-semibold text-white" >{text}</Text>
    </View>
  );
};
