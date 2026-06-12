// DioneyMaker v4 — Bully PS2 style
// STYLE FORMULA: PS1 pré-renderizado tipo FF7; paleta âmbar-terracota (Brasil) ou azul-ardósia
// (Portugal); VHS grain; personagem coral-laranja; equipamentos dourados; perspetiva lateral.
import { STR, CHAPTERS } from "./strings.js";

const W = 640, H = 360;
const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

// ── RNG determinístico ────────────────────────────────────────────
let seed = 42;
function rng() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }

// ── Estado ────────────────────────────────────────────────────────
const SAVE_KEY = "dioneymaker_v4";
let S = {
  scene: "title",
  chapter: 0,
  money: 50, rep: 0, skill: 0, day: 1,
  footage: 0, edited: 0,
  owned: { v3: false, wmm: false },
  introLine: 0, outroLine: 0,
  npcIdx: 0, npcLine: 0,
  msg: "", msgT: 0,
  friends: {},   // npc name → 0..5
  event: null,   // {msg, color, t}
  skillPanelFrom: "play",
};
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch {} }
function load() {
  try {
    const d = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (d && d.scene) { S = d; if (S.scene !== "title") S.scene = "play"; }
  } catch {}
}

// ── Arte PS1 pré-renderizada ──────────────────────────────────────
const ART_KEYS = [
  "title","icon",
  "bg_caninde","bg_fortaleza","bg_tour","bg_porto","bg_lisboa",
  "bg_studio","bg_warner","bg_ibiza","bg_egypt",
  "cut_film","cut_dance","cut_edit","cut_fortaleza","cut_tour",
  "cut_porto","cut_lisboa","cut_studio","cut_drone",
  "por_dioney","por_tirullipa","por_andre","por_luan",
  "por_alex","por_junin","por_safadao",
];
const ART = {};
for (const k of ART_KEYS) { const im = new Image(); im.src = `./assets/${k}.webp`; ART[k] = im; }
function artReady(k) { return ART[k] && ART[k].complete && ART[k].naturalWidth > 0; }
function drawArt(k) {
  const im = ART[k];
  const s = Math.max(W / im.naturalWidth, H / im.naturalHeight);
  const w2 = im.naturalWidth * s, h2 = im.naturalHeight * s;
  ctx.drawImage(im, (W - w2) / 2, (H - h2) / 2, w2, h2);
}
const CHAPTER_ART = {
  caninde:    { bg: "bg_caninde",   cut: "cut_film",      dance: "cut_dance" },
  caninde2:   { bg: "bg_caninde",   cut: "cut_edit" },
  fortaleza:  { bg: "bg_fortaleza", cut: "cut_fortaleza" },
  fortaleza2: { bg: "bg_fortaleza", cut: "cut_film" },
  tour:       { bg: "bg_tour",      cut: "cut_tour" },
  tour_sul:   { bg: "bg_tour",      cut: "cut_tour" },
  porto:      { bg: "bg_porto",     cut: "cut_porto" },
  porto2:     { bg: "bg_porto",     cut: "cut_porto" },
  lisboa:     { bg: "bg_lisboa",    cut: "cut_lisboa" },
  empresa:    { bg: "bg_studio",    cut: "cut_studio",    outroBg: "bg_warner" },
  warner:     { bg: "bg_warner",    cut: "cut_studio" },
  ibiza:      { bg: "bg_ibiza",     cut: "cut_dance",     outroBg: "bg_egypt" },
  mundo:      { bg: "bg_egypt",     cut: "cut_drone" },
};
const PORTRAITS = {
  "Luan": "por_luan", "Junin": "por_junin", "Tirullipa": "por_tirullipa",
  "André": "por_andre", "Alex": "por_alex", "Wesley Safadão": "por_safadao",
};

