'use client';
// apps/web/src/features/room/components/JoinRoomView.tsx

import React, { useState } from 'react';
import {
  Clock,
  Users,
  ChevronRight,
  Sparkles,
  CalendarDays,
} from 'lucide-react';

interface RoomInfo {
  hostName: string;
  title: string;
  dateRange: string;
  deadline: string;
  participantCount: number;
  totalCount: number;
  candidateDays: string;
}

interface Props {
  roomInfo?: RoomInfo;
  onJoin: (name: string) => void;
}

const DEFAULT_ROOM: RoomInfo = {
  hostName: '수현',
  title: '5월 동아리 회의',
  dateRange: '05.04 ~ 05.10',
  deadline: '05.03 23:59',
  participantCount: 8,
  totalCount: 14,
  candidateDays: '월·화·목 18~22시',
};

export default function JoinRoomView({
  roomInfo = DEFAULT_ROOM,
  onJoin,
}: Props) {
  const [name, setName] = useState('');

  const handleJoin = () => onJoin(name.trim());

  const progress = Math.round(
    (roomInfo.participantCount / roomInfo.totalCount) * 100,
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 상단 타이틀 바 */}
      <header className="bg-white border-b border-slate-100 px-4 h-12 flex items-center">
        <span className="text-base font-bold text-slate-800">모임 참여</span>
      </header>

      <main className="flex-1 px-4 pt-5 pb-8 flex flex-col gap-3">
        {/* 초대 카드 */}
        <div className="bg-white rounded-2xl border-2 border-indigo-400 shadow-sm overflow-hidden">
          {/* 초대자 배너 */}
          <div className="bg-indigo-50 px-4 py-2 border-b border-indigo-100">
            <p className="text-xs text-indigo-500 font-medium">
              <span className="font-bold text-indigo-700">
                {roomInfo.hostName}
              </span>{' '}
              님이 초대했어요
            </p>
          </div>

          {/* 제목 */}
          <div className="px-4 pt-4 pb-3 border-b border-slate-100">
            <h1 className="text-2xl font-black text-slate-900 leading-tight">
              {roomInfo.title}
            </h1>
          </div>

          {/* 정보 목록 */}
          <div className="px-4 py-1 divide-y divide-slate-100">
            <InfoRow
              icon={<CalendarDays className="w-3.5 h-3.5 text-indigo-400" />}
              label="날짜"
              value={roomInfo.dateRange}
            />
            <InfoRow
              icon={<Clock className="w-3.5 h-3.5 text-indigo-400" />}
              label="마감"
              value={roomInfo.deadline}
              valueClassName="text-rose-500 font-bold"
            />
            <InfoRow
              icon={<Users className="w-3.5 h-3.5 text-indigo-400" />}
              label="참여"
              value={
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">
                    {roomInfo.participantCount} / {roomInfo.totalCount}명
                  </span>
                  {/* 참여 진행 바 */}
                  <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-400 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              }
            />
            <InfoRow
              icon={<Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
              label="후보 요일"
              value={roomInfo.candidateDays}
              valueClassName="text-indigo-600 font-semibold"
            />
          </div>

          {/* 이름 입력 */}
          <div className="px-4 pt-3 pb-4">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              이름 <span className="font-normal text-slate-400">(선택)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              placeholder="빈칸이면 '참여자 #9' 자동 부여"
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200
                bg-slate-50 placeholder:text-slate-400
                focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                transition-all"
            />
          </div>
        </div>

        {/* 하단 고정 영역 */}
        <div className="pt-2 flex flex-col items-center gap-2">
          {/* 참여하기 버튼 */}
          <button
            onClick={handleJoin}
            className="w-full py-4 bg-teal-500 hover:bg-teal-600 active:scale-[0.98]
              text-white text-base font-bold rounded-2xl
              shadow-lg shadow-teal-200 transition-all flex items-center justify-center gap-2"
          >
            참여하기
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* 안내 문구 */}
          <p className="text-xs text-slate-400">가입 없이 익명으로 참여해요</p>

          {/* 불참 버튼 */}
          <button
            onClick={handleJoin}
            className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 active:scale-[0.98]
              text-teal text-base font-bold rounded-2xl
              shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            불참할께요
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
}

// ─── 정보 행 컴포넌트 ────────────────────────
interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}

function InfoRow({
  icon,
  label,
  value,
  valueClassName = 'text-slate-700 font-semibold',
}: InfoRowProps) {
  return (
    <div className="flex items-center justify-between py-3 gap-4">
      <div className="flex items-center gap-1.5 text-slate-500 text-sm flex-shrink-0">
        {icon}
        <span>{label}</span>
      </div>
      {typeof value === 'string' ? (
        <span className={`text-sm ${valueClassName}`}>{value}</span>
      ) : (
        <div className={`text-sm ${valueClassName}`}>{value}</div>
      )}
    </div>
  );
}
