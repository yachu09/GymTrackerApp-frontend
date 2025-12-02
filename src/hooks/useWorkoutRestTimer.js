import { useState, useEffect, useRef } from "react";

export default function useWorkoutRestTimer() {
  const initialSecondsRef = useRef(0);

  const [timeLeft, setTimeLeft] = useState(0);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isBreak) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsBreak(false);
            return initialSecondsRef.current;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreak]);

  const startBreak = (seconds) => {
    if (!seconds) seconds = 10;
    initialSecondsRef.current = seconds;
    setTimeLeft(seconds);
    setIsBreak(true);
  };

  const skipBreak = () => {
    setIsBreak(false);
    setTimeLeft(initialSecondsRef.current);
  };

  return {
    timeLeft,
    isBreak,
    startBreak,
    skipBreak,
  };
}
