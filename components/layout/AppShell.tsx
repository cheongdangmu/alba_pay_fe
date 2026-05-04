'use client';
// apps/web/src/components/layout/AppShell.tsx

import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import type { RoomData } from '@/types/room';
import JoinRoomView, { type RoomInfo } from '@/components/room/JoinRoomView';
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

  const handleJoinRoom = (name: string, info: RoomInfo) => {
    const trimmedName = name.trim();
    setRoomData((prev) => ({
      title:
        prev?.title ??
        (trimmedName ? `${trimmedName}님의 참여 모임` : '참여 중인 모임'),
      collectLocation: prev?.collectLocation ?? true,
      departureLocation: prev?.departureLocation,
      startDate: info.startDate,
      endDate: info.endDate,
      allowedDays: info.allowedDays,
      startHour: info.startHour,
      endHour: info.endHour,
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
