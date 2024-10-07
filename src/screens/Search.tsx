import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
  FlatList,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { InputMessage } from "@/components/InputMessage";
import { Loading } from "@/components/Loading";
import { PostList } from "@/components/PostList";
import { PostProps } from "./Home";
import { useState } from "react";
import { api } from "@/services/api";
import { useInfiniteQuery } from "@tanstack/react-query";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { colors } from "@/styles/colors";

const KEY = process.env.EXPO_PUBLIC_API_KEY;

type DataForm = {
  search: string;
};

export function Search() {
  const [isSearch, setIsSearch] = useState(false);
  const [search, setSearch] = useState("");

  const size = 2;

  const searchPost = async ({ pageParam = 1 }) => {
    const { data } = await api.get(
      `search?search=${search}&page=${pageParam}&size=${size}&key=${KEY}`
    );
    setIsSearch(false);
    return { ...data, pageParam };
  };

  const { data, status, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["searchPost", search],
      queryFn: searchPost,
      getNextPageParam: (lastPage) => {
        if (lastPage.pageParam < lastPage.count) {
          return lastPage.pageParam + 1;
        }
        return undefined;
      },
      initialPageParam: 1,
    });

  const schema = Yup.object().shape({
    search: Yup.string()
      .trim()
      .min(5, "A busca precisa ter mais que 4 caracteres!")
      .required("O campo de busca não pode ser vazio!"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DataForm>({
    resolver: yupResolver(schema),
  });

  async function handleSearch(form: Partial<DataForm>) {
    setIsSearch(true);
    setSearch(form.search as string);
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      enabled
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-background">
          <View className="mt-5 py-0 px-6">
            <InputMessage
              placeholder="Coloque sua busca aqui..."
              placeholderTextColor={colors.textLight}
              label="Faça sua busca"
              control={control}
              name="search"
              error={errors.search && (errors.search.message as string)}
              accessible={true}
              accessibilityLabel="Campo de busca"
              accessibilityHint="Digite sua busca e pressione o botão de buscar"
              accessibilityRole="search"
            >
              <Pressable
                className="relative top-0 left-6 p-3 h-14 rounded-r-sm border-l-4 border-l-background bg-success"
                disabled={isSearch}
                onPress={handleSubmit(handleSearch)}
                accessibilityLabel="Buscar"
                accessibilityRole="button"
              >
                <MaterialCommunityIcons
                  name="magnify"
                  size={28}
                  color={colors.light}
                />
              </Pressable>
            </InputMessage>
          </View>
          {status === "pending" ? (
            search !== "initialSearch" && (
              <View className="flex-1 justify-center items-center">
                <Loading size={50} />
              </View>
            )
          ) : (
            <FlatList
              data={data?.pages.flatMap((page) => page.data as PostProps)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <PostList data={item} />}
              onEndReachedThreshold={0.1}
              onEndReached={() => fetchNextPage()}
              ListFooterComponent={
                isFetchingNextPage ? <Loading size={32} /> : <></>
              }
              ListEmptyComponent={
                <View className="py-5 px-6">
                  {search !== "" && (
                    <Text className="text-base" accessibilityRole="text">
                      Nenhuma publicação corresponde a pesquisa, verifique a
                      ortografia ou tente uma combinação diferente de palavras!
                    </Text>
                  )}
                </View>
              }
              accessibilityLabel="Lista de resultados de busca"
              accessibilityRole="list"
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
