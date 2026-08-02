# 🎮 한글 모험단 (Hangul Adventure)
> **초등 1~2학년 대상 한글 게이미피케이션 학습 웹 애플리케이션**

글자를 이해하고 만들어보는 **미니게임 3종**, 골드를 모아 도전하는 **글자 마왕 보스전(10문항)**, 그리고 기록과 골드/클리어 횟수를 자랑하는 **Firebase 명예의 전당** 시스템이 적용되어 있습니다.

---

## 🌟 주요 기능
1. **게이미피케이션 미니게임 3종**:
   - 🧩 **글자 조립소**: 자음(초성) + 모음(중성) 카드 조합
   - 🛡️ **받침 구출작전**: 단어 내 받침 및 올바른 글자 선택
   - 🎈 **단어 풍선 팡팡**: Floating 풍선을 터뜨려 어휘 완성
2. **골드 & 보스 도전 시스템**:
   - 미니게임 성공 시마다 골드(50~60 Gold) 및 미니게임 클리어 카운트 획득
   - 100 Gold 소비 후 **글자 마왕 보스전** (10문항 종합 테스트) 진입
   - 퀴즈 정답 시 보스 피격 애니메이션 및 0.01초 단위 실시간 스피드 측정
3. **Firebase & LocalStorage 명예의 전당 (Leaderboard)**:
   - Google 계정 로그인 또는 게스트 익명 로그인 지원
   - 보스 클리어 소요 시간, 퀴즈 정답 수(10문제 중), 모은 총 골드, 미니게임 클리어 횟수를 실시간 저장 및 랭킹 정렬
   - 1, 2, 3위 🥇 🥈 🥉 금/은/동 칭호 뱃지 부여
4. **오디오 & 이펙트**:
   - Web Audio API 기반 레트로 효과음 (버튼음, 정답음, 골드 소리, 팡파레)
   - 폭죽 축하 효과 (`canvas-confetti`)

---

## 🚀 빠른 시작 (Local Run)

```bash
# 1. 패키지 설치
npm install

# 2. 로컬 개발 서버 구동
npm run dev
```

브라우저에서 `http://localhost:3000` 접속 후 플레이하실 수 있습니다.

---

## 📦 Firebase 설정 가이드 (Google 로그인 & 명예의 전당)

본 앱은 Firebase 설정이 없어도 **LocalStorage 모드로 100% 자동 동작**하지만, 팀/학급 플레이 및 구글 로그인을 위해 Firebase를 연결하려면 아래 단계를 진행하세요.

1. [Firebase Console](https://console.firebase.google.com/) 접속 후 새 프로젝트 생성
2. **Authentication (인증)** 활성화:
   - 로그인 방법: `Google` 및 `익명 (Anonymous)` 로그인 사용 설정
3. **Firestore Database (데이터베이스)** 생성:
   - 데이터베이스 만들기 -> 테스트 모드로 시작 -> 위치 선택 후 완료
4. **웹 앱 등록 및 환경변수 설정**:
   - 프로젝트 설정에서 웹 앱 생성 후 제공되는 `firebaseConfig` 값을 프로젝트 루트의 `.env` 파일로 작성하세요.

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 🐙 GitHub 업로드 방법

```bash
git init
git add .
git commit -m "feat: Initial commit for Hangul Adventure Web App"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/hangul-adventure.git
git push -u origin main
```

---

## ⚡ Vercel 배포 방법 (원클릭 배포)

1. [Vercel](https://vercel.com) 로그인 후 **"Add New" -> "Project"** 선택
2. 위에서 푸시한 **GitHub 저장소 (hangul-adventure)** 선택
3. Framework Preset: **Vite** 선택
4. **Environment Variables** 세션에 `.env`에 있던 Firebase 키값들을 동일하게 입력
5. **Deploy** 버튼 클릭! (약 30초 내에 글로벌 URL 배포 완료 🎉)

---

## 🛠️ 기술 스택
- **Front-end**: HTML5, Modern CSS (3D Toy Design & Glassmorphism), Vanilla ES6+ JS, Vite
- **Backend & Auth**: Firebase Authentication (Google & Anonymous), Firestore Database
- **Audio & FX**: Web Audio API, Canvas Confetti
- **Deployment**: Vercel
