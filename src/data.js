// 한글 학습 데이터셋 (초등 1~2학년 맞춤)

// 1. 미니게임 1: 글자 조합 데이터 (초성 자음 + 중성 모음)
export const GAME1_DATA = [
  { initial: 'ㄱ', vowel: 'ㅏ', result: '가', word: '가방', icon: '🎒' },
  { initial: 'ㄴ', vowel: 'ㅓ', result: '너', word: '너구리', icon: '🦝' },
  { initial: 'ㄷ', vowel: 'ㅗ', result: '도', word: '도토리', icon: '🐿️' },
  { initial: 'ㄹ', vowel: 'ㅜ', result: '루', word: '루돌프', icon: '🦌' },
  { initial: 'ㅁ', vowel: 'ㅣ', result: '미', word: '미끄럼틀', icon: '🛝' },
  { initial: 'ㅂ', vowel: 'ㅐ', result: '배', word: '배나무', icon: '🍐' },
  { initial: 'ㅅ', vowel: 'ㅗ', result: '소', word: '송아지', icon: '🐮' },
  { initial: 'ㅇ', vowel: 'ㅕ', result: '여', word: '여우', icon: '🦊' },
  { initial: 'ㅈ', vowel: 'ㅡ', result: '즈', word: '치즈', icon: '🧀' },
  { initial: 'ㅊ', vowel: 'ㅠ', result: '츄', word: '츄파춥스', icon: '🍭' },
  { initial: 'ㅋ', vowel: 'ㅣ', result: '키', word: '키위', icon: '🥝' },
  { initial: 'ㅌ', vowel: 'ㅗ', result: '토', word: '토끼', icon: '🐰' },
  { initial: 'ㅍ', vowel: 'ㅏ', result: '파', word: '파인애플', icon: '🍍' },
  { initial: 'ㅎ', vowel: 'ㅏ', result: '하', word: '하마', icon: '🦛' }
];

// 자음 & 모음 풀
export const CONSONANTS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
export const VOWELS = ['ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ', 'ㅐ', 'ㅔ'];

// 2. 미니게임 2: 받침 구출작전 데이터
export const GAME2_DATA = [
  {
    prefix: '고양',
    suffix: '',
    target: '이',
    options: ['이', '입', '일'],
    hintWord: '고양이',
    icon: '🐱',
    hintText: '야옹~ 귀여운 동물이에요!'
  },
  {
    prefix: '딸',
    suffix: '',
    target: '기',
    options: ['기', '길', '김'],
    hintWord: '딸기',
    icon: '🍓',
    hintText: '상큼하고 빨간 과일이에요!'
  },
  {
    prefix: '호랑',
    suffix: '',
    target: '이',
    options: ['이', '인', '임'],
    hintWord: '호랑이',
    icon: '🐯',
    hintText: '어흥! 숲속의 왕이에요!'
  },
  {
    prefix: '바',
    suffix: '람',
    target: '람',
    batchim: 'ㅁ',
    options: ['ㅁ', 'ㄴ', 'ㅇ'],
    hintWord: '바람',
    icon: '🌬️',
    hintText: '시원하게 불어오는 바람!'
  },
  {
    prefix: '공',
    suffix: '룡',
    target: '룡',
    batchim: 'ㅇ',
    options: ['ㅇ', 'ㄱ', 'ㄴ'],
    hintWord: '공룡',
    icon: '🦖',
    hintText: '옛날 지구에 살던 커다란 공룡!'
  },
  {
    prefix: '비행',
    suffix: '기',
    target: '기',
    options: ['기', '김', '길'],
    hintWord: '비행기',
    icon: '✈️',
    hintText: '하늘을 훨훨 날아다녀요!'
  },
  {
    prefix: '수',
    suffix: '박',
    target: '박',
    batchim: 'ㄱ',
    options: ['ㄱ', 'ㄴ', 'ㄹ'],
    hintWord: '수박',
    icon: '🍉',
    hintText: '여름에 먹는 달콤하고 시원한 수박!'
  },
  {
    prefix: '장난',
    suffix: '감',
    target: '감',
    batchim: 'ㅁ',
    options: ['ㅁ', 'ㅂ', 'ㅇ'],
    hintWord: '장난감',
    icon: '🧸',
    hintText: '재밌게 가지고 놀아요!'
  }
];

