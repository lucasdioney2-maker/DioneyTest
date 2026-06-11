// DioneyMaker — motor do jogo
// STYLE FORMULA: chunky pixel art with a 32x32 grid feel and bold 1-pixel dark
// outlines, rounded readable silhouettes, environments warm amber-terracotta
// (Brazil) or slate-blue (Portugal), hero in coral-orange, golden gear glow,
// nostalgic VHS haze, high contrast, side-view perspective.
import { STR, CHAPTERS } from "./strings.js";

const W = 640, H = 360; // resolução lógica do jogo
const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

// ── RNG determinístico ────────────────────────────────────────────
let seed = 42;
function rng() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }

// ── Estado ────────────────────────────────────────────────────────
const SAVE_KEY = "dioneymaker_save";
let S = {
  scene: "title",      // title | intro | play | record | dance | dialog | shop | outro | end
  chapter: 0,
  money: 50, rep: 0, skill: 0, day: 1,
  footage: 0, edited: 0,
  owned: { v3: false, wmm: false },
  introLine: 0, outroLine: 0,
  npcIdx: 0, npcLine: 0,
  msg: "", msgT: 0,
};
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch {} }
function load() {
  try { const d = JSON.parse(localStorage.getItem(SAVE_KEY)); if (d && d.scene) { S = d; if (S.scene !== "title") S.scene = "play"; } } catch {}
}

// ── Arte PS1 pré-renderizada (gerada com Soul "Dioney new") ──────
const ART_KEYS = [
  "title","icon",
  "bg_caninde","bg_fortaleza","bg_tour","bg_porto","bg_lisboa","bg_studio","bg_warner","bg_ibiza","bg_egypt",
  "cut_film","cut_dance","cut_edit","cut_fortaleza","cut_tour","cut_porto","cut_lisboa","cut_studio","cut_drone",
  "por_dioney","por_tirullipa","por_andre","por_luan","por_alex","por_junin","por_safadao",
];
const ART = {};
for (const k of ART_KEYS) { const im = new Image(); im.src = `./assets/${k}.webp`; ART[k] = im; }
function artReady(k) { return ART[k] && ART[k].complete && ART[k].naturalWidth > 0; }
function drawArt(k) { // cover-fit na resolução lógica
  const im = ART[k];
  const s = Math.max(W / im.naturalWidth, H / im.naturalHeight);
  const w2 = im.naturalWidth * s, h2 = im.naturalHeight * s;
  ctx.drawImage(im, (W - w2) / 2, (H - h2) / 2, w2, h2);
}
// arte por capítulo: cenário de jogo + cutscene da história
const CHAPTER_ART = {
  caninde:  { bg: "bg_caninde",   cut: "cut_film",      dance: "cut_dance" },
  caninde2: { bg: "bg_caninde",   cut: "cut_edit" },
  fortaleza:{ bg: "bg_fortaleza", cut: "cut_fortaleza" },
  tour:     { bg: "bg_tour",      cut: "cut_tour" },
  porto:    { bg: "bg_porto",     cut: "cut_porto" },
  lisboa:   { bg: "bg_lisboa",    cut: "cut_lisboa" },
  empresa:  { bg: "bg_studio",    cut: "cut_studio",    outroBg: "bg_warner" },
  mundo:    { bg: "bg_egypt",     cut: "cut_drone",     outroBg: "bg_ibiza" },
};
const PORTRAITS = {
  "Luan": "por_luan", "Junin": "por_junin", "Tirullipa": "por_tirullipa",
  "André": "por_andre", "Alex": "por_alex", "Wesley Safadão": "por_safadao",
};

// ── Input ─────────────────────────────────────────────────────────
let pointer = null;       // {x,y} toque/clique deste frame
let keysPressed = [];     // códigos pressionados este frame (edge)
const held = new Set();   // códigos mantidos (movimento contínuo)
let swipe = null;         // {dx,dy} gesto concluído este frame
let swipeStart = null;
let scale = 1, offX = 0, offY = 0;
const GAME_KEYS = ["Space","Enter","Escape","ArrowUp","ArrowDown","ArrowLeft","ArrowRight",
  "KeyW","KeyA","KeyS","KeyD","KeyF"];

function toLogical(cx, cy) {
  const r = canvas.getBoundingClientRect();
  return { x: (cx - r.left - offX) / scale, y: (cy - r.top - offY) / scale };
}
canvas.addEventListener("pointerdown", e => {
  const p = toLogical(e.clientX, e.clientY);
  pointer = p; swipeStart = { ...p, t: performance.now() };
  e.preventDefault();
});
canvas.addEventListener("pointerup", e => {
  if (!swipeStart) return;
  const p = toLogical(e.clientX, e.clientY);
  const dx = p.x - swipeStart.x, dy = p.y - swipeStart.y;
  if (Math.hypot(dx, dy) > 24) swipe = { dx, dy };
  swipeStart = null; e.preventDefault();
});
addEventListener("keydown", e => {
  if (GAME_KEYS.includes(e.code)) {
    if (!e.repeat) keysPressed.push(e.code);
    held.add(e.code); e.preventDefault();
  }
});
addEventListener("keyup", e => { held.delete(e.code); });
const isTouch = typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;

function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + "px"; canvas.style.height = innerHeight + "px";
  scale = Math.min(innerWidth / W, innerHeight / H);
  offX = (innerWidth - W * scale) / 2; offY = (innerHeight - H * scale) / 2;
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * offX, dpr * offY);
  ctx.imageSmoothingEnabled = false;
}
addEventListener("resize", resize); addEventListener("orientationchange", resize); resize();

// ── Helpers de desenho pixel ──────────────────────────────────────
function px(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x | 0, y | 0, w | 0, h | 0); }
function text(t, x, y, size, c, align = "left") {
  ctx.fillStyle = c; ctx.font = `bold ${size}px monospace`; ctx.textAlign = align; ctx.textBaseline = "top";
  ctx.fillText(t, x, y);
}
function outlineText(t, x, y, size, c, align = "center") {
  ctx.font = `bold ${size}px monospace`; ctx.textAlign = align; ctx.textBaseline = "top";
  ctx.fillStyle = "#1a1028"; ctx.fillText(t, x + 2, y + 2);
  ctx.fillStyle = c; ctx.fillText(t, x, y);
}

