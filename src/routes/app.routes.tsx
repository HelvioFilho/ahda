import { colors } from "@/styles/colors";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { Home } from "@/screens/Home";

const { Navigator, Screen } = createNativeStackNavigator();
function HomeScreen() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="Home" component={Home} />
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
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              size={30}
              color={color}
            />
          ),
        }}
      />
    </Navigator>
  );
}