// 받침 목록
export const BATCHIMS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅇ'];

// 3. 미니게임 3: 단어 풍선 팡팡 데이터
export const GAME3_DATA = [
  {
    targetWord: '사과',
    icon: '🍎',
    hint: '새콤달콤 빨간 사과',
    balloons: ['사', '과', '바', '나', '나', '포', '도']
  },
  {
    targetWord: '자전거',
    icon: '🚲',
    hint: '두 바퀴로 신나게 달려요',
    balloons: ['자', '전', '거', '차', '구', '름', '달']
  },
  {
    targetWord: '해바라기',
    icon: '🌻',
    hint: '해를 닮은 노란 꽃',
    balloons: ['해', '바', '라', '기', '장', '미', '풀']
  },
  {
    targetWord: '무지개',
    icon: '🌈',
    hint: '비 온 뒤 하늘에 뜨는 일곱 색깔',
    balloons: ['무', '지', '개', '구', '름', '비', '눈']
  },
  {
    targetWord: '우주선',
    icon: '🚀',
    hint: '별나라 우주로 날아가는 배',
    balloons: ['우', '주', '선', '별', '달', '해', '지']
  }
];

// 4. 보스전 퀴즈 풀 (10문항 종합 테스트)
export const BOSS_QUIZ_POOL = [
  {
    question: "'ㄱ'과 'ㅏ'가 만나면 만들어지는 글자는?",
    options: ['가', '나', '다', '라'],
    answer: 0,
    type: 'combine'
  },
  {
    question: "'호랑이'에서 어흥! 왕인 동물의 마지막 글자는?",
    options: ['어', '이', '아', '우'],
    answer: 1,
    type: 'word'
  },
  {
    question: "'수박'의 '박'에 들어가는 받침은 무엇일까요?",
    options: ['ㄴ', 'ㄹ', 'ㄱ', 'ㅁ'],
    answer: 2,
    type: 'batchim'
  },
  {
    question: "'ㄴ'과 'ㅓ'가 합쳐지면 무슨 글자일까요?",
    options: ['너', '노', '누', '니'],
    answer: 0,
    type: 'combine'
  },
  {
    question: "그림 [🍎]에 어울리는 올바른 단어는?",
    options: ['포도', '사과', '바나나', '수박'],
    answer: 1,
    type: 'word'
  },
  {
    question: "'공룡'에서 '공'에 사용된 받침은 무엇일까요?",
    options: ['ㅇ', 'ㄴ', 'ㅁ', 'ㅂ'],
    answer: 0,
    type: 'batchim'
  },
  {
    question: "'ㄷ'과 'ㅗ'가 모이면 어떤 글자가 될까요?",
    options: ['다', '더', '도', '두'],
    answer: 2,
    type: 'combine'
  },
  {
    question: "'바람'의 '람'에 들어가 시원한 바람을 만드는 받침은?",
    options: ['ㅁ', 'ㄱ', 'ㄴ', 'ㅇ'],
    answer: 0,
    type: 'batchim'
  },
  {
    question: "하늘을 날아다니는 [✈️]의 올바른 이름은?",
    options: ['자동차', '비행기', '자전거', '기차'],
    answer: 1,
    type: 'word'
  },
  {
    question: "'ㅎ'과 'ㅏ'가 합체하면 시원하게 웃는 어떤 글자가 될까요?",
    options: ['하', '허', '호', '후'],
    answer: 0,
    type: 'combine'
  },
  {
    question: "'딸기'에서 '딸'에 쓰인 받침은 무엇일까요?",
    options: ['ㄱ', 'ㄴ', 'ㄹ', 'ㅇ'],
    answer: 2,
    type: 'batchim'
  },
  {
    question: "비 온 뒤 하늘에 뜨는 아름다운 7색깔 [🌈]의 이름은?",
    options: ['구름', '무지개', '번개', '태양'],
    answer: 1,
    type: 'word'
  }
];
