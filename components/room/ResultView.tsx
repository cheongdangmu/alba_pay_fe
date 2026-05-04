'use client';
// apps/web/src/components/room/ResultView.tsx

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import {
  CheckCircle2,
  Clock,
  Coffee,
  MapPin,
  Star,
  Utensils,
  Users,
} from 'lucide-react';
import { type RoomData, MOCK_RESULTS } from '@/types/room';

interface Props {
  roomData: RoomData | null;
}

const PLACE_OFFSETS = [
  { lat: 0.0012, lng: 0.0015 },
  { lat: -0.001, lng: 0.0012 },
  { lat: 0.0008, lng: -0.0014 },
];

export default function ResultView({ roomData }: Props) {
  const [meetingPoint] = useState(MOCK_RESULTS.meetingPoint);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const markersRef = useRef<KakaoMarker[]>([]);

  const relayoutMap = () => {
    (
      mapRef.current as (KakaoMap & { relayout?: () => void }) | null
    )?.relayout?.();
  };

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
  }, []);

  const placeMarker = useCallback(
    (map: KakaoMap, lat: number, lng: number, content: string) => {
      const position = new window.kakao.maps.LatLng(lat, lng);
      const marker = new window.kakao.maps.Marker({ map, position });
      const infoWindow = new window.kakao.maps.InfoWindow({ content });

      infoWindow.open(map, marker);
      markersRef.current.push(marker);
    },
    [],
  );

  const renderMarkers = useCallback(() => {
    if (!mapRef.current) return;

    clearMarkers();
    mapRef.current.setCenter(
      new window.kakao.maps.LatLng(meetingPoint.lat, meetingPoint.lng),
    );

    placeMarker(
      mapRef.current,
      meetingPoint.lat,
      meetingPoint.lng,
      `<div style="width:160px;text-align:center;padding:6px 0;"><strong>${meetingPoint.label}</strong><br/>중간 지점</div>`,
    );

    MOCK_RESULTS.places.forEach((place, index) => {
      const offset = PLACE_OFFSETS[index % PLACE_OFFSETS.length];
      placeMarker(
        mapRef.current as KakaoMap,
        meetingPoint.lat + offset.lat,
        meetingPoint.lng + offset.lng,
        `<div style="width:180px;text-align:center;padding:6px 0;"><strong>${place.name}</strong><br/>${place.distance}</div>`,
      );
    });
  }, [clearMarkers, meetingPoint, placeMarker]);

  const initMap = useCallback(() => {
    if (!window.kakao?.maps) return;

    const container = document.getElementById('map');
    if (!container) return;

    if (mapRef.current) {
      relayoutMap();
      renderMarkers();
      setMapReady(true);
      return;
    }

    window.kakao.maps.load(() => {
      const nextContainer = document.getElementById('map');
      if (!nextContainer) return;

      const center = new window.kakao.maps.LatLng(
        meetingPoint.lat,
        meetingPoint.lng,
      );
      const map = new window.kakao.maps.Map(nextContainer, {
        center,
        level: 5,
      });

      mapRef.current = map;
      setMapReady(true);

      requestAnimationFrame(() => {
        relayoutMap();
        renderMarkers();
      });

      window.setTimeout(() => {
        relayoutMap();
        renderMarkers();
      }, 150);
    });
  }, [meetingPoint, renderMarkers]);

  useEffect(() => {
    if (window.kakao?.maps) {
      initMap();
    }
  }, [initMap]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-3">
      <Script
        src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=c92e2db2ad570ba196da9767ff6af5a7&autoload=false&libraries=services"
        strategy="afterInteractive"
        onLoad={initMap}
        onError={() => setMapError('지도를 불러오지 못했습니다.')}
      />

      <div className="bg-indigo-600 text-white p-4 rounded-2xl shadow-md flex items-center justify-between">
        <div>
          <span className="inline-block px-2 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded-md mb-1">
            READY
          </span>
          <h2 className="text-lg font-bold leading-tight">
            {roomData?.title || '모임 결과'}
          </h2>
          <p className="text-indigo-100 flex items-center gap-1.5 mt-1 text-xs">
            <Users className="w-3.5 h-3.5" /> 참여자 14/14명 완료
          </p>
          {roomData?.departureLocation && (
            <p className="text-indigo-100 mt-1 text-xs">
              출발지: {roomData.departureLocation}
            </p>
          )}
        </div>
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-base mb-3 flex items-center gap-1.5">
          <Clock className="w-5 h-5 text-indigo-500" /> 모두가 만날 수 있는 시간
        </h3>
        <div className="space-y-2">
          {MOCK_RESULTS.topCandidates.map((candidate) => (
            <div
              key={candidate.rank}
              className={`p-3 rounded-xl border-2 flex items-center justify-between transition-all hover:bg-slate-50 ${
                candidate.rank === 1
                  ? 'border-indigo-500 bg-indigo-50/30'
                  : 'border-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    candidate.rank === 1
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {candidate.rank}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">
                    {candidate.date} {candidate.time}
                  </div>
                  <div className="text-xs text-slate-500">
                    참석:{' '}
                    <span className="font-semibold text-indigo-600">
                      {candidate.attendeeCount}
                    </span>
                    /{candidate.total}명
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[10px] text-slate-400">매칭</div>
                <div className="font-mono font-bold text-sm text-indigo-600">
                  {(candidate.score * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {roomData?.collectLocation !== false && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-base flex items-center gap-1.5">
              <MapPin className="w-5 h-5 text-indigo-500" /> 중간 지점과 추천
              장소
            </h3>
            <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full truncate max-w-[140px]">
              {meetingPoint.label}
            </span>
          </div>

          <div
            id="map"
            className="h-64 bg-slate-100 rounded-xl mb-3 border border-slate-200 overflow-hidden flex items-center justify-center text-sm text-slate-500"
          >
            {!mapReady && (mapError ?? '지도를 불러오는 중입니다...')}
          </div>

          <div className="grid grid-cols-1 gap-2">
            {MOCK_RESULTS.places.map((place) => (
              <div
                key={place.id}
                className="p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {place.category === 'cafe' ? (
                    <Coffee className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  ) : (
                    <Utensils className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-slate-900 truncate">
                      {place.name}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{place.rating}</span>
                        <span className="text-slate-400">
                          ({place.reviews})
                        </span>
                      </div>
                      <span className="text-slate-300">·</span>
                      <span>매칭 {(place.score * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md flex-shrink-0 ml-2">
                  {place.distance}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h4 className="font-bold text-sm text-indigo-900 mb-0.5">
            방장이 최종 확정
          </h4>
          <p className="text-xs text-indigo-700">
            모두의 응답을 바탕으로 모임 일정을 확정해주세요.
          </p>
        </div>
        <button className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors">
          모임 확정하기
        </button>
      </div>
    </div>
  );
}