// ── Input ─────────────────────────────────────────────────────────
let pointer = null;
let keysPressed = [];
const held = new Set();
let swipe = null, swipeStart = null;
let scale = 1, offX = 0, offY = 0;
const GAME_KEYS = ["Space","Enter","Escape","Tab","ArrowUp","ArrowDown","ArrowLeft","ArrowRight",
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

// ── Helpers de desenho ────────────────────────────────────────────
function px(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x | 0, y | 0, w | 0, h | 0); }
function text(t, x, y, size, c, align = "left") {
  ctx.fillStyle = c; ctx.font = `bold ${size}px monospace`;
  ctx.textAlign = align; ctx.textBaseline = "top"; ctx.fillText(t, x, y);
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
    text(b.label, b.x + b.w / 2, b.y + b.h / 2 - 7, 12, "#ffe9c4", "center");
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

// ── Cenários procedurais ──────────────────────────────────────────
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
    px(0, 150, 280, 110, "#8a5a3a");
    px(120, 60, 14, 95, "#d8d0c0");
    px(117, 52, 20, 14, "#d8d0c0");
    px(108, 78, 12, 5, "#d8d0c0"); px(134, 78, 12, 5, "#d8d0c0");
    px(116, 150, 22, 10, "#b8b0a0");
    px(330, 170, 90, 90, "#e8ddc8");
    px(340, 150, 16, 20, "#e8ddc8"); px(394, 150, 16, 20, "#e8ddc8");
    px(344, 142, 8, 8, "#c9a44a"); px(398, 142, 8, 8, "#c9a44a");
    px(360, 200, 30, 60, "#7a4a2a");
    for (let i = 0; i < 6; i++) px(20 + i * 105, 230, 70, 50, ["#c97a4a","#d9985a","#b96a3f"][i % 3]);
    px(0, 280, W, 80, "#a3683c");
  },
  fortaleza(t) {
    skyGrad("#7ec8e3", "#f4c46a");
    drawSun(90, 70, 26, "#fff2b0");
    px(0, 200, W, 60, "#2a7fa8");
    for (let i = 0; i < 8; i++) px(10 + i * 80, 205 + Math.sin(t / 400 + i) * 3, 40, 4, "#bfe8f4");
    px(60, 190, 200, 8, "#6a5a4a");
    for (let i = 0; i < 7; i++) px(70 + i * 28, 198, 6, 30, "#5a4a3a");
    px(300, 165, 8, 35, "#3a8a6a"); px(296, 158, 16, 10, "#3a8a6a");
    for (let i = 0; i < 6; i++) {
      const h2 = 60 + (i * 37) % 50;
      px(380 + i * 42, 200 - h2, 34, h2 + 60, ["#e8e0d0","#d0c8b8","#c8d8e0"][i % 3]);
      for (let j = 0; j < 4; j++) px(386 + i * 42, 210 - h2 + j * 22, 8, 8, "#f4c46a");
    }
    px(0, 260, W, 100, "#e8d4a0");
  },
  tour(t) {
    skyGrad("#5a3a6a", "#f49a4a");
    drawSun(320, 110, 34, "#ffd9a0");
    px(0, 200, W, 60, "#3a5a3a");
    for (let i = 0; i < 10; i++) px(i * 68, 185 + (i % 3) * 8, 30, 30, "#2a4a2a");
    px(0, 260, W, 100, "#4a4a52");
    const dash = (t / 6) % 80;
    for (let i = -1; i < 9; i++) px(i * 80 + dash, 305, 40, 6, "#f4d44a");
    px(60, 218, 130, 44, "#e84a6a"); px(60, 226, 130, 10, "#fff");
    px(75, 226, 18, 14, "#aee4f4"); px(105, 226, 18, 14, "#aee4f4"); px(135, 226, 18, 14, "#aee4f4");
    ctx.fillStyle = "#222"; ctx.beginPath(); ctx.arc(90, 264, 9, 0, 7); ctx.arc(160, 264, 9, 0, 7); ctx.fill();
  },
  porto(t) {
    skyGrad("#4a5a78", "#8a92a8");
    for (let i = 0; i < 9; i++) {
      const h2 = 70 + (i * 29) % 40;
      px(i * 72, 190 - h2 + 70, 60, h2, ["#c9762a","#a83a3a","#3a6a8a","#c9b44a","#7a5a8a"][i % 5]);
      for (let j = 0; j < 3; j++) px(i * 72 + 10, 200 - h2 + 70 + j * 24, 10, 14, "#f4e4b0");
    }
    px(0, 260, W, 40, "#2a3a52");
    ctx.strokeStyle = "#3a3a42"; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(320, 268, 150, Math.PI, 0); ctx.stroke();
    px(170, 230, 300, 8, "#3a3a42");
    px(0, 300, W, 60, "#5a5a62");
    ctx.strokeStyle = "rgba(200,210,230,0.35)"; ctx.lineWidth = 1;
    for (let i = 0; i < 30; i++) {
      const rx = (i * 67 + t / 3) % W, ry = (i * 41 + t / 2) % H;
      ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 3, ry + 10); ctx.stroke();
    }
  },
  lisboa(t) {
    skyGrad("#2a3a5a", "#e88a5a");
    drawSun(540, 100, 24, "#ffd9a0");
    px(0, 140, W, 6, "#a83a2a");
    px(120, 90, 10, 56, "#a83a2a"); px(420, 90, 10, 56, "#a83a2a");
    ctx.strokeStyle = "#a83a2a"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, 130); ctx.quadraticCurveTo(125, 80, 270, 128); ctx.quadraticCurveTo(425, 80, W, 130); ctx.stroke();
    for (let i = 0; i < 9; i++) px(i * 72, 180 + (i % 3) * 10, 62, 90, ["#e8d4b0","#d4b896","#e0c8a8"][i % 3]);
    for (let i = 0; i < 9; i++) px(i * 72, 172 + (i % 3) * 10, 62, 10, "#a85a3a");
    px(0, 280, W, 80, "#8a8a92");
    for (let i = 0; i < 40; i++) px((i * 37) % W, 285 + (i * 13) % 70, 4, 4, "#d8d8e0");
    const tx = 80 + Math.sin(t / 2000) * 30;
    px(tx, 236, 90, 46, "#f4c42a"); px(tx, 244, 90, 8, "#fff");
    px(tx + 10, 246, 14, 14, "#aee4f4"); px(tx + 38, 246, 14, 14, "#aee4f4"); px(tx + 66, 246, 14, 14, "#aee4f4");
    px(tx + 40, 226, 4, 10, "#444");
  },
  studio(t) {
    skyGrad("#1a1a2a", "#2a2438");
    px(0, 0, W, H, "#241e34");
    px(0, 280, W, 80, "#1a1626");
    for (let i = 0; i < 3; i++) {
      px(60 + i * 190, 90, 140, 90, "#0a0a14");
      px(66 + i * 190, 96, 128, 60, ["#3a6af4","#e84a8a","#3af4aa"][i]);
      const wave = Math.sin(t / 300 + i) * 8;
      px(70 + i * 190, 160, 120, 8, "#2a2a3a"); px(70 + i * 190, 160, 60 + wave * 3, 8, "#e8a33d");
    }
    px(40, 220, 560, 14, "#3a3048");
    px(100, 196, 40, 24, "#888"); px(110, 188, 20, 10, "#666");
    px(480, 190, 50, 30, "#555"); px(495, 180, 20, 12, "#777");
    px(300, 200, 8, 20, "#aaa"); px(294, 196, 20, 6, "#aaa");
    px(20, 30, 10, 10, "#f4d44a"); px(610, 30, 10, 10, "#f4d44a");
    ctx.fillStyle = "rgba(244,212,74,0.06)";
    ctx.beginPath(); ctx.moveTo(25, 40); ctx.lineTo(150, 280); ctx.lineTo(0, 280); ctx.fill();
    ctx.beginPath(); ctx.moveTo(615, 40); ctx.lineTo(640, 280); ctx.lineTo(490, 280); ctx.fill();
  },
  warner(t) {
    skyGrad("#0a0a1a", "#1a1228");
    px(0, 0, W, H, "#0f0a1a");
    // Backlot — grandes soundstages
    for (let i = 0; i < 4; i++) {
      px(20 + i * 155, 100, 140, 180, ["#1a1828","#221930","#1e1630","#1a1a2a"][i]);
      px(20 + i * 155, 100, 140, 8, "#3a2a5a");
      px(40 + i * 155, 116, 30, 20, "#aee4f4");
      px(90 + i * 155, 116, 30, 20, "#aee4f4");
    }
    // Banner Warner Bros
    px(W / 2 - 100, 30, 200, 50, "#c9a200");
    px(W / 2 - 96, 34, 192, 42, "#f4d400");
    text("WARNER BROS", W / 2, 44, 14, "#1a0a00", "center");
    // Chão / estrada de set
    px(0, 280, W, 80, "#2a2830");
    for (let i = 0; i < 20; i++) px(i * 34, 286, 18, 4, "#3a3848");
    // Luzes giratórias
    const ang = t / 800;
    for (let i = 0; i < 5; i++) {
      const lx = 60 + i * 130, ly = 70;
      ctx.fillStyle = `rgba(255,200,100,${0.4 + Math.sin(ang + i) * 0.3})`;
      ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + Math.cos(ang + i) * 60, ly + 80); ctx.lineTo(lx + Math.cos(ang + i + 0.3) * 60, ly + 80); ctx.fill();
    }
  },
  ibiza(t) {
    skyGrad("#0a0a3a", "#3a0a5a");
    // Mar
    px(0, 200, W, 160, "#051828");
    for (let i = 0; i < 10; i++) px(i * 70, 205 + Math.sin(t / 600 + i) * 4, 40, 5, "#0a3a5a");
    // Palco festival
    px(100, 100, 440, 130, "#1a1228");
    px(100, 100, 440, 10, "#3a0a5a");
    px(200, 80, 240, 22, "#5a0a8a");
    // Luzes de palco
    const colors = ["#f43a8a","#3af4d4","#f4d400","#3a8af4","#f48a3a"];
    for (let i = 0; i < 8; i++) {
      const lx = 120 + i * 52, phase = t / 400 + i;
      ctx.fillStyle = colors[i % colors.length].replace(")", `,${0.5 + Math.sin(phase) * 0.4})`).replace("rgb", "rgba").replace("#", "rgba(").replace(/([0-9a-f]{2})/gi, m => parseInt(m, 16) + ",");
      // Simplified: just draw colored spots
      ctx.fillStyle = colors[i % colors.length];
      ctx.globalAlpha = 0.5 + Math.sin(phase) * 0.4;
      ctx.beginPath(); ctx.arc(lx, 108, 10, 0, 7); ctx.fill();
      ctx.globalAlpha = 0.2 + Math.sin(phase) * 0.15;
      ctx.beginPath(); ctx.moveTo(lx, 118); ctx.lineTo(lx - 20, 230); ctx.lineTo(lx + 20, 230); ctx.fill();
      ctx.globalAlpha = 1;
    }
    // Multidão
    for (let i = 0; i < 30; i++) {
      const px2 = (i * 47) % W, bob = Math.sin(t / 300 + i) * 4;
      px(px2, 240 + bob, 8, 20, ["#e84a6a","#3a8af4","#f4d44a","#3af48a"][i % 4]);
    }
    px(0, 260, W, 100, "#151020");
  },
  egypt(t) {
    skyGrad("#f4b44a", "#d97a3a");
    drawSun(320, 90, 40, "#fff0c0");
    ctx.fillStyle = "#c9985a";
    ctx.beginPath(); ctx.moveTo(150, 260); ctx.lineTo(260, 90); ctx.lineTo(370, 260); ctx.fill();
    ctx.fillStyle = "#b9854a";
    ctx.beginPath(); ctx.moveTo(330, 260); ctx.lineTo(430, 130); ctx.lineTo(530, 260); ctx.fill();
    ctx.fillStyle = "#a9784a";
    ctx.beginPath(); ctx.moveTo(60, 260); ctx.lineTo(130, 170); ctx.lineTo(200, 260); ctx.fill();
    px(500, 230, 70, 30, "#c9985a"); px(556, 210, 22, 26, "#c9985a"); px(550, 204, 32, 10, "#b9854a");
    px(0, 260, W, 100, "#e8c87a");
    const dx = 200 + Math.sin(t / 900) * 120, dy = 60 + Math.cos(t / 700) * 20;
    px(dx, dy, 24, 8, "#333"); px(dx - 6, dy - 4, 10, 4, "#555"); px(dx + 20, dy - 4, 10, 4, "#555");
    px(dx + 8, dy + 8, 8, 6, "#e84a4a");
  },
};

