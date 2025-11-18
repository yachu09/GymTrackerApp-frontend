import AppNavigator from "./src/navigation/AppNavigator";
import { Provider as WorkoutProvider } from "./src/context/WorkoutContext";

export default function App() {
  return (
    <WorkoutProvider>
      <AppNavigator />
    </WorkoutProvider>
  );
}