// ── Botões ────────────────────────────────────────────────────────
let buttons = [];
function btn(label, x, y, w, h, fn, color = "#e8a33d") {
  buttons.push({ label, x, y, w, h, fn, color });
}
function drawButtons() {
  for (const b of buttons) {
    px(b.x + 3, b.y + 3, b.w, b.h, "#1a1028");
    px(b.x, b.y, b.w, b.h, b.color);
    px(b.x + 2, b.y + 2, b.w - 4, b.h - 4, "#2a1f3d");
    text(b.label, b.x + b.w / 2, b.y + b.h / 2 - 7, 13, "#ffe9c4", "center");
  }
}
function hitButtons() {
  if (!pointer) return false;
  for (const b of buttons) {
    if (pointer.x >= b.x && pointer.x <= b.x + b.w && pointer.y >= b.y && pointer.y <= b.y + b.h) {
      pointer = null; b.fn(); return true;
    }
  }
  return false;
}

// ── Cenários procedurais com marcos reais ─────────────────────────
function skyGrad(top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, top); g.addColorStop(1, bottom);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function drawSun(x, y, r, c) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }

const BGS = {
  caninde(t) {
    skyGrad("#f4a44a", "#d96a3b");
    drawSun(520, 80, 30, "#ffe9a0");
    // Morro do Alto do Moinho + estátua de São Francisco (31m)
    px(0, 150, 280, 110, "#8a5a3a");
    px(120, 60, 14, 95, "#d8d0c0");          // corpo da estátua
    px(117, 52, 20, 14, "#d8d0c0");          // cabeça/capuz
    px(108, 78, 12, 5, "#d8d0c0"); px(134, 78, 12, 5, "#d8d0c0"); // braços abertos
    px(116, 150, 22, 10, "#b8b0a0");         // pedestal
    // Basílica de São Francisco das Chagas
    px(330, 170, 90, 90, "#e8ddc8");
    px(340, 150, 16, 20, "#e8ddc8"); px(394, 150, 16, 20, "#e8ddc8"); // torres
    px(344, 142, 8, 8, "#c9a44a"); px(398, 142, 8, 8, "#c9a44a");     // cúpulas douradas
    px(360, 200, 30, 60, "#7a4a2a");          // portal
    // casas do sertão
    for (let i = 0; i < 6; i++) px(20 + i * 105, 230, 70, 50, ["#c97a4a","#d9985a","#b96a3f"][i % 3]);
    px(0, 280, W, 80, "#a3683c"); // rua de terra
  },
  fortaleza(t) {
    skyGrad("#7ec8e3", "#f4c46a");
    drawSun(90, 70, 26, "#fff2b0");
    px(0, 200, W, 60, "#2a7fa8"); // mar
    for (let i = 0; i < 8; i++) px(10 + i * 80, 205 + Math.sin(t / 400 + i) * 3, 40, 4, "#bfe8f4"); // ondas
    // Ponte dos Ingleses (Praia de Iracema)
    px(60, 190, 200, 8, "#6a5a4a");
    for (let i = 0; i < 7; i++) px(70 + i * 28, 198, 6, 30, "#5a4a3a");
    // Estátua de Iracema Guardiã
    px(300, 165, 8, 35, "#3a8a6a"); px(296, 158, 16, 10, "#3a8a6a");
    // orla de prédios
    for (let i = 0; i < 6; i++) { const h2 = 60 + (i * 37) % 50; px(380 + i * 42, 200 - h2, 34, h2 + 60, ["#e8e0d0","#d0c8b8","#c8d8e0"][i % 3]);
      for (let j = 0; j < 4; j++) px(386 + i * 42, 210 - h2 + j * 22, 8, 8, "#f4c46a"); }
    px(0, 260, W, 100, "#e8d4a0"); // areia
  },
  tour(t) {
    skyGrad("#5a3a6a", "#f49a4a");
    drawSun(320, 110, 34, "#ffd9a0");
    px(0, 200, W, 60, "#3a5a3a"); // mata
    for (let i = 0; i < 10; i++) px(i * 68, 185 + (i % 3) * 8, 30, 30, "#2a4a2a");
    px(0, 260, W, 100, "#4a4a52"); // estrada
    const dash = (t / 6) % 80;
    for (let i = -1; i < 9; i++) px(i * 80 + dash, 305, 40, 6, "#f4d44a");
    // ônibus de turnê
    px(60, 218, 130, 44, "#e84a6a"); px(60, 226, 130, 10, "#fff");
    px(75, 226, 18, 14, "#aee4f4"); px(105, 226, 18, 14, "#aee4f4"); px(135, 226, 18, 14, "#aee4f4");
    ctx.fillStyle = "#222"; ctx.beginPath(); ctx.arc(90, 264, 9, 0, 7); ctx.arc(160, 264, 9, 0, 7); ctx.fill();
  },
  porto(t) {
    skyGrad("#4a5a78", "#8a92a8");
    // casario colorido da Ribeira
    for (let i = 0; i < 9; i++) { const h2 = 70 + (i * 29) % 40;
      px(i * 72, 190 - h2 + 70, 60, h2, ["#c9762a","#a83a3a","#3a6a8a","#c9b44a","#7a5a8a"][i % 5]);
      for (let j = 0; j < 3; j++) px(i * 72 + 10, 200 - h2 + 70 + j * 24, 10, 14, "#f4e4b0"); }
    px(0, 260, W, 40, "#2a3a52"); // rio Douro
    // Ponte D. Luís I — arco de ferro
    ctx.strokeStyle = "#3a3a42"; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(320, 268, 150, Math.PI, 0); ctx.stroke();
    px(170, 230, 300, 8, "#3a3a42");
    for (let i = 0; i < 8; i++) px(185 + i * 38, 238, 4, 268 - 238 - Math.abs(i - 3.5) * 0, "#3a3a42");
    px(0, 300, W, 60, "#5a5a62"); // cais
    // chuva
    ctx.strokeStyle = "rgba(200,210,230,0.35)"; ctx.lineWidth = 1;
    for (let i = 0; i < 30; i++) { const rx = (i * 67 + t / 3) % W, ry = (i * 41 + t / 2) % H;
      ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 3, ry + 10); ctx.stroke(); }
  },
  lisboa(t) {
    skyGrad("#2a3a5a", "#e88a5a");
    drawSun(540, 100, 24, "#ffd9a0");
    // Ponte 25 de Abril ao fundo
    px(0, 140, W, 6, "#a83a2a");
    px(120, 90, 10, 56, "#a83a2a"); px(420, 90, 10, 56, "#a83a2a");
    ctx.strokeStyle = "#a83a2a"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, 130); ctx.quadraticCurveTo(125, 80, 270, 128); ctx.quadraticCurveTo(425, 80, W, 130); ctx.stroke();
    // colina com casario
    for (let i = 0; i < 9; i++) px(i * 72, 180 + (i % 3) * 10, 62, 90, ["#e8d4b0","#d4b896","#e0c8a8"][i % 3]);
    for (let i = 0; i < 9; i++) px(i * 72, 172 + (i % 3) * 10, 62, 10, "#a85a3a"); // telhados
    px(0, 280, W, 80, "#8a8a92"); // calçada
    for (let i = 0; i < 40; i++) px((i * 37) % W, 285 + (i * 13) % 70, 4, 4, "#d8d8e0"); // calçada portuguesa
    // elétrico amarelo 28
    const tx = 80 + Math.sin(t / 2000) * 30;
    px(tx, 236, 90, 46, "#f4c42a"); px(tx, 244, 90, 8, "#fff");
    px(tx + 10, 246, 14, 14, "#aee4f4"); px(tx + 38, 246, 14, 14, "#aee4f4"); px(tx + 66, 246, 14, 14, "#aee4f4");
    px(tx + 40, 226, 4, 10, "#444");
  },
  studio(t) {
    skyGrad("#1a1a2a", "#2a2438");
    px(0, 0, W, H, "#241e34");
    px(0, 280, W, 80, "#1a1626"); // chão
    // ecrãs de edição
    for (let i = 0; i < 3; i++) { px(60 + i * 190, 90, 140, 90, "#0a0a14");
      px(66 + i * 190, 96, 128, 60, ["#3a6af4","#e84a8a","#3af4aa"][i]);
      const wave = Math.sin(t / 300 + i) * 8;
      px(70 + i * 190, 160, 120, 8, "#2a2a3a"); px(70 + i * 190, 160, 60 + wave * 3, 8, "#e8a33d"); }
    // mesa + equipamento
    px(40, 220, 560, 14, "#3a3048");
    px(100, 196, 40, 24, "#888"); px(110, 188, 20, 10, "#666");        // câmera
    px(480, 190, 50, 30, "#555"); px(495, 180, 20, 12, "#777");         // drone
    px(300, 200, 8, 20, "#aaa"); px(294, 196, 20, 6, "#aaa");           // gimbal
    // luzes de estúdio
    px(20, 30, 10, 10, "#f4d44a"); px(610, 30, 10, 10, "#f4d44a");
    ctx.fillStyle = "rgba(244,212,74,0.06)";
    ctx.beginPath(); ctx.moveTo(25, 40); ctx.lineTo(150, 280); ctx.lineTo(0, 280); ctx.fill();
    ctx.beginPath(); ctx.moveTo(615, 40); ctx.lineTo(640, 280); ctx.lineTo(490, 280); ctx.fill();
  },
  egypt(t) {
    skyGrad("#f4b44a", "#d97a3a");
    drawSun(320, 90, 40, "#fff0c0");
    // pirâmides de Gizé
    ctx.fillStyle = "#c9985a";
    ctx.beginPath(); ctx.moveTo(150, 260); ctx.lineTo(260, 90); ctx.lineTo(370, 260); ctx.fill();
    ctx.fillStyle = "#b9854a";
    ctx.beginPath(); ctx.moveTo(330, 260); ctx.lineTo(430, 130); ctx.lineTo(530, 260); ctx.fill();
    ctx.fillStyle = "#a9784a";
    ctx.beginPath(); ctx.moveTo(60, 260); ctx.lineTo(130, 170); ctx.lineTo(200, 260); ctx.fill();
    // esfinge
    px(500, 230, 70, 30, "#c9985a"); px(556, 210, 22, 26, "#c9985a"); px(550, 204, 32, 10, "#b9854a");
    px(0, 260, W, 100, "#e8c87a"); // areia
    // drone no céu
    const dx = 200 + Math.sin(t / 900) * 120, dy = 60 + Math.cos(t / 700) * 20;
    px(dx, dy, 24, 8, "#333"); px(dx - 6, dy - 4, 10, 4, "#555"); px(dx + 20, dy - 4, 10, 4, "#555");
    px(dx + 8, dy + 8, 8, 6, "#e84a4a");
  },
};

