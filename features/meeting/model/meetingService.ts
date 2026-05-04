// src/features/meeting/model/meetingService.ts

import { getCenter } from '@/shared/utils/getCenter';
import { searchNearby } from '@/shared/services/placeService';

export async function getMeetingData(points: any[], kakao: any) {
  const center = getCenter(points);

  const centerLatLng = new kakao.maps.LatLng(center.lat, center.lng);

  const places = await searchNearby('카페', centerLatLng, kakao);

  return {
    center,
    places: places.slice(0, 3),
  };
}
