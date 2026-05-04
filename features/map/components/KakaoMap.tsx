// src/features/map/components/KakaoMap.tsx

'use client';

import { useState } from 'react';
import { useKakaoMap } from '../hooks/useKakaoMap';
import { searchNearby } from '@/shared/services/placeService';

export default function KakaoMap() {
  const { mapRef, map, myLocation } = useKakaoMap();
  const [keyword, setKeyword] = useState('');
  const [marker, setMarker] = useState<any>(null);

  const handleSearch = async () => {
    if (!map || !myLocation || !keyword) return;

    const { kakao } = window;
    const location = new kakao.maps.LatLng(myLocation.lat, myLocation.lng);

    try {
      const data = await searchNearby(keyword, location, kakao);
      const nearest = data[0];
      const position = new kakao.maps.LatLng(nearest.y, nearest.x);

      if (marker) marker.setMap(null);

      const newMarker = new kakao.maps.Marker({ position });
      newMarker.setMap(map);
      setMarker(newMarker);
      map.setCenter(position);
    } catch {
      console.warn('장소 검색 실패');
    }
  };

  return (
    <div>
      {/* 검색 UI */}
      <div style={{ marginBottom: 10 }}>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="예: 하나은행"
        />
        <button onClick={handleSearch}>검색</button>
      </div>

      {/* 로딩 UX */}
      {!map && <div>지도 불러오는 중...</div>}

      {/* 지도 */}
      <div ref={mapRef} style={{ width: '100%', height: '500px' }} />
    </div>
  );
}
