"use client";
// apps/web/src/components/layout/AppShell.tsx

import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { RoomData } from '@/types/room';
import CreateRoomView  from '@/components/room/CreateRoomView';
import ParticipateView from '@/components/room/ParticipateView';
import ResultView      from '@/components/room/ResultView';

type View = 'CREATE' | 'PARTICIPATE' | 'RESULT';

export default function AppShell() {
  const [currentView, setCurrentView] = useState<View>('CREATE');
  const [roomData,    setRoomData]    = useState<RoomData | null>(null);

  const handleCreateRoom   = (data: RoomData) => { setRoomData(data); setCurrentView('PARTICIPATE'); };
  const handleSubmitBlocks = ()               => setCurrentView('RESULT');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* 상단 네비게이션 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-3 h-12 flex items-center justify-between">
          {/* 로고 */}
          <button
            onClick={() => setCurrentView('CREATE')}
            className="flex items-center gap-1.5"
          >
            <div className="w-6 h-6 bg-indigo-600 text-white rounded-md flex items-center justify-center font-bold text-sm">
              N
            </div>
            <span className="font-bold text-base tracking-tight text-slate-800">널널</span>
          </button>

          {/* 스텝 표시 */}
          <div className="flex items-center gap-0.5 text-[11px] text-slate-500">
            {(['CREATE', 'PARTICIPATE', 'RESULT'] as View[]).map((view, i) => {
              const labels: Record<View, string> = { CREATE: '방 만들기', PARTICIPATE: '시간 입력', RESULT: '결과' };
              return (
                <React.Fragment key={view}>
                  {i > 0 && <ChevronRight className="w-3 h-3 opacity-40" />}
                  <span className={`px-1.5 ${currentView === view ? 'text-indigo-600 font-semibold' : ''}`}>
                    {labels[view]}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </header>

      {/* 본문 */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-3 py-4">
        {currentView === 'CREATE'      && <CreateRoomView  onSubmit={handleCreateRoom} />}
        {currentView === 'PARTICIPATE' && <ParticipateView roomData={roomData} onSubmit={handleSubmitBlocks} />}
        {currentView === 'RESULT'      && <ResultView      roomData={roomData} />}
      </main>
    </div>
  );
}
