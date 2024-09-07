import { Text, TextInput, TextInputProps, View } from "react-native";

type InputFieldProps = TextInputProps & {
  label: string;
  error: string | undefined;
  changeHeight?: number;
  children?: React.ReactNode;
};

export function InputField({
  label,
  error,
  changeHeight = 50,
  children,
  ...rest
}: InputFieldProps) {
  return (
    <View className="mb-4">
      <Text className="text-base font-medium text-textDefault mb-2">
        {label}
      </Text>
      <View
        className="w-full flex-row items-center px-5 py-2.5 bg-light border border-inputBorder rounded-md"
        style={{ height: changeHeight }}
      >
        <TextInput
          className="flex-1 h-full text-base text-inputField font-regular"
          {...rest}
        />
        {children && children}
      </View>
      {error && (
        <Text className="text-base font-regular text-error mt-1">{error}</Text>
      )}
    </View>
  );
}
