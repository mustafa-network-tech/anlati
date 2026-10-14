"use client";

import { launchNote } from "@/lib/studio";
import { useLaunchActive } from "./useLaunch";

export default function LaunchNote({ initialActive }: { initialActive: boolean }) {
  const active = useLaunchActive(initialActive);
  if (!active) return null;
  return <p className="st-launch-note">{launchNote}</p>;
}
