import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '3D로 배우는 생활 영어 앱',
  description:
    '교실 · 공항 · 카페 · 체크인 카운터 속 3D 사물을 클릭해 영어 단어를 배우고, 문장 모드에서 생활 영어 문장까지 함께 복습하는 통합 영어 학습 앱.',
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
