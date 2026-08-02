# English Explorer 🌍

초등학생을 위한 **인터랙티브 3D 영어 단어 학습 앱**입니다.
교실 / 공항 / 카페 / 체크인 카운터 네 개의 장면 속 사물을 클릭하면
영어 단어, 발음(IPA), 한글 뜻, 예문이 뜨고 음성으로 들을 수 있습니다.

Three.js 기반 3D 인터랙티브 씬에 클릭 핫스팟을 배치하는 구조로,
`thebuggeddev/anatomy`(3D 인체 탐색 앱)의 패턴을 영어 교육용으로 응용했습니다.

## 기술 스택

- Next.js 14 (App Router) + React 18 + TypeScript
- Three.js — 3D 씬 렌더링, 클릭 레이캐스팅
- GSAP — 카메라 이동 애니메이션
- Tailwind CSS — UI 스타일
- Web Speech API — 단어/예문 발음 (별도 API 키 불필요)

## 시작하기

```bash
npm install
npm run dev
```

`http://localhost:3000` 에서 확인할 수 있습니다.

```bash
npm run build   # 프로덕션 빌드 검증
npm start       # 빌드된 앱 실행
```

## 프로젝트 구조

```
app/                  Next.js App Router 진입점
components/
  SceneExplorer.tsx    3D 씬 렌더링, 씬 전환, 클릭 인터랙션
  InfoPanel.tsx         선택한 단어의 정보 패널(발음 재생 포함)
data/
  scenes.ts             4개 장면 × 5~6개 핫스팟(단어) 데이터
```

## 콘텐츠 확장하기

`data/scenes.ts`의 `scenes` 배열에 새 장면 객체를 추가하거나,
기존 장면의 `hotspots` 배열에 항목을 추가하면 자동으로 3D 씬에 반영됩니다.
`shape`은 `box | cylinder | sphere | cone` 중 선택, `position`은 [x, y, z] 좌표입니다.

## 배포

Vercel에 리포지토리를 연결하면 별도 설정 없이 바로 배포됩니다.

## 다음 단계 아이디어

- 학습 진행률을 로컬스토리지 또는 DB(Drizzle + SQLite/D1 등)에 저장
- 사용자 발음 녹음 후 정답 발음과 비교하는 미니게임
- 단어 퀴즈 모드(4지선다, 스펠링 게임)
- 실제 glTF 3D 모델로 교체(현재는 기본 도형으로 표현)
