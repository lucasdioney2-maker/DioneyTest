// Smoke test headless: stubs de DOM/canvas, importa o jogo e percorre
// todos os capítulos simulando o jogador. Conta draw calls por frame.
let drawCalls = 0;
const ctxStub = new Proxy({}, {
  get(_, prop) {
    if (prop === "createLinearGradient") return () => ({ addColorStop() {} });
    return (...a) => { drawCalls++; };
  },
  set() { return true; },
});
const listeners = {};
globalThis.addEventListener = (ev, fn) => { (listeners[ev] ||= []).push(fn); };
globalThis.innerWidth = 1280; globalThis.innerHeight = 720;
globalThis.devicePixelRatio = 1;
globalThis.localStorage = { getItem: () => null, setItem() {}, };
globalThis.Image = class { set src(_) {} };
globalThis.location = { search: "" };
globalThis.URLSearchParams = URLSearchParams;
let rafCb = null;
globalThis.requestAnimationFrame = cb => { rafCb = cb; };
globalThis.document = {
  getElementById: id => id === "c" ? {
    getContext: () => ctxStub,
    addEventListener: (ev, fn) => { (listeners[ev] ||= []).push(fn); },
    getBoundingClientRect: () => ({ left: 0, top: 0 }),
    style: {}, width: 0, height: 0,
  } : { style: {}, textContent: "" },
};
globalThis.performance = performance;

const game = await import("../game.js");
const { STR, CHAPTERS } = await import("../strings.js");

// roda N frames
let now = performance.now();
function frames(n) {
  for (let i = 0; i < n; i++) { now += 16.7; drawCalls = 0; rafCb(now); }
}
function tap(x, y) {
  listeners.pointerdown.forEach(fn => fn({ clientX: x, clientY: y, preventDefault() {} }));
}
function key(code) {
  listeners.keydown.forEach(fn => fn({ code, preventDefault() {} }));
}

frames(5);
console.log("title scene draw calls/frame:", drawCalls);
if (drawCalls > 200) console.log("WARN: draw calls high (procedural 2D ok up to ~300)");

// começa o jogo
key("Space"); frames(2);
// percorre todos os capítulos
let guard = 0;
import fs from "node:fs";
const src = fs.readFileSync(new URL("../game.js", import.meta.url), "utf8");
// não temos acesso direto ao estado S (module-private); validamos por ausência de exceções
// avança intros com Space e simula muitos toques de ação ao longo de frames
for (let i = 0; i < 4000 && guard < 4000; i++, guard++) {
  key("Space"); frames(1);
  // toques espalhados na zona dos botões de ação e diálogos
  tap(640, 600); tap(400, 620); tap(880, 600); frames(1);
  key("ArrowLeft"); key("ArrowUp"); key("ArrowDown"); key("ArrowRight"); frames(1);
}
frames(60);
console.log("survived 4000 interaction cycles, final draw calls/frame:", drawCalls);
console.log("chapters defined:", CHAPTERS.length, "| equip items:", STR.equip.length);
console.log("SMOKE OK");
