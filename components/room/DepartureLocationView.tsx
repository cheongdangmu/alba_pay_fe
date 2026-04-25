'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronRight, MapPin } from 'lucide-react';
import { loadKakaoSdk } from '@/lib/kakao';
import type { RoomData } from '@/types/room';

interface Props {
  roomData: RoomData | null;
  onSubmit: (departureLocation: string) => void;
}

export default function DepartureLocationView({ roomData, onSubmit }: Props) {
  const [departureLocation, setDepartureLocation] = useState(
    roomData?.departureLocation ?? '',
  );
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const markerRef = useRef<KakaoMarker | null>(null);

  const relayoutMap = () => {
    (
      mapRef.current as (KakaoMap & { relayout?: () => void }) | null
    )?.relayout?.();
  };

  const renderMarker = useCallback(() => {
    if (!mapRef.current) return;

    const center = new window.kakao.maps.LatLng(37.566, 126.978);
    mapRef.current.setCenter(center);

    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    markerRef.current = new window.kakao.maps.Marker({
      map: mapRef.current,
      position: center,
    });

    const infoWindow = new window.kakao.maps.InfoWindow({
      content:
        '<div style="width:160px;text-align:center;padding:6px 0;">출발지 입력 예시 위치</div>',
    });

    infoWindow.open(mapRef.current, markerRef.current);
  }, []);

  const initMap = useCallback(() => {
    if (!window.kakao?.maps || !mapContainerRef.current) return;
    if (mapRef.current) {
      relayoutMap();
      renderMarker();
      setMapReady(true);
      return;
    }

    window.kakao.maps.load(() => {
      if (!mapContainerRef.current) return;

      const center = new window.kakao.maps.LatLng(37.566, 126.978);
      const map = new window.kakao.maps.Map(mapContainerRef.current, {
        center,
        level: 5,
      });

      mapRef.current = map;
      setMapReady(true);
      requestAnimationFrame(() => {
        relayoutMap();
        renderMarker();
      });
      window.setTimeout(() => {
        relayoutMap();
        renderMarker();
      }, 150);
    });
  }, [renderMarker]);

  useEffect(() => {
    let cancelled = false;

    loadKakaoSdk()
      .then(() => {
        if (!cancelled) {
          initMap();
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setMapError(
            error instanceof Error
              ? error.message
              : '지도를 불러오지 못했습니다.',
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [initMap]);

  const handleSubmit = () => {
    onSubmit(departureLocation.trim());
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-3">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-md mb-2">
          LOCATION
        </span>
        <h2 className="text-lg font-bold text-slate-900">출발지 입력</h2>
        <p className="text-sm text-slate-500 mt-1">
          결과를 계산하기 전에 출발 위치를 입력해주세요.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          출발지
        </label>
        <div className="relative mb-3">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={departureLocation}
            onChange={(e) => setDepartureLocation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="예: 강남역, 성수역, 서울시청"
            className="w-full pl-10 pr-3 py-3 text-sm rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div
          ref={mapContainerRef}
          className="h-56 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center text-sm text-slate-500"
        >
          {!mapReady && (mapError ?? '지도를 불러오는 중입니다...')}
        </div>

        <p className="text-xs text-slate-400 mt-2">
          비워두면 기본 위치 기준으로 결과를 보여줍니다.
        </p>
      </div>

      <div className="flex items-center justify-between sticky bottom-3 bg-white/90 backdrop-blur-md px-3 py-2.5 rounded-2xl border border-slate-200 shadow-xl">
        <div className="text-xs text-slate-600">결과 보기 전 마지막 단계</div>
        <button
          onClick={handleSubmit}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-1.5"
        >
          결과 보기 <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
