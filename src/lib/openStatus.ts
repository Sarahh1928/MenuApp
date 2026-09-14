import { useTranslation } from "react-i18next";
import type { RestaurantHours } from "../types/restaurant";

export interface OpenStatus {
  isOpen: boolean;
  closingTime?: string;
  openingTime?: string;
  openingDayOffset?: number; // 0 = today, 1 = tomorrow, 2+ = N days from now
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function formatTime(
  time: string,
  amLabel: string,
  pmLabel: string,
): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? pmLabel : amLabel;
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function getNowInTimezone(timezone: string): {
  dayOfWeek: number;
  minutes: number;
} {
  const now = new Date();

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Sun";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");

  return {
    dayOfWeek: weekdayMap[weekday],
    minutes: hour * 60 + minute,
  };
}

export function computeOpenStatus(
  hours: RestaurantHours[],
  timezone: string,
): OpenStatus {
  if (hours.length === 0) return { isOpen: false };

  const { dayOfWeek, minutes: nowMinutes } = getNowInTimezone(timezone);

  const today = hours.find((h) => h.day_of_week === dayOfWeek);
  const yesterday = hours.find((h) => h.day_of_week === (dayOfWeek + 6) % 7);

  // Case 1: yesterday's hours spill into today (overnight)
  if (
    yesterday &&
    !yesterday.is_closed &&
    yesterday.open_time &&
    yesterday.close_time
  ) {
    const openMin = timeToMinutes(yesterday.open_time);
    const closeMin = timeToMinutes(yesterday.close_time);
    const isOvernight = closeMin < openMin;

    if (isOvernight && nowMinutes < closeMin) {
      return { isOpen: true, closingTime: yesterday.close_time };
    }
  }

  // Case 2: today's own hours
  if (!today || today.is_closed || !today.open_time || !today.close_time) {
    for (let i = 1; i <= 7; i++) {
      const nextDay = hours.find((h) => h.day_of_week === (dayOfWeek + i) % 7);
      if (nextDay && !nextDay.is_closed && nextDay.open_time) {
        return {
          isOpen: false,
          openingTime: nextDay.open_time,
          openingDayOffset: i,
        };
      }
    }
    return { isOpen: false };
  }

  const openMin = timeToMinutes(today.open_time);
  const closeMin = timeToMinutes(today.close_time);
  const isOvernight = closeMin < openMin;

  if (isOvernight) {
    if (nowMinutes >= openMin) {
      return { isOpen: true, closingTime: today.close_time };
    }
    return { isOpen: false, openingTime: today.open_time, openingDayOffset: 0 };
  }

  if (nowMinutes >= openMin && nowMinutes < closeMin) {
    return { isOpen: true, closingTime: today.close_time };
  }

  // closed now, but opens later today
  if (nowMinutes < openMin) {
    return { isOpen: false, openingTime: today.open_time, openingDayOffset: 0 };
  }

  // closed for the rest of today — find next opening day
  for (let i = 1; i <= 7; i++) {
    const nextDay = hours.find((h) => h.day_of_week === (dayOfWeek + i) % 7);
    if (nextDay && !nextDay.is_closed && nextDay.open_time) {
      return {
        isOpen: false,
        openingTime: nextDay.open_time,
        openingDayOffset: i,
      };
    }
  }

  return { isOpen: false };
}