// ── Personagens (pixel art) ───────────────────────────────────────
function drawHero(x, y, t, act) {
  const bob = Math.sin(t / 250) * 2;
  px(x + 4, y + bob, 16, 14, "#5a3a28");
  px(x + 5, y + 6 + bob, 14, 10, "#c98a5a");
  px(x + 8, y + 9 + bob, 3, 3, "#1a1028"); px(x + 14, y + 9 + bob, 3, 3, "#1a1028");
  px(x + 2, y + 16 + bob, 20, 20, act >= 2 ? "#e85a3a" : "#f47a4a");
  px(x + 2, y + 36 + bob, 8, 14, "#2a3a5a"); px(x + 14, y + 36 + bob, 8, 14, "#2a3a5a");
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
  px(0, 0, W, 26, "rgba(20,12,32,0.92)");
  const cur = ch.act >= 2 ? STR.euro : STR.money;
  text(`${cur}${S.money}`, 8, 6, 13, "#f4d44a");
  text(`${STR.rep} ${S.rep}`, 110, 6, 13, "#3af48a");
  text(`${STR.skill} ${S.skill}`, 210, 6, 13, "#88c4f4");
  text(`🎞${S.footage} ✂${S.edited}`, 330, 6, 13, "#e8a0f4");
  text(`${STR.day} ${S.day}`, W - 90, 6, 12, "#a89ab8", "left");
  text(`${ch.place}`, W - 8, 6, 12, "#ffe9c4", "right");
  px(0, H - 22, W, 22, "rgba(20,12,32,0.88)");
  text(`${STR.goalLabel}: ${ch.goalText}`, 8, H - 18, 12, "#f4a44a");
  if (S.msg && S.msgT > 0) {
    px(W / 2 - 170, 38, 340, 26, "rgba(20,12,32,0.92)");
    text(S.msg, W / 2, 44, 13, "#ffe9c4", "center");
  }
  // Evento aleatório
  if (S.event && S.event.t > 0) {
    const a = Math.min(1, S.event.t / 800);
    ctx.globalAlpha = a;
    px(W / 2 - 200, H / 2 - 20, 400, 40, "rgba(20,12,32,0.97)");
    px(W / 2 - 200, H / 2 - 20, 400, 3, S.event.color || "#f4d44a");
    outlineText(S.event.msg, W / 2, H / 2 - 10, 14, S.event.color || "#f4d44a");
    ctx.globalAlpha = 1;
  }
}

// ── Progressão ───────────────────────────────────────────────────
function camLevel() {
  const o = S.owned;
  if (o.drone && o.a7) return 6; if (o.a7) return 5; if (o.dslr) return 4;
  if (o.hd) return 3; if (o.n73) return 2; if (o.v3) return 1; return 0;
}
function editLevel() { const o = S.owned; if (o.vegas) return 2; if (o.wmm) return 1; return 0; }
function flash(m) { S.msg = m; S.msgT = 2200; }
function goalMet() {
  const g = CHAPTERS[S.chapter].goal;
  return (!g.money || S.money >= g.money) && (!g.rep || S.rep >= g.rep) && (!g.skill || S.skill >= g.skill);
}
function nextDay() {
  S.day++;
  // Eventos aleatórios (8% por dia)
  if (rng() < 0.08) triggerRandomEvent();
  save();
}
function triggerRandomEvent() {
  const ch = CHAPTERS[S.chapter];
  const actEvents = [
    [
      { msg: `${STR.eventViral} +80 REP`, color: "#f4d44a", rep: 80 },
      { msg: `${STR.eventClient} +R$300`, color: "#3af48a", money: 300 },
      { msg: `${STR.eventFail} -R$150`, color: "#e84a4a", money: -150 },
    ],
    [
      { msg: `${STR.eventFeature} +150 REP`, color: "#f4d44a", rep: 150 },
      { msg: `${STR.eventBonus} +€500`, color: "#3af48a", money: 500 },
      { msg: `${STR.eventFail} -€200`, color: "#e84a4a", money: -200 },
    ],
    [
      { msg: `${STR.eventFeature} +200 REP`, color: "#f4d44a", rep: 200 },
      { msg: `${STR.eventBonus} +€2000`, color: "#3af48a", money: 2000 },
      { msg: `${STR.eventViral} +300 REP`, color: "#88f4d4", rep: 300 },
    ],
  ];
  const pool = actEvents[Math.min(2, ch.act - 1)];
  const ev = pool[(rng() * pool.length) | 0];
  S.event = { msg: ev.msg, color: ev.color, t: 3000 };
  if (ev.money) S.money = Math.max(0, S.money + ev.money);
  if (ev.rep) S.rep += ev.rep;
}
function addFriend(name) {
  if (!S.friends[name]) S.friends[name] = 0;
  if (S.friends[name] < 5) S.friends[name]++;
}
function friendBonus(name) { return (S.friends[name] || 0) >= 3; }

