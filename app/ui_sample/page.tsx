"use client";
import Script from "next/script";
import React, { useState, useCallback, useRef } from 'react';
import { 
  Calendar, Clock, MapPin, Users, ChevronRight, 
  CheckCircle2, Share2, Map as MapIcon, Coffee, Utensils, Star, Info
} from 'lucide-react';

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
  place_name: string;
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

interface RoomData {
  title: string;
  collectLocation: boolean;
}

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 9);

const MOCK_RESULTS = {
  topCandidates: [
    { rank: 1, date: '5월 6일 (수)', time: '19:00 - 21:00', attendeeCount: 14, total: 14, score: 0.92 },
    { rank: 2, date: '5월 7일 (목)', time: '18:30 - 20:30', attendeeCount: 13, total: 14, score: 0.85 },
    { rank: 3, date: '5월 4일 (월)', time: '20:00 - 22:00', attendeeCount: 12, total: 14, score: 0.78 },
  ],
  meetingPoint: { label: '시청역 부근', lat: 37.566, lng: 126.978 },
  places: [
    { id: 1, name: '스타벅스 시청점', category: 'cafe', distance: '120m', score: 0.88, rating: 4.5, reviews: 1024 },
    { id: 2, name: '시청역 뼈해장국', category: 'restaurant', distance: '80m', score: 0.85, rating: 4.2, reviews: 512 },
  ]
};

