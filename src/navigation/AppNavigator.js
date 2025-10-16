import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainTabs from "./MainTabs";

//główna funkcja nawigatora (w aplikacji może istnieć tylko 1 NavigationContainer)
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}
