import confetti from 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/+esm';
import { sounds } from './sound.js';
import { 
  GAME1_DATA, 
  CONSONANTS, 
  VOWELS, 
  GAME2_DATA, 
  GAME3_DATA, 
  BOSS_QUIZ_POOL 
} from './data.js';
import { 
  loginWithGoogle, 
  loginAnonymously, 
  subscribeAuthState, 
  saveBossRecordToLeaderboard, 
  getLeaderboardRecords 
} from './firebase.js';

// ==========================================
// 애플리케이션 상태 (State)
// ==========================================
const state = {
  profile: {
    name: '한글 모험가',
    avatar: '🦁',
    uid: null,
    isAnonymous: true
  },
  gold: 0,
  clearCount: 0,
  currentScreen: 'screen-home',

  game1: {
    index: 0,
    solvedCount: 0,
    selectedInitial: '',
    selectedVowel: ''
  },

  game2: {
    index: 0,
    solvedCount: 0
  },

  game3: {
    index: 0,
    solvedCount: 0,
    collectedChars: [],
    spawnTimer: null
  },

  boss: {
    active: false,
    quizIndex: 0,
    quizzes: [],
    score: 0,
    startTime: 0,
    timerInterval: null,
    elapsedSec: 0
  }
};

let elements = {};

function initDOMElements() {
  elements = {
    headerAvatar: document.getElementById('headerAvatar'),
    headerName: document.getElementById('headerName'),
    authStatusText: document.getElementById('authStatusText'),
    goldDisplay: document.getElementById('goldDisplay'),
    clearCountDisplay: document.getElementById('clearCountDisplay'),
    
    tabBtns: document.querySelectorAll('.tab-btn'),
    screens: document.querySelectorAll('.screen'),

    playerNameInput: document.getElementById('playerNameInput'),
    avatarOpts: document.querySelectorAll('.avatar-opt'),
    btnStartGame: document.getElementById('btnStartGame'),
    btnGoogleAuth: document.getElementById('btnGoogleAuth'),

    game1ProgressText: document.getElementById('game1ProgressText'),
    game1TargetHint: document.getElementById('game1TargetHint'),
    slotInitial: document.getElementById('slotInitial'),
    slotVowel: document.getElementById('slotVowel'),
    slotResult: document.getElementById('slotResult'),
    consonantGrid: document.getElementById('consonantGrid'),
    vowelGrid: document.getElementById('vowelGrid'),

    game2ProgressText: document.getElementById('game2ProgressText'),
    game2Icon: document.getElementById('game2Icon'),
    game2HintText: document.getElementById('game2HintText'),
    game2WordDisplay: document.getElementById('game2WordDisplay'),
    game2OptionsRow: document.getElementById('game2OptionsRow'),

    game3ProgressText: document.getElementById('game3ProgressText'),
    game3Hint: document.getElementById('game3Hint'),
    game3TargetWord: document.getElementById('game3TargetWord'),
    game3Progress: document.getElementById('game3Progress'),
    balloonStage: document.getElementById('balloonStage'),

    bossHpFill: document.getElementById('bossHpFill'),
    bossTimerText: document.getElementById('bossTimerText'),
    bossAvatar: document.getElementById('bossAvatar'),
    bossProgress: document.getElementById('bossProgress'),
    bossQuestion: document.getElementById('bossQuestion'),
    bossOptions: document.getElementById('bossOptions'),

    leaderboardBody: document.getElementById('leaderboardBody'),

    modalOverlay: document.getElementById('modalOverlay'),
    modalIcon: document.getElementById('modalIcon'),
    modalTitle: document.getElementById('modalTitle'),
    modalBody: document.getElementById('modalBody'),
    modalCloseBtn: document.getElementById('modalCloseBtn')
  };
}

