// src/features/map/hooks/useKakaoMap.ts

'use client';

import { useEffect, useState } from 'react';
import { useMapInit } from '@/shared/hooks/useMapInit';

export function useKakaoMap() {
  const { mapRef, map } = useMapInit(3);
  const [myLocation, setMyLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!map) return;

    const { kakao } = window;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setMyLocation({ lat, lng });

        const move = new kakao.maps.LatLng(lat, lng);
        map.setCenter(move);

        const marker = new kakao.maps.Marker({ position: move });
        marker.setMap(map);
      },
      () => {
        console.warn('위치 권한 거부됨');
      },
    );
  }, [map]);

  return { mapRef, map, myLocation };
}
