import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WorkoutPlanningScreen from "../screens/WorkoutPlanningScreen";
import WorkoutTabScreen from "../screens/WorkoutTabScreen";
import AddProgramScreen from "../screens/AddProgramScreen";

const Stack = createNativeStackNavigator();

export default function WorkoutStack() {
  return (
    <Stack.Navigator initialRouteName="WorkoutTab">
      <Stack.Screen name="WorkoutTab" component={WorkoutTabScreen} />
      <Stack.Screen name="WorkoutPlanning" component={WorkoutPlanningScreen} />
      <Stack.Screen name="AddProgram" component={AddProgramScreen} />
    </Stack.Navigator>
  );
}
