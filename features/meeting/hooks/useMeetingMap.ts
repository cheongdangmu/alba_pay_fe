// src/features/meeting/hooks/useMeetingMap.ts

'use client';

import { useMapInit } from '@/shared/hooks/useMapInit';
import { getMeetingData } from '../model/meetingService';

export function useMeetingMap() {
  const { mapRef, map } = useMapInit(5);

  const renderMeeting = async (points: any[]) => {
    if (!map) return;

    const { kakao } = window;
    const { center, places } = await getMeetingData(points, kakao);
    const centerPos = new kakao.maps.LatLng(center.lat, center.lng);

    map.setCenter(centerPos);

    points.forEach((p) => {
      new kakao.maps.Marker({
        position: new kakao.maps.LatLng(p.lat, p.lng),
        map,
      });
    });

    new kakao.maps.Marker({ position: centerPos, map });

    places.forEach((place: any) => {
      new kakao.maps.Marker({
        position: new kakao.maps.LatLng(place.y, place.x),
        map,
      });
    });
  };

  return { mapRef, renderMeeting };
}
