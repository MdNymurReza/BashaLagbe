module.exports = [
"[project]/.next-internal/server/app/listings/create/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/listings.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "408ca7b96e820d7870984b2b68bb39e1ea01c7522a",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$listings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createListing"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$listings$2f$create$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$listings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/listings/create/page/actions.js { ACTIONS_MODULE0 => "[project]/app/actions/listings.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$listings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/listings.ts [app-rsc] (ecmascript)");
}),
"[project]/.next-internal/server/app/listings/create/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/listings.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$listings$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/listings.ts [app-rsc] (ecmascript)");
;
}),
"[project]/app/actions/listings.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"408ca7b96e820d7870984b2b68bb39e1ea01c7522a":{"name":"createListing"}},"app/actions/listings.ts",""] */ __turbopack_context__.s([
    "createListing",
    ()=>createListing
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function createListing(formData) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        return {
            success: false,
            error: 'You must be logged in to create a listing.'
        };
    }
    // 1. Insert main listing
    const listingData = {
        user_id: user.id,
        title: formData.get('title'),
        description: formData.get('description'),
        property_type: formData.get('property_type'),
        listing_type: formData.get('listing_type'),
        zone_id: parseInt(formData.get('zone_id'), 10),
        address: formData.get('address'),
        lat: parseFloat(formData.get('lat') || '23.7949'),
        lng: parseFloat(formData.get('lng') || '90.4493'),
        gender_pref: formData.get('gender_pref'),
        total_rooms: parseInt(formData.get('total_rooms'), 10) || 1,
        current_occupancy: parseInt(formData.get('current_occupancy'), 10) || 0,
        status: 'available',
        is_verified: false
    };
    const { data: newListing, error: listingError } = await supabase.from('listings').insert(listingData).select('listing_id').single();
    if (listingError) {
        console.error('Error creating listing:', listingError);
        return {
            success: false,
            error: 'Failed to create listing. Please try again.'
        };
    }
    const listingId = newListing.listing_id;
    // 2. Insert Utility Costs
    const utilityCosts = {
        listing_id: listingId,
        base_rent: parseInt(formData.get('base_rent'), 10) || 0,
        electricity_amount: parseInt(formData.get('electricity_amount'), 10) || 0,
        electricity_type: formData.get('electricity_type'),
        gas_bill: parseInt(formData.get('gas_bill'), 10) || 0,
        water_bill: parseInt(formData.get('water_bill'), 10) || 0,
        internet_cost: parseInt(formData.get('internet_cost'), 10) || 0,
        maintenance_fee: parseInt(formData.get('maintenance_fee'), 10) || 0,
        caretaker_fee: parseInt(formData.get('caretaker_fee'), 10) || 0,
        other_fees: parseInt(formData.get('other_fees'), 10) || 0
    };
    // Calculate total monthly
    // @ts-ignore
    utilityCosts.total_monthly = utilityCosts.base_rent + utilityCosts.electricity_amount + utilityCosts.gas_bill + utilityCosts.water_bill + utilityCosts.internet_cost + utilityCosts.maintenance_fee + utilityCosts.caretaker_fee + utilityCosts.other_fees;
    const { error: costsError } = await supabase.from('utility_costs').insert(utilityCosts);
    if (costsError) {
        console.error('Error creating utility costs:', costsError);
    }
    // 3. Insert Amenities
    const amenities = {
        listing_id: listingId,
        attached_bathroom: formData.get('attached_bathroom') === 'true',
        attached_kitchen: formData.get('attached_kitchen') === 'true',
        is_furnished: formData.get('is_furnished') === 'true',
        rooftop_access: formData.get('rooftop_access') === 'true',
        parking: formData.get('parking') === 'true',
        power_backup: formData.get('power_backup') === 'true',
        lift_access: formData.get('lift_access') === 'true'
    };
    const { error: amenitiesError } = await supabase.from('listing_amenities').insert(amenities);
    if (amenitiesError) {
        console.error('Error creating amenities:', amenitiesError);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/listings');
    return {
        success: true,
        listingId
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createListing
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createListing, "408ca7b96e820d7870984b2b68bb39e1ea01c7522a", null);
}),
"[project]/lib/supabase/server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAdminClient",
    ()=>createAdminClient,
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
// Admin client that bypasses RLS (for admin API routes only)
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-rsc] (ecmascript) <locals>");
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://sthjpzooutzrzwepmljr.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0aGpwem9vdXR6cnp3ZXBtbGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0MDU0NjEsImV4cCI6MjEwNDk4MTQ2MX0.BXBReAeUZ6Il90i1eP72FQXkS3eBPtZM3PCs0jUUJn8"), {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // Server Component - cookies can't be set
                }
            }
        }
    });
}
;
function createAdminClient() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "https://sthjpzooutzrzwepmljr.supabase.co"), process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}
}),
];

//# sourceMappingURL=_1ogo136._.js.map