// ── Personagem (pixel, coral-orange) ──────────────────────────────
function drawHero(x, y, t, act) {
  const bob = Math.sin(t / 250) * 2;
  px(x + 4, y + bob, 16, 14, "#5a3a28");                 // cabelo
  px(x + 5, y + 6 + bob, 14, 10, "#c98a5a");             // rosto
  px(x + 8, y + 9 + bob, 3, 3, "#1a1028"); px(x + 14, y + 9 + bob, 3, 3, "#1a1028");
  px(x + 2, y + 16 + bob, 20, 20, act >= 2 ? "#e85a3a" : "#f47a4a"); // camisa coral
  px(x + 2, y + 36 + bob, 8, 14, "#2a3a5a"); px(x + 14, y + 36 + bob, 8, 14, "#2a3a5a");
  if (act >= 1) { // câmera ao pescoço a partir do ato 2
    const ch = S.chapter;
    if (CHAPTERS[ch] && CHAPTERS[ch].actions.includes("record")) {
      px(x + 6, y + 24 + bob, 14, 9, "#333"); px(x + 9, y + 26 + bob, 5, 5, "#88c4f4");
    }
  }
}
function drawNpc(x, y, t, i) {
  const cols = ["#3a8af4", "#3af48a", "#f43a8a", "#f4d43a", "#8a3af4", "#3af4d4"];
  const c = cols[i % cols.length], bob = Math.sin(t / 250 + i) * 2;
  px(x + 4, y + bob, 16, 12, "#2a1f1a");
  px(x + 5, y + 5 + bob, 14, 10, "#b97a4a");
  px(x + 2, y + 15 + bob, 20, 20, c);
  px(x + 2, y + 35 + bob, 8, 14, "#333"); px(x + 14, y + 35 + bob, 8, 14, "#333");
}

