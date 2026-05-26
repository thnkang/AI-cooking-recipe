
export interface UserProfile {
  cookingLevel: string;
  cuisinePreferences: string[];
  allergies: string[];
  personalGoal: string;
  activityLevel: string;
  dietaryPreferences: string[];
}

export interface Ingredient {
  id: string;
  name: string;
}

export enum TimePreference {
  QUICK = '5-15 min',
  LONG = 'Hours'
}
