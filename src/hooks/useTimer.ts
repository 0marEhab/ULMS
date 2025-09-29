import { useState, useEffect } from "react";

/**
 * Custom hook for managing a countdown timer
 * @param initialTime - Initial time in seconds
 * @param onTimeUp - Callback when timer reaches 0
 * @returns Current time and timer controls
 */
export const useTimer = (
  initialTime: number,
  onTimeUp?: () => void
) => {
  const [timeRemaining, setTimeRemaining] =
    useState(initialTime);
  const [isRunning, setIsRunning] =
    useState(false);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onTimeUp?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, isRunning, onTimeUp]);

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = (newTime?: number) => {
    setIsRunning(false);
    setTimeRemaining(newTime ?? initialTime);
  };

  return {
    timeRemaining,
    isRunning,
    start,
    stop,
    reset,
  };
};
