import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously, 
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

// 공백/탭(%09) 문자 완전 제거 함수
const cleanStr = (str) => (str || '').replace(/\s+/g, '').trim();

const rawApiKey = import.meta.env?.VITE_FIREBASE_API_KEY || "AIzaSyBTbZ0KejfFqsYihBExeKJP972fbXMa-RA";
const rawAuthDomain = import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "korean-33cd2.firebaseapp.com";
const rawProjectId = import.meta.env?.VITE_FIREBASE_PROJECT_ID || "korean-33cd2";
const rawStorageBucket = import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "korean-33cd2.firebasestorage.app";
const rawMessagingId = import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "1089232242314";
const rawAppId = import.meta.env?.VITE_FIREBASE_APP_ID || "1:1089232242314:web:f1a5d18328c31e799f0f73";

// Firebase 키 설정 (공백 및 탭 문자 제거 정제)
const firebaseConfig = {
  apiKey: cleanStr(rawApiKey),
  authDomain: cleanStr(rawAuthDomain),
  projectId: cleanStr(rawProjectId),
  storageBucket: cleanStr(rawStorageBucket),
  messagingSenderId: cleanStr(rawMessagingId),
  appId: cleanStr(rawAppId)
};

let app = null;
let auth = null;
let db = null;
let isFirebaseReady = false;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  isFirebaseReady = true;
  console.log("🔥 Firebase 연결 완료 (공백 정제됨)!");
} catch (err) {
  console.warn("⚠️ Firebase 초기화 에러:", err);
}

// 1. Google 로그인
export async function loginWithGoogle() {
  if (!isFirebaseReady || !auth) {
    throw new Error("Firebase 인증 서비스에 연결할 수 없습니다.");
  }
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err) {
    console.error("Google Auth Detailed Error:", err);
    if (err.code === 'auth/popup-closed-by-user') {
      throw new Error("로그인 창이 닫혔습니다. 다시 구글 로그인 버튼을 눌러주세요.");
    }
    if (err.code === 'auth/unauthorized-domain') {
      throw new Error("도메인이 미승인되었습니다. Firebase 콘솔에 현재 사이트 주소가 등록되었는지 확인해주세요.");
    }
    throw new Error(err.message || "구글 로그인 중 문제가 발생했습니다.");
  }
}

// 2. 익명 로그인
export async function loginAnonymously() {
  if (!isFirebaseReady || !auth) {
    return {
      uid: 'guest_' + Date.now(),
      displayName: '익명 모험가',
      isAnonymous: true
    };
  }
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (e) {
    return {
      uid: 'guest_' + Date.now(),
      displayName: '익명 모험가',
      isAnonymous: true
    };
  }
}

// 3. 로그아웃
export async function logoutUser() {
  if (isFirebaseReady && auth) {
    await signOut(auth);
  }
}

// 4. 인증 상태 감지
export function subscribeAuthState(callback) {
  if (isFirebaseReady && auth) {
    return onAuthStateChanged(auth, callback);
  } else {
    callback(null);
    return () => {};
  }
}

// 5. 명예의 전당 랭킹 등록
export async function saveBossRecordToLeaderboard(recordData) {
  if (isFirebaseReady && db) {
    try {
      await addDoc(collection(db, 'hallOfFame'), {
        ...recordData,
        createdAt: serverTimestamp()
      });
      console.log("🔥 Firestore 명예의 전당 저장 완료!");
    } catch (e) {
      console.error("Firestore 저장 에러, LocalStorage에 저장함:", e);
      saveRecordToLocalStorage(recordData);
    }
  } else {
    saveRecordToLocalStorage(recordData);
  }
}

// 6. 명예의 전당 랭킹 조회
export async function getLeaderboardRecords() {
  if (isFirebaseReady && db) {
    try {
      const q = query(
        collection(db, 'hallOfFame'),
        orderBy('score', 'desc'),
        orderBy('timeSec', 'asc'),
        limit(20)
      );
      const snapshot = await getDocs(q);
      const records = [];
      snapshot.forEach(doc => {
        records.push({ id: doc.id, ...doc.data() });
      });
      if (records.length > 0) return records;
    } catch (e) {
      console.warn("Firestore 조회 실패 (LocalStorage 로드):", e);
    }
  }
  return getRecordsFromLocalStorage();
}

function saveRecordToLocalStorage(record) {
  const localList = JSON.parse(localStorage.getItem('hangul_hall_of_fame') || '[]');
  localList.push({
    ...record,
    id: 'local_' + Date.now()
  });
  localList.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.timeSec - b.timeSec;
  });
  localStorage.setItem('hangul_hall_of_fame', JSON.stringify(localList.slice(0, 30)));
}

function getRecordsFromLocalStorage() {
  const localList = JSON.parse(localStorage.getItem('hangul_hall_of_fame') || '[]');
  if (localList.length === 0) {
    const dummyList = [
      { name: '한글대장 뽀로로', avatar: '🦁', timeSec: 24.5, score: 10, totalGold: 850, gameClearCount: 15, date: '2026-08-02' },
      { name: '세종대왕 후예', avatar: '🐯', timeSec: 28.2, score: 10, totalGold: 600, gameClearCount: 10, date: '2026-08-02' },
      { name: '글자왕 루피', avatar: '🐰', timeSec: 35.0, score: 9, totalGold: 450, gameClearCount: 8, date: '2026-08-02' }
    ];
    localStorage.setItem('hangul_hall_of_fame', JSON.stringify(dummyList));
    return dummyList;
  }
  return localList;
}

export { isFirebaseReady };
