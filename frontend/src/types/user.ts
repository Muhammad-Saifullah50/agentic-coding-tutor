export interface UserProfile {
  id: number;
  created_at: string; // timestamptz
  username: string;
  email: string;
  ageRange: string;
  educationLevel: string;
  techBackground: string;
  codingExperience: string;
  goals: string[];
  learningSpeed: string;
  learningMode: string;
  timePerWeek: string;
  preferredLanguage: string;
  userId: string;
  courses: number;
  onBoarded: boolean;
  imageUrl: string;
}

// Partial type for when creating/updating a profile
export type UserProfileInput = Partial<Omit<UserProfile, 'id' | 'created_at' | 'courses'>>

// Type for the minimum required fields when creating a profile
export interface CreateUserProfileInput {
  username: string;
  email: string;
  userId: string;
}