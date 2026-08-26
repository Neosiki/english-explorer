# English Explorer 제품 콘셉트 영상

English Explorer의 실제 코드와 콘텐츠를 바탕으로 제작한 세로형 제품 콘셉트 영상입니다.
실제 배포 화면 녹화본이 아니며, 구현되지 않은 기능이나 임의의 성과 수치는 사용하지 않았습니다.

## 결과물

| 파일 | 사양 | 용도 |
|---|---|---|
| [MP4](media/english-explorer-product-film.mp4) | 1080×1920 · 20초 · 60fps · H.264/AAC | 제품 소개, Shorts/Reels, 포트폴리오 |
| [GIF](media/english-explorer-product-film.gif) | 540×960 · 15fps · 무음 | README 및 메신저 미리보기 |
| [포스터](media/english-explorer-product-film-poster.jpg) | 1080×1920 | 썸네일과 엔드카드 |
| [스토리보드](storyboard.md) | 7개 장면 | 제작 의도와 사실 기준 확인 |

## 영상에 사용한 코드 기반 사실

- 생활 장면 4개: Classroom, Airport, Cafe, Check-in Counter
- 장면 속 단어·예문 21개와 독립 생활 문장 14개, 총 35개 학습 카드
- 사물을 선택하면 단어, IPA, 한글 뜻, 예문을 표시
- Web Speech API를 이용한 발음 듣기
- 문장 복습 모드와 localStorage/Supabase 학습 기록

## 대표 장면

| 장면 | 핵심 단어 | IPA | 뜻 | 예문 |
|---|---|---|---|---|
| Classroom | desk | `/dɛsk/` | 책상 | This is my desk. |
| Airport | passport | `/ˈpæspɔːrt/` | 여권 | Show your passport. |
| Cafe | cup | `/kʌp/` | 컵 | This is a cup. |
| Check-in Counter | boarding pass | `/ˈbɔːrdɪŋ pæs/` | 탑승권 | I need a boarding pass. |

## 디자인 방향

선택 방향은 **A — Pastel Diorama**입니다. 네 장면을 원형 미니어처 무대,
부드러운 오전광, 둥근 재질, `#1f2430` 잉크색, `#ffb703` 노랑,
`#4cc9f0` 하늘색으로 통일했습니다. 각 장면은 핵심 사물 하나와 최대 세 개의
보조 사물만 사용해 초등 학습자가 시선을 잃지 않도록 구성했습니다.

## 검증 결과

- 해상도: 1080×1920
- 프레임률: 60fps
- 길이: 20초
- 오디오: AAC 스테레오, 교육용 BGM + 장면별 SFX
- 통합 음량: −15.4 LUFS
- 시작·종료 검정 프레임 없음

영상 우하단에는 제작 성격을 분명히 하기 위해
`비공식 제품 콘셉트 · Created by Huashu-Design` 문구를 표시했습니다.
