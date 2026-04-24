'use client';
// apps/web/src/features/room/components/ParticipateView.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Clock, Share2, Info, MapPin, ChevronRight } from 'lucide-react';
import { type RoomData, HOURS } from '@/types/room';

interface Props {
  roomData: RoomData | null;
  onSubmit: () => void;
}

function generateDates(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  const names = ['일', '월', '화', '수', '목', '금', '토'];
  while (current <= end) {
    dates.push(
      `${current.getMonth() + 1}/${current.getDate()}(${names[current.getDay()]})`,
    );
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

function isWeekend(d: string) {
  return d.endsWith('(토)') || d.endsWith('(일)');
}

const DATES = generateDates('2026-04-24', '2026-05-23');
const COL_W = 44;
const TIME_W = 40;

export default function ParticipateView({ roomData, onSubmit }: Props) {
  const [selectedBlocks, setSelectedBlocks] = useState(new Set<string>());

  const isDraggingRef = useRef(false);
  const dragModeRef = useRef(true);
  const lastCellRef = useRef<{ dateIdx: number; hour: number } | null>(null); // 직전 셀 위치
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // id 파싱: "4/24(금)-9" → { dateIdx, hour }
  const parseId = (id: string) => {
    const parts = id.split('-');
    const hour = parseInt(parts[parts.length - 1], 10);
    const dateStr = parts.slice(0, parts.length - 1).join('-');
    const dateIdx = DATES.indexOf(dateStr);
    return { dateIdx, hour };
  };

  const toggle = (id: string, add: boolean) => {
    setSelectedBlocks((prev) => {
      const next = new Set(prev);
      if (add) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  // 두 셀 사이의 모든 셀을 채우는 보간
  const fillBetween = (
    from: { dateIdx: number; hour: number },
    to: { dateIdx: number; hour: number },
  ) => {
    const minD = Math.min(from.dateIdx, to.dateIdx);
    const maxD = Math.max(from.dateIdx, to.dateIdx);
    const minH = Math.min(from.hour, to.hour);
    const maxH = Math.max(from.hour, to.hour);

    setSelectedBlocks((prev) => {
      const next = new Set(prev);
      for (let di = minD; di <= maxD; di++) {
        for (let h = minH; h <= maxH; h++) {
          const id = `${DATES[di]}-${h}`;
          if (dragModeRef.current) {
            next.add(id);
          } else {
            next.delete(id);
          }
        }
      }
      return next;
    });
  };

  // 마우스 이벤트 (PC)
  const handleMouseDown = (id: string) => {
    const willSelect = !selectedBlocks.has(id);
    isDraggingRef.current = true;
    dragModeRef.current = willSelect;
    lastCellRef.current = parseId(id);
    toggle(id, willSelect);
  };
  const handleMouseEnter = (id: string) => {
    if (!isDraggingRef.current) return;
    const current = parseId(id);
    // 직전 셀과 현재 셀 사이를 보간 → 빠른 이동 시 빈 칸 없이 채워짐
    if (lastCellRef.current) fillBetween(lastCellRef.current, current);
    else toggle(id, dragModeRef.current);
    lastCellRef.current = current;
  };
  const handleMouseUp = () => {
    isDraggingRef.current = false;
    lastCellRef.current = null;
  };

  // 헤더 <-> 그리드 스크롤 동기화
  const syncScroll = (src: 'header' | 'grid', left: number) => {
    if (src === 'header' && gridRef.current) gridRef.current.scrollLeft = left;
    if (src === 'grid' && headerRef.current)
      headerRef.current.scrollLeft = left;
  };

  // non-passive touch 이벤트 (모바일)
  // React onTouchStart/Move는 passive=true 기본값 → e.preventDefault() 불가
  // useEffect로 직접 DOM에 { passive: false }로 등록
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const onStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      const id = target?.getAttribute('data-id');
      if (!id) return;
      e.preventDefault();
      setSelectedBlocks((prev) => {
        const willSelect = !prev.has(id);
        isDraggingRef.current = true;
        dragModeRef.current = willSelect;
        lastCellRef.current = parseId(id);
        const next = new Set(prev);
        if (willSelect) {
          next.add(id);
        } else {
          next.delete(id);
        }
        return next;
      });
    };

    const onMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      const id = target?.getAttribute('data-id');
      if (!id) return;
      const current = parseId(id);
      if (lastCellRef.current) {
        const from = lastCellRef.current;
        const minD = Math.min(from.dateIdx, current.dateIdx);
        const maxD = Math.max(from.dateIdx, current.dateIdx);
        const minH = Math.min(from.hour, current.hour);
        const maxH = Math.max(from.hour, current.hour);
        setSelectedBlocks((prev) => {
          const next = new Set(prev);
          for (let di = minD; di <= maxD; di++) {
            for (let h = minH; h <= maxH; h++) {
              const fid = `${DATES[di]}-${h}`;
              if (dragModeRef.current) {
                next.add(fid);
              } else {
                next.delete(fid);
              }
            }
          }
          return next;
        });
      }
      lastCellRef.current = current;
    };

    const onEnd = () => {
      isDraggingRef.current = false;
      lastCellRef.current = null;
    };

    el.addEventListener('touchstart', onStart, { passive: false });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd);
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
    };
  }, []);

  const totalW = TIME_W + COL_W * DATES.length;

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
          <h2 className="text-base font-bold text-slate-900 leading-tight">
            {roomData?.title}
          </h2>
          <p className="text-slate-500 flex items-center gap-1 mt-0.5 text-xs">
            <Clock className="w-3 h-3" /> 마감: 2일 남음
          </p>
        </div>
        <button className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors flex-shrink-0">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* 그리드 카드 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-3 overflow-hidden">
        <div className="p-3 pb-2 border-b border-slate-100">
          <h3 className="text-sm font-bold flex items-center gap-1.5">
            <Info className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            <span className="text-rose-500">안되는 시간</span>을 드래그해서
            칠해주세요
          </h3>
        </div>

        {/* 날짜 헤더 (그리드 스크롤과 동기화) */}
        <div
          ref={headerRef}
          className="overflow-x-auto border-b border-slate-100 bg-white"
          style={{ scrollbarWidth: 'none' }}
          onScroll={(e) => syncScroll('header', e.currentTarget.scrollLeft)}
        >
          <div style={{ width: totalW }} className="flex">
            <div
              style={{ width: TIME_W, minWidth: TIME_W }}
              className="flex-shrink-0 border-r border-slate-100"
            />
            {DATES.map((date) => (
              <div
                key={date}
                style={{ width: COL_W, minWidth: COL_W }}
                className={`flex-shrink-0 py-1.5 flex flex-col items-center gap-0.5 border-r border-slate-100
                  ${isWeekend(date) ? 'text-rose-400 bg-rose-50/40' : 'text-slate-500'}`}
              >
                <span className="text-[10px] font-semibold leading-none">
                  {date.split('(')[0]}
                </span>
                <span className="text-[9px] font-medium leading-none">
                  {date.match(/\((.+)\)/)?.[1]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 시간 × 날짜 그리드 */}
        <div
          ref={gridRef}
          className="overflow-x-auto"
          style={{ scrollbarWidth: 'none' }}
          onScroll={(e) => syncScroll('grid', e.currentTarget.scrollLeft)}
        >
          <div style={{ width: totalW }}>
            {HOURS.map((hour) => (
              <div key={hour} className="flex">
                {/* 시간 라벨 sticky */}
                <div
                  style={{ width: TIME_W, minWidth: TIME_W }}
                  className="flex-shrink-0 sticky left-0 z-10 bg-white
                    text-right pr-2 text-[10px] text-slate-400
                    flex items-center justify-end
                    border-r border-b border-slate-100"
                >
                  {hour}:00
                </div>

                {DATES.map((date) => {
                  const id = `${date}-${hour}`;
                  const isSelected = selectedBlocks.has(id);
                  const weekend = isWeekend(date);
                  return (
                    <div
                      key={id}
                      data-id={id}
                      onMouseDown={() => handleMouseDown(id)}
                      onMouseEnter={() => handleMouseEnter(id)}
                      style={{ width: COL_W, minWidth: COL_W }}
                      className={`flex-shrink-0 h-8 cursor-crosshair
                        transition-colors duration-75 border-b border-r
                        ${
                          isSelected
                            ? 'bg-rose-400 border-rose-300'
                            : weekend
                              ? 'bg-rose-50/60 border-rose-100 hover:bg-rose-100'
                              : 'bg-indigo-50/60 border-slate-100 hover:bg-indigo-100'
                        }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
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
          <span className="font-bold text-rose-500">{selectedBlocks.size}</span>
          개 불가 선택
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
