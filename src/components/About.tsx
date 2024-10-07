import { Pressable, Text, View } from "react-native";
import * as Linking from "expo-linking";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/styles/colors";

type AboutProps = {
  closeModal: () => void;
};

export function About({ closeModal }: AboutProps) {
  return (
    <View className="flex-1 h-full justify-center items-center bg-backgroundModal">
      <View className="w-11/12 rounded-3xl p-4 bg-light">
        <Pressable
          className="self-end"
          onPress={closeModal}
          accessibilityLabel="Fechar sobre o aplicativo"
          accessibilityRole="button"
        >
          <Ionicons name="close-circle" size={30} color={colors.error} />
        </Pressable>
        <View className="w-11/12 pt-1 pr-1 pb-8 pl-4">
          <Text className="text-xl font-bold text-center mb-5">
            A Hora do Anjo
          </Text>
          <View className="flex-row my-1">
            <Text className="text-base font-regular ml-1">
              Aplicativo desenvolvido para o programa de rádio A Hora do Anjo{" "}
              {"\n"}© todos os direitos reservados
            </Text>
          </View>
          <View className="flex-row my-1">
            <Text className="text-base font-bold">Versão:</Text>
            <Text className="text-base font-regular ml-1">1.0.0</Text>
          </View>
          <View className="flex-row my-1">
            <Text className="text-base font-bold">Desenvolvido por:</Text>
            <Text className="text-base font-regular ml-1">Hélvio Filho</Text>
          </View>
          <Pressable
            className="self-center justify-center pt-2.5"
            onPress={() => Linking.openURL("https://www.hsvf.com.br")}
            accessibilityLabel="Abrir site hsvf.com.br"
            accessibilityRole="link"
          >
            <Text className="text-base font-bold text-tabBarColor-active">
              www.hsvf.com.br
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
