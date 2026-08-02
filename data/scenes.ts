export type Shape = 'box' | 'cylinder' | 'sphere' | 'cone';

export interface Hotspot {
  id: string;
  word: string;
  korean: string;
  ipa: string;
  example: string;
  shape: Shape;
  color: string; // hex
  position: [number, number, number];
  size: [number, number, number]; // width/radius, height, depth
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
      { id: 'desk', word: 'desk', korean: '책상', ipa: '/dɛsk/', example: 'This is my desk.', shape: 'box', color: '#a0714a', position: [-2, 0.4, 0], size: [1.4, 0.8, 0.8] },
      { id: 'chair', word: 'chair', korean: '의자', ipa: '/tʃɛr/', example: 'Sit on the chair.', shape: 'box', color: '#6b4a2b', position: [-2, 0.9, 1], size: [0.6, 0.9, 0.6] },
      { id: 'book', word: 'book', korean: '책', ipa: '/bʊk/', example: 'Open your book.', shape: 'box', color: '#e63946', position: [-1.6, 0.85, -0.1], size: [0.4, 0.08, 0.3] },
      { id: 'pencil', word: 'pencil', korean: '연필', ipa: '/ˈpɛnsəl/', example: 'I have a pencil.', shape: 'cylinder', color: '#ffb703', position: [-1, 0.85, 0.1], size: [0.05, 0.5, 0.05] },
      { id: 'blackboard', word: 'blackboard', korean: '칠판', ipa: '/ˈblækbɔːrd/', example: 'Look at the blackboard.', shape: 'box', color: '#1d3557', position: [0, 1.6, -2.2], size: [3, 1.6, 0.1] },
      { id: 'backpack', word: 'backpack', korean: '책가방', ipa: '/ˈbækpæk/', example: 'Pack your backpack.', shape: 'box', color: '#2a9d8f', position: [1.5, 0.5, 1.2], size: [0.6, 0.8, 0.4] },
    ],
  },
  {
    id: 'airport',
    title: 'Airport',
    titleKo: '공항',
    bgColor: '#e0f2fe',
    floorColor: '#b6bec7',
    hotspots: [
      { id: 'airplane', word: 'airplane', korean: '비행기', ipa: '/ˈɛrpleɪn/', example: 'The airplane is big.', shape: 'cone', color: '#ffffff', position: [-1.5, 1, -1], size: [0.8, 2.2, 0.8] },
      { id: 'gate', word: 'gate', korean: '탑승구', ipa: '/ɡeɪt/', example: 'Go to gate five.', shape: 'box', color: '#457b9d', position: [1.8, 1, -1.5], size: [0.2, 2, 1.2] },
      { id: 'suitcase', word: 'suitcase', korean: '여행 가방', ipa: '/ˈsuːtkeɪs/', example: 'Carry your suitcase.', shape: 'box', color: '#e76f51', position: [0.5, 0.4, 1.2], size: [0.6, 0.8, 0.3] },
      { id: 'passport', word: 'passport', korean: '여권', ipa: '/ˈpæspɔːrt/', example: 'Show your passport.', shape: 'box', color: '#2a9d8f', position: [-0.5, 0.85, 1.3], size: [0.3, 0.05, 0.4] },
      { id: 'runway', word: 'runway', korean: '활주로', ipa: '/ˈrʌnweɪ/', example: 'The plane is on the runway.', shape: 'box', color: '#495057', position: [-1.5, 0.02, -2.5], size: [1.2, 0.04, 3] },
    ],
  },
  {
    id: 'cafe',
    title: 'Cafe',
    titleKo: '카페',
    bgColor: '#fff1e6',
    floorColor: '#d8c3a5',
    hotspots: [
      { id: 'cup', word: 'cup', korean: '컵', ipa: '/kʌp/', example: 'This is a cup.', shape: 'cylinder', color: '#ffffff', position: [-0.6, 0.9, 0], size: [0.18, 0.25, 0.18] },
      { id: 'table', word: 'table', korean: '테이블', ipa: '/ˈteɪbəl/', example: 'Sit at the table.', shape: 'cylinder', color: '#8d6e63', position: [0, 0.4, 0], size: [1, 0.1, 1] },
      { id: 'menu', word: 'menu', korean: '메뉴', ipa: '/ˈmɛnjuː/', example: 'Read the menu.', shape: 'box', color: '#e9c46a', position: [0.5, 0.85, 0.3], size: [0.3, 0.02, 0.4] },
      { id: 'juice', word: 'juice', korean: '주스', ipa: '/dʒuːs/', example: 'I want juice.', shape: 'cylinder', color: '#ff9f1c', position: [0.3, 0.9, -0.3], size: [0.15, 0.28, 0.15] },
      { id: 'cake', word: 'cake', korean: '케이크', ipa: '/keɪk/', example: 'The cake is sweet.', shape: 'cylinder', color: '#f4a261', position: [-0.2, 0.88, 0.2], size: [0.2, 0.15, 0.2] },
    ],
  },
  {
    id: 'checkin',
    title: 'Check-in Counter',
    titleKo: '체크인 카운터',
    bgColor: '#eef2ff',
    floorColor: '#c9ccd1',
    hotspots: [
      { id: 'ticket', word: 'ticket', korean: '티켓', ipa: '/ˈtɪkɪt/', example: 'Here is my ticket.', shape: 'box', color: '#118ab2', position: [-0.8, 0.95, 0.3], size: [0.25, 0.02, 0.12] },
      { id: 'counter', word: 'counter', korean: '카운터', ipa: '/ˈkaʊntər/', example: 'Go to the counter.', shape: 'box', color: '#495057', position: [0, 0.5, -0.5], size: [2.4, 1, 0.6] },
      { id: 'luggage', word: 'luggage', korean: '짐', ipa: '/ˈlʌɡɪdʒ/', example: 'Put your luggage here.', shape: 'box', color: '#e76f51', position: [1, 0.35, 0.8], size: [0.5, 0.7, 0.35] },
      { id: 'boardingpass', word: 'boarding pass', korean: '탑승권', ipa: '/ˈbɔːrdɪŋ pæs/', example: 'I need a boarding pass.', shape: 'box', color: '#06d6a0', position: [-0.2, 0.92, -0.2], size: [0.22, 0.02, 0.1] },
      { id: 'scale', word: 'scale', korean: '저울', ipa: '/skeɪl/', example: 'Put the bag on the scale.', shape: 'cylinder', color: '#ffd166', position: [0.6, 0.42, -0.4], size: [0.3, 0.06, 0.3] },
    ],
  },
];
