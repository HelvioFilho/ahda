import { View } from "react-native";

type BulletProps = {
  active?: boolean;
};

export function Bullet({ active = false }: BulletProps) {
  return (
    <View
      className={`w-2 h-2 rounded-full ml-2 ${
        active ? "bg-textDefault" : "bg-textLight"
      }`}
    />
  );
}
