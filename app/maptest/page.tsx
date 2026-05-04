// src/app/page.tsx
import KakaoMap from '@/components/ui/KakaoMap';

export default function Page() {
  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-5">우리 약속 방 지도</h1>

      {/* 지도가 들어갈 크기를 지정해줍니다. */}
      <div className="h-56 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center text-sm text-slate-500">
        <KakaoMap
          center={{ lat: 37.5112, lng: 127.0981 }} // 예: 잠실 롯데월드몰
          level={4}
        />
      </div>
    </main>
  );
}
