export interface Coords {
  lat: number;
  lng: number;
}

/** How close a volunteer must be to the venue before a scan is accepted. */
export const GEOFENCE_RADIUS_M = 100;

/**
 * Venue coordinates are derived from the town named in an event's location
 * string, so no extra field is needed on VolunteerEvent and events created
 * through the dialog are geofenced too.
 *
 * Localities are listed alongside cities because the longest match wins —
 * "Meenambakkam, Chennai" resolves to the airport area, not the city centre.
 */
const GAZETTEER: Record<string, Coords> = {
  // --- Kerala (seeded event venues) ---
  "fort kochi": { lat: 9.9658, lng: 76.2422 },
  kochi: { lat: 9.9312, lng: 76.2673 },
  ernakulam: { lat: 9.9816, lng: 76.2999 },
  aluva: { lat: 10.1081, lng: 76.3517 },
  thiruvananthapuram: { lat: 8.5241, lng: 76.9366 },
  kozhikode: { lat: 11.2588, lng: 75.7804 },
  thrissur: { lat: 10.5276, lng: 76.2144 },
  kollam: { lat: 8.8932, lng: 76.6141 },
  alappuzha: { lat: 9.4981, lng: 76.3388 },
  kottayam: { lat: 9.5916, lng: 76.5222 },
  kannur: { lat: 11.8745, lng: 75.3704 },
  palakkad: { lat: 10.7867, lng: 76.6548 },
  chittoor: { lat: 10.6996, lng: 76.7414 },
  idukki: { lat: 9.8497, lng: 76.9681 },
  wayanad: { lat: 11.6854, lng: 76.132 },
  malappuram: { lat: 11.051, lng: 76.0711 },
  pathanamthitta: { lat: 9.2648, lng: 76.787 },
  kasaragod: { lat: 12.4996, lng: 74.9869 },

  // --- Tamil Nadu ---
  meenambakkam: { lat: 12.9899, lng: 80.1693 },
  pallavaram: { lat: 12.9675, lng: 80.1491 },
  tambaram: { lat: 12.9249, lng: 80.10 },
  guindy: { lat: 13.0067, lng: 80.2206 },
  velachery: { lat: 12.9791, lng: 80.2209 },
  adyar: { lat: 13.0012, lng: 80.2565 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  coimbatore: { lat: 11.0168, lng: 76.9558 },
  madurai: { lat: 9.9252, lng: 78.1198 },
  tiruchirappalli: { lat: 10.7905, lng: 78.7047 },
  salem: { lat: 11.6643, lng: 78.146 },
  vellore: { lat: 12.9165, lng: 79.1325 },

  // --- Other metros ---
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  hyderabad: { lat: 17.385, lng: 78.4867 },
  mumbai: { lat: 19.076, lng: 72.8777 },
  pune: { lat: 18.5204, lng: 73.8567 },
  delhi: { lat: 28.6139, lng: 77.209 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
  mangaluru: { lat: 12.9141, lng: 74.856 },
};

/**
 * Local development escape hatch. Demo venues are hundreds of kilometres from
 * wherever you happen to be testing, so on localhost the distance check is
 * reported but not enforced. This is deliberately narrow: it is false in any
 * production build and on any non-localhost host.
 */
export function isGeofenceOverride() {
  if (process.env.NODE_ENV !== "development") return false;
  if (typeof window === "undefined") return false;
  return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
}

/** Longest matching town name wins, so "Fort Kochi" beats "Kochi". */
export function venueCoords(location: string): Coords | null {
  const haystack = location.toLowerCase();
  let match: { key: string; coords: Coords } | null = null;

  for (const [key, coords] of Object.entries(GAZETTEER)) {
    if (haystack.includes(key) && (!match || key.length > match.key.length)) {
      match = { key, coords };
    }
  }

  return match?.coords ?? null;
}

/** Great-circle distance in metres. */
export function distanceMeters(a: Coords, b: Coords): number {
  const R = 6_371_000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

export function formatDistance(metres: number) {
  return metres < 1000 ? `${metres}m` : `${(metres / 1000).toFixed(1)}km`;
}