// ── Mini-jogo: GRAVAR (guitar-hero) ──────────────────────────────
const LANE_KEYS = ["KeyA", "KeyS", "KeyD", "KeyF"];
const LANE_COLORS = ["#e84a6a", "#3a8af4", "#f4d43a", "#3af48a"];
const HIT_Y = H - 70;
let rec = null;
function startRecord() {
  if (camLevel() === 0 && CHAPTERS[S.chapter].id !== "caninde") { flash("Precisas de uma câmera! Vai à loja."); return; }
  const ch = CHAPTERS[S.chapter];
  const n = 10 + ch.act * 4 + (S.skill >> 4);
  const speed = 0.10 + ch.act * 0.02 + Math.min(0.05, S.skill / 2000);
  const notes = [];
  let tt = 1200;
  for (let i = 0; i < n; i++) { notes.push({ lane: (rng() * 4) | 0, t: tt, hit: 0 }); tt += 480 + ((rng() * 3) | 0) * 160; }
  rec = { notes, t: 0, speed, hits: 0, perfect: 0, combo: 0, maxCombo: 0, done: false, doneT: 0,
    tip: STR.tips[(rng() * STR.tips.length) | 0] };
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
    rec.done = true; rec.doneT = 1800;
    const lvl = Math.max(1, camLevel());
    S.footage += Math.max(1, (rec.hits * lvl + rec.perfect * lvl) >> 1);
    S.skill += 2 + (rec.maxCombo >> 1);
    flash(rec.perfect > rec.notes.length / 2 ? STR.recordPerfect : rec.hits > rec.notes.length / 3 ? STR.recordGood : STR.recordBad);
    nextDay();
  }
}
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
  text(`${["V3 240p","V3 240p","N73 480p","HD 720p","DSLR 1080p","A7 4K","A7+DRONE 4K"][camLevel()]}`, W - 10, 9, 11, "#fff", "right");
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
      px(W / 2 - 150, H / 2 - 44, 300, 88, "rgba(20,12,32,0.94)");
      outlineText(`${rec.hits}/${rec.notes.length} tomadas`, W / 2, H / 2 - 32, 16, "#f4d44a");
      outlineText(`${rec.perfect} perfeitas · combo ${rec.maxCombo}x`, W / 2, H / 2 - 6, 13, "#ffe9c4");
    } else outlineText(STR.recordHint, W / 2, H - 22, 11, "rgba(255,233,196,0.8)");
  }
}

// ── Mini-jogo: DANÇAR (gestos de mouse/dedo) ──────────────────────
let dance = null;
const ARROWS = ["ArrowLeft","ArrowUp","ArrowDown","ArrowRight"];
const ARROW_CHAR = { ArrowLeft: "←", ArrowUp: "↑", ArrowDown: "↓", ArrowRight: "→" };
const DIRS = [[-1,0],[0,-1],[0,1],[1,0]];
function startDance() {
  const n = 6 + Math.min(8, (S.rep / 15) | 0);
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
    dance.done = true; dance.doneT = 1800;
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
  const cx = W / 2, cy = H / 2 + 10;
  ctx.strokeStyle = "rgba(255,233,196,0.5)"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, 46, 0, 7); ctx.stroke();
  for (const n of dance.notes) {
    if (n.hit) continue;
    const dtN = n.t - dance.t;
    if (dtN > 1600 || dtN < -420) continue;
    const r = 46 + Math.max(0, dtN) * 0.16;
    const a = Math.max(0.15, 1 - dtN / 1600);
    const [dx2, dy2] = DIRS[n.dir];
    ctx.strokeStyle = `rgba(244,212,74,${a})`; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke();
    if (dtN < 700) {
      outlineText(ARROW_CHAR[ARROWS[n.dir]], cx, cy - 14, 40, "#f4d44a");
      ctx.strokeStyle = "#3af48a"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + dx2 * 70, cy + dy2 * 70); ctx.stroke();
    }
    break;
  }
  if (dance.combo >= 3) outlineText(`${dance.combo}x ${STR.combo}`, W / 2, 36, 20, "#f4d44a");
  if (dance.done) {
    px(W / 2 - 150, H / 2 - 44, 300, 88, "rgba(20,12,32,0.94)");
    outlineText(`${dance.hits}/${dance.notes.length} passos`, W / 2, H / 2 - 32, 16, "#f4d44a");
    outlineText(`combo ${dance.maxCombo}x`, W / 2, H / 2 - 6, 13, "#ffe9c4");
  } else outlineText(STR.danceSwipeHint, W / 2, H - 24, 11, "rgba(255,233,196,0.85)");
}

// ── Mini-jogo: COBRIR EVENTO (coverage) ──────────────────────────
const COV_ICONS = ["🎤","👥","🌅","💃","🎬","🎧"];
const COV_NAMES = ["Close artista","Reação plateia","Plano aberto","Dança","Detalhe","Bastidor"];
let cov = null;
function startCoverage() {
  if (camLevel() === 0) { flash("Precisas de uma câmera! Vai à loja."); return; }
  cov = {
    targets: [],     // {x,y,icon,name,born,deadline,hit}
    t: 0, duration: 12000,
    score: 0, missed: 0,
    spawnNext: 1200,
    done: false, doneT: 0,
    tip: STR.tips[(rng() * STR.tips.length) | 0],
  };
  S.scene = "coverage";
}
function spawnCovTarget() {
  const icon = (rng() * COV_ICONS.length) | 0;
  cov.targets.push({
    x: 80 + rng() * (W - 160), y: 60 + rng() * (H - 160),
    icon, name: COV_NAMES[icon],
    born: cov.t, deadline: cov.t + 1600 + rng() * 800,
    hit: false, pulse: 0,
  });
}
function updateCoverage(dt) {
  if (cov.done) { cov.doneT -= dt; if (cov.doneT <= 0) { S.scene = "play"; cov = null; } return; }
  cov.t += dt;
  if (cov.t >= cov.spawnNext && cov.t < cov.duration) {
    spawnCovTarget();
    cov.spawnNext = cov.t + 1200 + rng() * 600;
  }
  for (const tgt of cov.targets) {
    if (!tgt.hit && cov.t > tgt.deadline) { tgt.hit = "miss"; cov.missed++; }
  }
  // Clicar/tocar num alvo
  if (pointer) {
    for (const tgt of cov.targets) {
      if (tgt.hit) continue;
      if (Math.hypot(pointer.x - tgt.x, pointer.y - tgt.y) < 36) {
        tgt.hit = "ok"; cov.score++;
        if (camLevel() >= 3) S.skill++;
        pointer = null; break;
      }
    }
  }
  if (keysPressed.includes("Space")) {
    // Captura o alvo mais próximo do centro
    let best = null, bestD = 100;
    for (const tgt of cov.targets) {
      if (tgt.hit) continue;
      const d = Math.hypot(tgt.x - W / 2, tgt.y - H / 2);
      if (d < bestD) { best = tgt; bestD = d; }
    }
    if (best) { best.hit = "ok"; cov.score++; }
  }
  if (cov.t >= cov.duration) {
    cov.done = true; cov.doneT = 2000;
    const lvl = Math.max(1, camLevel());
    S.footage += Math.max(1, cov.score * lvl);
    S.skill += Math.max(1, cov.score >> 1);
    flash(cov.score >= 6 ? STR.coverageWin : STR.coverageFail);
    nextDay();
  }
}
function renderCoverage(t) {
  drawChapterBG(t, "bg");
  ctx.fillStyle = "rgba(10,6,20,0.38)"; ctx.fillRect(0, 0, W, H);
  if (!cov) return;
  // Progresso de tempo
  const prog = Math.min(1, cov.t / cov.duration);
  px(0, 28, W, 5, "#2a1f3d");
  px(0, 28, W * (1 - prog), 5, "#e84a6a");
  // Alvos
  for (const tgt of cov.targets) {
    if (tgt.hit === "miss") continue;
    const age = cov.t - tgt.born;
    const life = tgt.deadline - tgt.born;
    const rem = Math.max(0, 1 - age / life);
    if (tgt.hit === "ok") {
      // Flash de acerto
      ctx.globalAlpha = Math.max(0, 1 - (age - life * 0.7) * 2);
      text("✓", tgt.x, tgt.y - 16, 28, "#3af48a", "center");
      ctx.globalAlpha = 1;
      continue;
    }
    // Anel de urgência (encolhe com o tempo)
    ctx.strokeStyle = `rgba(244,164,74,${0.4 + rem * 0.6})`;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(tgt.x, tgt.y, 32 + rem * 20, 0, 7); ctx.stroke();
    // Ícone + nome
    text(COV_ICONS[tgt.icon], tgt.x, tgt.y - 20, 28, "#fff", "center");
    text(tgt.name, tgt.x, tgt.y + 16, 9, "#ffe9c4", "center");
    // Barra de tempo restante
    px(tgt.x - 20, tgt.y + 30, 40, 4, "#2a1f3d");
    px(tgt.x - 20, tgt.y + 30, 40 * rem, 4, rem < 0.3 ? "#e84a4a" : "#f4d44a");
  }
  // HUD score
  px(W - 120, 36, 110, 22, "rgba(20,12,32,0.9)");
  text(`📹 ${cov.score} capturados`, W - 114, 40, 11, "#3af48a");
  outlineText(cov.tip, W / 2, 60, 10, "#ffe9c4");
  if (cov.done) {
    px(W / 2 - 160, H / 2 - 44, 320, 88, "rgba(20,12,32,0.94)");
    outlineText(`${cov.score} shots capturados`, W / 2, H / 2 - 32, 16, "#f4d44a");
    outlineText(`${cov.missed} perdidos`, W / 2, H / 2 - 6, 13, "#ffe9c4");
  } else outlineText(STR.coverageHint, W / 2, H - 24, 11, "rgba(255,233,196,0.85)");
  vhs(t); hud();
}

