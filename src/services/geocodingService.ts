export interface GeocodeResult {
  lat: number;
  lng: number;
  address: string;
  area: string;
  city: string;
}

/**
 * Reverse Geocodes Latitude and Longitude using OpenStreetMap Nominatim API
 */
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodeResult> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'CivicLensAI/1.0 (civiclens@example.com)'
      }
    });

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};

      const road = addr.road || addr.pedestrian || addr.suburb || addr.neighbourhood || '';
      const suburb = addr.suburb || addr.neighbourhood || addr.residential || addr.city_district || 'Central District';
      const city = addr.city || addr.town || addr.village || addr.county || 'Metropolis';

      const fullAddress = data.display_name || `${road}, ${suburb}, ${city}`;

      return {
        lat,
        lng,
        address: fullAddress,
        area: suburb,
        city,
      };
    }
  } catch (err) {
    console.warn('Nominatim reverse geocoding fallback:', err);
  }

  // Graceful Fallback if offline or API limits
  return {
    lat,
    lng,
    address: `GPS Marker (${lat.toFixed(4)}, ${lng.toFixed(4)}), Central District`,
    area: 'Central District',
    city: 'Metropolis',
  };
}

/**
 * Searches for a location by text query using OpenStreetMap Nominatim API
 */
export async function searchLocationQuery(query: string): Promise<GeocodeResult[]> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'CivicLensAI/1.0 (civiclens@example.com)'
      }
    });

    if (res.ok) {
      const list = await res.json();
      return list.map((item: any) => {
        const addr = item.address || {};
        const suburb = addr.suburb || addr.neighbourhood || addr.residential || addr.city_district || 'District';
        const city = addr.city || addr.town || addr.village || addr.county || 'City';

        return {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          address: item.display_name,
          area: suburb,
          city,
        };
      });
    }
  } catch (err) {
    console.warn('Nominatim search location fallback:', err);
  }

  return [];
}
