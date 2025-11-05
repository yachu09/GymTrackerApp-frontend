import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WorkoutPlanningScreen from "../screens/WorkoutPlanningScreen";
import WorkoutTabScreen from "../screens/WorkoutTabScreen";
import AddProgramScreen from "../screens/AddProgramScreen";
import ExerciseSearchScreen from "../screens/ExerciseSearchScreen";
import ProgramDetailsScreen from "../screens/ProgramDetailsScreen";

const Stack = createNativeStackNavigator();

export default function WorkoutStack() {
  return (
    <Stack.Navigator initialRouteName="WorkoutPlanning">
      <Stack.Screen name="WorkoutTab" component={WorkoutTabScreen} />
      <Stack.Screen
        name="WorkoutPlanning"
        component={WorkoutPlanningScreen}
        options={{ title: "Let's workout!" }}
      />
      <Stack.Screen
        name="ProgramDetails"
        component={ProgramDetailsScreen}
        options={{ title: "Program Details" }}
      />
      <Stack.Screen
        name="AddProgram"
        component={AddProgramScreen}
        options={{ title: "Add a program" }}
        initialParams={{ idsToAdd: [], exercises: [] }}
      />
      <Stack.Screen
        name="ExerciseSearch"
        component={ExerciseSearchScreen}
        options={{ title: "Add exercises" }}
      />
    </Stack.Navigator>
  );
}
