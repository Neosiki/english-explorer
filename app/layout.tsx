import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '3D로 배우는 생활 영어 앱',
  description: '교실 · 공항 · 카페 · 체크인 카운터 속 3D 사물을 클릭해 영어 단어를 배우고, 문장·복습·퀴즈까지 이어 가는 학습 앱.',
  applicationName: '3D로 배우는 생활 영어',
  appleWebApp: { capable: true, title: '생활 영어', statusBarStyle: 'default' },
};

export const viewport: Viewport = {
  themeColor: '#312e81',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
