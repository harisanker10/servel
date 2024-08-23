"use client";

import { useEffect, useState } from "react";
const runningIntervals: NodeJS.Timeout[] = [];
const clearAllIntervals = () => {
  while (runningIntervals.length > 0) {
    clearInterval(runningIntervals.pop());
  }
};

export function useTimer(onFinish?: () => void) {
  const [formattedTime, setFormattedTime] = useState<string | null>(null);
  const [expired, SetExpired] = useState(false);

  useEffect(() => {
    return () => {
      SetExpired(false);
      clearAllIntervals();
    };
  }, []);

  const startInterval = (timeStamp: Date) => {
    clearAllIntervals();
    SetExpired(false);
    const interval = setInterval(() => {
      const remainingInMs =
        new Date(timeStamp).getTime() - new Date().getTime();
      if (remainingInMs <= 400) {
        setFormattedTime(null);
        SetExpired(true);
        clearAllIntervals();
        if (onFinish) onFinish();
        return;
      }
      const minutes = Math.floor(remainingInMs / (60 * 1000));
      const seconds = Math.floor((remainingInMs % 60000) / 1000);
      setFormattedTime(`${minutes}:${seconds}`);
    }, 1000);
    runningIntervals.push(interval);
  };

  const start = (expiryTimestamp: Date) => {
    startInterval(expiryTimestamp);
  };

  const reset = (newTimestamp: Date) => {
    clearAllIntervals();
    startInterval(newTimestamp);
  };

  return { formattedTime, start, reset, expired };
}
