// Time formatting utilities

/**
 * Formats seconds into MM:SS format
 * @param seconds - Number of seconds
 * @returns Formatted time string (e.g., "5:30", "15:05")
 */
export const formatTime = (
  seconds: number
): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Converts minutes to seconds
 * @param minutes - Number of minutes
 * @returns Number of seconds
 */
export const minutesToSeconds = (
  minutes: number
): number => {
  return minutes * 60;
};

/**
 * Formats duration in a human-readable format
 * @param seconds - Number of seconds
 * @returns Human-readable duration (e.g., "1h 30m", "45m", "30s")
 */
export const formatDuration = (
  seconds: number
): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(
    (seconds % 3600) / 60
  );
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${remainingSeconds}s`;
  }
};

/**
 * Checks if time is running low (less than 5 minutes)
 * @param seconds - Number of seconds remaining
 * @returns True if time is running low
 */
export const isTimeRunningLow = (
  seconds: number
): boolean => {
  return seconds < 300; // 5 minutes
};

/**
 * Checks if time is critically low (less than 1 minute)
 * @param seconds - Number of seconds remaining
 * @returns True if time is critically low
 */
export const isTimeCritical = (
  seconds: number
): boolean => {
  return seconds < 60; // 1 minute
};
