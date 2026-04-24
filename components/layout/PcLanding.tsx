// apps/web/src/components/layout/PcLanding.tsx
// PC에서만 렌더링 (hidden md:flex)

import AppShell from '@/components/layout/AppShell';

const FEATURES = [
  {
    icon: '🗓️',
    title: '드래그로 불가 시간 선택',
    desc: '캘린더를 드래그해서 안 되는 시간을 빠르게 입력',
  },
  {
    icon: '📍',
    title: '중간지점 자동 추천',
    desc: '출발지 기반으로 모두에게 가까운 장소 추천',
  },
  {
    icon: '🏆',
    title: '최적 시간 Top 3',
    desc: '알고리즘이 겹치는 시간을 계산해 순위로 제시',
  },
] as const;

export default function PcLanding() {
  return (
    <div className="hidden md:flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 items-center justify-center gap-20 px-16">
      {/* 왼쪽: 브랜드 소개 */}
      <div className="flex-1 max-w-lg">
        {/* 로고 */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-200">
            N
          </div>
          <span className="font-black text-3xl tracking-tight text-slate-900">
            널널
          </span>
        </div>

        {/* 헤드카피 */}
        <h1 className="text-5xl font-black text-slate-900 leading-tight mb-4">
          언제 만날까요?
          <br />
          <span className="text-indigo-600">가장 빠르게</span>
          <br />
          <span className="text-slate-400">찾아드립니다</span>
        </h1>
        <p className="text-slate-500 text-lg mb-10 leading-relaxed">
          불가능한 시간을 드래그해서 칠하면
          <br />
          모두가 가능한 최적의 시간과 장소를 추천해드려요.
        </p>

        {/* 기능 요약 */}
        <div className="space-y-4 mb-10">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm"
            >
              <span className="text-2xl">{f.icon}</span>
              <div>
                <div className="font-bold text-slate-900">{f.title}</div>
                <div className="text-sm text-slate-500">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex gap-3">
          <a
            href="#"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all"
          >
            지금 바로 시작하기 →
          </a>
          <a
            href="#"
            className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 transition-all"
          >
            사용 방법 보기
          </a>
        </div>
      </div>

      {/* 오른쪽: 폰 목업 */}
      <div className="flex-shrink-0 relative">
        {/* 폰 외곽 프레임 */}
        <div className="relative w-[360px] h-[740px] bg-slate-900 rounded-[3rem] shadow-2xl p-2">
          {/* 노치 */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-900 rounded-full z-10" />
          {/* 화면 */}
          <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
            <div
              style={{
                transform: 'scale(0.78)',
                transformOrigin: 'top left',
                width: '128.2%',
                height: '128.2%',
              }}
            >
              <AppShell />
            </div>
          </div>
        </div>

        {/* 데코 블러 */}
        <div className="absolute -top-6  -right-6 w-24 h-24 bg-indigo-200 rounded-full opacity-60 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-200 rounded-full opacity-50 blur-3xl" />
      </div>
    </div>
  );
}
