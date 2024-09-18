import { useEffect, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { bible as bibleAPI } from "@/services/api";
import { Loading } from "./Loading";

export type DataBibleProps = {
  book: string;
  chapter: number;
  number: number;
  text: string;
};

export function BibleModal() {
  const [visible, setVisible] = useState(true);
  const [bible, setBible] = useState<DataBibleProps>({} as DataBibleProps);
  const [loading, setLoading] = useState(true);

  async function getBible() {
    try {
      const { data } = await bibleAPI.get("/verses/ra/random").catch(() => {
        return {
          data: {
            book: {
              name: "Eclesiastes",
            },
            chapter: 9,
            number: 10,
            text: "Posso todas as coisas em Cristo que me fortalece.",
          },
        };
      });
      if (typeof data === "object" && Object.keys(data).length > 0) {
        setBible({
          book: data.book.name,
          chapter: data.chapter,
          number: data.number,
          text: data.text,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getBible();
  }, []);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
      }}
    >
      <View className="flex-1 justify-center items-center h-full bg-backgroundModal">
        <View className="w-11/12 justify-around items-center bg-light rounded-3xl pb-5">
          <View className="w-full flex-row justify-between items-center pt-5">
            <View />
            <Text className="text-xl font-bold self-end">Versículo do dia</Text>
            <Pressable className="pr-3" onPress={() => setVisible(false)}>
              <Ionicons name="close-circle" size={30} color={colors.error} />
            </Pressable>
          </View>
          <View className="w-3/4 h-px bg-dark  my-3.5" />
          <Text className="text-lg font-bold self-start ml-7 pt-2.5 pb-2 tracking-widest">{`Livro: ${
            loading ? "Carregando..." : bible.book
          }`}</Text>
          <View className="w-full py-2.5 px-7">
            {loading ? (
              <Loading size={32} />
            ) : (
              <Text className="text-base font-regular text-justify">
                <Text className="text-base font-medium">{`${bible.chapter}:${bible.number} - `}</Text>
                {bible.text}
              </Text>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
