// 3D 장면과 무관하게 독립적으로 외우는 생활 영어 문장 14개.
// 문장 모드(SentenceMode)에서 3D 단어 카드와 함께 섞여 복습됩니다.
// id는 hotspot id(desk, airplane 등)와 겹치지 않도록 phrase- 접두사를 붙입니다.

export interface PhraseCard {
  id: string;
  en: string;
  ko: string;
  cat: string;
}

export const sentences: PhraseCard[] = [
  { id: 'phrase-1', en: 'Hello.', ko: '안녕하세요.', cat: '인사' },
  { id: 'phrase-2', en: 'How are you?', ko: '어떻게 지내세요?', cat: '인사' },
  { id: 'phrase-3', en: 'Nice to meet you.', ko: '만나서 반가워요.', cat: '인사' },
  { id: 'phrase-4', en: "What's your name?", ko: '이름이 뭐예요?', cat: '자기소개' },
  { id: 'phrase-5', en: 'My name is Jimin.', ko: '제 이름은 지민이에요.', cat: '자기소개' },
  { id: 'phrase-6', en: "I'm from Korea.", ko: '저는 한국에서 왔어요.', cat: '자기소개' },
  { id: 'phrase-7', en: 'Thank you so much.', ko: '정말 감사합니다.', cat: '감사/사과' },
  { id: 'phrase-8', en: "I'm sorry.", ko: '죄송합니다.', cat: '감사/사과' },
  { id: 'phrase-9', en: 'Excuse me.', ko: '실례합니다.', cat: '감사/사과' },
  { id: 'phrase-10', en: 'Could you help me?', ko: '저 좀 도와주시겠어요?', cat: '일상' },
  { id: 'phrase-11', en: 'How much is this?', ko: '이거 얼마예요?', cat: '일상' },
  { id: 'phrase-12', en: 'See you tomorrow.', ko: '내일 봐요.', cat: '일상' },
  { id: 'phrase-13', en: 'Have a nice day.', ko: '좋은 하루 보내세요.', cat: '일상' },
  { id: 'phrase-14', en: "I don't understand.", ko: '이해가 안 돼요.', cat: '일상' },
];