// ── Mini-jogo: ESTABILIZAR (crosshair) ───────────────────────────
let stab = null;
function startStabilize() {
  if (camLevel() === 0) { flash("Precisas de uma câmera! Vai à loja."); return; }
  stab = {
    cx: W / 2, cy: H / 2,
    vx: (rng() - 0.5) * 0.06, vy: (rng() - 0.5) * 0.06,
    score: 0, total: 0,
    t: 0, duration: 9000,
    braceT: 0,       // se > 0, brace ativo (reduz velocidade)
    done: false, doneT: 0,
  };
  S.scene = "stabilize";
}
function updateStabilize(dt) {
  if (stab.done) { stab.doneT -= dt; if (stab.doneT <= 0) { S.scene = "play"; stab = null; } return; }
  stab.t += dt;
  // Toque = brace (recentra levemente)
  if (pointer) {
    stab.vx += (W / 2 - stab.cx) * 0.006;
    stab.vy += (H / 2 - stab.cy) * 0.006;
    stab.braceT = 400;
    pointer = null;
  }
  if (keysPressed.includes("Space")) {
    stab.vx += (W / 2 - stab.cx) * 0.012;
    stab.vy += (H / 2 - stab.cy) * 0.012;
    stab.braceT = 400;
  }
  if (stab.braceT > 0) stab.braceT -= dt;
  // Física: deriva + noise
  const noiseX = (rng() - 0.5) * 0.04, noiseY = (rng() - 0.5) * 0.04;
  const damp = stab.braceT > 0 ? (S.owned.stab ? 0.985 : 0.97) : 0.996;
  stab.vx = stab.vx * damp + noiseX;
  stab.vy = stab.vy * damp + noiseY;
  stab.vx += Math.sin(stab.t / 1400) * 0.005;
  stab.vy += Math.cos(stab.t / 900) * 0.005;
  stab.cx += stab.vx * dt;
  stab.cy += stab.vy * dt;
  stab.cx = Math.max(40, Math.min(W - 40, stab.cx));
  stab.cy = Math.max(40, Math.min(H - 40, stab.cy));
  stab.total++;
  const inTarget = Math.hypot(stab.cx - W / 2, stab.cy - H / 2) < 30;
  if (inTarget) stab.score++;
  if (stab.t >= stab.duration) {
    stab.done = true; stab.doneT = 2000;
    const pct = stab.total > 0 ? (stab.score / stab.total) : 0;
    S.skill += Math.round(pct * 12);
    S.footage += pct > 0.5 ? 2 : 1;
    flash(pct > 0.65 ? STR.stabilizeWin : STR.stabilizeFail);
    nextDay();
  }
}
function renderStabilize(t) {
  drawChapterBG(t, "cut");
  ctx.fillStyle = "rgba(10,6,20,0.5)"; ctx.fillRect(0, 0, W, H);
  if (!stab) return;
  // Tempo
  const prog = stab.t / stab.duration;
  px(0, 28, W * (1 - prog), 4, "#3af4d4");
  // Target circle
  const inTarget = Math.hypot(stab.cx - W / 2, stab.cy - H / 2) < 30;
  ctx.strokeStyle = inTarget ? "#3af48a" : "rgba(255,255,255,0.4)";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(W / 2, H / 2, 30, 0, 7); ctx.stroke();
  // Crosshair (mira)
  const pulse = stab.braceT > 0 ? "#88f4d4" : (inTarget ? "#3af48a" : "#e84a4a");
  ctx.strokeStyle = pulse; ctx.lineWidth = 2;
  const cx = stab.cx, cy = stab.cy;
  ctx.beginPath(); ctx.moveTo(cx - 18, cy); ctx.lineTo(cx - 6, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 6, cy); ctx.lineTo(cx + 18, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy - 18); ctx.lineTo(cx, cy - 6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy + 6); ctx.lineTo(cx, cy + 18); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 7); ctx.stroke();
  // Score bar
  if (stab.total > 0) {
    const pct = stab.score / stab.total;
    px(20, H - 36, W - 40, 8, "#2a1f3d");
    px(20, H - 36, (W - 40) * pct, 8, "#3af4d4");
    text(`${Math.round(pct * 100)}% estável`, 20, H - 50, 11, "#3af4d4");
  }
  if (stab.done) {
    const pct = stab.total > 0 ? (stab.score / stab.total) : 0;
    px(W / 2 - 160, H / 2 - 44, 320, 88, "rgba(20,12,32,0.94)");
    outlineText(`${Math.round(pct * 100)}% estável`, W / 2, H / 2 - 32, 16, "#f4d44a");
    outlineText(S.owned.stab ? "Estabilizador ajudou!" : "Compra um estabilizador na loja!", W / 2, H / 2 - 6, 11, "#ffe9c4");
  } else {
    outlineText(STR.stabilizeHint, W / 2, H - 24, 11, "rgba(255,233,196,0.85)");
    if (!isTouch) outlineText("ESPAÇO para estabilizar", W / 2, H - 36, 10, "rgba(255,233,196,0.6)");
  }
  vhs(t); hud();
}

