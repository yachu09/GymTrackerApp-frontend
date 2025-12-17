import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WorkoutPlanningScreen from "../screens/WorkoutPlanningScreen";
import AddProgramDayScreen from "../screens/AddProgramDayScreen";
import ExerciseSearchScreen from "../screens/ExerciseSearchScreen";
import ProgramDetailsScreen from "../screens/ProgramDetailsScreen";
import ProgramDayDetailsScreen from "../screens/ProgramDayDetailsScreen";
import WorkoutScreen from "../screens/WorkoutScreen";
import WorkoutSummaryScreen from "../screens/WorkoutSummaryScreen";
import AddNewProgramScreen from "../screens/AddNewProgramScreen";
import AddExerciseScreen from "../screens/AddExerciseScreen";

const Stack = createNativeStackNavigator();

export default function WorkoutStack() {
  return (
    <Stack.Navigator initialRouteName="WorkoutPlanning">
      <Stack.Screen
        name="WorkoutPlanning"
        component={WorkoutPlanningScreen}
        options={{ title: "Training Programs" }}
      />
      <Stack.Screen
        name="ProgramDetails"
        component={ProgramDetailsScreen}
        options={{ title: "Training Days" }}
      />
      <Stack.Screen
        name="ProgramDayDetails"
        component={ProgramDayDetailsScreen}
        options={{ title: "Exercises Info" }}
      />
      <Stack.Screen
        name="AddProgramDay"
        component={AddProgramDayScreen}
        options={{ title: "Add a program day" }}
        initialParams={{ idsToAdd: [], exercises: [] }}
      />
      <Stack.Screen
        name="AddNewProgram"
        component={AddNewProgramScreen}
        options={{ title: "Add a program" }}
      />
      <Stack.Screen
        name="ExerciseSearch"
        component={ExerciseSearchScreen}
        options={{ title: "Add exercises" }}
      />
      <Stack.Screen
        name="Workout"
        component={WorkoutScreen}
        options={{ title: "Undefined Workout" }}
      />
      <Stack.Screen
        name="WorkoutSummary"
        component={WorkoutSummaryScreen}
        options={{ title: "Workout Summary" }}
      />
      <Stack.Screen
        name="AddExercise"
        component={AddExerciseScreen}
        options={{ title: "Add an exercise" }}
      />
    </Stack.Navigator>
  );
}
