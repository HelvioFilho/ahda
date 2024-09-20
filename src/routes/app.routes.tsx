import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Ionicons,
  MaterialCommunityIcons,
  EvilIcons,
} from "@expo/vector-icons";

import { Home } from "@/screens/Home";
import { Search } from "@/screens/Search";
import { Message } from "@/screens/Message";
import { Settings } from "@/screens/Settings";
import { Post } from "@/screens/Post";

import { PlayButton } from "@/components/PlayButton";

import { colors } from "@/styles/colors";

const { Navigator, Screen } = createNativeStackNavigator();
function HomeScreen() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="Home" component={Home} />
      <Screen name="Post" component={Post} />
    </Navigator>
  );
}

function SearchScreen() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="Search" component={Search} />
      <Screen name="Post" component={Post} />
    </Navigator>
  );
}

export function AppRoute() {
  const { Navigator, Screen } = createBottomTabNavigator();

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopColor: "transparent",
          height: 70,
          paddingTop: 5,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: colors.tabBarColor.active,
        tabBarInactiveTintColor: colors.dark,
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Screen
        name="HomeAndPost"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Screen
        name="Busca"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="magnify" size={33} color={color} />
          ),
          tabBarHideOnKeyboard: true,
        }}
      />
      <Screen
        name="Play"
        component={PlayButton}
        options={{
          tabBarLabel: "",
          tabBarButton: () => <PlayButton />,
        }}
      />
      <Screen
        name="Mensagem"
        component={Message}
        options={{
          tabBarIcon: ({ color }) => (
            <EvilIcons name="envelope" size={37} color={color} />
          ),
          tabBarHideOnKeyboard: true,
        }}
      />
      <Screen
        name="Opções"
        component={Settings}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={30}
              color={color}
            />
          ),
          tabBarHideOnKeyboard: true,
        }}
      />
    </Navigator>
  );
}