// ── Mini-jogo: MONTAR TIMELINE (edição) ──────────────────────────
const TL_COLORS = ["#e84a6a","#3a8af4","#f4d43a","#3af48a","#f43af4"];
let tl = null;
function startTimeline() {
  if (editLevel() === 0) { flash("Precisas do Movie Maker! (grátis na loja)"); return; }
  if (S.footage <= 0) { flash(STR.noFootage); return; }
  // Embaralhar 0-4
  const order = [0,1,2,3,4];
  for (let i = 4; i > 0; i--) { const j = (rng() * (i + 1)) | 0; [order[i], order[j]] = [order[j], order[i]]; }
  tl = {
    clips: order,        // clips disponíveis (índice = posição visual, valor = id do clip)
    slots: [null,null,null,null,null],  // slots de saída
    selected: null,      // índice do clip selecionado
    t: 0, timeLimit: 28000,
    done: false, doneT: 0,
  };
  S.scene = "timeline";
}
function updateTimeline(dt) {
  if (tl.done) { tl.doneT -= dt; if (tl.doneT <= 0) { S.scene = "play"; tl = null; } return; }
  tl.t += dt;
  if (tl.t >= tl.timeLimit) { tlFinish(); return; }
  // Verificar clique em clip ou slot
  if (pointer) {
    const handled = hitTimeline(pointer.x, pointer.y);
    if (handled) pointer = null;
  }
  // Enter confirma quando todos os slots preenchidos
  if (keysPressed.includes("Space") || keysPressed.includes("Enter")) {
    if (tl.slots.every(s => s !== null)) tlFinish();
  }
}
function hitTimeline(px2, py2) {
  // Clips row: y=60-120, 5 clips: x = 20+i*120
  for (let i = 0; i < 5; i++) {
    const cx = 28 + i * 120, cy = 65, cw = 108, ch2 = 50;
    if (px2 >= cx && px2 <= cx + cw && py2 >= cy && py2 <= cy + ch2) {
      const clipId = tl.clips[i];
      if (clipId === null) return true; // já colocado num slot
      if (tl.selected === null) { tl.selected = i; return true; }
      else {
        // Swap clips
        [tl.clips[tl.selected], tl.clips[i]] = [tl.clips[i], tl.clips[tl.selected]];
        tl.selected = null; return true;
      }
    }
  }
  // Slots row: y=180-240, 5 slots: x = 28+i*120
  for (let i = 0; i < 5; i++) {
    const sx = 28 + i * 120, sy = 185, sw = 108, sh2 = 50;
    if (px2 >= sx && px2 <= sx + sw && py2 >= sy && py2 <= sy + sh2) {
      if (tl.selected !== null) {
        const clipId = tl.clips[tl.selected];
        if (clipId !== null) {
          // Se slot já ocupado, troca de volta para clips
          if (tl.slots[i] !== null) tl.clips[tl.selected] = tl.slots[i];
          else tl.clips[tl.selected] = null;
          tl.slots[i] = clipId;
          tl.selected = null;
        }
        return true;
      }
      // Remover do slot de volta para clips (encontra posição livre)
      if (tl.slots[i] !== null) {
        for (let k = 0; k < 5; k++) {
          if (tl.clips[k] === null) { tl.clips[k] = tl.slots[i]; tl.slots[i] = null; break; }
        }
        return true;
      }
    }
  }
  return false;
}
function tlFinish() {
  tl.done = true; tl.doneT = 2000;
  let correct = 0;
  for (let i = 0; i < 5; i++) if (tl.slots[i] === i) correct++;
  const pct = correct / 5;
  const timeBonus = Math.max(0, tl.timeLimit - tl.t) / tl.timeLimit;
  const edited = Math.round(1 + pct * 3 + timeBonus * 2);
  S.footage = Math.max(0, S.footage - 1);
  S.edited += edited;
  S.skill += correct + editLevel();
  flash(correct >= 4 ? STR.timelineWin : STR.timelineFail);
  nextDay();
}
function renderTimeline(t2) {
  drawChapterBG(t2, "cut");
  ctx.fillStyle = "rgba(10,6,20,0.75)"; ctx.fillRect(0, 0, W, H);
  outlineText("MONTAR TIMELINE", W / 2, 14, 14, "#f4d44a");
  // Timer
  const rem = Math.max(0, tl.timeLimit - tl.t);
  px(20, 36, W - 40, 5, "#2a1f3d");
  px(20, 36, (W - 40) * (rem / tl.timeLimit), 5, rem < 5000 ? "#e84a4a" : "#3af4d4");
  // Clips disponíveis
  text("CLIPS", 28, 48, 10, "#a89ab8");
  for (let i = 0; i < 5; i++) {
    const cx = 28 + i * 120, cy = 65;
    const clipId = tl.clips[i];
    if (clipId === null) {
      px(cx, cy, 108, 50, "#1a1628");
      text("—", cx + 54, cy + 17, 16, "#3a2a52", "center");
    } else {
      const sel = tl.selected === i;
      px(cx + (sel ? -2 : 0), cy + (sel ? -2 : 0), 108, 50, sel ? "#f4d44a" : TL_COLORS[clipId]);
      px(cx + 2, cy + 2, 104, 46, "#1a1628");
      text(`${clipId + 1}`, cx + 14, cy + 8, 18, TL_COLORS[clipId]);
      text(STR.clipLabels[clipId], cx + 54, cy + 32, 8, "#ffe9c4", "center");
      if (sel) { px(cx - 2, cy - 2, 112, 4, "#f4d44a"); px(cx - 2, cy - 2, 4, 54, "#f4d44a"); }
    }
  }
  // Slots de saída
  text("ORDEM CORRETA:", 28, 160, 10, "#a89ab8");
  for (let i = 0; i < 5; i++) {
    const sx = 28 + i * 120, sy = 185;
    px(sx, sy, 108, 50, "#1a1628");
    px(sx, sy, 108, 2, "#3a2a52");
    text(`${i + 1}`, sx + 14, sy + 8, 11, "#3a2a52");
    if (tl.slots[i] !== null) {
      const id = tl.slots[i];
      px(sx + 2, sy + 2, 104, 46, TL_COLORS[id]);
      px(sx + 4, sy + 4, 100, 42, "#1a1628");
      text(`${id + 1}`, sx + 14, sy + 8, 18, TL_COLORS[id]);
      text(STR.clipLabels[id], sx + 54, sy + 32, 8, "#ffe9c4", "center");
      // Tick se correto
      if (id === i) { text("✓", sx + 86, sy + 6, 14, "#3af48a"); }
    }
  }
  // Botão confirmar
  if (tl.slots.every(s => s !== null)) {
    btn("✓ CONFIRMAR", W / 2 - 70, 250, 140, 30, tlFinish, "#3af48a");
    drawButtons();
  }
  if (tl.done) {
    const correct = tl.slots.filter((s, i) => s === i).length;
    px(W / 2 - 160, H / 2 - 44, 320, 88, "rgba(20,12,32,0.96)");
    outlineText(`${correct}/5 clips corretos`, W / 2, H / 2 - 32, 16, "#f4d44a");
    outlineText("Corta no movimento — o corte some.", W / 2, H / 2 - 6, 11, "#ffe9c4");
  } else outlineText(STR.timelineHint, W / 2, H - 24, 11, "rgba(255,233,196,0.85)");
  hud();
}

