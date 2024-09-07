import { useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";

import { Header } from "@/components/Header";
import { Loading } from "@/components/Loading";
import { PostList } from "@/components/PostList";

import { api } from "@/services/api";
import { colors } from "@/styles/colors";

const KEY = process.env.EXPO_PUBLIC_API_KEY;

export type PostProps = {
  id: string;
  title: string;
  text: string;
  preview: string;
  user: {
    name: string;
    image: string;
    about: string;
  };
  youtube: string;
  cover: string;
  date_post: string;
};

export function Home() {
  const size = 2;
  const [visibleWarning, setVisibleWarning] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getPosts = async ({ pageParam = 1 }) => {
    const { data } = await api.get(
      `get_post?page=${pageParam}&size=${size}&key=${KEY}`
    );
    return { ...data, pageParam };
  };

  const {
    data,
    status,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["getPost"],
    queryFn: getPosts,
    getNextPageParam: (lastPage) => {
      if (lastPage.pageParam < lastPage.count) {
        return lastPage.pageParam + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  if (status === "pending") {
    return (
      <View className="flex-1 w-full bg-background">
        <Loading size={50} />
      </View>
    );
  }

  const postCount = data?.pages.flatMap((page) => page.data).length || 0;

  return (
    <View className="flex-1 w-full bg-background">
      <FlatList
        data={data?.pages.flatMap((data) => data.data as PostProps)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostList data={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await refetch();
              setRefreshing(false);
            }}
            tintColor={colors.tabBarColor.active}
            colors={[colors.tabBarColor.active]}
          />
        }
        onEndReachedThreshold={0.1}
        onEndReached={async () => {
          await fetchNextPage();
          if (!hasNextPage) {
            if (!visibleWarning) {
              setVisibleWarning(true);
            }
          } else {
            setVisibleWarning(false);
          }
        }}
        ListHeaderComponent={<Header />}
        ListEmptyComponent={
          <View className="w-full items-center justify-center mt-5">
            <Text className="text-lg font-regular">
              Ainda não há publicações.
            </Text>
          </View>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <Loading size={32} />
          ) : !hasNextPage && visibleWarning && postCount > 0 ? (
            <Text className="text-base font-regular pt-1 pb-12 text-center">
              Não há mais publicações a serem exibidas!
            </Text>
          ) : (
            <></>
          )
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
