"use client";

import { useSyncExternalStore } from "react";
import { isLaunchActive } from "@/lib/studio";

const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 60000);
  return () => clearInterval(id);
};

export function useLaunchActive(initial: boolean) {
  return useSyncExternalStore(subscribe, () => isLaunchActive(), () => initial);
}
