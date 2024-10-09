import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Modal,
  Pressable,
  View,
  Animated,
  Easing,
} from "react-native";
import LottieView from "lottie-react-native";
import TrackPlayer, {
  State,
  usePlaybackState,
} from "react-native-track-player";
import { FontAwesome } from "@expo/vector-icons";

import { Loading } from "@/components/Loading";
import { WarningModal } from "@/components/WarningModal";

import PlayStop from "@/assets/play.json";
import { colors } from "@/styles/colors";

export function PlayButton() {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const opacityAnim = useRef(new Animated.Value(1)).current; // Animação de opacidade
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const playbackState = usePlaybackState();
  const animationPlayStop = useRef<LottieView>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardVisible(true);
        hideButton();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false);
        showButton();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const hideButton = () => {
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    Animated.timing(scaleAnim, {
      toValue: 0.8,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const showButton = () => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  };

  async function addTrack() {
    try {
      const data = {
        url: "https://s18.maxcast.com.br:8707/live",
        artwork: require("@/assets/angel-blue.png"),
        title: "Rádio A Hora do Anjo",
        artist: "De segunda a sexta de 18h às 19h",
      };
      await TrackPlayer.add(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function setPlay() {
    try {
      await TrackPlayer.play();
      animationPlayStop.current?.play(24, 0);
    } catch (e) {
      console.log(e);
    }
  }

  async function setPause() {
    try {
      await TrackPlayer.pause();
      await TrackPlayer.reset();
    } catch (e) {
      console.log(e);
    }
  }

  async function togglePlayback(playbackState: State) {
    if (playbackState === State.None || playbackState === State.Stopped) {
      await addTrack();
    } else if (playbackState === State.Playing) {
      await setPause();
    }
  }

  useEffect(() => {
    if (playbackState.state === State.Loading) {
      setLoading(true);
      return;
    }

    if (playbackState.state === "error") {
      setLoading(false);
      setVisible(true);
      return;
    }

    if (
      playbackState.state === undefined ||
      playbackState.state === State.None ||
      playbackState.state === State.Paused
    ) {
      animationPlayStop.current?.play(0, 24);
      return;
    }

    if (playbackState.state === State.Ready) {
      setLoading(false);
      setPlay();
      return;
    }
  }, [playbackState, isKeyboardVisible]);

  return (
    <>
      <Animated.View
        style={{
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <View
          className={`
        relative 
        -top-6 
        w-16 
        h-16 
        rounded-full 
        justify-center 
        items-center 
        bg-tabBarColor-active`}
          style={{
            shadowColor: colors.tabBarColor.shadow,
            shadowOffset: { width: 0, height: 7 },
            shadowOpacity: 0.25,
            shadowRadius: 3.5,
            elevation: 5,
          }}
        >
          {playbackState.state === "error" ? (
            <Pressable
              className="w-16 h-16 rounded-full items-center justify-center"
              onPress={() => setVisible(true)}
              accessibilityLabel="Mostrar mensagem de erro"
              accessibilityRole="button"
            >
              <FontAwesome name="exclamation" size={24} color={colors.light} />
            </Pressable>
          ) : (
            <Pressable
              className="w-16 h-16 rounded-full items-center justify-center"
              onPress={() =>
                playbackState.state !== undefined &&
                togglePlayback(playbackState.state)
              }
              disabled={loading}
              accessibilityLabel="Pausar ou Reproduzir"
              accessibilityRole="button"
            >
              {loading ? (
                <Loading player size={20} />
              ) : (
                <LottieView
                  ref={animationPlayStop}
                  source={PlayStop}
                  style={{ height: 60, width: 60, alignSelf: "center" }}
                  resizeMode="contain"
                  loop={false}
                  autoPlay={false}
                  onAnimationFinish={() => setLoading(false)}
                />
              )}
            </Pressable>
          )}
        </View>
      </Animated.View>
      <Modal
        animationType="fade"
        transparent
        visible={visible}
        onRequestClose={() => setVisible(false)}
        hardwareAccelerated={true}
      >
        <WarningModal
          title="Aviso"
          height={220}
          message={
            "A rádio encontra-se, momentaneamente, fora do ar. \nSentimos muito pelo inconveniente, tente novamente mais tarde!"
          }
          colorButton={colors.error}
          closeModal={() => setVisible(false)}
        />
      </Modal>
    </>
  );
}
