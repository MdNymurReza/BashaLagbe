(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/MapComponent.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MapComponent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/leaflet/dist/leaflet-src.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
// Fix default Leaflet icon paths (bundler strips the default URLs)
delete __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Icon.Default.prototype._getIconUrl;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});
// Green pin for listing markers
const listingIcon = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [
        25,
        41
    ],
    iconAnchor: [
        12,
        41
    ],
    popupAnchor: [
        1,
        -34
    ],
    shadowSize: [
        41,
        41
    ]
});
function MapComponent({ zones, listings = [], selectedZoneId, onZoneSelect, interactive = true }) {
    _s();
    const mapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const polygonLayerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pinLayerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Initialise map once
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapComponent.useEffect": ()=>{
            if (!containerRef.current || mapRef.current) return;
            mapRef.current = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].map(containerRef.current, {
                zoomControl: interactive,
                dragging: interactive,
                scrollWheelZoom: interactive ? 'center' : false
            }).setView(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MAP_CENTER"], __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MAP_ZOOM"]);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                subdomains: [
                    'mt0',
                    'mt1',
                    'mt2',
                    'mt3'
                ],
                attribution: '&copy; Google Maps'
            }).addTo(mapRef.current);
            polygonLayerRef.current = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].layerGroup().addTo(mapRef.current);
            pinLayerRef.current = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].layerGroup().addTo(mapRef.current);
        }
    }["MapComponent.useEffect"], []); // eslint-disable-line react-hooks/exhaustive-deps
    // Redraw zone polygons when zones or selection changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapComponent.useEffect": ()=>{
            const map = mapRef.current;
            const polygonGroup = polygonLayerRef.current;
            if (!map || !polygonGroup) return;
            polygonGroup.clearLayers();
            const defaultStyle = {
                color: '#1a5c45',
                weight: 2,
                fillColor: '#1a5c45',
                fillOpacity: 0.10
            };
            const selectedStyle = {
                color: '#2e7d5a',
                weight: 3,
                fillColor: '#2e7d5a',
                fillOpacity: 0.30
            };
            zones.forEach({
                "MapComponent.useEffect": (zone)=>{
                    if (!zone.polygon) return;
                    const isSelected = selectedZoneId === zone.id || selectedZoneId === zone.zone_id;
                    const polygon = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].polygon(zone.polygon, isSelected ? selectedStyle : defaultStyle);
                    if (interactive) {
                        polygon.bindTooltip(`<b>${zone.name || zone.zone_name}</b>`, {
                            direction: 'top',
                            sticky: true
                        });
                        polygon.on('mouseover', {
                            "MapComponent.useEffect": ()=>{
                                if (!isSelected) polygon.setStyle({
                                    fillOpacity: 0.20
                                });
                            }
                        }["MapComponent.useEffect"]);
                        polygon.on('mouseout', {
                            "MapComponent.useEffect": ()=>{
                                if (!isSelected) polygon.setStyle({
                                    fillOpacity: 0.10
                                });
                            }
                        }["MapComponent.useEffect"]);
                        polygon.on('click', {
                            "MapComponent.useEffect": ()=>{
                                if (onZoneSelect) onZoneSelect(zone.id || zone.zone_id);
                            }
                        }["MapComponent.useEffect"]);
                    }
                    polygon.addTo(polygonGroup);
                    if (isSelected) {
                        map.fitBounds(polygon.getBounds(), {
                            padding: [
                                20,
                                20
                            ]
                        });
                    }
                }
            }["MapComponent.useEffect"]);
        }
    }["MapComponent.useEffect"], [
        zones,
        selectedZoneId,
        interactive,
        onZoneSelect
    ]);
    // Redraw listing pins when listings change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapComponent.useEffect": ()=>{
            const pinGroup = pinLayerRef.current;
            if (!pinGroup) return;
            pinGroup.clearLayers();
            listings.forEach({
                "MapComponent.useEffect": (l)=>{
                    const lat = l.lat ?? l.latitude;
                    const lng = l.lng ?? l.longitude;
                    if (!lat || !lng) return;
                    const id = l.listing_id ?? l.id;
                    const rent = l.costs?.total_monthly ?? 0;
                    const popup = `
        <div style="min-width:160px">
          <strong style="font-size:13px">${l.title}</strong><br/>
          ${rent > 0 ? `<span style="color:#1a5c45;font-weight:600">${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fmt"])(rent)}/mo</span>` : ''}<br/>
          <a href="/listings/${id}" style="color:#1a5c45;font-size:12px;text-decoration:underline">
            View Details →
          </a>
        </div>
      `;
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].marker([
                        lat,
                        lng
                    ], {
                        icon: listingIcon
                    }).bindPopup(popup).addTo(pinGroup);
                }
            }["MapComponent.useEffect"]);
        }
    }["MapComponent.useEffect"], [
        listings
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        style: {
            width: '100%',
            height: '100%',
            zIndex: 1
        }
    }, void 0, false, {
        fileName: "[project]/components/MapComponent.tsx",
        lineNumber: 128,
        columnNumber: 10
    }, this);
}
_s(MapComponent, "fA/BrGlMLPbyYgLgbufwFqNTxz0=");
_c = MapComponent;
var _c;
__turbopack_context__.k.register(_c, "MapComponent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/MapComponent.tsx [app-client] (ecmascript, next/dynamic entry)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/components/MapComponent.tsx [app-client] (ecmascript)"));
}),
"[project]/lib/data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DIET_LABELS",
    ()=>DIET_LABELS,
    "GUEST_LABELS",
    ()=>GUEST_LABELS,
    "ITEM_CATEGORY_LABELS",
    ()=>ITEM_CATEGORY_LABELS,
    "ITEM_CONDITION_LABELS",
    ()=>ITEM_CONDITION_LABELS,
    "MAP_CENTER",
    ()=>MAP_CENTER,
    "MAP_ZOOM",
    ()=>MAP_ZOOM,
    "NOISE_LABELS",
    ()=>NOISE_LABELS,
    "PROPERTY_TYPE_LABELS",
    ()=>PROPERTY_TYPE_LABELS,
    "SLEEP_SCHEDULE_LABELS",
    ()=>SLEEP_SCHEDULE_LABELS,
    "zones",
    ()=>zones
]);
const zones = [
    {
        zone_id: 1,
        id: 1,
        zone_name: 'UIU Campus Area',
        name: 'UIU Campus Area',
        description: 'Immediate surroundings of UIU main campus',
        center_lat: 23.7979,
        center_lng: 90.4497,
        lat: 23.7979,
        lng: 90.4497,
        radius_km: 1.5,
        polygon: [
            [
                23.8010,
                90.4460
            ],
            [
                23.8010,
                90.4550
            ],
            [
                23.7940,
                90.4550
            ],
            [
                23.7940,
                90.4460
            ]
        ]
    },
    {
        zone_id: 2,
        id: 2,
        zone_name: 'Sayed Nagar',
        name: 'Sayed Nagar',
        description: 'Residential area close to campus',
        center_lat: 23.7950,
        center_lng: 90.4440,
        lat: 23.7950,
        lng: 90.4440,
        radius_km: 2.0,
        polygon: [
            [
                23.7970,
                90.4410
            ],
            [
                23.7970,
                90.4470
            ],
            [
                23.7910,
                90.4470
            ],
            [
                23.7910,
                90.4410
            ]
        ]
    },
    {
        zone_id: 3,
        id: 3,
        zone_name: 'Shatarkul',
        name: 'Shatarkul',
        description: 'Quiet neighbourhood south of campus',
        center_lat: 23.7910,
        center_lng: 90.4350,
        lat: 23.7910,
        lng: 90.4350,
        radius_km: 2.5,
        polygon: [
            [
                23.7920,
                90.4320
            ],
            [
                23.7920,
                90.4400
            ],
            [
                23.7880,
                90.4400
            ],
            [
                23.7880,
                90.4320
            ]
        ]
    },
    {
        zone_id: 4,
        id: 4,
        zone_name: 'Nurer Chala',
        name: 'Nurer Chala',
        description: 'Bustling commercial and residential area',
        center_lat: 23.8050,
        center_lng: 90.4380,
        lat: 23.8050,
        lng: 90.4380,
        radius_km: 2.0,
        polygon: [
            [
                23.8070,
                90.4350
            ],
            [
                23.8070,
                90.4420
            ],
            [
                23.8020,
                90.4420
            ],
            [
                23.8020,
                90.4350
            ]
        ]
    },
    {
        zone_id: 5,
        id: 5,
        zone_name: 'Aftabnagar',
        name: 'Aftabnagar',
        description: 'Planned residential sector',
        center_lat: 23.7660,
        center_lng: 90.4340,
        lat: 23.7660,
        lng: 90.4340,
        radius_km: 3.0,
        polygon: [
            [
                23.7710,
                90.4300
            ],
            [
                23.7710,
                90.4450
            ],
            [
                23.7620,
                90.4450
            ],
            [
                23.7620,
                90.4300
            ]
        ]
    },
    {
        zone_id: 6,
        id: 6,
        zone_name: 'Notun Bazar',
        name: 'Notun Bazar',
        description: 'Major transit and shopping hub',
        center_lat: 23.7970,
        center_lng: 90.4220,
        lat: 23.7970,
        lng: 90.4220,
        radius_km: 2.5,
        polygon: [
            [
                23.7990,
                90.4190
            ],
            [
                23.7990,
                90.4260
            ],
            [
                23.7940,
                90.4260
            ],
            [
                23.7940,
                90.4190
            ]
        ]
    }
];
const MAP_CENTER = [
    23.7805,
    90.4200
];
const MAP_ZOOM = 12;
const PROPERTY_TYPE_LABELS = {
    single_room: 'Single Room',
    shared_room: 'Shared Room',
    full_mess: 'Full Mess',
    sublet: 'Sub-let',
    any: 'Any'
};
const ITEM_CATEGORY_LABELS = {
    furniture: 'Furniture',
    appliances: 'Appliances',
    electronics: 'Electronics',
    kitchen: 'Kitchen',
    study: 'Study',
    other: 'Other'
};
const ITEM_CONDITION_LABELS = {
    new: 'New',
    like_new: 'Like New',
    good: 'Good',
    fair: 'Fair'
};
const SLEEP_SCHEDULE_LABELS = {
    early: 'Early Bird (before 11pm)',
    late: 'Night Owl (after 12am)',
    flexible: 'Flexible'
};
const DIET_LABELS = {
    vegetarian: 'Vegetarian',
    non_veg: 'Non-Vegetarian',
    halal_strict: 'Strictly Halal'
};
const GUEST_LABELS = {
    allowed: 'Allowed',
    restricted: 'Restricted (weekends only)',
    not_allowed: 'Not Allowed'
};
const NOISE_LABELS = {
    quiet: 'Quiet',
    moderate: 'Moderate',
    noisy: 'Lively is fine'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0w9e1yc._.js.map