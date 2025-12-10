import { useMemo } from "react";

export default function useWorkoutMuscleStats(workout) {
  return useMemo(() => {
    if (!workout || !workout.exercises?.length) {
      return { stats: [], muscleGroupTotals: {}, totalSets: 0 };
    }

    const stats = [];
    const muscleGroupTotals = {};

    let totalSets = 0;

    workout.exercises.forEach((ex) => {
      const completedSets = ex.sets?.length ?? 0;
      totalSets += completedSets;

      const muscleGroup = ex.muscleGroup || "Unknown";

      if (!muscleGroupTotals[muscleGroup]) {
        muscleGroupTotals[muscleGroup] = 0;
      }
      muscleGroupTotals[muscleGroup] += completedSets;
    });

    workout.exercises.forEach((ex) => {
      const completedSets = ex.sets?.length ?? 0;
      const muscleGroup = ex.muscleGroup || "Unknown";

      stats.push({
        name: ex.exerciseName,
        muscleGroup,
        completedSets,
        contributionPercent:
          totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0,
      });
    });

    for (const group in muscleGroupTotals) {
      muscleGroupTotals[group] = Math.round(
        (muscleGroupTotals[group] / totalSets) * 100
      );
    }

    return { stats, muscleGroupTotals, totalSets };
  }, [workout]);
}
