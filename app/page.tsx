// apps/web/src/app/page.tsx
import AppShell from '@/components/layout/AppShell';

/**
 * 루트 페이지
 * - PC  (md 이상) : PcLanding  → 랜딩 + 폰 목업 프리뷰
 * - 모바일         : AppShell   → 앱 그대로 전체화면
 */
export default function Page() {
  return (
    <>
      <div className="block">
        <AppShell />
      </div>
    </>
  );
}
