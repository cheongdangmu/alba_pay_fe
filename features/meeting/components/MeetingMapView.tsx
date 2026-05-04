// src/features/meeting/components/MeetingMapView.tsx

'use client';

import { useMeetingMap } from '../hooks/useMeetingMap';

export default function MeetingMapView() {
  const { mapRef, renderMeeting } = useMeetingMap();

  const points = [
    { lat: 37.5665, lng: 126.978 },
    { lat: 37.57, lng: 126.99 },
    { lat: 37.55, lng: 126.99 },
  ];

  return (
    <div>
      <button onClick={() => renderMeeting(points)}>
        중간지점 + 추천 보기
      </button>

      <div ref={mapRef} style={{ width: '100%', height: '500px' }} />
    </div>
  );
}
