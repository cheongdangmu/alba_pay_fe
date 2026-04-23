"use client";

import React, { useState, useCallback, useRef } from 'react';
import { 
  Calendar, Clock, MapPin, Users, ChevronRight, 
  CheckCircle2, Share2, Map as MapIcon, Coffee, Utensils, Star, Info
} from 'lucide-react';


interface RoomData {
  title: string;
  collectLocation: boolean;
}

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 9); // 09:00 ~ 21:00

// Mock Result Data based on SRS ALG-SCORE-TIME & ALG-SCORE-PLACE
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

export default function NullNullApp() {
  const [currentView, setCurrentView] = useState('CREATE'); // CREATE, PARTICIPATE, RESULT
  const [roomData, setRoomData] = useState<RoomData | null>(null);

  const handleCreateRoom = (data : RoomData) => {
    setRoomData(data);
    setCurrentView('PARTICIPATE');
  };

  const handleSubmitBlocks = () => {
    setCurrentView('RESULT');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('CREATE')}>
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-xl">N</div>
            <span className="font-bold text-xl tracking-tight text-slate-800">널널</span>
          </div>
          <div className="flex gap-2 text-sm text-slate-500">
            <span className={`px-2 ${currentView === 'CREATE' ? 'text-indigo-600 font-semibold' : ''}`}>방 만들기</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <span className={`px-2 ${currentView === 'PARTICIPATE' ? 'text-indigo-600 font-semibold' : ''}`}>시간 입력</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <span className={`px-2 ${currentView === 'RESULT' ? 'text-indigo-600 font-semibold' : ''}`}>결과</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto p-4 py-8">
        {currentView === 'CREATE' && <CreateRoomView onSubmit={handleCreateRoom} />}
        {currentView === 'PARTICIPATE' && <ParticipateView roomData={roomData} onSubmit={handleSubmitBlocks} />}
        {currentView === 'RESULT' && <ResultView roomData={roomData} />}
      </main>
    </div>
  );
}

function CreateRoomView({ onSubmit }: { onSubmit: (data: RoomData) => void }) {
  const [title, setTitle] = useState('');
  const [collectLocation, setCollectLocation] = useState(true);

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-bold mb-6 text-slate-900">새로운 약속 잡기</h1>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">약속 이름 (Title)</label>
          <input 
            type="text" 
            placeholder="예: 5월 동아리 회의" 
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">시작일</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input type="date" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 outline-none" defaultValue="2026-05-04" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">종료일 (최대 30일)</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input type="date" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 outline-none" defaultValue="2026-05-10" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">참여자 수 (선택)</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input type="number" placeholder="최대 50명" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 outline-none" />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <h3 className="font-medium text-slate-900">중간지점 추천받기</h3>
            <p className="text-sm text-slate-500">참여자들의 출발지를 기반으로 모이기 좋은 장소를 추천합니다.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={collectLocation} onChange={() => setCollectLocation(!collectLocation)} />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        <button 
          onClick={() => onSubmit({ title: title || '새로운 약속', collectLocation })}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
        >
          방 만들기
        </button>
      </div>
    </div>
  );
}