function initApp() {
  initDOMElements();
  updateUIStats();

  elements.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sounds.playClick();
      const targetScreen = btn.dataset.target;

      if (targetScreen === 'screen-boss' && !state.boss.active) {
        if (state.gold < 100) {
          showModal('👿 보스전 도전 불가!', '보스전에 도전하려면 100 골드가 필요해요! 미니게임을 먼저 클리어해 골드를 모아오세요.', '🪙');
          return;
        } else {
          confirmBossChallenge();
          return;
        }
      }

      switchScreen(targetScreen);
    });
  });

  elements.avatarOpts.forEach(opt => {
    opt.addEventListener('click', () => {
      sounds.playClick();
      elements.avatarOpts.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      state.profile.avatar = opt.dataset.avatar;
      elements.headerAvatar.textContent = state.profile.avatar;
    });
  });

  elements.playerNameInput.addEventListener('input', (e) => {
    state.profile.name = e.target.value.trim() || '한글 모험가';
    elements.headerName.textContent = state.profile.name;
  });

  elements.btnStartGame.addEventListener('click', () => {
    sounds.playClick();
    loginAnonymously().then(user => {
      if (user) {
        state.profile.uid = user.uid;
      }
    });
    switchScreen('screen-game1');
  });

  // 구글 로그인 처리 (정확한 유저 프로필 반영)
  elements.btnGoogleAuth.addEventListener('click', async () => {
    sounds.playClick();
    try {
      const user = await loginWithGoogle();
      if (user) {
        state.profile.name = user.displayName || '구글 모험가';
        state.profile.uid = user.uid;
        state.profile.isAnonymous = false;
        elements.playerNameInput.value = state.profile.name;
        elements.headerName.textContent = state.profile.name;
        elements.authStatusText.textContent = `Google: ${user.email || state.profile.name}`;
        
        showModal('🎉 Google 로그인 성공!', `${state.profile.name} 모험가님 환영합니다! 명예의 전당에 본인 기록이 안전하게 연결됩니다.`, '👑');
      }
    } catch (err) {
      console.warn("Google Auth Warning:", err);
      showModal('로그인 안내', err.message || '구글 로그인 중 문제가 발생했습니다.', 'ℹ️');
    }
  });

  elements.modalCloseBtn.addEventListener('click', () => {
    sounds.playClick();
    elements.modalOverlay.style.display = 'none';
  });

  subscribeAuthState(user => {
    if (user && !user.isAnonymous) {
      state.profile.uid = user.uid;
      state.profile.name = user.displayName || '구글 모험가';
      state.profile.isAnonymous = false;
      elements.headerName.textContent = state.profile.name;
      elements.playerNameInput.value = state.profile.name;
      elements.authStatusText.textContent = `Google: ${user.email || state.profile.name}`;
    }
  });

  initGame1();
}

function switchScreen(screenId) {
  state.currentScreen = screenId;

  if (screenId !== 'screen-game3') {
    clearInterval(state.game3.spawnTimer);
  }

  elements.screens.forEach(s => s.classList.remove('active'));
  elements.tabBtns.forEach(b => {
    if (b.dataset.target === screenId) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });

  const activeScreen = document.getElementById(screenId);
  if (activeScreen) {
    activeScreen.classList.add('active');
  }

  if (screenId === 'screen-game1') initGame1();
  if (screenId === 'screen-game2') initGame2();
  if (screenId === 'screen-game3') initGame3();
  if (screenId === 'screen-rank') loadLeaderboard();
}

function updateUIStats() {
  if (!elements.goldDisplay) return;
  elements.goldDisplay.textContent = state.gold;
  elements.clearCountDisplay.textContent = state.clearCount;

  if (elements.game1ProgressText) elements.game1ProgressText.textContent = `${state.game1.solvedCount} / 5`;
  if (elements.game2ProgressText) elements.game2ProgressText.textContent = `${state.game2.solvedCount} / 5`;
  if (elements.game3ProgressText) elements.game3ProgressText.textContent = `${state.game3.solvedCount} / 5`;
}

function showModal(title, message, icon = '🎉') {
  elements.modalTitle.textContent = title;
  elements.modalBody.textContent = message;
  elements.modalIcon.textContent = icon;
  elements.modalOverlay.style.display = 'flex';
}

function fireConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  } catch (e) {
    console.log("Confetti effect triggered");
  }
}

