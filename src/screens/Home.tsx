import { Header } from "@/components/Header";
import { PostList } from "@/components/PostList";
import { FlatList, Text, View } from "react-native";

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
  const posts: PostProps[] = [
    {
      id: "1",
      title: "Curiosidades do Cristianismo",
      text: "Text 1",
      preview:
        "A primeira igreja católica de Belém, conhecida como a Catedral Metropolitana de Belém, ou Catedral da Sé, foi fundada em 1616, logo após a fundação da cidade pelos portugueses.",
      user: {
        name: "Hélvio Filho",
        image: "https://avatars.githubusercontent.com/u/14864367",
        about: "About 1",
      },
      youtube: "https://www.youtube.com/watch?v=Phj08UZbCUs",
      cover:
        "https://upload.wikimedia.org/wikipedia/commons/d/da/Belem-Merces2.jpg",
      date_post: "17/02/2023 10:25",
    },
  ];
  return (
    <View className="flex-1 w-full bg-background">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostList data={item} />}
        ListHeaderComponent={() => <Header />}
        ListEmptyComponent={() => <Text>Empty</Text>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
