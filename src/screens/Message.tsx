import { useCallback, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { api } from "@/services/api";
import { appDataStore } from "@/services/store";

import { Loading } from "@/components/Loading";
import { WarningModal } from "@/components/WarningModal";
import { InputMessage } from "@/components/InputMessage";

import SendLeft from "@/assets/send-left.png";
import SendRight from "@/assets/send-right.png";
import AngelHaloImage from "@/assets/angelHalo.png";

import { colors } from "@/styles/colors";

const KEY = process.env.EXPO_PUBLIC_API_KEY;

type WarningProps = {
  message: string;
  height: number;
  color: string;
};

type DataForm = {
  name: string;
  email: string;
  message: string;
};

export function Message() {
  const [inputHeight, setInputHeight] = useState(56);
  const [visible, setVisible] = useState(false);
  const [warning, setWarning] = useState<WarningProps>({} as WarningProps);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { startSettings } = appDataStore();

  const schema = Yup.object().shape({
    message: Yup.string().trim().required("Mensagem não pode ser vazia!"),
    email: Yup.string().trim().email("Coloque um e-mail válido!"),
    name: Yup.string()
      .trim()
      .min(4, "Nome precisa ter mais que 3 caracteres!")
      .required("Nome não pode ser vazio!"),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function handleSendMessage(form: Partial<DataForm>) {
    setIsSubmitting(true);
    api
      .post("set_message", {
        name: form.name,
        email: form.email,
        message: form.message,
        key: KEY,
      })
      .then(({ data }) => {
        let message,
          height = 170;
        if (data.error) {
          if (data.message) {
            message = data.message
              ? data.message
              : "Algo deu errado e sua mensagem não pode ser enviada, por favor tente novamente mais tarde";
            height = 210;
          }
        } else {
          message = "Sua mensagem foi enviada com sucesso!";
          reset({
            name: form.name,
            email: form.email ? form.email : "",
            message: "",
          });
        }
        setWarning({
          height,
          message,
          color: colors.error,
        });
      })
      .catch((error) => {
        console.log(error);
        setWarning({
          height: 210,
          message:
            "Algo deu errado e o servidor não respondeu, se o erro persistir, entre em contato com o desenvolvedor do aplicativo!",
          color: colors.error,
        });
      })
      .finally(() => {
        setIsSubmitting(false);
        setVisible(true);
      });
  }

  useFocusEffect(
    useCallback(() => {
      setValue("name", startSettings.name ? startSettings.name : "");
      setValue("email", startSettings.email ? startSettings.email : "");
    }, [startSettings])
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      enabled
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-1 bg-background">
            <View className="relative top-5 flex-row justify-between px-5">
              <Image
                className="w-28 h-28"
                source={SendRight}
                accessible={false}
              />
              <Image
                className="absolute top-14 left-1/2 transform -translate-x-[35px] w-32 h-10"
                source={AngelHaloImage}
                accessible={false}
              />
              <Image
                className="w-28 h-28"
                source={SendLeft}
                accessible={false}
              />
            </View>
            <Text
              className="text-xl font-bold text-center mt-5"
              accessibilityRole="header"
            >
              Nos envie{"\n"}uma mensagem!
            </Text>
            <Text className="text-base font-regular my-2.5 mx-5 ">
              Suas mensagens podem ser lidas no programa, esse é seu contato
              direto com A hora do anjo, então nos escreva!
            </Text>
            <View className="mt-5 px-6">
              <InputMessage
                placeholder="Nome"
                label="Nome"
                name="name"
                control={control}
                autoCorrect={false}
                error={errors.name && (errors.name.message as string)}
                accessible={true}
                accessibilityLabel="Campo de nome"
                accessibilityHint="Digite seu nome"
                accessibilityRole="text"
              />
              <InputMessage
                placeholder="E-mail"
                label="E-mail (Opcional)"
                name="email"
                control={control}
                autoCapitalize="none"
                keyboardType="email-address"
                error={errors.email && (errors.email.message as string)}
                accessible={true}
                accessibilityLabel="Campo de e-mail"
                accessibilityHint="Digite seu e-mail (opcional)"
                accessibilityRole="text"
              />
              <InputMessage
                placeholder="Sua mensagem"
                label="Mensagem"
                name="message"
                control={control}
                changeHeight={inputHeight}
                error={errors.message && (errors.message.message as string)}
                multiline={true}
                onContentSizeChange={(e) =>
                  setInputHeight(e.nativeEvent.contentSize.height + 30)
                }
                accessible={true}
                accessibilityLabel="Campo de mensagem"
                accessibilityHint="Digite sua mensagem"
                accessibilityRole="text"
              />
              <Pressable
                className="w-full h-14 justify-center items-center rounded-md mt-2.5 mb-44 bg-success"
                disabled={isSubmitting}
                onPress={handleSubmit(handleSendMessage)}
                accessibilityLabel="Enviar mensagem"
                accessibilityRole="button"
                accessibilityState={{ disabled: isSubmitting }}
              >
                {isSubmitting ? (
                  <Loading size={24} player={true} />
                ) : (
                  <Text className="text-lg font-regular text-light">
                    Enviar
                  </Text>
                )}
              </Pressable>
            </View>
            <Modal
              animationType="fade"
              transparent
              visible={visible}
              onRequestClose={() => setVisible(false)}
            >
              <WarningModal
                title="Aviso"
                height={warning.height}
                message={warning.message}
                colorButton={warning.color}
                closeModal={() => setVisible(false)}
              />
            </Modal>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