// ─────────────────────────────────────────────
// 앱 내부 컴포넌트 (PC 목업 & 모바일 공통 사용)
// ─────────────────────────────────────────────
function AppShell() {
  const [currentView, setCurrentView] = useState('CREATE');
  const [roomData, setRoomData] = useState<RoomData | null>(null);

  const handleCreateRoom = (data: RoomData) => {
    setRoomData(data);
    setCurrentView('PARTICIPATE');
  };
  const handleSubmitBlocks = () => setCurrentView('RESULT');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-3 h-12 flex items-center justify-between">
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setCurrentView('CREATE')}>
            <div className="w-6 h-6 bg-indigo-600 text-white rounded-md flex items-center justify-center font-bold text-sm">N</div>
            <span className="font-bold text-base tracking-tight text-slate-800">널널</span>
          </div>
          <div className="flex items-center gap-0.5 text-[11px] text-slate-500">
            <span className={`px-1.5 ${currentView === 'CREATE' ? 'text-indigo-600 font-semibold' : ''}`}>방 만들기</span>
            <ChevronRight className="w-3 h-3 opacity-40" />
            <span className={`px-1.5 ${currentView === 'PARTICIPATE' ? 'text-indigo-600 font-semibold' : ''}`}>시간 입력</span>
            <ChevronRight className="w-3 h-3 opacity-40" />
            <span className={`px-1.5 ${currentView === 'RESULT' ? 'text-indigo-600 font-semibold' : ''}`}>결과</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto p-3 py-4">
        {currentView === 'CREATE' && <CreateRoomView onSubmit={handleCreateRoom} />}
        {currentView === 'PARTICIPATE' && <ParticipateView roomData={roomData} onSubmit={handleSubmitBlocks} />}
        {currentView === 'RESULT' && <ResultView roomData={roomData} />}
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────
// PC 랜딩 페이지
// ─────────────────────────────────────────────
function PcLanding() {
  return (
    <div className="hidden md:flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 items-center justify-center gap-20 px-16">
      
      {/* 왼쪽: 브랜드 소개 */}
      <div className="flex-1 max-w-lg">
        {/* 로고 */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-200">N</div>
          <span className="font-black text-3xl tracking-tight text-slate-900">널널</span>
        </div>

        <h1 className="text-5xl font-black text-slate-900 leading-tight mb-4">
          언제 만날까요?<br />
          <span className="text-indigo-600">가장 빠르게</span><br />
          <span className="text-slate-400">찾아드립니다</span>
        </h1>
        <p className="text-slate-500 text-lg mb-10 leading-relaxed">
          불가능한 시간을 드래그해서 칠하면<br />
          모두가 가능한 최적의 시간과 장소를 추천해드려요.
        </p>

        {/* 기능 요약 */}
        <div className="space-y-4 mb-10">
          {[
            { icon: '🗓️', title: '드래그로 불가 시간 선택', desc: '캘린더를 드래그해서 안 되는 시간을 빠르게 입력' },
            { icon: '📍', title: '중간지점 자동 추천', desc: '출발지 기반으로 모두에게 가까운 장소 추천' },
            { icon: '🏆', title: '최적 시간 Top 3', desc: '알고리즘이 겹치는 시간을 계산해 순위로 제시' },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <div className="font-bold text-slate-900">{f.title}</div>
                <div className="text-sm text-slate-500">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <a href="#" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all">
            지금 바로 시작하기 →
          </a>
          <a href="#" className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 transition-all">
            사용 방법 보기
          </a>
        </div>
      </div>

      {/* 오른쪽: 폰 목업 */}
      <div className="flex-shrink-0 relative">
        {/* 폰 외곽 프레임 */}
        <div className="relative w-[360px] h-[740px] bg-slate-900 rounded-[3rem] shadow-2xl p-2">
          {/* 노치 */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-900 rounded-full z-10" />
          {/* 화면 */}
          <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
            {/* 실제 앱 UI를 scale로 축소해서 표시 */}
            <div
              style={{ transform: 'scale(0.78)', transformOrigin: 'top left', width: '128.2%', height: '128.2%' }}
            >
              <AppShell />
            </div>
          </div>
        </div>

        {/* 데코 요소 */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-200 rounded-full opacity-60 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-200 rounded-full opacity-50 blur-3xl" />
      </div>

    </div>
  );
}

// ─────────────────────────────────────────────
// 모바일 전용 뷰
// ─────────────────────────────────────────────
function MobileView() {
  return (
    <div className="block md:hidden">
      <AppShell />
    </div>
  );
}

// ─────────────────────────────────────────────
// 최상위 Export
// ─────────────────────────────────────────────
export default function NullNullApp() {
  return (
    <>
      <PcLanding />
      <MobileView />
    </>
  );
}

// ─────────────────────────────────────────────
// 하위 뷰 컴포넌트들 (기존 코드 그대로)
// ─────────────────────────────────────────────
function CreateRoomView({ onSubmit }: { onSubmit: (data: RoomData) => void }) {
  const [title, setTitle] = useState('');
  const [collectLocation, setCollectLocation] = useState(true);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-xl font-bold mb-4 text-slate-900">새로운 약속 잡기</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">약속 이름</label>
          <input
            type="text"
            placeholder="예: 5월 동아리 회의"
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">시작일</label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input type="date" className="w-full pl-8 pr-2 py-2.5 text-sm rounded-xl border border-slate-300 outline-none" defaultValue="2026-05-04" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">종료일</label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input type="date" className="w-full pl-8 pr-2 py-2.5 text-sm rounded-xl border border-slate-300 outline-none" defaultValue="2026-05-10" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">참여자 수 (선택)</label>
          <div className="relative">
            <Users className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="number" placeholder="최대 50명" className="w-full pl-8 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 outline-none" />
          </div>
        </div>
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <h3 className="text-sm font-medium text-slate-900">중간지점 추천받기</h3>
            <p className="text-xs text-slate-500 mt-0.5">출발지 기반으로 모이기 좋은 장소 추천</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer ml-3 flex-shrink-0">
            <input type="checkbox" className="sr-only peer" checked={collectLocation} onChange={() => setCollectLocation(!collectLocation)} />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
        <button
          onClick={() => onSubmit({ title: title || '새로운 약속', collectLocation })}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
        >
          방 만들기
        </button>
      </div>
    </div>
  );
}

function ParticipateView({ roomData, onSubmit }: { roomData: RoomData | null; onSubmit: () => void }) {
  const [selectedBlocks, setSelectedBlocks] = useState(new Set<string>());
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState(true);

  const toggleBlock = (id: string, forceState: boolean) => {
    setSelectedBlocks(prev => {
      const next = new Set(prev);
      if (forceState) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleMouseDown = (id: string) => {
    setIsDragging(true);
    const isCurrentlySelected = selectedBlocks.has(id);
    setDragMode(!isCurrentlySelected);
    toggleBlock(id, !isCurrentlySelected);
  };
  const handleMouseEnter = (id: string) => {
    if (isDragging) toggleBlock(id, dragMode);
  };
  const handleMouseUp = () => setIsDragging(false);

  // 터치 이벤트
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const id = el?.getAttribute('data-id');
    if (!id) return;
    setIsDragging(true);
    const isCurrentlySelected = selectedBlocks.has(id);
    setDragMode(!isCurrentlySelected);
    toggleBlock(id, !isCurrentlySelected);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isDragging) return;
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const id = el?.getAttribute('data-id');
    if (id) toggleBlock(id, dragMode);
  };
  const handleTouchEnd = () => setIsDragging(false);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      {/* 방 정보 헤더 */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 mb-3 flex justify-between items-center">
        <div>
          <span className="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-md mb-1">COLLECTING</span>
          <h2 className="text-base font-bold text-slate-900 leading-tight">{roomData?.title}</h2>
          <p className="text-slate-500 flex items-center gap-1 mt-0.5 text-xs"><Clock className="w-3 h-3" /> 마감: 2일 남음</p>
        </div>
        <button className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors flex-shrink-0">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* 달력 */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 mb-3">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-indigo-500 flex-shrink-0" />
          <span className="text-rose-500">안되는 시간</span>을 드래그해서 칠해주세요
        </h3>

        {/* 달력 그리드 — overflow 없이 화면에 꽉 참 */}
        <div
          className="select-none touch-none w-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* 요일 헤더 */}
          <div className="flex gap-px mb-1">
            {/* 시간 라벨 열 너비 고정 */}
            <div className="w-7 flex-shrink-0" />
            {DAYS.map(day => (
              <div key={day} className="flex-1 text-center text-[11px] font-semibold text-slate-600 bg-slate-50 py-1.5 rounded-md">{day}</div>
            ))}
          </div>

          {/* 시간 행들 */}
          {HOURS.map(hour => (
            <div key={hour} className="flex gap-px mb-px">
              {/* 시간 라벨 */}
              <div className="w-7 flex-shrink-0 text-right pr-1 text-[10px] text-slate-400 flex items-center justify-end leading-none">
                {hour}
              </div>
              {/* 요일별 블록 */}
              {DAYS.map(day => {
                const id = `${day}-${hour}`;
                const isSelected = selectedBlocks.has(id);
                return (
                  <div
                    key={id}
                    data-id={id}
                    onMouseDown={() => handleMouseDown(id)}
                    onMouseEnter={() => handleMouseEnter(id)}
                    className={`flex-1 h-8 rounded-sm cursor-crosshair transition-colors duration-75
                      ${isSelected
                        ? 'bg-rose-400 border border-rose-500'
                        : 'bg-indigo-50 border border-slate-100 hover:bg-indigo-100'}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 출발지 */}
      {roomData?.collectLocation && (
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 mb-3">
          <h3 className="text-sm font-bold mb-2">어디서 출발하시나요?</h3>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input type="text" placeholder="출발지 검색 (예: 강남역)" className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-slate-300 outline-none" />
            </div>
            <button className="px-4 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-xl transition-colors">확인</button>
          </div>
        </div>
      )}

      {/* 하단 저장 바 */}
      <div className="flex items-center justify-between sticky bottom-3 bg-white/90 backdrop-blur-md px-3 py-2.5 rounded-2xl border border-slate-200 shadow-xl">
        <div className="text-xs text-slate-600">
          <span className="font-bold text-rose-500">{selectedBlocks.size}</span>개 불가 선택
        </div>
        <button
          onClick={onSubmit}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-1.5"
        >
          저장하고 결과 보기 <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ResultView({ roomData }: { roomData: RoomData | null }) {
  const [address, setAddress] = useState("");
  const [meetingPoint, setMeetingPoint] = useState(MOCK_RESULTS.meetingPoint);
  const mapRef = useRef<KakaoMap | null>(null);
  const markersRef = useRef<KakaoMarker[]>([]);

  const searchAddress = () => {
    if (!address.trim()) return;
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(parseFloat(result[0].y), parseFloat(result[0].x));
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
        if (mapRef.current) {
          mapRef.current.setCenter(coords);
          const marker = new window.kakao.maps.Marker({ map: mapRef.current, position: coords });
          markersRef.current.push(marker);
          const infowindow = new window.kakao.maps.InfoWindow({ content: `<div style="width:150px;text-align:center;padding:6px 0;">${address}</div>` });
          infowindow.open(mapRef.current, marker);
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
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
        if (mapRef.current) {
          mapRef.current.setCenter(coords);
          const marker = new window.kakao.maps.Marker({ map: mapRef.current, position: coords });
          markersRef.current.push(marker);
          const infowindow = new window.kakao.maps.InfoWindow({ content: `<div style="width:200px;text-align:center;padding:6px 0;"><strong>${result[0].place_name}</strong><br/>${result[0].address_name}</div>` });
          infowindow.open(mapRef.current, marker);
        }
        setMeetingPoint({ label: result[0].place_name, lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) });
      } else {
        alert("주소나 장소를 찾을 수 없습니다.");
      }
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=c92e2db2ad570ba196da9767ff6af5a7&autoload=false&libraries=services`}
        strategy="afterInteractive"
        onLoad={() => {
          window.kakao.maps.load(() => {
            const container = document.getElementById('map');
            if (container) {
              const defaultCenter = new window.kakao.maps.LatLng(37.566, 126.978);
              const map = new window.kakao.maps.Map(container, { center: defaultCenter, level: 5 });
              mapRef.current = map;
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const { latitude, longitude } = position.coords;
                    const currentPos = new window.kakao.maps.LatLng(latitude, longitude);
                    map.setCenter(currentPos);
                    const marker = new window.kakao.maps.Marker({ map, position: currentPos });
                    markersRef.current.push(marker);
                    const infowindow = new window.kakao.maps.InfoWindow({ content: `<div style="width:100px;text-align:center;padding:6px 0;">📍 내 위치</div>` });
                    infowindow.open(map, marker);
                  },
                  () => {}
                );
              }
            }
          });
        }}
      />

      <div className="bg-indigo-600 text-white p-4 rounded-2xl shadow-md flex items-center justify-between">
        <div>
          <span className="inline-block px-2 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded-md mb-1">READY</span>
          <h2 className="text-lg font-bold leading-tight">{roomData?.title || '5월 동아리 회의'}</h2>
          <p className="text-indigo-100 flex items-center gap-1.5 mt-1 text-xs"><Users className="w-3.5 h-3.5" /> 참여자 14/14명 완료</p>
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
            <div key={candidate.rank} className={`p-3 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-50
              ${candidate.rank === 1 ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-100'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0
                  ${candidate.rank === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {candidate.rank}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">{candidate.date} {candidate.time}</div>
                  <div className="text-xs text-slate-500">참석: <span className="font-semibold text-indigo-600">{candidate.attendeeCount}</span>/{candidate.total}명</div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[10px] text-slate-400">매칭</div>
                <div className="font-mono font-bold text-sm text-indigo-600">{(candidate.score * 100).toFixed(0)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {roomData?.collectLocation !== false && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-base flex items-center gap-1.5">
              <MapPin className="w-5 h-5 text-indigo-500" /> 중간지점 추천 장소
            </h3>
            <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full truncate max-w-[100px]">{meetingPoint.label}</span>
          </div>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="주소를 입력하세요"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && searchAddress()}
            />
            <button onClick={searchAddress} className="px-3 py-2 bg-blue-500 text-white text-sm rounded-xl hover:bg-blue-600">검색</button>
          </div>
          <div id="map" className="h-40 bg-slate-100 rounded-xl mb-3 border border-slate-200 overflow-hidden" />
          <div className="grid grid-cols-1 gap-2">
            {MOCK_RESULTS.places.map((place) => (
              <div key={place.id} className="p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  {place.category === 'cafe' ? <Coffee className="w-4 h-4 text-orange-500 flex-shrink-0" /> : <Utensils className="w-4 h-4 text-orange-500 flex-shrink-0" />}
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
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md flex-shrink-0 ml-2">{place.distance}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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