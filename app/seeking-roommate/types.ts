// ============================================================
// FEATURE: Seeking Room / Flatmate
// TypeScript Types & Interfaces
// ============================================================

export type SeekingPropertyType = 'single_room' | 'shared_room' | 'full_mess' | 'sublet' | 'any';
export type SeekingStatus = 'active' | 'fulfilled';
export type ResponseStatus = 'pending' | 'accepted' | 'rejected';
export type GenderPref = 'any' | 'male' | 'female';
export type UserGender = 'male' | 'female' | 'other';

export interface SeekingPost {
  post_id: number;
  id?: number;
  user_id: string;
  zone_id: number;
  zone?: string;
  budget_min: number;
  budget_max: number;
  property_type: SeekingPropertyType | string;
  preferred_gender: GenderPref;
  move_in_date?: string;
  requirements?: string;
  status: SeekingStatus;
  created_at: string;
  // Joined relational fields
  user_name?: string;
  user?: string;
  user_gender?: UserGender;
}

export interface SeekingResponse {
  response_id: number;
  post_id: number;
  responder_id: string;
  message?: string;
  status: ResponseStatus;
  created_at: string;
  // Joined relational fields
  responder_name?: string;
  responder_email?: string;
  responder_phone?: string;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  requirements?: string;
}

export interface RoommatePreferences {
  preference_id?: number;
  user_id?: string;
  sleep_schedule?: 'early' | 'late' | 'flexible';
  diet_pref?: 'veg' | 'non_veg' | 'any';
  guest_policy?: 'allowed' | 'rarely' | 'never';
  smoking_habit?: 'non_smoker' | 'smoker' | 'outdoor_only';
  noise_level?: 'quiet' | 'moderate' | 'lively';
  cleanliness_level?: 'strict' | 'moderate' | 'relaxed';
}

export interface SeekingFilters {
  property_type: string;
  zone: string;
  preferred_gender: string;
}
