export interface Hotspot {
  id: string;
  word: string;
  korean: string;
  ipa: string;
  example: string;
  exampleKo: string;
  color: string; // hex, used as the object's primary material color
  position: [number, number, number]; // where the object's base/contact point sits
}

export interface SceneDef {
  id: string;
  title: string;
  titleKo: string;
  bgColor: string;
  floorColor: string;
  hotspots: Hotspot[];
}

export const scenes: SceneDef[] = [
  {
    id: 'classroom',
    title: 'Classroom',
    titleKo: '교실',
    bgColor: '#dbeafe',
    floorColor: '#c8b28a',
    hotspots: [
      { id: 'desk', word: 'desk', korean: '책상', ipa: '/dɛsk/', example: 'This is my desk.', exampleKo: '이건 제 책상이에요.', color: '#a0714a', position: [-2, 0, 0] },
      { id: 'chair', word: 'chair', korean: '의자', ipa: '/tʃɛr/', example: 'Sit on the chair.', exampleKo: '의자에 앉으세요.', color: '#6b4a2b', position: [-2, 0, 1] },
      { id: 'book', word: 'book', korean: '책', ipa: '/bʊk/', example: 'Open your book.', exampleKo: '책을 펴세요.', color: '#e63946', position: [-2.3, 0.8, -0.15] },
      { id: 'pencil', word: 'pencil', korean: '연필', ipa: '/ˈpɛnsəl/', example: 'I have a pencil.', exampleKo: '저는 연필이 있어요.', color: '#ffb703', position: [-1.7, 0.8, 0.15] },
      { id: 'blackboard', word: 'blackboard', korean: '칠판', ipa: '/ˈblækbɔːrd/', example: 'Look at the blackboard.', exampleKo: '칠판을 보세요.', color: '#1d3557', position: [0, 0, -2.2] },
      { id: 'backpack', word: 'backpack', korean: '책가방', ipa: '/ˈbækpæk/', example: 'Pack your backpack.', exampleKo: '책가방을 챙기세요.', color: '#2a9d8f', position: [1.5, 0, 1.2] },
    ],
  },
  {
    id: 'airport',
    title: 'Airport',
    titleKo: '공항',
    bgColor: '#e0f2fe',
    floorColor: '#b6bec7',
    hotspots: [
      { id: 'airplane', word: 'airplane', korean: '비행기', ipa: '/ˈɛrpleɪn/', example: 'The airplane is big.', exampleKo: '비행기는 커요.', color: '#f4f4f4', position: [-1.5, 0, -1] },
      { id: 'gate', word: 'gate', korean: '탑승구', ipa: '/ɡeɪt/', example: 'Go to gate five.', exampleKo: '5번 탑승구로 가세요.', color: '#457b9d', position: [1.8, 0, -1.5] },
      { id: 'suitcase', word: 'suitcase', korean: '여행 가방', ipa: '/ˈsuːtkeɪs/', example: 'Carry your suitcase.', exampleKo: '여행 가방을 들어주세요.', color: '#e76f51', position: [0.5, 0, 1.2] },
      { id: 'passport', word: 'passport', korean: '여권', ipa: '/ˈpæspɔːrt/', example: 'Show your passport.', exampleKo: '여권을 보여주세요.', color: '#2a9d8f', position: [0.5, 0.5, 1.05] },
      { id: 'runway', word: 'runway', korean: '활주로', ipa: '/ˈrʌnweɪ/', example: 'The plane is on the runway.', exampleKo: '비행기가 활주로에 있어요.', color: '#495057', position: [-1.5, 0, -2.5] },
    ],
  },
  {
    id: 'cafe',
    title: 'Cafe',
    titleKo: '카페',
    bgColor: '#fff1e6',
    floorColor: '#d8c3a5',
    hotspots: [
      { id: 'cup', word: 'cup', korean: '컵', ipa: '/kʌp/', example: 'This is a cup.', exampleKo: '이건 컵이에요.', color: '#ffffff', position: [-0.25, 0.7, 0.15] },
      { id: 'table', word: 'table', korean: '테이블', ipa: '/ˈteɪbəl/', example: 'Sit at the table.', exampleKo: '테이블에 앉으세요.', color: '#8d6e63', position: [0, 0, 0] },
      { id: 'menu', word: 'menu', korean: '메뉴', ipa: '/ˈmɛnjuː/', example: 'Read the menu.', exampleKo: '메뉴를 읽어보세요.', color: '#e9c46a', position: [0.28, 0.7, 0.2] },
      { id: 'juice', word: 'juice', korean: '주스', ipa: '/dʒuːs/', example: 'I want juice.', exampleKo: '저는 주스를 마시고 싶어요.', color: '#ff9f1c', position: [0.15, 0.7, -0.25] },
      { id: 'cake', word: 'cake', korean: '케이크', ipa: '/keɪk/', example: 'The cake is sweet.', exampleKo: '케이크는 달아요.', color: '#f4a261', position: [-0.2, 0.7, -0.2] },
    ],
  },
  {
    id: 'checkin',
    title: 'Check-in Counter',
    titleKo: '체크인 카운터',
    bgColor: '#eef2ff',
    floorColor: '#c9ccd1',
    hotspots: [
      { id: 'ticket', word: 'ticket', korean: '티켓', ipa: '/ˈtɪkɪt/', example: 'Here is my ticket.', exampleKo: '여기 제 티켓이에요.', color: '#118ab2', position: [-0.6, 0.98, -0.5] },
      { id: 'counter', word: 'counter', korean: '카운터', ipa: '/ˈkaʊntər/', example: 'Go to the counter.', exampleKo: '카운터로 가세요.', color: '#495057', position: [0, 0, -0.5] },
      { id: 'luggage', word: 'luggage', korean: '짐', ipa: '/ˈlʌɡɪdʒ/', example: 'Put your luggage here.', exampleKo: '짐을 여기에 놓으세요.', color: '#e76f51', position: [-1.6, 0, 0.9] },
      { id: 'boardingpass', word: 'boarding pass', korean: '탑승권', ipa: '/ˈbɔːrdɪŋ pæs/', example: 'I need a boarding pass.', exampleKo: '탑승권이 필요해요.', color: '#06d6a0', position: [0.3, 0.98, -0.55] },
      { id: 'scale', word: 'scale', korean: '저울', ipa: '/skeɪl/', example: 'Put the bag on the scale.', exampleKo: '가방을 저울에 올려주세요.', color: '#ffd166', position: [1.4, 0, 0.6] },
    ],
  },
];
