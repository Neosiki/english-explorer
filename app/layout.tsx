import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'English Explorer — Interactive Vocabulary',
  description:
    'Click objects in 3D scenes to learn English words for kids: classroom, airport, cafe, and check-in counter.',
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
