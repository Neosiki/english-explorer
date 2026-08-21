# 3D로 배우는 생활 영어 앱

초등학생을 위한 **인터랙티브 3D 영어 단어·문장 학습 앱**입니다.
교실 / 공항 / 카페 / 체크인 카운터 네 개의 장면 속 사물을 클릭하면
영어 단어, 발음(IPA), 한글 뜻, 예문이 뜨고 음성으로 들을 수 있습니다.
"문장 모드"에서는 21개 단어·예문에 더해, 3D 장면과 무관한 생활 영어
문장 14개(인사·자기소개·감사/사과·일상)까지 총 35개를 플래시카드로
복습할 수 있습니다. (예전에는 이 생활 문장 14개가 별도의 "영어 학습 앱
— 문장 플래시카드 편" 프로젝트였는데, 이 프로젝트로 통합됐습니다.)

Three.js 기반 3D 인터랙티브 씬에 클릭 핫스팟을 배치하는 구조로,
`thebuggeddev/anatomy`(3D 인체 탐색 앱)의 패턴을 영어 교육용으로 응용했습니다.

## 기술 스택

- Next.js 14 (App Router) + React 18 + TypeScript
- Three.js — 3D 씬 렌더링, 클릭 레이캐스팅
- GSAP — 카메라 이동 애니메이션
- Tailwind CSS — UI 스타일
- Web Speech API — 단어/예문 발음 (별도 API 키 불필요)
- Supabase (선택) — 학습 기록을 날짜별로 클라우드에 저장

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

## 온라인 DB 연동하기 (무료 — Supabase)

기본값은 이 브라우저의 localStorage에만 학습 기록을 저장하는
"로컬 저장 모드"입니다. Supabase를 연결하면 실제 클라우드 DB에
날짜별로 기록이 쌓입니다.

1. [supabase.com](https://supabase.com)에서 무료 프로젝트를 생성합니다.
2. SQL Editor에 [`supabase-schema.sql`](supabase-schema.sql) 내용을 붙여넣고 실행합니다.
3. `.env.local.example`을 `.env.local`로 복사하고, Supabase
   Project Settings → API에서 확인한 URL/anon key를 채워넣습니다.
4. 서버를 재시작하면 문장 모드 하단의 배지가 "Supabase 연결됨"으로 바뀝니다.

> ⚠️ **Claude Artifact로 배포한 `standalone/index.html`에서는 Supabase가
> 동작하지 않습니다.** Claude Artifact는 보안상 외부 네트워크 요청을 모두
> 차단하기 때문에, Artifact 안에서는 URL/key를 채워도 자동으로 "로컬 저장
> 모드"로 폴백됩니다. Supabase를 실제로 쓰려면 이 저장소를 Netlify, Vercel,
> GitHub Pages 등 자체 호스팅으로 배포해야 합니다.

## 프로젝트 구조

```
app/                  Next.js App Router 진입점
components/
  SceneExplorer.tsx    3D 씬 렌더링, 씬 전환, 클릭 인터랙션
  InfoPanel.tsx         선택한 단어의 정보 패널(발음 재생 포함)
  SentenceMode.tsx      전체 단어·문장을 복습하는 플래시카드 화면
  BrowserNotice.tsx     인앱 브라우저(카카오톡 등) 감지 배너
data/
  scenes.ts             4개 장면 × 5~6개 핫스팟(단어+문장) 데이터
  sentences.ts           3D 장면과 무관한 생활 영어 문장 14개
lib/
  models.ts              단어별 3D 모델 조립 로직
  speech.ts               모바일 대응 음성 재생 유틸
  db.ts                   Supabase/localStorage 학습 기록 저장·조회
supabase-schema.sql     Supabase에 붙여넣을 테이블 정의
```

## 콘텐츠 확장하기

`data/scenes.ts`의 `scenes` 배열에 새 장면 객체를 추가하거나,
기존 장면의 `hotspots` 배열에 항목을 추가하면 3D 씬과 문장 모드 양쪽에
자동으로 반영됩니다. 각 항목은 `word`(단어), `example`(예문),
`exampleKo`(예문 한글 번역)를 함께 채워야 문장 모드에 정상 표시됩니다.
3D 모델은 `lib/models.ts`에 물건별 조립 함수를 추가해서 그립니다.

## 배포

Vercel에 리포지토리를 연결하면 별도 설정 없이 바로 배포됩니다.

`standalone/index.html`은 Next.js/React/Three.js 없이 동작하는 단일 HTML
파일 버전입니다. Three.js 라이브러리를 빌드 시점에 인라인으로 포함하고
있어 서버 없이 파일 하나만 열어도 실행되며, Claude Artifact처럼 정적 HTML
한 장만 받는 공유 채널에 올릴 때 사용합니다. `app/`, `components/`,
`lib/`, `data/`의 원본 소스와는 별도로 관리되며 자동 동기화되지 않으므로,
장면/모델/문장을 수정하면 이 파일도 수동으로 다시 생성해야 합니다.
(Supabase 관련 제약은 위 "온라인 DB 연동하기" 섹션 참고)

## 다음 단계 아이디어

- 사용자 발음 녹음 후 정답 발음과 비교하는 미니게임
- 단어 퀴즈 모드(4지선다, 스펠링 게임)
- 지금은 기본 도형을 조합한 형태(lib/models.ts)로 표현 중 — 실제 glTF 3D 모델로 교체하면 더 사실적으로 표현 가능
- Supabase Auth로 로그인을 추가해 여러 기기 간 학습 기록 동기화


## 8차시 바이브 앱 코딩 실습 강의안

수강생이 계정 생성부터 AI 기반 구축, 온라인 배포, 클라우드 DB, 음성 재생, 스마트폰 홈 화면 설치까지 직접 따라 할 수 있는 8차시 HTML 강의안을 [`course/영어학습앱_8차시_실습강의안.html`](course/영어학습앱_8차시_실습강의안.html)에 추가했습니다.

강의안에는 8시간 전체 시간표, 차시별 강사 시연·수강생 실습 타임라인, 실제 복사 가능한 코드, 3D 영어 학습앱 이미지, 3D 데모 영상, 비전문가 수강생을 위한 사전 준비 오류 해결표와 최종 제출 체크리스트가 포함되어 있습니다.

### 강의안 열기

저장소를 내려받은 뒤 HTML 파일과 `course/assets/` 폴더를 같은 구조로 유지한 상태에서 `course/영어학습앱_8차시_실습강의안.html`을 브라우저로 엽니다. 온라인 배포 시에는 저장소의 `course/` 폴더를 정적 호스팅 경로로 연결하면 이미지와 MP4 데모가 함께 표시됩니다.

강의안의 소개 링크는 [Neosiki 홈페이지](https://neosiki.github.io/#work)와 이 영어 학습앱 저장소를 연결합니다. 영상은 별도의 외부 분석 서비스나 API 키 없이 로컬 MP4 파일로 재생되며, 이미지에는 한국어 대체 텍스트가 지정되어 있습니다.

## 고도화 버전: 로그인·개인화 복습·PWA

기존 3D 장면·문장 모드·TTS·localStorage 기능과 중복되지 않도록 고도화 영역을 별도로 추가했습니다. `components/UpgradeDashboard.tsx`에는 이메일 매직 링크·Google 로그인, 로그인 전 체험 모드, 적응형 복습 예약, 회상 퀴즈, 학습 대시보드, 선택형 음성 인식, PWA 설치 버튼이 들어 있습니다.

Supabase 환경 변수가 없으면 기존처럼 체험 모드로 작동하며, 학습 상태는 현재 브라우저에 저장됩니다. 환경 변수가 설정되고 사용자가 로그인하면 `explorer_review_state`와 `explorer_review_events`를 통해 사용자별 복습 상태를 동기화합니다. `supabase-schema.sql`의 RLS는 `auth.uid() = user_id`를 기준으로 로그인한 사용자의 데이터만 허용합니다.

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://프로젝트.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=공개_anon_key
```

Supabase 대시보드의 Authentication에서 Email OTP/Magic Link와 Google provider를 켜고, 로컬·배포 주소를 Site URL 및 Redirect URL에 등록해야 합니다. 서비스 역할 키는 브라우저 코드나 저장소에 넣지 않습니다.

PWA 설치 메타데이터는 `app/manifest.ts`와 `app/icon.svg`에 정의되어 있습니다. HTTPS 배포 후 브라우저의 설치 기능을 사용할 수 있으며, 서비스 워커 기반 오프라인 캐시를 추가할 때는 캐시 범위를 핵심 앱 화면과 콘텐츠 자산으로 제한합니다.

### 고도화 실습 강의안

새 기능만 다루는 별도 HTML 강의안은 [`course/영어학습앱_고도화_8차시_실습강의안.html`](course/영어학습앱_고도화_8차시_실습강의안.html)입니다. 인증 설계, 매직 링크, RLS·동기화, 간격 반복, 회상 퀴즈, 대시보드, PWA·접근성, SpeechRecognition, 통합 테스트·배포를 8차시로 구성했습니다.
