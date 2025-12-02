import { useMemo, useContext, useEffect } from "react";
import { Context as WorkoutContext } from "../context/WorkoutContext";

function getISOWeek(date) {
  const tmp = new Date(date.valueOf());

  const dayNr = ((tmp.getDay() + 6) % 7) + 1;

  tmp.setDate(tmp.getDate() + (4 - dayNr));

  const yearStart = new Date(tmp.getFullYear(), 0, 1);

  const week = Math.ceil(((tmp - yearStart) / 86400000 + 1) / 7);

  return week;
}

function getISOWeekYear(date) {
  const tmp = new Date(date.valueOf());

  const dayNr = ((tmp.getDay() + 6) % 7) + 1;
  tmp.setDate(tmp.getDate() + (4 - dayNr));

  return tmp.getFullYear();
}

export default function useWorkoutStreak() {
  const {
    state: { workouts },
    loadWorkouts,
  } = useContext(WorkoutContext);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const result = useMemo(() => {
    if (!workouts.length) {
      return { streak: 0, currentWeekWorkouts: 0 };
    }

    const workoutsByWeek = {};

    for (const w of workouts) {
      const date = new Date(w.date);
      const week = getISOWeek(date);
      const year = getISOWeekYear(date);

      const key = `${year}-${week}`;

      if (!workoutsByWeek[key]) workoutsByWeek[key] = 0;
      workoutsByWeek[key] += 1;
    }

    const now = new Date();
    const currWeek = getISOWeek(now);
    const currYear = getISOWeekYear(now);
    const currKey = `${currYear}-${currWeek}`;

    const currentWeekWorkouts = workoutsByWeek[currKey] || 0;

    const sortedWeeks = Object.keys(workoutsByWeek).sort((a, b) => {
      const [ya, wa] = a.split("-").map(Number);
      const [yb, wb] = b.split("-").map(Number);

      if (yb !== ya) return yb - ya;
      return wb - wa;
    });

    let streak = 0;

    for (const key of sortedWeeks) {
      if (key === currKey) continue;

      if (workoutsByWeek[key] >= 1) {
        streak++;
      } else {
        break;
      }
    }

    return { streak, currentWeekWorkouts };
  }, [workouts]);

  return result;
}
