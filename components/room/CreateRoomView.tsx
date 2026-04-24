"use client";
// apps/web/src/components/room/CreateRoomView.tsx

import React, { useState } from 'react';
import { Calendar, Users } from 'lucide-react';
import { RoomData } from '@/types/room';

interface Props {
  onSubmit: (data: RoomData) => void;
}

export default function CreateRoomView({ onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [collectLocation, setCollectLocation] = useState(true);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-xl font-bold mb-4 text-slate-900">새로운 약속 잡기</h1>

      <div className="space-y-4">
        {/* 약속 이름 */}
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

        {/* 날짜 범위 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">시작일</label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="date"
                className="w-full pl-8 pr-2 py-2.5 text-sm rounded-xl border border-slate-300 outline-none"
                defaultValue="2026-05-04"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">종료일</label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="date"
                className="w-full pl-8 pr-2 py-2.5 text-sm rounded-xl border border-slate-300 outline-none"
                defaultValue="2026-05-10"
              />
            </div>
          </div>
        </div>

        {/* 참여자 수 */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">참여자 수 (선택)</label>
          <div className="relative">
            <Users className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="number"
              placeholder="최대 50명"
              className="w-full pl-8 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 outline-none"
            />
          </div>
        </div>

        {/* 중간지점 토글 */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <h3 className="text-sm font-medium text-slate-900">중간지점 추천받기</h3>
            <p className="text-xs text-slate-500 mt-0.5">출발지 기반으로 모이기 좋은 장소 추천</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer ml-3 flex-shrink-0">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={collectLocation}
              onChange={() => setCollectLocation(!collectLocation)}
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer
              peer-checked:after:translate-x-full peer-checked:after:border-white
              after:content-[''] after:absolute after:top-[2px] after:left-[2px]
              after:bg-white after:border-slate-300 after:border after:rounded-full
              after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
          </label>
        </div>

        {/* 제출 버튼 */}
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
