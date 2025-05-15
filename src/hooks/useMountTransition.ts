"use client";
import { useEffect, useState } from "react";

export default function useMountTransition(open: boolean, delay: number = 300) {
  const [hasTransitionedIn, setHasTransitionedIn] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (!hasTransitionedIn && open) {
      setHasTransitionedIn(true);
    } else if (hasTransitionedIn && !open) {
      timer = setTimeout(() => setHasTransitionedIn(false), delay);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [open, delay , hasTransitionedIn]);

  return hasTransitionedIn;
}
