// src/shared/hooks/useMapInit.ts

'use client';

import { useEffect, useRef, useState } from 'react';
import { loadKakaoSdk } from '@/lib/kakaoLoader';

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };

export function useMapInit(level = 3) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      await loadKakaoSdk();
      if (!mapRef.current || !isMounted) return;

      const { kakao } = window;
      const mapInstance = new kakao.maps.Map(mapRef.current, {
        center: new kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
        level,
      });

      setMap(mapInstance);
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [level]);

  return { mapRef, map };
}