function getLimitedOptions(correctItem, fullPool, count = 4) {
  const others = fullPool.filter(x => x !== correctItem);
  const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, count - 1);
  return [...shuffledOthers, correctItem].sort(() => 0.5 - Math.random());
}

// [미니게임 1]
function initGame1() {
  const item = GAME1_DATA[state.game1.index % GAME1_DATA.length];
  state.game1.selectedInitial = '';
  state.game1.selectedVowel = '';

  updateUIStats();
  elements.game1TargetHint.textContent = `목표: "${item.result}" (${item.icon} ${item.word})`;
  elements.slotInitial.textContent = '?';
  elements.slotVowel.textContent = '?';
  elements.slotResult.textContent = '?';

  const consonantChoices = getLimitedOptions(item.initial, CONSONANTS, 4);
  elements.consonantGrid.innerHTML = '';
  consonantChoices.forEach(c => {
    const card = document.createElement('div');
    card.className = 'letter-card';
    card.textContent = c;
    card.addEventListener('click', () => {
      sounds.playClick();
      state.game1.selectedInitial = c;
      elements.slotInitial.textContent = c;
      checkGame1Combine();
    });
    elements.consonantGrid.appendChild(card);
  });

  const vowelChoices = getLimitedOptions(item.vowel, VOWELS, 4);
  elements.vowelGrid.innerHTML = '';
  vowelChoices.forEach(v => {
    const card = document.createElement('div');
    card.className = 'letter-card';
    card.style.borderColor = '#10B981';
    card.style.color = '#047857';
    card.textContent = v;
    card.addEventListener('click', () => {
      sounds.playClick();
      state.game1.selectedVowel = v;
      elements.slotVowel.textContent = v;
      checkGame1Combine();
    });
    elements.vowelGrid.appendChild(card);
  });
}

function checkGame1Combine() {
  const { selectedInitial, selectedVowel } = state.game1;
  if (!selectedInitial || !selectedVowel) return;

  const target = GAME1_DATA[state.game1.index % GAME1_DATA.length];
  
  if (selectedInitial === target.initial && selectedVowel === target.vowel) {
    elements.slotResult.textContent = target.result;
    sounds.playSuccess();

    state.game1.solvedCount += 1;
    updateUIStats();

    if (state.game1.solvedCount >= 5) {
      sounds.playCoin();
      fireConfetti();
      state.gold += 50;
      state.clearCount += 1;
      state.game1.solvedCount = 0;
      updateUIStats();

      setTimeout(() => {
        showModal('🎉 5문제 완공 축하해!', `글자 만들기 5문제를 멋지게 풀어 50 골드를 획득했습니다! (+50 Gold)`, '🪙');
        state.game1.index++;
        initGame1();
      }, 400);
    } else {
      setTimeout(() => {
        state.game1.index++;
        initGame1();
      }, 400);
    }
  } else {
    sounds.playWrong();
  }
}

// [미니게임 2]
function initGame2() {
  const item = GAME2_DATA[state.game2.index % GAME2_DATA.length];
  updateUIStats();

  elements.game2Icon.textContent = item.icon;
  elements.game2HintText.textContent = item.hintText;
  elements.game2WordDisplay.textContent = `${item.prefix} ${item.suffix || '_'}`;

  elements.game2OptionsRow.innerHTML = '';
  item.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      sounds.playClick();
      if (opt === item.target || opt === item.batchim) {
        sounds.playSuccess();
        elements.game2WordDisplay.textContent = item.hintWord;

        state.game2.solvedCount += 1;
        updateUIStats();

        if (state.game2.solvedCount >= 5) {
          sounds.playCoin();
          fireConfetti();
          state.gold += 50;
          state.clearCount += 1;
          state.game2.solvedCount = 0;
          updateUIStats();

          setTimeout(() => {
            showModal('🎉 받침 구출 5문제 완성!', `받침 구출 5문제를 모두 잘 해결했습니다! (+50 Gold)`, '🛡️');
            state.game2.index++;
            initGame2();
          }, 400);
        } else {
          setTimeout(() => {
            state.game2.index++;
            initGame2();
          }, 400);
        }
      } else {
        sounds.playWrong();
      }
    });
    elements.game2OptionsRow.appendChild(btn);
  });
}