// ── Overlay VHS ───────────────────────────────────────────────────
function vhs(t) {
  ctx.fillStyle = "rgba(0,0,0,0.10)";
  for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1);
  const fl = Math.sin(t / 90) * 0.02 + 0.02;
  ctx.fillStyle = `rgba(255,240,200,${fl})`; ctx.fillRect(0, 0, W, H);
}

// ── HUD ───────────────────────────────────────────────────────────
function hud() {
  const ch = CHAPTERS[S.chapter];
  px(0, 0, W, 26, "rgba(20,12,32,0.88)");
  const cur = ch.act >= 2 ? STR.euro : STR.money;
  text(`${cur}${S.money}`, 8, 6, 13, "#f4d44a");
  text(`${STR.rep} ${S.rep}`, 110, 6, 13, "#3af48a");
  text(`${STR.skill} ${S.skill}`, 210, 6, 13, "#88c4f4");
  text(`🎞${S.footage} ✂${S.edited}`, 330, 6, 13, "#e8a0f4");
  text(`${ch.place}`, W - 8, 6, 12, "#ffe9c4", "right");
  // meta
  px(0, H - 22, W, 22, "rgba(20,12,32,0.88)");
  text(`${STR.goalLabel}: ${ch.goalText}`, 8, H - 18, 12, "#f4a44a");
  if (S.msg && S.msgT > 0) {
    px(W / 2 - 160, 40, 320, 26, "rgba(20,12,32,0.92)");
    text(S.msg, W / 2, 46, 13, "#ffe9c4", "center");
  }
}

// ── Lógica de progressão ──────────────────────────────────────────
function camLevel() {
  const o = S.owned;
  if (o.drone && o.a7) return 6; if (o.a7) return 5; if (o.dslr) return 4;
  if (o.hd) return 3; if (o.n73) return 2; if (o.v3) return 1; return 0;
}
function editLevel() { const o = S.owned; if (o.vegas) return 2; if (o.wmm) return 1; return 0; }
function flash(m) { S.msg = m; S.msgT = 2000; }
function goalMet() {
  const g = CHAPTERS[S.chapter].goal;
  return (!g.money || S.money >= g.money) && (!g.rep || S.rep >= g.rep) && (!g.skill || S.skill >= g.skill);
}
function nextDay() { S.day++; save(); }

// ── Mini-game: GRAVAR (guitar-hero de técnicas de câmera) ─────────
// 4 pistas = 4 técnicas; notas caem, acerta no ritmo com A S D F ou tocando
const LANE_KEYS = ["KeyA", "KeyS", "KeyD", "KeyF"];
const LANE_COLORS = ["#e84a6a", "#3a8af4", "#f4d43a", "#3af48a"];
const HIT_Y = H - 70;
let rec = null;
function startRecord() {
  if (camLevel() === 0 && CHAPTERS[S.chapter].id !== "caninde") { flash("Precisas de uma câmera! Vai à loja."); return; }
  const ch = CHAPTERS[S.chapter];
  const n = 10 + ch.act * 4;
  const speed = 0.10 + ch.act * 0.02 + Math.min(0.05, S.skill / 2000);
  const notes = [];
  let tt = 1200;
  for (let i = 0; i < n; i++) { notes.push({ lane: (rng() * 4) | 0, t: tt, hit: 0 }); tt += 480 + ((rng() * 3) | 0) * 160; }
  rec = { notes, t: 0, speed, hits: 0, perfect: 0, combo: 0, maxCombo: 0, done: false, doneT: 0, tip: STR.tips[(rng() * STR.tips.length) | 0] };
  S.scene = "record";
}
function recHit(lane) {
  let best = null, bestD = 1e9;
  for (const n of rec.notes) {
    if (n.hit || n.lane !== lane) continue;
    const d = Math.abs(HIT_Y - (HIT_Y - (n.t - rec.t) * rec.speed));
    if (d < 44 && d < bestD) { best = n; bestD = d; }
  }
  if (!best) { rec.combo = 0; return; }
  const win = S.owned.stab ? 28 : 18;
  best.hit = bestD < win ? 2 : 1;
  rec.hits++; if (best.hit === 2) rec.perfect++;
  rec.combo++; rec.maxCombo = Math.max(rec.maxCombo, rec.combo);
  if (rec.combo % 5 === 0) rec.tip = STR.tips[(rng() * STR.tips.length) | 0];
}
function updateRecord(dt) {
  if (rec.done) { rec.doneT -= dt; if (rec.doneT <= 0) { S.scene = "play"; rec = null; } return; }
  rec.t += dt;
  for (const k of keysPressed) { const li = LANE_KEYS.indexOf(k); if (li >= 0) recHit(li); }
  if (pointer && pointer.y > HIT_Y - 60) {
    recHit(Math.min(3, Math.max(0, ((pointer.x - (W / 2 - 200)) / 100) | 0)));
    pointer = null;
  }
  for (const n of rec.notes) if (!n.hit && (rec.t - n.t) * rec.speed > 44) { n.hit = -1; rec.combo = 0; }
  const last = rec.notes[rec.notes.length - 1];
  if (rec.t > last.t + 900) {
    rec.done = true; rec.doneT = 1600;
    const lvl = Math.max(1, camLevel());
    S.footage += Math.max(1, (rec.hits * lvl + rec.perfect * lvl) >> 1);
    S.skill += 2 + (rec.maxCombo >> 1);
    flash(rec.perfect > rec.notes.length / 2 ? STR.recordPerfect : rec.hits > rec.notes.length / 3 ? STR.recordGood : STR.recordBad);
    nextDay();
  }
}
// cenário do capítulo: arte PS1 se carregada, senão fallback procedural
function drawChapterBG(t, kind = "bg") {
  const ch = CHAPTERS[S.chapter];
  const art = CHAPTER_ART[ch.id];
  const key = art && art[kind] ? art[kind] : (art ? art.bg : null);
  if (key && artReady(key)) drawArt(key);
  else BGS[ch.bgKey](t);
}

