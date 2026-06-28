import { format, formatDistanceToNow, isPast } from "date-fns";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatGameDate(date: string | Date) {
  const value = typeof date === "string" ? new Date(date) : date;
  return format(value, "EEE, MMM d · h:mm a");
}

export function formatRelativeDate(date: string | Date) {
  const value = typeof date === "string" ? new Date(date) : date;
  if (isPast(value)) return "Started";
  return `in ${formatDistanceToNow(value)}`;
}

export function sportEmoji(sport: string) {
  const map: Record<string, string> = {
    Basketball: "🏀",
    Soccer: "⚽",
    Tennis: "🎾",
    Volleyball: "🏐",
    Pickleball: "🏓",
    Football: "🏈",
    Baseball: "⚾",
    Running: "🏃",
    "Ultimate Frisbee": "🥏",
    Other: "🎯",
  };
  return map[sport] ?? "🎯";
}
