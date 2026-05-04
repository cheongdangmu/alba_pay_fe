'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { KAKAO_MAP_SDK_URL } from '@/types/kakao';

export default function KakaoMap({
  center = { lat: 37.5665, lng: 126.978 },
  level = 3,
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const initMap = () => {
    const container = mapRef.current;
    if (!container || !window.kakao || !window.kakao.maps) return;

    window.kakao.maps.load(() => {
      // 이미 지도가 생성되어 있는지 확인 (중복 생성 방지)
      if (container.hasChildNodes()) return;

      const options = {
        center: new window.kakao.maps.LatLng(center.lat, center.lng),
        level: level,
      };

      new window.kakao.maps.Map(container, options);
    });
  };

  useEffect(() => {
    if (isLoaded) {
      initMap();
    }
  }, [isLoaded]);

  return (
    <>
      <Script
        src={KAKAO_MAP_SDK_URL}
        strategy="afterInteractive"
        onLoad={() => setIsLoaded(true)}
      />
      <div
        ref={mapRef}
        // 스타일이 Tailwind 클래스에만 의존하면 가끔 인식을 못할 때가 있습니다.
        // 테스트를 위해 인라인 스타일을 강제로 넣어보세요.
        style={{ width: '100%', height: '100%', minHeight: '300px' }}
        className="rounded-md border bg-muted"
      />
    </>
  );
}
