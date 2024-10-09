import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/styles/colors";

type WarningModalProps = {
  title?: string;
  message: string;
  height?: number;
  colorButton: string;
  closeModal: () => void;
};

export function WarningModal({
  title = "Aviso",
  message,
  height = 200,
  colorButton,
  closeModal,
}: WarningModalProps) {
  return (
    <View className="flex-1 h-full justify-center items-center bg-backgroundModal">
      <View
        className={`
          w-11/12 
          bg-light 
          rounded-3xl 
          p-4 
          justify-around 
          items-center
        `}
        style={{ height: height }}
      >
        <Pressable
          onPress={closeModal}
          className="absolute top-2 right-2 w-12 h-12 z-20 items-center justify-center"
          accessibilityLabel="Fechar aviso"
          accessibilityRole="button"
        >
          <Ionicons name="close-circle" size={30} color={colors.error} />
        </Pressable>
        {title && <Text className="text-xl font-bold text-dark">{title}</Text>}
        <Text className="w-4/5 text-base font-regular">{message}</Text>
        <View className="w-11/12 h-12 py-5 px-8 justify-around items-center">
          <Pressable
            className="w-11/12 h-10 justify-center items-center rounded-xl bg"
            style={{ backgroundColor: colorButton }}
            onPress={closeModal}
            accessibilityLabel="Fechar"
            accessibilityRole="button"
          >
            <Text className="text-base font-regular text-light">Fechar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