function renderRecord(t) {
  drawChapterBG(t, "cut");
  ctx.fillStyle = "rgba(10,6,20,0.62)"; ctx.fillRect(0, 0, W, H);
  px(W / 2 - 230, 6, 60, 16, "#e83a3a"); text("● REC", W / 2 - 224, 9, 11, "#fff");
  text(`${["V3 240p","V3 240p","N73 480p","HD 720p","DSLR 1080p","A7 4K","A7 4K+DRONE"][camLevel()]}`, W / 2 + 230, 9, 11, "#fff", "right");
  const left = W / 2 - 200;
  for (let i = 0; i < 4; i++) {
    const lx = left + i * 100;
    ctx.fillStyle = "rgba(255,255,255,0.05)"; ctx.fillRect(lx + 6, 30, 88, H - 100);
    px(lx + 6, HIT_Y - 3, 88, 6, LANE_COLORS[i]);
    text(STR.lanes[i], lx + 50, HIT_Y + 12, 11, LANE_COLORS[i], "center");
    if (!isTouch) text("ASDF"[i], lx + 50, HIT_Y + 28, 12, "#ffe9c4", "center");
  }
  if (rec) {
    for (const n of rec.notes) {
      if (n.hit) continue;
      const y = HIT_Y - (n.t - rec.t) * rec.speed;
      if (y < 24 || y > H) continue;
      const lx = left + n.lane * 100;
      px(lx + 22, y - 11, 56, 22, LANE_COLORS[n.lane]);
      px(lx + 26, y - 7, 48, 14, "#1a1028");
      px(lx + 30, y - 4, 40, 8, LANE_COLORS[n.lane]);
    }
    if (rec.combo >= 3) outlineText(`${rec.combo}x ${STR.combo}`, W / 2, 36, 20, "#f4d44a");
    outlineText(rec.tip, W / 2, 64, 11, "#ffe9c4");
    if (rec.done) {
      px(W / 2 - 140, H / 2 - 40, 280, 80, "rgba(20,12,32,0.94)");
      outlineText(`${rec.hits}/${rec.notes.length} tomadas`, W / 2, H / 2 - 28, 16, "#f4d44a");
      outlineText(`${rec.perfect} perfeitas · combo ${rec.maxCombo}x`, W / 2, H / 2 - 4, 13, "#ffe9c4");
    } else outlineText(STR.recordHint, W / 2, H - 22, 11, "rgba(255,233,196,0.8)");
  }
}

// ── Mini-game: DANÇAR (gestos de mouse/dedo no ritmo) ────────────
let dance = null;
const ARROWS = ["ArrowLeft","ArrowUp","ArrowDown","ArrowRight"];
const ARROW_CHAR = { ArrowLeft: "←", ArrowUp: "↑", ArrowDown: "↓", ArrowRight: "→" };
const DIRS = [[-1,0],[0,-1],[0,1],[1,0]]; // mesmo índice de ARROWS
function startDance() {
  const n = 6 + Math.min(6, (S.rep / 15) | 0);
  const notes = [];
  let tt = 1400;
  for (let i = 0; i < n; i++) { notes.push({ dir: (rng() * 4) | 0, t: tt, hit: 0 }); tt += 700 + ((rng() * 2) | 0) * 250; }
  dance = { notes, t: 0, hits: 0, perfect: 0, combo: 0, maxCombo: 0, done: false, doneT: 0 };
  S.scene = "dance";
}
function danceHit(dirIdx) {
  let best = null, bestD = 1e9;
  for (const n of dance.notes) {
    if (n.hit || n.dir !== dirIdx) continue;
    const d = Math.abs(n.t - dance.t);
    if (d < 420 && d < bestD) { best = n; bestD = d; }
  }
  if (!best) { dance.combo = 0; return; }
  best.hit = bestD < 180 ? 2 : 1;
  dance.hits++; if (best.hit === 2) dance.perfect++;
  dance.combo++; dance.maxCombo = Math.max(dance.maxCombo, dance.combo);
}
function updateDance(dt) {
  if (dance.done) { dance.doneT -= dt; if (dance.doneT <= 0) { S.scene = "play"; dance = null; } return; }
  dance.t += dt;
  for (const k of keysPressed) { const i = ARROWS.indexOf(k); if (i >= 0) danceHit(i); }
  if (swipe) {
    const i = Math.abs(swipe.dx) > Math.abs(swipe.dy)
      ? (swipe.dx < 0 ? 0 : 3) : (swipe.dy < 0 ? 1 : 2);
    danceHit(i); swipe = null;
  }
  for (const n of dance.notes) if (!n.hit && dance.t - n.t > 420) { n.hit = -1; dance.combo = 0; }
  const last = dance.notes[dance.notes.length - 1];
  if (dance.t > last.t + 900) {
    dance.done = true; dance.doneT = 1600;
    const repG = dance.hits * 2 + dance.perfect * 2 + (dance.maxCombo >> 1);
    S.rep += Math.max(1, repG);
    flash(dance.hits > dance.notes.length / 2 ? STR.danceWin : STR.danceFail);
    nextDay();
  }
}
function renderDance(t) {
  drawChapterBG(t, "dance");
  ctx.fillStyle = "rgba(10,6,20,0.5)"; ctx.fillRect(0, 0, W, H);
  if (!dance) return;
  // alvo central: gesto a executar (anel estilo ritmo)
  const cx = W / 2, cy = H / 2 + 10;
  ctx.strokeStyle = "rgba(255,233,196,0.5)"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, 46, 0, 7); ctx.stroke();
  for (const n of dance.notes) {
    if (n.hit) continue;
    const dtN = n.t - dance.t;
    if (dtN > 1600 || dtN < -420) continue;
    const r = 46 + Math.max(0, dtN) * 0.16;           // anel encolhe até ao alvo
    const a = Math.max(0.15, 1 - dtN / 1600);
    const [dx2, dy2] = DIRS[n.dir];
    ctx.strokeStyle = `rgba(244,212,74,${a})`; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke();
    if (dtN < 700) {
      outlineText(ARROW_CHAR[ARROWS[n.dir]], cx + dx2 * 0, cy - 14, 40, "#f4d44a");
      // seta de direção do gesto
      ctx.strokeStyle = "#3af48a"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + dx2 * 70, cy + dy2 * 70); ctx.stroke();
    }
    break; // só a nota da frente
  }
  if (dance.combo >= 3) outlineText(`${dance.combo}x ${STR.combo}`, W / 2, 36, 20, "#f4d44a");
  if (dance.done) {
    px(W / 2 - 140, H / 2 - 40, 280, 80, "rgba(20,12,32,0.94)");
    outlineText(`${dance.hits}/${dance.notes.length} passos`, W / 2, H / 2 - 28, 16, "#f4d44a");
    outlineText(`combo ${dance.maxCombo}x`, W / 2, H / 2 - 4, 13, "#ffe9c4");
  } else outlineText(STR.danceSwipeHint, W / 2, H - 24, 11, "rgba(255,233,196,0.85)");
}

