"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 10_000);
  return () => window.clearInterval(id);
}

function offsetMinutes(timeZone: string, date: Date) {
  const there = new Date(date.toLocaleString("en-US", { timeZone }));
  const here = new Date(date.toLocaleString("en-US"));
  return Math.round((there.getTime() - here.getTime()) / 60_000);
}

function describe(timeZone: string) {
  const now = new Date();
  const time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone }).format(now);
  const diff = offsetMinutes(timeZone, now);
  const hours = Math.abs(diff) / 60;
  const amount = Number.isInteger(hours) ? `${hours}h` : `${hours.toFixed(1)}h`;
  const relative = diff === 0 ? "same time as you" : diff > 0 ? `${amount} ahead of you` : `${amount} behind you`;
  return `${time}|${relative}`;
}

interface LocalTimeProps {
  timeZone: string;
  /** "inline" renders just the time; "full" adds how far ahead/behind the visitor it is. */
  variant?: "inline" | "full";
}

/** Live local time for the given zone. Renders "--:--" on the server, then fills in. */
export function LocalTime({ timeZone, variant = "full" }: LocalTimeProps) {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => describe(timeZone),
    () => null,
  );
  const [time, relative] = snapshot?.split("|") ?? ["--:--", ""];

  if (variant === "inline") {
    return <time suppressHydrationWarning>{time}</time>;
  }

  return (
    <span>
      <time suppressHydrationWarning className="tabular-nums">
        {time}
      </time>
      {relative && <span className="text-muted-foreground"> · {relative}</span>}
    </span>
  );
}
