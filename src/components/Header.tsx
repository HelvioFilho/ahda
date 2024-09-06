import { Image, Text, View } from "react-native";
import Logo from "@/assets/angel-white.png";

export function Header() {
  return (
    <View className="bg-light border-b border-header pt-5 pb-4 mb-1">
      <Image className="w-full h-44" resizeMode="contain" source={Logo} />
      <Text className="text-center text-base font-bold">
        Programa A hora do Anjo{"\n"}De segunda à sexta de 18h às 19h
      </Text>
    </View>
  );
}
