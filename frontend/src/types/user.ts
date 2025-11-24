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
  xp?: number;
  streak?: number;
  last_activity_date?: string;
  courses: number;
  onBoarded: boolean;
  imageUrl: string;

  // Subscription & Credits
  subscription_plan?: 'free' | 'plus' | 'pro';
  credits?: number;
}

// Partial type for when creating/updating a profile
export type UserProfileInput = Partial<Omit<UserProfile, 'id' | 'created_at' | 'courses'>>

// Type for the minimum required fields when creating a profile
export interface CreateUserProfileInput {
  username: string;
  email: string;
  userId: string;
}