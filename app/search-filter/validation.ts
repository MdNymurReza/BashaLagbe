// ============================================================
// FEATURE: Search & Filter
// Zod Validation Schemas
// ============================================================

import { z } from 'zod';
import { NO_BUDGET_LIMIT, AMENITY_COLUMNS } from './constants';

/**
 * Validates search filter input from the URL or form submissions.
 * Coerces string values to the correct types for safe use.
 */
export const searchFilterSchema = z.object({
  q: z.string().max(200, 'Search query too long').optional().default(''),
  zone: z.string().optional().default(''),
  type: z.enum(['single_room', 'shared_room', 'full_mess', 'sublet', 'any', ''])
    .optional()
    .default(''),
  budget: z.coerce.number().min(0).max(NO_BUDGET_LIMIT).optional().default(NO_BUDGET_LIMIT),
  sort: z.enum(['newest', 'cost_asc', 'cost_desc']).optional().default('newest'),
  amenities: z.string().optional().default(''),
  page: z.coerce.number().int().min(1).optional().default(1),
});

/**
 * Validates a saved search label provided by the user (for renaming).
 */
export const savedSearchLabelSchema = z.object({
  label: z.string().min(1, 'Label is required').max(200, 'Label too long'),
});

export type SearchFilterInput = z.infer<typeof searchFilterSchema>;
export type SavedSearchLabelInput = z.infer<typeof savedSearchLabelSchema>;
