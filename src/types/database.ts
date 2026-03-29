export type PreferredFormat = "in_person" | "hybrid" | "online";
export type SkillLevel = "beginner" | "intermediate" | "advanced";
export type SkillIntention = "learn" | "teach" | "collaborate";

export type Availability = {
  [day in
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday"]?: ("morning" | "afternoon" | "evening")[];
};

export type Profile = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  city: string | null;
  availability: Availability | null;
  preferred_format: PreferredFormat | null;
  is_public_profile: boolean;
  created_at: string;
  updated_at: string;
};

export type UserSkill = {
  id: string;
  user_id: string;
  skill_name: string;
  level: SkillLevel;
  intention: SkillIntention;
  goal: string | null;
  created_at: string;
};
