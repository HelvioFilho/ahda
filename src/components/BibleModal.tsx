import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { appDataStore } from "@/services/store";

export function BibleModal() {
  const [visible, setVisible] = useState(true);
  const { bible } = appDataStore();

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
      }}
    >
      <View className="flex-1 justify-center items-center h-full bg-backgroundModal">
        <View className="w-11/12 justify-around items-center bg-light rounded-3xl pb-5">
          <View className="w-full flex-row justify-between items-center pt-5">
            <View />
            <Text className="text-xl font-bold self-end">Versículo do dia</Text>
            <Pressable className="pr-3" onPress={() => setVisible(false)}>
              <Ionicons name="close-circle" size={30} color={colors.error} />
            </Pressable>
          </View>
          <View className="w-3/4 h-px bg-dark  my-3.5" />
          <Text className="text-lg font-bold self-start ml-7 pt-2.5 pb-2 tracking-widest">{`Livro: ${bible.book}`}</Text>
          <View className="w-full py-2.5 px-7">
            <Text className="text-base font-regular text-justify">
              <Text className="text-base font-medium">{`${bible.chapter}:${bible.number} - `}</Text>
              {bible.text}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