// ── Cena principal ────────────────────────────────────────────────
function doEdit() {
  if (S.footage <= 0) { flash(STR.noFootage); return; }
  if (editLevel() === 0) { flash("Precisas de um editor! (Loja: Movie Maker é grátis)"); return; }
  const n = Math.min(S.footage, 2 + editLevel());
  S.footage -= n; S.edited += n; S.skill += editLevel(); nextDay();
  flash(STR.edited + ` (+${n})`);
}
function doPublish() {
  if (S.edited <= 0) { flash(STR.noEdited); return; }
  const ch = CHAPTERS[S.chapter];
  const mult = 8 + ch.act * 10 + camLevel() * 6;
  const gain = S.edited * mult, repG = S.edited * (2 + ch.act * 2);
  S.money += gain; S.rep += repG; S.edited = 0; nextDay();
  flash(`${STR.published}${repG}  +${ch.act >= 2 ? "€" : "R$"}${gain}`);
}
function doWork() {
  const ch = CHAPTERS[S.chapter];
  S.money += 60 + ch.act * 60; nextDay(); flash(STR.workDone);
}
function startTalk() {
  const ch = CHAPTERS[S.chapter];
  S.npcIdx = (S.npcIdx + 1) % ch.npcs.length; S.npcLine = 0; S.scene = "dialog";
}

// ── Modo exploração: Dioney anda pelo cenário (estilo FF7) ────────
const hero = { x: 90, target: null, dir: 1, walking: false };
const GROUND = H - 78;
const ACTION_DEFS = {
  dance:   { icon: "🕺", label: STR.actDance,   fn: startDance,                   color: "#8a3af4" },
  record:  { icon: "🎥", label: STR.actRecord,  fn: startRecord,                  color: "#e84a6a" },
  edit:    { icon: "✂️", label: STR.actEdit,    fn: doEdit,                       color: "#3a8af4" },
  publish: { icon: "📤", label: STR.actPublish, fn: doPublish,                    color: "#3af48a" },
  work:    { icon: "💪", label: STR.actWork,    fn: doWork,                       color: "#a87a4a" },
  talk:    { icon: "💬", label: STR.actTalk,    fn: startTalk,                    color: "#f4a43a" },
  shop:    { icon: "🛒", label: STR.actShop,    fn: () => { S.scene = "shop"; },  color: "#f4d43a" },
};
function hotspots() {
  const ch = CHAPTERS[S.chapter];
  const spots = [];
  for (const a of ch.actions) {
    if (a === "talk") { // NPCs são entidades individuais no mapa
      ch.npcs.forEach((npc, i) => spots.push({
        icon: "", label: npc.name, color: "#f4a43a", id: "npc" + i, npcIdx: i,
        fn: () => { S.npcIdx = i; S.npcLine = 0; S.scene = "dialog"; },
      }));
    } else spots.push({ ...ACTION_DEFS[a], id: a });
  }
  const gap = (W - 120) / Math.max(1, spots.length - 1 || 1);
  spots.forEach((s2, i) => s2.x = spots.length === 1 ? W / 2 : 60 + i * gap);
  return spots;
}
function updateWalk(dt) {
  const sp = 0.16 * dt;
  let moved = false;
  if (held.has("KeyA") || held.has("ArrowLeft"))  { hero.x -= sp; hero.dir = -1; moved = true; hero.target = null; }
  if (held.has("KeyD") || held.has("ArrowRight")) { hero.x += sp; hero.dir = 1;  moved = true; hero.target = null; }
  if (hero.target !== null) {
    const d = hero.target - hero.x;
    if (Math.abs(d) < sp) { hero.x = hero.target; hero.target = null; }
    else { hero.x += Math.sign(d) * sp; hero.dir = Math.sign(d); moved = true; }
  }
  hero.x = Math.max(24, Math.min(W - 24, hero.x));
  hero.walking = moved;
}
function nearSpot() {
  let best = null;
  for (const h2 of hotspots()) if (Math.abs(h2.x - hero.x) < 34 && (!best || Math.abs(h2.x - hero.x) < Math.abs(best.x - hero.x))) best = h2;
  return best;
}
function drawHeroBig(t) {
  const x = hero.x - 16, y = GROUND - 64;
  const bob = hero.walking ? Math.sin(t / 90) * 3 : Math.sin(t / 400) * 1.5;
  const legSwing = hero.walking ? Math.sin(t / 90) * 6 : 0;
  ctx.save();
  if (hero.dir < 0) { ctx.translate(hero.x * 2, 0); ctx.scale(-1, 1); }
  px(x + 6, y + bob, 22, 18, "#3a2818");                    // cabelo
  px(x + 8, y + 9 + bob, 18, 13, "#c98a5a");                // rosto
  px(x + 12, y + 13 + bob, 3, 3, "#1a1028"); px(x + 20, y + 13 + bob, 3, 3, "#1a1028");
  px(x + 4, y + 22 + bob, 26, 24, "#e85a3a");               // camisa
  px(x + 9, y + 28 + bob, 16, 10, "#333");                  // câmera ao peito
  px(x + 12, y + 30 + bob, 6, 6, "#88c4f4");
  px(x + 5, y + 46 + bob, 10, 18 + legSwing * 0.4, "#2a3a5a");
  px(x + 19, y + 46 + bob, 10, 18 - legSwing * 0.4, "#2a3a5a");
  ctx.restore();
  // sombra
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath(); ctx.ellipse(hero.x, GROUND + 2, 18, 5, 0, 0, 7); ctx.fill();
}
function renderPlay(t) {
  const ch = CHAPTERS[S.chapter];
  drawChapterBG(t, "bg");
  updateWalk(STEP);
  // hotspots no chão
  buttons = [];
  const near = nearSpot();
  for (const h2 of hotspots()) {
    const active = near && near.id === h2.id;
    const pulse = active ? Math.sin(t / 150) * 3 : 0;
    ctx.fillStyle = active ? h2.color : "rgba(20,12,32,0.75)";
    ctx.beginPath(); ctx.ellipse(h2.x, GROUND + 4, 22 + pulse, 7, 0, 0, 7); ctx.fill();
    if (h2.npcIdx !== undefined) drawNpc(h2.x - 12, GROUND - 52, t, h2.npcIdx);
    else text(h2.icon, h2.x, GROUND - 38 + Math.sin(t / 300 + h2.x) * 3, 22, "#fff", "center");
    if (active) {
      px(h2.x - 52, GROUND - 72, 104, 22, "rgba(20,12,32,0.92)");
      text(h2.label, h2.x, GROUND - 68, 12, "#ffe9c4", "center");
      if (!isTouch) outlineText(STR.interactPrompt, h2.x, GROUND - 92, 11, "#f4d44a");
    }
    // toque direto no ícone = interagir
    buttons.push({ label: "", x: h2.x - 26, y: GROUND - 50, w: 52, h: 60, color: "", fn: () => {
      if (Math.abs(h2.x - hero.x) < 34) h2.fn(); else hero.target = h2.x;
    }});
  }
  drawHeroBig(t);
  if (keysPressed.includes("Space") || keysPressed.includes("Enter")) { if (near) near.fn(); }
  // toque no chão = andar até lá
  if (pointer && pointer.y > 70 && pointer.y < H - 30) {
    let onSpot = false;
    for (const b of buttons) if (pointer.x >= b.x && pointer.x <= b.x + b.w && pointer.y >= b.y && pointer.y <= b.y + b.h) onSpot = true;
    if (!onSpot) { hero.target = pointer.x; pointer = null; }
  }
  vhs(t); hud();
  text(isTouch ? STR.walkHintTouch : STR.walkHint, W / 2, H - 36, 10, "rgba(255,233,196,0.7)", "center");
  if (goalMet()) {
    px(W / 2 - 130, 95, 260, 60, "rgba(20,12,32,0.92)");
    outlineText(STR.chapterDone, W / 2, 105, 16, "#f4d44a");
    buttons.push({ label: STR.actNext, x: W / 2 - 60, y: 125, w: 120, h: 26, color: "#3af48a",
      fn: () => { S.scene = "outro"; S.outroLine = 0; } });
    const b = buttons[buttons.length - 1];
    px(b.x, b.y, b.w, b.h, b.color); px(b.x + 2, b.y + 2, b.w - 4, b.h - 4, "#2a1f3d");
    text(b.label, b.x + b.w / 2, b.y + 7, 12, "#ffe9c4", "center");
  }
}