// ── Ações de exploração ───────────────────────────────────────────
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

// ── Exploração: mundo ─────────────────────────────────────────────
const hero = { x: 90, target: null, dir: 1, walking: false };
const GROUND = H - 78;
const ACTION_DEFS = {
  dance:     { icon: "🕺", label: STR.actDance,    fn: startDance,                           color: "#8a3af4" },
  record:    { icon: "🎥", label: STR.actRecord,   fn: startRecord,                          color: "#e84a6a" },
  edit:      { icon: "✂️",  label: STR.actEdit,     fn: doEdit,                               color: "#3a8af4" },
  publish:   { icon: "📤", label: STR.actPublish,  fn: doPublish,                            color: "#3af48a" },
  work:      { icon: "💪", label: STR.actWork,     fn: doWork,                               color: "#a87a4a" },
  talk:      { icon: "💬", label: STR.actTalk,     fn: startTalk,                            color: "#f4a43a" },
  shop:      { icon: "🛒", label: STR.actShop,     fn: () => { S.scene = "shop"; },          color: "#f4d43a" },
  coverage:  { icon: "📹", label: STR.actCoverage, fn: startCoverage,                        color: "#e84a8a" },
  stabilize: { icon: "🎯", label: STR.actStabilize,fn: startStabilize,                       color: "#3af4d4" },
  timeline:  { icon: "🎬", label: STR.actTimeline, fn: startTimeline,                        color: "#f43af4" },
};
function hotspots() {
  const ch = CHAPTERS[S.chapter];
  const spots = [];
  for (const a of ch.actions) {
    if (a === "talk") {
      ch.npcs.forEach((npc, i) => spots.push({
        icon: "", label: npc.name, color: "#f4a43a", id: "npc" + i, npcIdx: i,
        fn: () => { S.npcIdx = i; S.npcLine = 0; S.scene = "dialog"; },
      }));
    } else spots.push({ ...ACTION_DEFS[a], id: a });
  }
  const total = spots.length || 1;
  const gap = (W - 120) / Math.max(1, total - 1);
  spots.forEach((s2, i) => s2.x = total === 1 ? W / 2 : 60 + i * gap);
  return spots;
}
function npcWorldX(i, t) {
  // NPCs patrulham ao longo de uma faixa sinusoidal
  const spots = hotspots();
  const npcSpot = spots.find(s2 => s2.npcIdx === i);
  if (!npcSpot) return 120 + i * 90;
  return npcSpot.x + Math.sin(t / 2200 + i * 2.5) * 38;
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
  for (const h2 of hotspots()) {
    if (Math.abs(h2.x - hero.x) < 34 && (!best || Math.abs(h2.x - hero.x) < Math.abs(best.x - hero.x))) best = h2;
  }
  return best;
}
function drawHeroBig(t) {
  const x = hero.x - 16, y = GROUND - 64;
  const bob = hero.walking ? Math.sin(t / 90) * 3 : Math.sin(t / 400) * 1.5;
  const legSwing = hero.walking ? Math.sin(t / 90) * 6 : 0;
  ctx.save();
  if (hero.dir < 0) { ctx.translate(hero.x * 2, 0); ctx.scale(-1, 1); }
  px(x + 6, y + bob, 22, 18, "#3a2818");
  px(x + 8, y + 9 + bob, 18, 13, "#c98a5a");
  px(x + 12, y + 13 + bob, 3, 3, "#1a1028"); px(x + 20, y + 13 + bob, 3, 3, "#1a1028");
  px(x + 4, y + 22 + bob, 26, 24, "#e85a3a");
  px(x + 9, y + 28 + bob, 16, 10, "#333");
  px(x + 12, y + 30 + bob, 6, 6, "#88c4f4");
  px(x + 5, y + 46 + bob, 10, 18 + legSwing * 0.4, "#2a3a5a");
  px(x + 19, y + 46 + bob, 10, 18 - legSwing * 0.4, "#2a3a5a");
  ctx.restore();
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath(); ctx.ellipse(hero.x, GROUND + 2, 18, 5, 0, 0, 7); ctx.fill();
}
function renderPlay(t) {
  const ch = CHAPTERS[S.chapter];
  drawChapterBG(t, "bg");
  updateWalk(STEP);
  buttons = [];
  const near = nearSpot();
  for (const h2 of hotspots()) {
    const active = near && near.id === h2.id;
    const pulse = active ? Math.sin(t / 150) * 3 : 0;
    ctx.fillStyle = active ? h2.color : "rgba(20,12,32,0.75)";
    ctx.beginPath(); ctx.ellipse(h2.x, GROUND + 4, 22 + pulse, 7, 0, 0, 7); ctx.fill();
    if (h2.npcIdx !== undefined) {
      // NPC patrulha
      const nx = npcWorldX(h2.npcIdx, t);
      drawNpc(nx - 12, GROUND - 52, t, h2.npcIdx);
      // Coração de amizade
      const fr = S.friends[ch.npcs[h2.npcIdx]?.name] || 0;
      if (fr > 0) {
        for (let fi = 0; fi < fr; fi++) text("♥", nx - 10 + fi * 12, GROUND - 68, 10, "#f44a8a", "left");
      }
      // Label nome
      if (active) {
        px(h2.x - 52, GROUND - 72, 104, 22, "rgba(20,12,32,0.92)");
        text(h2.label, h2.x, GROUND - 68, 12, "#ffe9c4", "center");
      }
    } else {
      text(h2.icon, h2.x, GROUND - 38 + Math.sin(t / 300 + h2.x) * 3, 22, "#fff", "center");
      if (active) {
        px(h2.x - 52, GROUND - 72, 104, 22, "rgba(20,12,32,0.92)");
        text(h2.label, h2.x, GROUND - 68, 12, "#ffe9c4", "center");
        if (!isTouch) outlineText(STR.interactPrompt, h2.x, GROUND - 92, 11, "#f4d44a");
      }
    }
    buttons.push({ label: "", x: h2.x - 26, y: GROUND - 50, w: 52, h: 60, color: "", fn: () => {
      if (Math.abs(h2.x - hero.x) < 34) h2.fn(); else hero.target = h2.x;
    }});
  }
  drawHeroBig(t);
  if (keysPressed.includes("Space") || keysPressed.includes("Enter")) { if (near) near.fn(); }
  if (keysPressed.includes("Tab") || keysPressed.includes("Escape")) {
    if (S.scene === "play") { S.skillPanelFrom = "play"; S.scene = "skillpanel"; }
  }
  if (pointer && pointer.y > 70 && pointer.y < H - 30) {
    let onSpot = false;
    for (const b of buttons) if (pointer.x >= b.x && pointer.x <= b.x + b.w && pointer.y >= b.y && pointer.y <= b.y + b.h) onSpot = true;
    if (!onSpot) { hero.target = pointer.x; pointer = null; }
  }
  vhs(t); hud();
  // Dica inferior contextual
  const hint = isTouch ? STR.walkHintTouch : STR.walkHint;
  text(hint, W / 2, H - 36, 10, "rgba(255,233,196,0.7)", "center");
  if (!isTouch) text("[TAB] Técnicas", W - 8, H - 36, 10, "rgba(255,233,196,0.5)", "right");
  // Cap concluído
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
  const pk = PORTRAITS[npc.name];
  if (artReady("por_dioney")) {
    const im = ART.por_dioney, s = 130 / im.naturalHeight;
    ctx.drawImage(im, 16, H - 248, im.naturalWidth * s, 130);
  }
  if (pk && artReady(pk)) {
    const im = ART[pk], s = 130 / im.naturalHeight;
    ctx.drawImage(im, W - 16 - im.naturalWidth * s, H - 248, im.naturalWidth * s, 130);
  } else if (!pk) drawNpc(W - 60, H - 230, t, S.npcIdx);
  // Amizade
  const fr = S.friends[npc.name] || 0;
  if (fr > 0) {
    for (let fi = 0; fi < fr; fi++) text("♥", W / 2 - 28 + fi * 13, H - 120, 11, "#f44a8a", "left");
  }
  px(20, H - 110, W - 40, 90, "rgba(20,12,32,0.94)");
  px(20, H - 110, W - 40, 3, "#e8a33d");
  text(npc.name, 36, H - 100, 14, "#f4d44a");
  text(npc.lines[S.npcLine], 36, H - 78, 13, "#ffe9c4");
  text("▼ toca para continuar", W - 36, H - 40, 11, "#8a8298", "right");
  if (pointer || keysPressed.includes("Space") || keysPressed.includes("Enter")) {
    pointer = null; S.npcLine++;
    if (S.npcLine >= npc.lines.length) {
      S.scene = "play"; S.rep += 2;
      addFriend(npc.name);
      // Bónus de amizade
      if (friendBonus(npc.name)) flash(`+Bónus de amizade com ${npc.name}!`);
    }
  }
}

