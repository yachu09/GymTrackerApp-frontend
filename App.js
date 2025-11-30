import AppNavigator from "./src/navigation/AppNavigator";
import { Provider as WorkoutProvider } from "./src/context/WorkoutContext";
import { Provider as TrainingProgramsProvider } from "./src/context/TrainingProgramsContext";

export default function App() {
  return (
    <TrainingProgramsProvider>
      <WorkoutProvider>
        <AppNavigator />
      </WorkoutProvider>
    </TrainingProgramsProvider>
  );
}
