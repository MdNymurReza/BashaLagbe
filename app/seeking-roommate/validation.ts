// ============================================================
// FEATURE: Seeking Room / Flatmate
// Zod Validation Schemas
// ============================================================

import { z } from 'zod';

export const createSeekingSchema = z.object({
  zone_id: z.string().min(1, 'Please select a zone'),
  budget_min: z.number().min(0, 'Budget min cannot be negative'),
  budget_max: z.number().min(1, 'Budget max must be greater than 0'),
  property_type: z.enum(['single_room', 'shared_room', 'full_mess', 'sublet', 'any']),
  preferred_gender: z.enum(['male', 'female', 'any']),
  move_in_date: z.string().optional(),
  requirements: z.string().optional()
}).refine(data => data.budget_max >= data.budget_min, {
  message: "Max budget must be greater than or equal to min budget",
  path: ["budget_max"]
});

export const seekResponseSchema = z.object({
  message: z.string().min(5, 'Message must be at least 5 characters')
});

export const updateRoommatePreferencesSchema = z.object({
  sleep_schedule: z.enum(['early', 'late', 'flexible'], { message: 'Please select your sleep schedule' }),
  diet_pref: z.enum(['veg', 'non_veg', 'any'], { message: 'Please select your diet preference' }),
  guest_policy: z.enum(['allowed', 'rarely', 'never'], { message: 'Please select your guest policy' }),
  smoking_habit: z.enum(['non_smoker', 'smoker', 'outdoor_only'], { message: 'Please select your smoking preference' }),
  noise_level: z.enum(['quiet', 'moderate', 'lively'], { message: 'Please select your noise level tolerance' }),
  cleanliness_level: z.enum(['strict', 'moderate', 'relaxed'], { message: 'Please select your cleanliness expectation' })
});

export type CreateSeekingInput = z.infer<typeof createSeekingSchema>;
export type SeekResponseInput = z.infer<typeof seekResponseSchema>;
export type RoommatePreferenceInput = z.infer<typeof updateRoommatePreferencesSchema>;