// ── Diálogo ───────────────────────────────────────────────────────
function renderDialog(t) {
  const ch = CHAPTERS[S.chapter], npc = ch.npcs[S.npcIdx];
  drawChapterBG(t, "bg");
  vhs(t);
  // retratos estilo FF7: Dioney à esquerda, NPC à direita
  const pk = PORTRAITS[npc.name];
  if (artReady("por_dioney")) {
    const im = ART.por_dioney, s = 130 / im.naturalHeight;
    ctx.drawImage(im, 16, H - 248, im.naturalWidth * s, 130);
  }
  if (pk && artReady(pk)) {
    const im = ART[pk], s = 130 / im.naturalHeight;
    const w2 = im.naturalWidth * s;
    ctx.drawImage(im, W - 16 - w2, H - 248, w2, 130);
  } else if (!pk) drawNpc(W - 60, H - 230, t, S.npcIdx);
  px(20, H - 110, W - 40, 90, "rgba(20,12,32,0.94)");
  px(20, H - 110, W - 40, 3, "#e8a33d");
  text(npc.name, 36, H - 100, 14, "#f4d44a");
  text(npc.lines[S.npcLine], 36, H - 78, 13, "#ffe9c4");
  text("▼ toca para continuar", W - 36, H - 40, 11, "#8a8298", "right");
  if (pointer || keysPressed.includes("Space") || keysPressed.includes("Enter")) {
    pointer = null; S.npcLine++;
    if (S.npcLine >= npc.lines.length) { S.scene = "play"; S.rep += 2; }
  }
}

// ── Loja ──────────────────────────────────────────────────────────
function renderShop(t) {
  drawChapterBG(t, "bg");
  ctx.fillStyle = "rgba(10,6,20,0.85)"; ctx.fillRect(0, 0, W, H);
  outlineText(STR.shopTitle, W / 2, 14, 18, "#f4d44a");
  buttons = [];
  const ch = CHAPTERS[S.chapter];
  const cur = ch.act >= 2 ? "€" : "R$";
  STR.equip.forEach((e, i) => {
    const col = i % 3, row = (i / 3) | 0;
    const x = 30 + col * 200, y = 48 + row * 86;
    const has = S.owned[e.id];
    px(x, y, 188, 78, has ? "#1f3a2a" : "#2a1f3d");
    px(x, y, 188, 2, has ? "#3af48a" : "#e8a33d");
    text(e.name, x + 8, y + 8, 13, "#ffe9c4");
    text(e.desc, x + 8, y + 26, 10, "#a89ab8");
    if (has) text(STR.owned, x + 8, y + 48, 12, "#3af48a");
    else btn(`${cur}${e.price}`, x + 8, y + 44, 90, 26, () => {
      if (S.money >= e.price) { S.money -= e.price; S.owned[e.id] = true; flash(STR.bought + e.name); save(); }
      else flash(STR.notEnough);
    }, "#3af48a");
  });
  btn(STR.shopClose, W / 2 - 50, H - 38, 100, 30, () => { S.scene = "play"; }, "#e84a6a");
  drawButtons();
  if (S.msg && S.msgT > 0) { px(W / 2 - 160, H - 70, 320, 24, "rgba(20,12,32,0.95)"); text(S.msg, W / 2, H - 65, 12, "#ffe9c4", "center"); }
}

