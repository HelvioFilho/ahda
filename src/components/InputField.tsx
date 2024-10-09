import {
  Text,
  TextInput,
  TextInputProps,
  View,
  AccessibilityRole,
} from "react-native";

type InputFieldProps = TextInputProps & {
  label: string;
  error: string | undefined;
  changeHeight?: number;
  children?: React.ReactNode;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
};

export function InputField({
  label,
  error,
  changeHeight = 56,
  children,
  accessible = true,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  ...rest
}: InputFieldProps) {
  return (
    <View className="mb-4">
      <Text
        className="text-base font-medium text-textDefault mb-2"
        accessible={false}
      >
        {label}
      </Text>
      <View
        className="w-full flex-row items-center px-5 py-1 bg-light border border-inputBorder rounded-md"
        style={{ height: changeHeight }}
      >
        <TextInput
          className="flex-1 h-12 text-base text-inputField font-regular"
          accessible={accessible}
          accessibilityLabel={accessibilityLabel || label}
          accessibilityHint={accessibilityHint}
          accessibilityRole={accessibilityRole}
          {...rest}
        />
        {children && children}
      </View>
      {error && (
        <Text
          className="text-base font-regular text-error mt-1"
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
        >
          {error}
        </Text>
      )}
    </View>
  );
}
