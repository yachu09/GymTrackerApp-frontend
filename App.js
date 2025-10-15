import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ExerciseSearchScreen from "./src/screens/ExerciseSearchScreen";
import ExerciseDetailsScreen from "./src/screens/ExerciseDetailsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ExerciseSearch"
        screenOptions={{
          headerTitle: "Exercise Search",
        }}
      >
        <Stack.Screen name="ExerciseSearch" component={ExerciseSearchScreen} />
        <Stack.Screen
          name="ExerciseDetails"
          component={ExerciseDetailsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
