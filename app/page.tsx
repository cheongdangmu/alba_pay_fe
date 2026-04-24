// apps/web/src/app/page.tsx

import PcLanding from '@/components/layout/PcLanding';
import AppShell  from '@/components/layout/AppShell';

/**
 * 루트 페이지
 * - PC  (md 이상) : PcLanding  → 랜딩 + 폰 목업 프리뷰
 * - 모바일         : AppShell   → 앱 그대로 전체화면
 */
export default function Page() {
  return (
    <>
      {/* PC 전용 랜딩 (hidden md:flex) */}
      <PcLanding />

      {/* 모바일 전용 앱 (block md:hidden) */}
      <div className="block md:hidden">
        <AppShell />
      </div>
    </>
  );
}
