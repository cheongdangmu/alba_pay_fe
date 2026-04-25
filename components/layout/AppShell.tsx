'use client';
// apps/web/src/components/layout/AppShell.tsx

import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import type { RoomData } from '@/types/room';
import JoinRoomView from '@/components/room/JoinRoomView';
import ParticipateView from '@/components/room/ParticipateView';
import DepartureLocationView from '@/components/room/DepartureLocationView';
import ResultView from '@/components/room/ResultView';

type View = 'JOIN' | 'PARTICIPATE' | 'DEPARTURE' | 'RESULT';

const STEP_LABELS: Record<View, string> = {
  JOIN: '방 참여',
  PARTICIPATE: '시간 입력',
  DEPARTURE: '출발지 입력',
  RESULT: '결과',
};

export default function AppShell() {
  const [currentView, setCurrentView] = useState<View>('JOIN');
  const [roomData, setRoomData] = useState<RoomData | null>(null);

  const handleJoinRoom = (name: string) => {
    const trimmedName = name.trim();
    setRoomData((prev) => ({
      title:
        prev?.title ??
        (trimmedName ? `${trimmedName}님의 참여 모임` : '참여 중인 모임'),
      collectLocation: prev?.collectLocation ?? true,
      departureLocation: prev?.departureLocation,
    }));
    setCurrentView('PARTICIPATE');
  };

  const handleSubmitBlocks = () => {
    setCurrentView(
      roomData?.collectLocation === false ? 'RESULT' : 'DEPARTURE',
    );
  };

  const handleSubmitDeparture = (departureLocation: string) => {
    setRoomData((prev) =>
      prev
        ? {
            ...prev,
            departureLocation,
          }
        : prev,
    );
    setCurrentView('RESULT');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-3 h-12 flex items-center justify-between">
          <button
            onClick={() => setCurrentView('JOIN')}
            className="flex items-center gap-1.5"
          >
            <div className="w-6 h-6 bg-indigo-600 text-white rounded-md flex items-center justify-center font-bold text-sm">
              N
            </div>
            <span className="font-bold text-base tracking-tight text-slate-800">
              알바페이
            </span>
          </button>

          <div className="flex items-center gap-0.5 text-[11px] text-slate-500">
            {(['JOIN', 'PARTICIPATE', 'DEPARTURE', 'RESULT'] as View[]).map(
              (view, i) => (
                <React.Fragment key={view}>
                  {i > 0 && <ChevronRight className="w-3 h-3 opacity-40" />}
                  <span
                    className={`px-1.5 ${currentView === view ? 'text-indigo-600 font-semibold' : ''}`}
                  >
                    {STEP_LABELS[view]}
                  </span>
                </React.Fragment>
              ),
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto p-3 py-4">
        {currentView === 'JOIN' && <JoinRoomView onJoin={handleJoinRoom} />}
        {currentView === 'PARTICIPATE' && (
          <ParticipateView roomData={roomData} onSubmit={handleSubmitBlocks} />
        )}
        {currentView === 'DEPARTURE' && (
          <DepartureLocationView
            roomData={roomData}
            onSubmit={handleSubmitDeparture}
          />
        )}
        {currentView === 'RESULT' && <ResultView roomData={roomData} />}
      </main>
    </div>
  );
}