function ParticipateView({ roomData, onSubmit }: { roomData: RoomData | null; onSubmit: (data: RoomData) => void }) {
  const [selectedBlocks, setSelectedBlocks] = useState(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState(true); // true: select (make NULL), false: deselect

  // Handle Drag Selection Logic
  const handleMouseDown = (id : string) => {
    setIsDragging(true);
    const isCurrentlySelected = selectedBlocks.has(id);
    setDragMode(!isCurrentlySelected);
    toggleBlock(id, !isCurrentlySelected);
  };

  const handleMouseEnter = (id : string) => {
    if (isDragging) {
      toggleBlock(id, dragMode);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleBlock = (id: string, forceState: boolean) => {
    setSelectedBlocks(prev => {
      const next = new Set(prev);
      if (forceState) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      {/* Room Info Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6 flex justify-between items-start">
        <div>
          <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-md mb-2">COLLECTING</span>
          <h2 className="text-2xl font-bold text-slate-900">{roomData?.title}</h2>
          <p className="text-slate-500 flex items-center gap-1 mt-1 text-sm"><Clock className="w-4 h-4"/> 마감: 2일 남음</p>
        </div>
        <button className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-indigo-500"/>
          <span className="text-rose-500">안되는 시간</span>을 드래그하여 칠해주세요 (NULL 블록)
        </h3>
        
        {/* Time Grid UI */}
        <div className="overflow-x-auto pb-4 select-none touch-none">
          <div className="min-w-[600px]">
            {/* Header: Days */}
            <div className="grid grid-cols-8 gap-1 mb-2">
              <div className="text-center text-xs font-medium text-slate-400">시간</div>
              {DAYS.map(day => (
                <div key={day} className="text-center font-semibold text-slate-700 bg-slate-50 py-2 rounded-lg">{day}</div>
              ))}
            </div>
            
            {/* Grid Body */}
            {HOURS.map(hour => (
              <div key={hour} className="grid grid-cols-8 gap-1 mb-1">
                <div className="text-right pr-2 text-xs font-medium text-slate-400 flex items-center justify-end -translate-y-3">
                  {hour}:00
                </div>
                {DAYS.map(day => {
                  const id = `${day}-${hour}`;
                  const isSelected = selectedBlocks.has(id);
                  return (
                    <div 
                      key={id}
                      onMouseDown={() => handleMouseDown(id)}
                      onMouseEnter={() => handleMouseEnter(id)}
                      className={`h-10 rounded-md cursor-crosshair transition-colors duration-100 border border-slate-100
                        ${isSelected 
                          ? 'bg-rose-400 border-rose-500 shadow-inner' 
                          : 'bg-indigo-50 hover:bg-indigo-100'}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Location Input (FR-LOCATION-001) */}
      {roomData?.collectLocation && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
          <h3 className="font-bold text-lg mb-4">어디서 출발하시나요?</h3>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input type="text" placeholder="출발지 검색 (예: 강남역)" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 outline-none" />
            </div>
            <button className="px-6 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl transition-colors">확인</button>
          </div>
        </div>
      )}

      {/* Submit Action */}
      <div className="flex items-center justify-between sticky bottom-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl">
        <div className="text-sm text-slate-600">
          <span className="font-bold text-rose-500">{selectedBlocks.size}</span>개의 불가 시간 선택됨
        </div>
        <button 
          onClick={() => roomData && onSubmit(roomData)}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
        >
          저장하고 결과 보기 <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function ResultView({ roomData }: { roomData: RoomData | null }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      
      {/* Result Status Header */}
      <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-md flex items-center justify-between">
        <div>
          <span className="inline-block px-2 py-1 bg-white/20 text-white text-xs font-bold rounded-md mb-2">READY</span>
          <h2 className="text-2xl font-bold">{roomData?.title || '5월 동아리 회의'}</h2>
          <p className="text-indigo-100 flex items-center gap-2 mt-1">
            <Users className="w-4 h-4"/> 참여자 14/14명 완료
          </p>
        </div>
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Top 3 Times (ALG-SCORE-TIME) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
          <Clock className="w-6 h-6 text-indigo-500"/> 모두가 만날 수 있는 시간
        </h3>
        <div className="space-y-3">
          {MOCK_RESULTS.topCandidates.map((candidate) => (
            <div key={candidate.rank} className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-50
              ${candidate.rank === 1 ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-100'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold
                  ${candidate.rank === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {candidate.rank}
                </div>
                <div>
                  <div className="font-bold text-lg text-slate-900">{candidate.date} {candidate.time}</div>
                  <div className="text-sm text-slate-500">참석 가능: <span className="font-semibold text-indigo-600">{candidate.attendeeCount}</span>/{candidate.total}명</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 mb-1">매칭 점수</div>
                <div className="font-mono font-bold text-indigo-600">{(candidate.score * 100).toFixed(0)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Place Recommendations (ALG-CENTROID & ALG-PLACE-SEARCH) */}
      {roomData?.collectLocation !== false && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl flex items-center gap-2">
              <MapPin className="w-6 h-6 text-indigo-500"/> 중간지점 추천 장소
            </h3>
            <span className="text-sm font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
              기준: {MOCK_RESULTS.meetingPoint.label}
            </span>
          </div>

          {/* Mock Map Visual */}
          <div className="h-48 bg-slate-100 rounded-xl mb-4 flex flex-col items-center justify-center border border-slate-200 relative overflow-hidden">
            <MapIcon className="w-12 h-12 text-slate-300 mb-2" />
            <span className="text-slate-400 font-medium">카카오맵 SDK 영역</span>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/20 rounded-full animate-pulse"></div>
            <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-600" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {MOCK_RESULTS.places.map((place) => (
              <div key={place.id} className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {place.category === 'cafe' ? <Coffee className="w-4 h-4 text-orange-500"/> : <Utensils className="w-4 h-4 text-orange-500"/>}
                    <span className="font-bold text-slate-900">{place.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{place.distance}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{place.rating}</span>
                    <span className="text-slate-400">({place.reviews})</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                  <div>매칭률 {(place.score * 100).toFixed(0)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Host Confirmation Action (FR-ROOM-006) */}
      <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-indigo-900 mb-1">방장님이신가요?</h4>
          <p className="text-sm text-indigo-700">모두의 의견을 바탕으로 약속을 확정해 주세요.</p>
        </div>
        <button className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors">
          약속 확정하기
        </button>
      </div>

    </div>
  );
}