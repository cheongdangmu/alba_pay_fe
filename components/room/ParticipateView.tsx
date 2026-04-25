'use client';
// apps/web/src/features/room/components/ParticipateView.tsx

import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, Clock, Info, Share2 } from 'lucide-react';
import { HOURS, type RoomData } from '@/types/room';

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

function isWeekend(date: string) {
  return date.endsWith('(토)') || date.endsWith('(일)');
}

const DATES = generateDates('2026-04-24', '2026-05-23');
const COL_W = 44;
const TIME_W = 40;

export default function ParticipateView({ roomData, onSubmit }: Props) {
  const [selectedBlocks, setSelectedBlocks] = useState(new Set<string>());

  const isDraggingRef = useRef(false);
  const dragModeRef = useRef(true);
  const lastCellRef = useRef<{ dateIdx: number; hour: number } | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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
    if (lastCellRef.current) {
      fillBetween(lastCellRef.current, current);
    } else {
      toggle(id, dragModeRef.current);
    }
    lastCellRef.current = current;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    lastCellRef.current = null;
  };

  const syncScroll = (src: 'header' | 'grid', left: number) => {
    if (src === 'header' && gridRef.current) {
      gridRef.current.scrollLeft = left;
    }
    if (src === 'grid' && headerRef.current) {
      headerRef.current.scrollLeft = left;
    }
  };

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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-3 overflow-hidden">
        <div className="p-3 pb-2 border-b border-slate-100">
          <h3 className="text-sm font-bold flex items-center gap-1.5">
            <Info className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            <span className="text-rose-500">안 되는 시간</span>을 드래그해서
            표시해주세요
          </h3>
        </div>

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
                className={`flex-shrink-0 py-1.5 flex flex-col items-center gap-0.5 border-r border-slate-100 ${
                  isWeekend(date)
                    ? 'text-rose-400 bg-rose-50/40'
                    : 'text-slate-500'
                }`}
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

        <div
          ref={gridRef}
          className="overflow-x-auto"
          style={{ scrollbarWidth: 'none' }}
          onScroll={(e) => syncScroll('grid', e.currentTarget.scrollLeft)}
        >
          <div style={{ width: totalW }}>
            {HOURS.map((hour) => (
              <div key={hour} className="flex">
                <div
                  style={{ width: TIME_W, minWidth: TIME_W }}
                  className="flex-shrink-0 sticky left-0 z-10 bg-white text-right pr-2 text-[10px] text-slate-400 flex items-center justify-end border-r border-b border-slate-100"
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
                      className={`flex-shrink-0 h-8 cursor-crosshair transition-colors duration-75 border-b border-r ${
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

      <div className="flex items-center justify-between sticky bottom-3 bg-white/90 backdrop-blur-md px-3 py-2.5 rounded-2xl border border-slate-200 shadow-xl">
        <div className="text-xs text-slate-600">
          <span className="font-bold text-rose-500">{selectedBlocks.size}</span>
          개 블록 선택
        </div>
        <button
          onClick={onSubmit}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-1.5"
        >
          {roomData?.collectLocation ? '출발지 입력으로 이동' : '결과 보기'}{' '}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
