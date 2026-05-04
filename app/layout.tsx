// apps/web/src/app/layout.tsx

import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: '널널 - 약속 잡기',
  description: '모두가 가능한 시간과 중간지점을 자동으로 추천해드립니다.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-600 text-white rounded-md flex items-center justify-center font-bold text-sm">
                A
              </div>
              <span className="font-bold text-base tracking-tight text-slate-800">
                알바페이
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm text-slate-600">
              <Link
                href="/"
                className="hover:text-indigo-600 transition-colors"
              >
                홈
              </Link>
              <Link
                href="/room"
                className="hover:text-indigo-600 transition-colors"
              >
                내 방
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
          <div className="max-w-3xl mx-auto px-4 py-6 text-center text-sm text-slate-400">
            <p className="font-medium text-slate-500 mb-1">알바페이</p>
            <p>급여 정산을 더 쉽고 빠르게</p>
            <p className="mt-3">© 2026 알바페이. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
