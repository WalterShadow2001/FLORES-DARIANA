/* ─── DATA ─── */
const PHOTOS = [
  'img/photo1.jpg',
  'img/photo2.jpg',
  'img/photo3.jpg',
  'img/photo4.jpg',
  'img/photo5.jpg',
  'img/photo6.jpg',
  'img/photo7.jpg'
];

const TRACKS = [
  { title: 'Eres Mi Religión — Maná',                   src: 'audio/eres-mi-religion.mp3' },
  { title: 'Bendita Tu Luz — Maná ft. Juan Luis Guerra', src: 'audio/bendita-tu-luz.mp3' },
  { title: 'Aunque No Sea Conmigo — Bunbury',               src: 'audio/Aunque no sea con migo - Bunbury.mp3' },
  { title: 'Contigo - Elefate',                                    src: 'audio/Contigo - Elefante' },
  { title: "I Was Made For Lovin' You — KISS",           src: 'audio/kiss-i-was-made-for-lovin-you.mp3' },
  { title: 'Wind of Change — Scorpions',                 src: 'audio/wind-of-change.mp3' },
];

/* ── STARS ── */
const starsDiv = document.getElementById('stars');
for (let i = 0; i < 55; i++) {
  const s = document.createElement('div');
  s.className = 'star';
  const sz = Math.random() * 2.5 + 0.5;
  s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;`
    + `width:${sz}px;height:${sz}px;`
    + `animation-delay:${Math.random()*6}s;animation-duration:${2+Math.random()*4}s;`;
  starsDiv.appendChild(s);
}

/* ── FIREFLIES ── */
const fliesDiv = document.getElementById('flies');
for (let i = 0; i < 9; i++) {
  const f = document.createElement('div');
  f.className = 'fly';
  const x = Math.random()*100, y = Math.random()*100;
  const dx = (Math.random()-0.5)*30, dy = (Math.random()-0.5)*30;
  const dur = 4 + Math.random()*6;
  f.style.cssText = `left:${x}%;top:${y}%;`
    + `--dx:${dx}vw;--dy:${dy}vh;`
    + `animation-duration:${dur}s;animation-delay:${Math.random()*dur}s;`;
  fliesDiv.appendChild(f);
}

/* ── CUSTOM CURSOR ── */
const cur = document.createElement('div');
cur.id = 'cursor';
document.body.appendChild(cur);
document.addEventListener('mousemove', e => {
  cur.style.left = e.clientX + 'px';
  cur.style.top  = e.clientY + 'px';
});

/* ── CURSOR SPARKLES ── */
document.addEventListener('mousemove', e => {
  if (Math.random() > 0.25) return;
  const sp = document.createElement('div');
  sp.className = 'sparkle';
  sp.style.left = e.clientX + 'px';
  sp.style.top  = e.clientY + 'px';
  document.body.appendChild(sp);
  setTimeout(() => sp.remove(), 700);
});

/* ── PHOTOS ── */
(function loadPhotos() {
  const all = [...PHOTOS];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  document.getElementById('img-left').src  = all[0] || '';
  document.getElementById('img-right').src = all[1] || all[0] || '';
  setTimeout(() => {
    const pl = document.getElementById('ph-left');
    const pr = document.getElementById('ph-right');
    pl.style.transition = 'opacity 2s ease';
    pl.style.opacity = '1';
    pr.style.transition = 'opacity 2s ease';
    pr.style.opacity = '1';
  }, 700);
})();

/* ── AUDIO PLAYER ── */
(function initPlayer() {
  const audio      = document.getElementById('audio');
  const btnPlay    = document.getElementById('btn-play');
  const btnPrev    = document.getElementById('btn-prev');
  const btnNext    = document.getElementById('btn-next');
  const trackTitle = document.getElementById('track-title');
  const progFill   = document.getElementById('prog-fill');
  const progBar    = document.getElementById('prog-bar');

  let idx = 0;

  function loadTrack(i) {
    idx = ((i % TRACKS.length) + TRACKS.length) % TRACKS.length;
    audio.src = TRACKS[idx].src;
    trackTitle.textContent = TRACKS[idx].title;
    progFill.style.width = '0%';
    progFill.style.transition = 'none';
  }

  function syncIcon() { btnPlay.textContent = audio.paused ? '▶' : '⏸'; }

  function tryPlay() {
    const p = audio.play();
    if (p !== undefined) p.then(syncIcon).catch(syncIcon);
  }

  btnPlay.addEventListener('click', () => {
    if (audio.paused) tryPlay(); else { audio.pause(); syncIcon(); }
  });
  btnPrev.addEventListener('click', () => { loadTrack(idx - 1); tryPlay(); });
  btnNext.addEventListener('click', () => { loadTrack(idx + 1); tryPlay(); });

  audio.addEventListener('timeupdate', () => {
    if (audio.duration && !isNaN(audio.duration)) {
      progFill.style.transition = 'width .6s linear';
      progFill.style.width = ((audio.currentTime / audio.duration) * 100) + '%';
    }
  });
  audio.addEventListener('ended',  () => { loadTrack(idx + 1); tryPlay(); });
  audio.addEventListener('play',   syncIcon);
  audio.addEventListener('pause',  syncIcon);

  progBar.addEventListener('click', e => {
    if (!audio.duration || isNaN(audio.duration)) return;
    const rect = progBar.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  });

  loadTrack(0);
})();
