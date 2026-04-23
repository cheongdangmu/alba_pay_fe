"use client";

import Script from "next/script";
import { useState, useRef } from "react";

// 카카오 지도 타입 정의
interface KakaoMap {
  setCenter: (latlng: KakaoLatLng) => void;
}

interface KakaoLatLng {
  getLat: () => number;
  getLng: () => number;
}

interface KakaoMarker {
  setMap: (map: KakaoMap | null) => void;
}

interface KakaoInfoWindow {
  open: (map: KakaoMap, marker: KakaoMarker) => void;
}

interface KakaoGeocoderResult {
  y: string;
  x: string;
  address_name: string;
  place_name : string;
}

interface KakaoGeocoderStatus {
  OK: string;
}

interface KakaoPlaces {
  keywordSearch: (
    keyword: string,
    callback: (result: KakaoGeocoderResult[], status: string, pagination: unknown) => void,
    options?: { category_group_code?: string }
  ) => void;
}

interface KakaoServices {
  Geocoder: new () => KakaoGeocoder;
  Places: new () => KakaoPlaces;
  Status: KakaoGeocoderStatus;
}

interface KakaoGeocoder {
  addressSearch: (
    address: string,
    callback: (result: KakaoGeocoderResult[], status: string) => void
  ) => void;
}

interface KakaoMaps {
  load: (callback: () => void) => void;
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMap;
  Marker: new (options: { map?: KakaoMap; position: KakaoLatLng }) => KakaoMarker;
  InfoWindow: new (options: { content: string }) => KakaoInfoWindow;
  services: KakaoServices;
}

interface KakaoNamespace {
  maps: KakaoMaps;
}

declare global {
  interface Window {
    kakao: KakaoNamespace;
  }
}

export default function Home() {
  const [address, setAddress] = useState("");
  const mapRef = useRef<KakaoMap | null>(null);
  const markersRef = useRef<KakaoMarker[]>([]);

  const searchAddress = () => {
    if (!address.trim()) return;

    const geocoder = new window.kakao.maps.services.Geocoder();

    // 먼저 주소 검색 시도
    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(parseFloat(result[0].y), parseFloat(result[0].x));

        // 기존 마커 제거
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // 지도 중심 이동
        if (mapRef.current) {
          mapRef.current.setCenter(coords);
        }

        // 새 마커 생성
        if (mapRef.current) {
          const marker = new window.kakao.maps.Marker({
            map: mapRef.current,
            position: coords
          });

          markersRef.current.push(marker);

          // 인포윈도우 생성
          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="width:150px;text-align:center;padding:6px 0;">${address}</div>`
          });
          infowindow.open(mapRef.current, marker);
        }
      } else {
        // 주소 검색 실패 시 키워드 검색 시도 (역, 장소 등)
        searchKeyword();
      }
    });
  };

  const searchKeyword = () => {
    const places = new window.kakao.maps.services.Places();

    places.keywordSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(parseFloat(result[0].y), parseFloat(result[0].x));

        // 기존 마커 제거
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // 지도 중심 이동
        if (mapRef.current) {
          mapRef.current.setCenter(coords);
        }

        // 새 마커 생성
        if (mapRef.current) {
          const marker = new window.kakao.maps.Marker({
            map: mapRef.current,
            position: coords
          });

          markersRef.current.push(marker);
          // 인포윈도우 생성
          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="width:200px;text-align:center;padding:6px 0;"><strong>${result[0].place_name}</strong><br/>${result[0].address_name}</div>`
          });
          infowindow.open(mapRef.current, marker);
        }
      } else {
        alert("주소나 장소를 찾을 수 없습니다.");
      }
    });
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=c92e2db2ad570ba196da9767ff6af5a7&autoload=false&libraries=services`}
        strategy="afterInteractive"
        onLoad={() => {
          window.kakao.maps.load(() => {
            const container = document.getElementById('map');
            if (container) {
              const options = {
                center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                level: 3
              };
              const map = new window.kakao.maps.Map(container, options);
              mapRef.current = map;
            }
          });
        }}
      />
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="w-full max-w-md mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="주소를 입력하세요"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && searchAddress()}
            />
            <button
              onClick={searchAddress}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              검색
            </button>
          </div>
        </div>
        <div id="map" style={{ width: '100%', height: '400px' }}></div>
      </main>
    </div>
  );
}
