'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { isLikelyInAppBrowser } from '@/lib/speech';

export default function BrowserNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(isLikelyInAppBrowser());
  }, []);

  if (!visible) return null;

  return (
    <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-center gap-3 bg-amber-100 px-4 py-2 text-center text-sm text-amber-900 shadow">
      <p className="flex-1">
        카카오톡 등 앱 안에서 열면 발음이 안 들릴 수 있어요. 오른쪽 위 메뉴에서{' '}
        <strong>&apos;다른 브라우저로 열기&apos;</strong>(Chrome, 삼성 인터넷 등)를 눌러주세요.
      </p>
      <button
        onClick={() => setVisible(false)}
        aria-label="닫기"
        className="shrink-0 rounded-full p-1 text-amber-700 hover:bg-amber-200"
      >
        <X size={16} />
      </button>
    </div>
  );
}
