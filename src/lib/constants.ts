export const SPORTS = [
  "Basketball",
  "Soccer",
  "Tennis",
  "Volleyball",
  "Pickleball",
  "Football",
  "Baseball",
  "Running",
  "Ultimate Frisbee",
  "Other",
] as const;

export const SKILL_LEVELS = [
  "All levels",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Competitive",
] as const;

export type Sport = (typeof SPORTS)[number];
export type SkillLevel = (typeof SKILL_LEVELS)[number];
