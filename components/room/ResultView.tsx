"use client";
// apps/web/src/components/room/ResultView.tsx

import React, { useState, useRef } from 'react';
import Script from 'next/script';
import { Clock, MapPin, Users, CheckCircle2, Coffee, Utensils, Star } from 'lucide-react';
import { RoomData, MOCK_RESULTS } from '@/types/room';

interface Props {
  roomData: RoomData | null;
}

export default function ResultView({ roomData }: Props) {
  const [address,      setAddress]      = useState('');
  const [meetingPoint, setMeetingPoint] = useState(MOCK_RESULTS.meetingPoint);
  const mapRef     = useRef<KakaoMap | null>(null);
  const markersRef = useRef<KakaoMarker[]>([]);

  // ─── 지도 유틸 ───────────────────────────────
  const clearMarkers = () => {
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
  };

  const placeMarker = (map: KakaoMap, coords: KakaoLatLng, content: string) => {
    const marker     = new window.kakao.maps.Marker({ map, position: coords });
    const infowindow = new window.kakao.maps.InfoWindow({ content });
    infowindow.open(map, marker);
    markersRef.current.push(marker);
  };

  // ─── 주소 / 키워드 검색 ───────────────────────
  const searchAddress = () => {
    if (!address.trim()) return;
    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(parseFloat(result[0].y), parseFloat(result[0].x));
        clearMarkers();
        mapRef.current?.setCenter(coords);
        if (mapRef.current) {
          placeMarker(mapRef.current, coords, `<div style="width:150px;text-align:center;padding:6px 0;">${address}</div>`);
        }
        setMeetingPoint({ label: address, lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) });
      } else {
        searchKeyword();
      }
    });
  };

  const searchKeyword = () => {
    const places = new window.kakao.maps.services.Places();
    places.keywordSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(parseFloat(result[0].y), parseFloat(result[0].x));
        clearMarkers();
        mapRef.current?.setCenter(coords);
        if (mapRef.current) {
          placeMarker(
            mapRef.current,
            coords,
            `<div style="width:200px;text-align:center;padding:6px 0;"><strong>${result[0].place_name}</strong><br/>${result[0].address_name}</div>`
          );
        }
        setMeetingPoint({ label: result[0].place_name, lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) });
      } else {
        alert('주소나 장소를 찾을 수 없습니다.');
      }
    });
  };

  // ─── 카카오 지도 초기화 ───────────────────────
  const initMap = () => {
    window.kakao.maps.load(() => {
      const container    = document.getElementById('map');
      if (!container) return;
      const defaultCenter = new window.kakao.maps.LatLng(37.566, 126.978);
      const map           = new window.kakao.maps.Map(container, { center: defaultCenter, level: 5 });
      mapRef.current      = map;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            const pos = new window.kakao.maps.LatLng(coords.latitude, coords.longitude);
            map.setCenter(pos);
            placeMarker(map, pos, `<div style="width:100px;text-align:center;padding:6px 0;">📍 내 위치</div>`);
          },
          () => {} // 거부 시 서울 시청 기본값 유지
        );
      }
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-3">
      <Script
        src="//dapi.kakao.com/v2/maps/sdk.js?appkey=c92e2db2ad570ba196da9767ff6af5a7&autoload=false&libraries=services"
        strategy="afterInteractive"
        onLoad={initMap}
      />

      {/* 상태 헤더 */}
      <div className="bg-indigo-600 text-white p-4 rounded-2xl shadow-md flex items-center justify-between">
        <div>
          <span className="inline-block px-2 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded-md mb-1">READY</span>
          <h2 className="text-lg font-bold leading-tight">{roomData?.title || '5월 동아리 회의'}</h2>
          <p className="text-indigo-100 flex items-center gap-1.5 mt-1 text-xs">
            <Users className="w-3.5 h-3.5" /> 참여자 14/14명 완료
          </p>
        </div>
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* 최적 시간 Top 3 */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-base mb-3 flex items-center gap-1.5">
          <Clock className="w-5 h-5 text-indigo-500" /> 모두가 만날 수 있는 시간
        </h3>
        <div className="space-y-2">
          {MOCK_RESULTS.topCandidates.map((c) => (
            <div
              key={c.rank}
              className={`p-3 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-50
                ${c.rank === 1 ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-100'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0
                  ${c.rank === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {c.rank}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">{c.date} {c.time}</div>
                  <div className="text-xs text-slate-500">
                    참석: <span className="font-semibold text-indigo-600">{c.attendeeCount}</span>/{c.total}명
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[10px] text-slate-400">매칭</div>
                <div className="font-mono font-bold text-sm text-indigo-600">{(c.score * 100).toFixed(0)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 중간지점 & 장소 추천 */}
      {roomData?.collectLocation !== false && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-base flex items-center gap-1.5">
              <MapPin className="w-5 h-5 text-indigo-500" /> 중간지점 추천 장소
            </h3>
            <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full truncate max-w-[100px]">
              {meetingPoint.label}
            </span>
          </div>

          {/* 주소 검색 */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchAddress()}
              placeholder="주소를 입력하세요"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={searchAddress}
              className="px-3 py-2 bg-blue-500 text-white text-sm rounded-xl hover:bg-blue-600"
            >
              검색
            </button>
          </div>

          {/* 카카오맵 */}
          <div id="map" className="h-40 bg-slate-100 rounded-xl mb-3 border border-slate-200 overflow-hidden" />

          {/* 장소 목록 */}
          <div className="grid grid-cols-1 gap-2">
            {MOCK_RESULTS.places.map((place) => (
              <div
                key={place.id}
                className="p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {place.category === 'cafe'
                    ? <Coffee   className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    : <Utensils className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  }
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-slate-900 truncate">{place.name}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{place.rating}</span>
                        <span className="text-slate-400">({place.reviews})</span>
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

      {/* 약속 확정 (방장) */}
      <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h4 className="font-bold text-sm text-indigo-900 mb-0.5">방장님이신가요?</h4>
          <p className="text-xs text-indigo-700">모두의 의견을 바탕으로 약속을 확정해 주세요.</p>
        </div>
        <button className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors">
          약속 확정하기
        </button>
      </div>
    </div>
  );
}
