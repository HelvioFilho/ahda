import React from "react";
import { ActivityIndicator, ActivityIndicatorProps } from "react-native";
import { colors } from "@/styles/colors";

type LoadingProps = ActivityIndicatorProps & {
  size: number;
  player?: boolean;
};

export function Loading({ size, player, ...rest }: LoadingProps) {
  return (
    <ActivityIndicator
      color={colors.tabBarColor[player ? "player" : "active"]}
      size={size}
      className="flex-1"
      {...rest}
    />
  );
}
