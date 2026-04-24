"use client";
// apps/web/src/components/room/ParticipateView.tsx

import React, { useState } from 'react';
import { Clock, Share2, Info, MapPin, ChevronRight } from 'lucide-react';
import { RoomData, DAYS, HOURS } from '@/types/room';

interface Props {
  roomData: RoomData | null;
  onSubmit: () => void;
}

export default function ParticipateView({ roomData, onSubmit }: Props) {
  const [selectedBlocks, setSelectedBlocks] = useState(new Set<string>());
  const [isDragging, setIsDragging]         = useState(false);
  const [dragMode, setDragMode]             = useState(true); // true = 선택, false = 해제

  // ─── 블록 토글 ───────────────────────────────
  const toggleBlock = (id: string, forceState: boolean) => {
    setSelectedBlocks(prev => {
      const next = new Set(prev);
      forceState ? next.add(id) : next.delete(id);
      return next;
    });
  };

  // ─── 마우스 이벤트 ────────────────────────────
  const handleMouseDown = (id: string) => {
    setIsDragging(true);
    const willSelect = !selectedBlocks.has(id);
    setDragMode(willSelect);
    toggleBlock(id, willSelect);
  };
  const handleMouseEnter = (id: string) => {
    if (isDragging) toggleBlock(id, dragMode);
  };
  const handleMouseUp = () => setIsDragging(false);

  // ─── 터치 이벤트 (모바일 드래그) ──────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const el    = document.elementFromPoint(touch.clientX, touch.clientY);
    const id    = el?.getAttribute('data-id');
    if (!id) return;
    setIsDragging(true);
    const willSelect = !selectedBlocks.has(id);
    setDragMode(willSelect);
    toggleBlock(id, willSelect);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isDragging) return;
    const touch = e.touches[0];
    const el    = document.elementFromPoint(touch.clientX, touch.clientY);
    const id    = el?.getAttribute('data-id');
    if (id) toggleBlock(id, dragMode);
  };
  const handleTouchEnd = () => setIsDragging(false);

  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 방 정보 헤더 */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 mb-3 flex justify-between items-center">
        <div>
          <span className="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-md mb-1">
            COLLECTING
          </span>
          <h2 className="text-base font-bold text-slate-900 leading-tight">{roomData?.title}</h2>
          <p className="text-slate-500 flex items-center gap-1 mt-0.5 text-xs">
            <Clock className="w-3 h-3" /> 마감: 2일 남음
          </p>
        </div>
        <button className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors flex-shrink-0">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* 시간 그리드 */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 mb-3">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-indigo-500 flex-shrink-0" />
          <span className="text-rose-500">안되는 시간</span>을 드래그해서 칠해주세요
        </h3>

        <div
          className="select-none touch-none w-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* 요일 헤더 */}
          <div className="flex gap-px mb-1">
            <div className="w-7 flex-shrink-0" />
            {DAYS.map(day => (
              <div
                key={day}
                className="flex-1 text-center text-[11px] font-semibold text-slate-600 bg-slate-50 py-1.5 rounded-md"
              >
                {day}
              </div>
            ))}
          </div>

          {/* 시간 행 */}
          {HOURS.map(hour => (
            <div key={hour} className="flex gap-px mb-px">
              <div className="w-7 flex-shrink-0 text-right pr-1 text-[10px] text-slate-400 flex items-center justify-end">
                {hour}
              </div>
              {DAYS.map(day => {
                const id         = `${day}-${hour}`;
                const isSelected = selectedBlocks.has(id);
                return (
                  <div
                    key={id}
                    data-id={id}
                    onMouseDown={() => handleMouseDown(id)}
                    onMouseEnter={() => handleMouseEnter(id)}
                    className={`flex-1 h-8 rounded-sm cursor-crosshair transition-colors duration-75 border
                      ${isSelected
                        ? 'bg-rose-400 border-rose-500'
                        : 'bg-indigo-50 border-slate-100 hover:bg-indigo-100'}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 출발지 입력 */}
      {roomData?.collectLocation && (
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 mb-3">
          <h3 className="text-sm font-bold mb-2">어디서 출발하시나요?</h3>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="출발지 검색 (예: 강남역)"
                className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-slate-300 outline-none"
              />
            </div>
            <button className="px-4 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-xl transition-colors">
              확인
            </button>
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
