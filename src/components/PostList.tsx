import { PostProps } from "@/screens/Home";
import { appDataStore } from "@/services/store";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Loading } from "./Loading";

type PostListProps = {
  data: PostProps;
};

export function PostList({ data }: PostListProps) {
  const [loading, setLoading] = useState(true);
  const date = data.date_post.split(" ");
  const { navigate } = useNavigation();
  const { setPost } = appDataStore();

  function handleSetPost() {
    setPost(data);
    navigate("Post");
  }

  return (
    <Pressable
      className="w-full py-2.5 rounded-ee-3xl bg-light mb-5"
      onPress={handleSetPost}
    >
      <Text className="text-2xl font-bold text-center text-dark mb-2">
        {data.title}
      </Text>
      <View className="relative items-center w-full h-64">
        {loading && (
          <Loading
            style={{
              position: "absolute",
              top: 250 / 2.5,
              elevation: 999,
              zIndex: 999,
            }}
            size={32}
          />
        )}
        <Image
          className="w-full h-full"
          source={{ uri: data.cover }}
          onLoadEnd={() => setLoading(false)}
        />
      </View>
      {data.user.name ? (
        <View className="-top-5 items-center justify-center w-1/2 rounded-r-2xl bg-mark">
          <Text
            className="text-sm font-bold text-light px-2 py-1"
            numberOfLines={1}
          >
            Por: {data.user.name}
          </Text>
        </View>
      ) : (
        <View className="mt-5" />
      )}
      <Text className="text-base font-regular -mt-2.5 p-2">{data.preview}</Text>
      <View className="w-10/12 border-t-black border-t-0.8 self-center" />
      <Text className="text-sm font-regular text-center p-2">
        publicado em: {date[0]} às {date[1]}
      </Text>
    </Pressable>
  );
}
