import { Text, TextInput, TextInputProps, View } from "react-native";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

type InputMessageProps<T extends FieldValues> = TextInputProps & {
  name: Path<T>;
  label: string;
  control: Control<T>;
  error: string | undefined;
  changeHeight?: number;
  children?: React.ReactNode;
};

export function InputMessage<T extends FieldValues>({
  name,
  label,
  control,
  error,
  changeHeight = 50,
  children,
  ...rest
}: InputMessageProps<T>) {
  return (
    <View className="mb-4">
      <Text
        className="text-base text-textDefault font-medium mb-2"
        accessible={false}
      >
        {label}
      </Text>
      <View
        className="w-full flex-row items-center px-5 py-2.5 bg-light border border-inputBorder rounded-md"
        style={{ height: changeHeight }}
      >
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="flex-1 h-full text-base text-inputField font-regular"
              onChangeText={onChange}
              value={value}
              {...rest}
            />
          )}
        />
        {children && children}
      </View>
      {error && (
        <Text
          className="text-base text-error font-regular mt-1"
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
        >
          {error}
        </Text>
      )}
    </View>
  );
}
