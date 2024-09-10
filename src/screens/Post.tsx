import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import RenderHTML from "react-native-render-html";
import { MaterialIcons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";
import { useNavigation } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";

import { Loading } from "@/components/Loading";
import { ImageGallery } from "@/components/ImageGallery";

import { tagsStyles } from "@/utils/tagStyle";
import { formattedText } from "@/utils/formattedText";

import { api } from "@/services/api";
import { colors } from "@/styles/colors";
import { appDataStore } from "@/services/store";

const KEY = process.env.EXPO_PUBLIC_API_KEY;

type GalleryProps = {
  id: string;
  path: string;
};

export function Post() {
  const [imageGallery, setImageGallery] = useState<GalleryProps[]>([]);
  const [maxHeight, setMaxHeight] = useState(250);
  const [text, setText] = useState("<p></p>");
  const [loading, setLoading] = useState(true);
  const [youtubeLoading, setYoutubeLoading] = useState(true);

  const { width: displayWidth } = Dimensions.get("window");
  const video_height = 230;

  const { goBack } = useNavigation();
  const { post: data } = appDataStore();

  const date = data.date_post.split(" ");
  const day = date[0];
  const hour = date[1];

  async function getText(text: string) {
    setText(formattedText(text));
  }

  async function getImageGallery(id: string) {
    try {
      const { data } = await api.get(`get_image_gallery?id=${id}&key=${KEY}`);
      if (!data.error) {
        setImageGallery(data.images);
      } else {
        console.log(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getMaxHeight() {
    await Image.getSize(data.cover, (width, height) => {
      setMaxHeight((displayWidth * height) / width);
    });
  }

  const onFullScreenChange = useCallback((isFullScreen: boolean) => {
    if (isFullScreen) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    } else {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    }
  }, []);

  useEffect(() => {
    getImageGallery(data.id);
    getText(data.text);
    getMaxHeight();
  }, [data]);

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: colors.light }}>
        <View
          className="relative justify-center items-center"
          style={{ width: displayWidth, height: maxHeight }}
        >
          {loading && (
            <Loading
              style={{
                position: "absolute",
                top: maxHeight / 2.8,
                elevation: 999,
                zIndex: 999,
              }}
              size={32}
            />
          )}
          <Image
            className="w-full h-full"
            source={{ uri: data.cover }}
            resizeMode={"stretch"}
            onLoadEnd={() => setLoading(false)}
          />
        </View>
        <View className="relative w-full -top-24 rounded-t-60px -mb-12 bg-light">
          <Text className="text-2xl font-bold text-center mt-8 mx-6">
            {data.title}
          </Text>
          <View className="pt-8 mb-5">
            <RenderHTML
              contentWidth={displayWidth}
              source={{ html: text }}
              tagsStyles={tagsStyles}
            />
          </View>
          {!!data.youtube && (
            <View className="mb-2.5" style={{ height: video_height }}>
              <YoutubePlayer
                videoId={data.youtube}
                height={youtubeLoading ? 0 : video_height}
                onReady={() => setYoutubeLoading(false)}
                onFullScreenChange={onFullScreenChange}
              />
              {youtubeLoading && (
                <Loading
                  style={{
                    marginTop: video_height / 3,
                    alignSelf: "center",
                  }}
                  size={32}
                />
              )}
            </View>
          )}
          {imageGallery.length > 0 && (
            <View className="pb-8">
              <Text className="text-2xl font-bold text-center px-5">
                Galeria de Imagens
              </Text>
              <ImageGallery images={imageGallery} />
            </View>
          )}
          <Text className="text-base font-regular text-right px-5">{`publicado em: ${day} às ${hour}`}</Text>
          {data.user.name && (
            <View className="mt-5 mx-5 pb-1 rounded-40px text-textLight">
              <View className="flex-row mt-5 mx-5 mb-4">
                <Image
                  className="w-14 h-14 rounded-full mr-2.5"
                  source={{ uri: data.user.image }}
                />
                <Text className="text-lg font-medium self-center">
                  {data.user.name}
                </Text>
              </View>
              {!!data.user.about && (
                <View className="mx-2.5 mb-5 py-2.5 px-4 rounded-xl bg-light">
                  <Text className="text-base font-regular">
                    {data.user.about}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      <Pressable
        className="absolute top-14 left-4 w-12 h-12 items-center justify-center rounded-full border-2 border-light bg-tabBarColor-active"
        onPress={goBack}
      >
        <MaterialIcons
          name="keyboard-arrow-left"
          size={20}
          color={colors.light}
        />
      </Pressable>
    </>
  );
}
