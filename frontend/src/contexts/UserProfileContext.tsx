import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProfile {
  ageRange: string;
  educationLevel: string;
  techBackground: string;
  codingExperience: string;
  goals: string[];
  learningSpeed: string;
  learningMode: string;
  timePerWeek: string;
  preferredLanguage: string;
}

interface UserProfileContextType {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  clearUserProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    } else {
      localStorage.removeItem('userProfile');
    }
  }, [userProfile]);

  const setUserProfile = (profile: UserProfile) => {
    setUserProfileState(profile);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfileState(prev => prev ? { ...prev, ...updates } : null);
  };

  const clearUserProfile = () => {
    setUserProfileState(null);
  };

  return (
    <UserProfileContext.Provider value={{ userProfile, setUserProfile, updateUserProfile, clearUserProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};