// [미니게임 3]
function initGame3() {
  clearInterval(state.game3.spawnTimer);
  const item = GAME3_DATA[state.game3.index % GAME3_DATA.length];
  state.game3.collectedChars = [];
  updateUIStats();

  elements.game3Hint.innerHTML = `[${item.icon}] 힌트: ${item.hint}`;
  elements.game3TargetWord.textContent = item.targetWord;
  updateGame3Progress();

  elements.balloonStage.innerHTML = '';

  state.game3.spawnTimer = setInterval(() => {
    spawnBalloon(item);
  }, 1200);
}

function updateGame3Progress() {
  const item = GAME3_DATA[state.game3.index % GAME3_DATA.length];
  const targetChars = item.targetWord.split('');
  
  let display = '';
  targetChars.forEach((ch, idx) => {
    if (idx < state.game3.collectedChars.length) {
      display += ` <span style="color:#10B981; font-weight:bold; font-size:1.4rem;">[${ch}]</span>`;
    } else {
      display += ` <span style="color:#9CA3AF; font-size:1.4rem;">[ _ ]</span>`;
    }
  });
  elements.game3Progress.innerHTML = `현재 단어 완성: ${display}`;
}

function spawnBalloon(item) {
  if (state.currentScreen !== 'screen-game3') return;

  const balloon = document.createElement('div');
  balloon.className = 'balloon';

  const targetChars = item.targetWord.split('');
  const neededChar = targetChars[state.game3.collectedChars.length];

  let charToShow = '';
  if (Math.random() < 0.6 && neededChar) {
    charToShow = neededChar;
  } else {
    charToShow = item.balloons[Math.floor(Math.random() * item.balloons.length)];
  }

  balloon.textContent = charToShow;

  const leftPercent = Math.floor(Math.random() * 80) + 5;
  balloon.style.left = `${leftPercent}%`;

  const colors = ['#FF6B6B', '#4D96FF', '#6BCB77', '#FFD93D', '#A855F7'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  balloon.style.background = `radial-gradient(circle at 30% 30%, #FFF, ${randomColor})`;

  balloon.addEventListener('click', () => {
    sounds.playPop();
    balloon.remove();

    const currentNeeded = targetChars[state.game3.collectedChars.length];

    if (charToShow === currentNeeded) {
      state.game3.collectedChars.push(charToShow);
      updateGame3Progress();

      if (state.game3.collectedChars.length === targetChars.length) {
        clearInterval(state.game3.spawnTimer);
        sounds.playSuccess();

        state.game3.solvedCount += 1;
        updateUIStats();

        if (state.game3.solvedCount >= 5) {
          sounds.playCoin();
          fireConfetti();
          state.gold += 60;
          state.clearCount += 1;
          state.game3.solvedCount = 0;
          updateUIStats();

          setTimeout(() => {
            showModal('🎉 단어 풍선 5개 터뜨리기 성공!', `5개의 단어를 완성해 60 골드를 모았습니다! (+60 Gold)`, '🎈');
            state.game3.index++;
            initGame3();
          }, 400);
        } else {
          setTimeout(() => {
            state.game3.index++;
            initGame3();
          }, 400);
        }
      }
    } else {
      sounds.playWrong();
    }
  });

  elements.balloonStage.appendChild(balloon);

  setTimeout(() => {
    if (balloon.parentNode) {
      balloon.remove();
    }
  }, 6000);
}

// [보스전]
function confirmBossChallenge() {
  state.gold -= 100;
  updateUIStats();
  sounds.playCoin();

  state.boss.active = true;
  state.boss.quizIndex = 0;
  state.boss.score = 0;
  state.boss.startTime = Date.now();

  state.boss.quizzes = [...BOSS_QUIZ_POOL].sort(() => 0.5 - Math.random()).slice(0, 10);

  switchScreen('screen-boss');
  startBossTimer();
  renderBossQuiz();
}

function startBossTimer() {
  clearInterval(state.boss.timerInterval);
  state.boss.timerInterval = setInterval(() => {
    const elapsedMs = Date.now() - state.boss.startTime;
    state.boss.elapsedSec = (elapsedMs / 1000).toFixed(2);
    elements.bossTimerText.textContent = `⏱️ ${state.boss.elapsedSec}초`;
  }, 50);
}

function renderBossQuiz() {
  const quizIndex = state.boss.quizIndex;
  if (quizIndex >= 10) {
    finishBossChallenge();
    return;
  }

  const remainingHp = 100 - (quizIndex * 10);
  elements.bossHpFill.style.width = `${remainingHp}%`;

  elements.bossProgress.textContent = `문제 ${quizIndex + 1} / 10`;

  const quiz = state.boss.quizzes[quizIndex];
  elements.bossQuestion.textContent = quiz.question;

  elements.bossOptions.innerHTML = '';
  quiz.options.forEach((optText, optIdx) => {
    const btn = document.createElement('button');
    btn.className = 'boss-opt-btn';
    btn.textContent = `${optIdx + 1}. ${optText}`;
    btn.addEventListener('click', () => {
      sounds.playClick();
      handleBossAnswer(optIdx === quiz.answer);
    });
    elements.bossOptions.appendChild(btn);
  });
}

function handleBossAnswer(isCorrect) {
  if (isCorrect) {
    state.boss.score += 1;
    sounds.playSuccess();
    elements.bossAvatar.classList.add('hit');
    setTimeout(() => elements.bossAvatar.classList.remove('hit'), 300);
  } else {
    sounds.playWrong();
  }

  state.boss.quizIndex += 1;
  renderBossQuiz();
}

async function finishBossChallenge() {
  clearInterval(state.boss.timerInterval);
  state.boss.active = false;
  elements.bossHpFill.style.width = '0%';

  sounds.playFanfare();
  fireConfetti();

  const finalTime = parseFloat(state.boss.elapsedSec);
  const finalScore = state.boss.score;

  const record = {
    name: state.profile.name,
    avatar: state.profile.avatar,
    timeSec: finalTime,
    score: finalScore,
    totalGold: state.gold,
    gameClearCount: state.clearCount,
    date: new Date().toLocaleDateString('ko-KR')
  };

  await saveBossRecordToLeaderboard(record);

  showModal(
    '😈 글자 마왕 퇴치 성공!',
    `결과: 10문제 중 ${finalScore}문제 정답! (소요 시간: ${finalTime}초)\n기록이 명예의 전당에 올라갔습니다!`,
    '👑'
  );

  setTimeout(() => {
    switchScreen('screen-rank');
  }, 1000);
}

// [명예의 전당]
async function loadLeaderboard() {
  elements.leaderboardBody.innerHTML = '<tr><td colspan="6">🏆 명예의 전당 기록 불러오는 중...</td></tr>';

  try {
    const records = await getLeaderboardRecords();
    elements.leaderboardBody.innerHTML = '';

    records.forEach((rec, idx) => {
      const tr = document.createElement('tr');

      let rankDisplay = `${idx + 1}위`;
      if (idx === 0) rankDisplay = '🥇 1위';
      if (idx === 1) rankDisplay = '🥈 2위';
      if (idx === 2) rankDisplay = '🥉 3위';

      tr.innerHTML = `
        <td class="rank-badge">${rankDisplay}</td>
        <td style="font-weight:bold;">${rec.avatar || '🦁'} ${rec.name || '모험가'}</td>
        <td style="color:#DC2626; font-weight:bold;">⏱️ ${rec.timeSec}초</td>
        <td style="color:#059669; font-weight:bold;">🎯 ${rec.score} / 10</td>
        <td style="color:#D97706;">🪙 ${rec.totalGold || 0} Gold</td>
        <td>⭐ ${rec.gameClearCount || 0}회</td>
      `;
      elements.leaderboardBody.appendChild(tr);
    });
  } catch (err) {
    elements.leaderboardBody.innerHTML = '<tr><td colspan="6">랭킹 로드 실패</td></tr>';
  }
}

window.addEventListener('DOMContentLoaded', initApp);