// ── Loja ──────────────────────────────────────────────────────────
function renderShop(t) {
  drawChapterBG(t, "bg");
  ctx.fillStyle = "rgba(10,6,20,0.86)"; ctx.fillRect(0, 0, W, H);
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
  if (S.msg && S.msgT > 0) { px(W / 2 - 170, H - 70, 340, 24, "rgba(20,12,32,0.96)"); text(S.msg, W / 2, H - 65, 12, "#ffe9c4", "center"); }
}

// ── Painel de técnicas (skill tree) ──────────────────────────────
function renderSkillPanel(t) {
  drawChapterBG(t, "bg");
  ctx.fillStyle = "rgba(10,6,20,0.90)"; ctx.fillRect(0, 0, W, H);
  outlineText(STR.skillPanel, W / 2, 16, 16, "#f4d44a");
  const unlocked = Math.min(STR.skillNames.length,
    camLevel() * 2 + editLevel() + Math.min(3, (S.skill / 20) | 0));
  STR.skillNames.forEach((name, i) => {
    const col = i % 2, row = (i / 2) | 0;
    const x = 30 + col * 300, y = 50 + row * 38;
    const has = i < unlocked;
    px(x, y, 280, 32, has ? "#1a2a1a" : "#1a1628");
    px(x, y, 280, 2, has ? "#3af48a" : "#3a2a52");
    text(has ? "✓" : "○", x + 8, y + 8, 14, has ? "#3af48a" : "#3a2a52");
    text(name, x + 28, y + 9, 12, has ? "#ffe9c4" : "#3a2a52");
  });
  // Stats
  px(20, H - 80, W - 40, 54, "rgba(20,12,32,0.9)");
  text(`Câmera: ${["Nenhuma","V3 240p","N73 480p","HD 720p","DSLR 1080p","A7 4K","A7+Drone"][camLevel()]}`, 30, H - 74, 11, "#88c4f4");
  text(`Editor: ${["Nenhum","Movie Maker","Sony Vegas"][editLevel()]}`, 30, H - 56, 11, "#e8a0f4");
  text(`Técnica: ${S.skill} pts  ·  Dia: ${S.day}`, 30, H - 38, 11, "#f4a44a");
  buttons = [];
  btn(STR.skillClose, W / 2 - 50, H - 20, 100, 24, () => { S.scene = S.skillPanelFrom || "play"; }, "#e84a6a");
  drawButtons();
}

// ── Intro/Outro ───────────────────────────────────────────────────
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
  if (S.event && S.event.t > 0) S.event.t -= dt;
  if (S.scene === "record"   && rec)  updateRecord(dt);
  if (S.scene === "dance"    && dance) updateDance(dt);
  if (S.scene === "coverage" && cov)  updateCoverage(dt);
  if (S.scene === "stabilize"&& stab) updateStabilize(dt);
  if (S.scene === "timeline" && tl)   updateTimeline(dt);
}
function render() {
  ctx.fillStyle = "#0f0a18"; ctx.fillRect(-offX / scale, -offY / scale, innerWidth / scale + 2, innerHeight / scale + 2);
  switch (S.scene) {
    case "title":     renderTitle(gt); break;
    case "intro":     renderStory(gt, CHAPTERS[S.chapter].intro, S.introLine,
      () => { S.scene = "play"; save(); }, () => S.introLine++); break;
    case "outro":     renderStory(gt, CHAPTERS[S.chapter].outro, S.outroLine,
      () => {
        if (S.chapter + 1 >= CHAPTERS.length) { S.scene = "end"; }
        else {
          S.chapter++; S.introLine = 0; S.scene = "intro";
          const id = CHAPTERS[S.chapter].id;
          if (id === "porto")   { S.money = 0; S.owned = {}; S.footage = 0; S.edited = 0; flash("Recomeço total..."); }
          if (id === "caninde2"){ S.owned.v3 = true; S.owned.wmm = true; }
          if (id === "empresa") { S.owned.a7 = true; S.owned.drone = true; S.owned.stab = true; }
          if (id === "warner")  { if (!S.owned.dslr) S.owned.dslr = true; }
          save();
        }
      }, () => S.outroLine++); break;
    case "play":       renderPlay(gt); break;
    case "record":     if (rec)  renderRecord(gt); break;
    case "dance":      if (dance) renderDance(gt); break;
    case "coverage":   if (cov)  renderCoverage(gt); break;
    case "stabilize":  if (stab) renderStabilize(gt); break;
    case "timeline":   if (tl)   renderTimeline(gt); break;
    case "dialog":     renderDialog(gt); break;
    case "shop":       renderShop(gt); break;
    case "skillpanel": renderSkillPanel(gt); break;
    case "end":        renderEnd(gt); break;
  }
  hitButtons();
  keysPressed = [];
  if (!["dialog","intro","outro","title","coverage","stabilize","timeline"].includes(S.scene)) pointer = null;
  swipe = null;
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
