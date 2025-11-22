import { useState, useEffect } from 'react';

interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationState {
  coordinates: Coordinates | null;
  isLoading: boolean;
  error: string | null;
  source: 'gps' | 'ip' | null;
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

    const setLocation = (coords: Coordinates, source: 'gps' | 'ip') => {
      if (mounted) {
        setState({
          coordinates: coords,
          isLoading: false,
          error: null,
          source,
        });
      }
    };

    const handleError = (errorMsg: string) => {
      if (mounted) {
        setState(prev => ({ ...prev, isLoading: false, error: errorMsg }));
      }
    };

    // 1. Try GPS first
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(
            {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            'gps'
          );
        },
        async (gpsError) => {
          console.warn('GPS lookup failed, falling back to IP location:', gpsError.message);
          // 2. Fallback to IP
          try {
            const response = await fetch('https://ipapi.co/json/');
            if (!response.ok) throw new Error('IP location service failed');
            
            const data = await response.json();
            if (data.latitude && data.longitude) {
              setLocation(
                {
                  lat: data.latitude,
                  lng: data.longitude,
                },
                'ip'
              );
            } else {
              handleError('Could not determine location from IP');
            }
          } catch (ipError) {
            console.error('IP location lookup failed:', ipError);
            handleError('Could not determine location via GPS or IP');
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      // GPS not available, try IP immediately
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          if (data.latitude && data.longitude) {
            setLocation(
              {
                lat: data.latitude,
                lng: data.longitude,
              },
              'ip'
            );
          } else {
            handleError('Could not determine location from IP');
          }
        })
        .catch(err => {
          console.error('IP location lookup failed:', err);
          handleError('Geolocation not supported and IP lookup failed');
        });
    }

    return () => {
      mounted = false;
    };
  }, []);

  return state;
}