// ── Intro / Outro de capítulo ─────────────────────────────────────
function renderStory(t, lines, lineIdx, onDone, advance) {
  const ch = CHAPTERS[S.chapter];
  const kind = S.scene === "outro" && CHAPTER_ART[ch.id]?.outroBg ? "outroBg" : "cut";
  drawChapterBG(t, kind);
  ctx.fillStyle = "rgba(10,6,20,0.55)"; ctx.fillRect(0, 0, W, H);
  vhs(t);
  outlineText(`${STR.chapter} ${S.chapter + 1} — ${ch.place}`, W / 2, 50, 15, "#f4d44a");
  for (let i = 0; i <= lineIdx && i < lines.length; i++)
    outlineText(lines[i], W / 2, 120 + i * 28, 14, i === lineIdx ? "#ffe9c4" : "#8a8298");
  text("▼ toca para continuar", W - 30, H - 30, 11, "#8a8298", "right");
  if (pointer || keysPressed.includes("Space") || keysPressed.includes("Enter")) {
    pointer = null;
    if (lineIdx + 1 >= lines.length) onDone(); else advance();
  }
}

// ── Título / Fim ──────────────────────────────────────────────────
function renderTitle(t) {
  if (artReady("title")) { drawArt("title"); }
  else { BGS.caninde(t); ctx.fillStyle = "rgba(10,6,20,0.5)"; ctx.fillRect(0, 0, W, H); drawHero(W / 2 - 12, 190, t, 0); }
  vhs(t);
  outlineText(STR.title, W / 2, 30, 44, "#f4d44a");
  outlineText(STR.subtitle, W / 2, 85, 16, "#ffe9c4");
  if ((t / 600 | 0) % 2 === 0) outlineText(STR.tapToStart, W / 2, 290, 13, "#ffe9c4");
  if (pointer || keysPressed.includes("Space") || keysPressed.includes("Enter")) {
    pointer = null; S.scene = "intro"; S.introLine = 0;
  }
}
function renderEnd(t) {
  if (artReady("cut_drone")) drawArt("cut_drone"); else BGS.egypt(t);
  vhs(t);
  ctx.fillStyle = "rgba(10,6,20,0.65)"; ctx.fillRect(0, 0, W, H);
  outlineText(STR.gameOver, W / 2, 70, 36, "#f4d44a");
  STR.theEnd.split("\n").forEach((l, i) => outlineText(l, W / 2, 140 + i * 26, 15, "#ffe9c4"));
  STR.credits.split("\n").forEach((l, i) => outlineText(l, W / 2, 230 + i * 20, 11, "#8a8298"));
  if (!artReady("cut_drone")) {
    drawHero(W / 2 - 60, 290, t, 3);
    for (let i = 0; i < 5; i++) drawNpc(W / 2 - 10 + i * 30, 292, t, i);
  }
}

// ── Loop principal (timestep fixo) ────────────────────────────────
const STEP = 1000 / 60;
let acc = 0, last = performance.now(), paused = false, gt = 0;
let frames = 0, fpsAt = last, fps = 0;
addEventListener("blur", () => paused = true);
addEventListener("focus", () => { paused = false; last = performance.now(); });

function update(dt) {
  gt += dt;
  if (S.msgT > 0) S.msgT -= dt;
  if (S.scene === "record" && rec) updateRecord(dt);
  if (S.scene === "dance" && dance) updateDance(dt);
}
function render() {
  ctx.fillStyle = "#0f0a18"; ctx.fillRect(-offX / scale, -offY / scale, (innerWidth) / scale + 2, (innerHeight) / scale + 2);
  switch (S.scene) {
    case "title": renderTitle(gt); break;
    case "intro": renderStory(gt, CHAPTERS[S.chapter].intro, S.introLine,
      () => { S.scene = "play"; save(); }, () => S.introLine++); break;
    case "outro": renderStory(gt, CHAPTERS[S.chapter].outro, S.outroLine,
      () => {
        if (S.chapter + 1 >= CHAPTERS.length) { S.scene = "end"; }
        else { S.chapter++; S.introLine = 0; S.scene = "intro";
          if (CHAPTERS[S.chapter].id === "porto") { S.money = 0; S.owned = {}; S.footage = 0; S.edited = 0; flash("Recomeço total..."); }
          if (CHAPTERS[S.chapter].id === "caninde2") { S.owned.v3 = true; S.owned.wmm = true; }
          if (CHAPTERS[S.chapter].id === "empresa") { S.owned.a7 = true; S.owned.drone = true; S.owned.stab = true; }
          save(); }
      }, () => S.outroLine++); break;
    case "play": renderPlay(gt); break;
    case "record": if (rec) renderRecord(gt); break;
    case "dance": if (dance) renderDance(gt); break;
    case "dialog": renderDialog(gt); break;
    case "shop": renderShop(gt); break;
    case "end": renderEnd(gt); break;
  }
  hitButtons();
  keysPressed = [];
  if (S.scene !== "dialog" && S.scene !== "intro" && S.scene !== "outro" && S.scene !== "title") pointer = null;
}

const dev = new URLSearchParams(location.search).has("dev");
const devEl = document.getElementById("dev");
if (dev && devEl) devEl.style.display = "block";

function frame(now) {
  requestAnimationFrame(frame);
  if (paused) return;
  acc += now - last; last = now;
  if (acc > 500) acc = 500;
  while (acc >= STEP) { update(STEP); acc -= STEP; }
  render();
  if (dev && (frames++, now - fpsAt >= 500)) {
    fps = Math.round(frames * 1000 / (now - fpsAt)); frames = 0; fpsAt = now;
    devEl.textContent = fps + " fps";
  }
}
load();
requestAnimationFrame(frame);
