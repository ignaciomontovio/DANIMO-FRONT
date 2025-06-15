import React from "react";
import { Text, View } from "react-native";

type Props = {
  type: 'sent' | 'received';
  text: string;
};

export const ChatBubble = ({ type, text }: Props) => {
  const isSent = type === 'sent';
  const bubbleColor = isSent ? '#f7a1b2' : '#d2a8d6';

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
      <Text className="text-s font-bold text-white" >{text}</Text>
    </View>
  );
};
