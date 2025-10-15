import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SearchTabScreen from "../screens/SearchTabScreen";
import TestTabScreen from "../screens/TestTabScreen";
import SearchStack from "./SearchStack";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="TestTab" component={TestTabScreen} />
      <Tab.Screen
        name="SearchTabScreen"
        component={SearchStack}
        options={{ title: "Search" }}
      />
    </Tab.Navigator>
  );
}
