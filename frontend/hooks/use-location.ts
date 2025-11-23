import { useState, useEffect } from 'react';

interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationState {
  coordinates: Coordinates | null;
  isLoading: boolean;
  error: string | null;
  source: 'gps' | 'ip' | 'default' | null;
}

// Default location (San Francisco) as fallback
const DEFAULT_LOCATION: Coordinates = {
  lat: 37.7749,
  lng: -122.4194,
};

// Multiple IP geolocation services as fallbacks
const IP_SERVICES = [
  'https://ipapi.co/json/',
  'https://ip-api.com/json/',
  'https://api.ipgeolocation.io/ipgeo?apiKey=free',
];

async function tryIpLocationService(url: string): Promise<Coordinates | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // Handle different response formats
    let lat: number | undefined;
    let lng: number | undefined;

    if (url.includes('ipapi.co')) {
      lat = data.latitude;
      lng = data.longitude;
    } else if (url.includes('ip-api.com')) {
      lat = data.lat;
      lng = data.lon;
    } else if (url.includes('ipgeolocation.io')) {
      lat = data.latitude;
      lng = data.longitude;
    }

    if (lat != null && lng != null && !isNaN(lat) && !isNaN(lng)) {
      return { lat, lng };
    }

    return null;
  } catch (error) {
    // Silently fail and try next service
    console.debug(`IP location service ${url} failed:`, error);
    return null;
  }
}

async function getLocationFromIp(): Promise<Coordinates | null> {
  // Try each IP service in order
  for (const serviceUrl of IP_SERVICES) {
    const coords = await tryIpLocationService(serviceUrl);
    if (coords) {
      return coords;
    }
  }
  return null;
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    coordinates: null,
    isLoading: true,
    error: null,
    source: null,
  });

  useEffect(() => {
    let mounted = true;

    const setLocation = (coords: Coordinates, source: 'gps' | 'ip' | 'default') => {
      if (mounted) {
        setState({
          coordinates: coords,
          isLoading: false,
          error: null,
          source,
        });
      }
    };

    const handleError = (errorMsg: string, useDefault = true) => {
      if (mounted) {
        if (useDefault) {
          // Use default location as last resort
          setState({
            coordinates: DEFAULT_LOCATION,
            isLoading: false,
            error: errorMsg,
            source: 'default',
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false, error: errorMsg }));
        }
      }
    };

    // 1. Try GPS first
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (mounted) {
            setLocation(
              {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
              'gps'
            );
          }
        },
        async (gpsError) => {
          console.warn('GPS lookup failed, falling back to IP location:', gpsError.message);
          // 2. Fallback to IP services
          try {
            const ipCoords = await getLocationFromIp();
            if (ipCoords) {
              setLocation(ipCoords, 'ip');
            } else {
              handleError('Could not determine location via GPS or IP. Using default location.', true);
            }
          } catch (ipError) {
            console.error('All IP location services failed:', ipError);
            handleError('Could not determine location via GPS or IP. Using default location.', true);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // Increased timeout
          maximumAge: 60000, // Accept cached location up to 1 minute old
        }
      );
    } else {
      // GPS not available, try IP immediately
      getLocationFromIp()
        .then(ipCoords => {
          if (mounted) {
            if (ipCoords) {
              setLocation(ipCoords, 'ip');
            } else {
              handleError('Geolocation not supported and IP lookup failed. Using default location.', true);
            }
          }
        })
        .catch(err => {
          console.error('All location methods failed:', err);
          if (mounted) {
            handleError('Geolocation not supported and IP lookup failed. Using default location.', true);
          }
        });
    }

    return () => {
      mounted = false;
    };
  }, []);

  return state;
}

