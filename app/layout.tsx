import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '영어 학습 앱 — 초등학생을 위한 3D 단어 탐험',
  description:
    '교실 · 공항 · 카페 · 체크인 카운터 속 3D 사물을 클릭해 영어 단어와 문장을 배우는 초등학생용 영어 학습 앱.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
