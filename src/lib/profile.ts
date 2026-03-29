import type { Profile, UserSkill } from "@/types/database";

export type MissingField = "skills" | "city" | "availability";

export function getProfileCompleteness(
  profile: Profile,
  skills: UserSkill[]
): MissingField[] {
  const missing: MissingField[] = [];

  if (skills.length === 0) {
    missing.push("skills");
  }

  if (!profile.city?.trim()) {
    missing.push("city");
  }

  if (
    !profile.availability ||
    Object.keys(profile.availability).length === 0
  ) {
    missing.push("availability");
  }

  return missing;
}

export function isProfileComplete(
  profile: Profile,
  skills: UserSkill[]
): boolean {
  return getProfileCompleteness(profile, skills).length === 0;
}
