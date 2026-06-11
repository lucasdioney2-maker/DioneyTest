# DioneyMaker RPG — Design Plan (Mode S)

## §1 Game Profile

| Axis | Value |
|---|---|
| Time | Real-time narrative + turn-based dialogue choices |
| Space | 2D scene-based (point-and-click panels with side-scroll movement) |
| Player agency | Narrative choices + equipment/skill progression |
| Conflict | Resource management (dinheiro, tempo, XP de técnica) + story tension |
| Content | Narrative linear with branching decisions and unlockable gear |
| Outcome | Non-zero sum — protagonist grows across 3 acts |
| Players | Solo |
| Session | 20–40 min per chapter; 3 acts × 3–4 chapters each |
| Engagement | Story mastery + progression (unlock gear, techniques, crew members) |
| Strictness mode | S |
| Target platforms | Desktop + mobile browsers |
| Input methods | Mouse/touch (point-and-click), keyboard shortcuts |
| Language | Portuguese (PT/BR) |

### Performance budgets
- Target FPS: 60
- Draw call budget: ≤ 60 per frame
- Worst-case scene: crew scene with 5 characters + HUD + dialogue box

---

## §2 Laws Applied

- **L1 Experience first**: Feel of living a creative life — the struggle, the discovery, the pride of leveling up gear.
- **L2 Meaningful interaction**: Every choice either spends resources or changes story. No filler clicks.
- **L3 Pattern mastery**: Player learns the filmmaker's craft loop — record → edit → publish → earn → upgrade.
- **L4 Outcome undecided**: Money runs low, visa expires, equipment breaks — tension always present.

---

## §3 Concept

**Experience formula**: "Sinto que estou a viver a jornada de um criador — começo com nada, aprendo, erro, cresce."

**Four pillars**:
- Mechanics: Resource loop (dinheiro/tempo/habilidade), gear unlock tree, mini-games (filming, editing)
- Story: 3-act autobiographical narrative of Dioney's life as a videomaker
- Aesthetics: Retro-pixel art with warm amber/gold accents, VHS scanlines overlay
- Technology: Vanilla JS + Canvas 2D, no heavy frameworks, mobile-first

**Interest curve / Act structure (expanded)**:

**Ato 1 — Brasil (a ascensão)**
1. *Canindé* — origem no sertão: dança, Motorola V3, Windows Movie Maker, Stari Rebol (Junin, Luan)
2. *Fortaleza* — salto para a capital: Sony Vegas, primeiros trabalhos pagos, contato com Tirullipa
3. *Viagens pelo Brasil* — em turnê com Tirullipa gravando pelo país, ápice da carreira no Brasil
4. *Queda* — o contrato com Tirullipa acaba → decisão de recomeçar na Europa (perde tudo)

**Ato 2 — Europa (o recomeço)**
1. *Porto* — vida nova de imigrante: trabalhos de restauração, luta pelo documento, zero equipamento
2. *Lisboa* — reconstrução: volta a comprar câmeras nível a nível, primeiros trabalhos com André

**Ato 3 — A empresa (a conquista)**
1. *Empresa no Porto* — funda a empresa com André (sócio/primo), monta a crew: Alex, Yuri, Luan, Rox, Bruni
2. *Europa e o mundo* — produções em locais reais: Warner Bros., Ibiza com Wesley Safadão, Egito
3. *Final* — drone shot épico, a crew completa, do sertão para o mundo

---

## §4 System

### Core verb table
| Verb | Object | Outcome |
|---|---|---|
| gravar | cena/evento | ganha XP técnica + footage |
| editar | vídeo | ganha moedas + reputação |
| publicar | vídeo editado | ganha seguidores + contrato |
| comprar | equipamento | desbloqueia qualidade de gravação |
| conversar | NPC | desbloqueia missão / membro da equipa |
| dançar | palco | ganha reputação inicial (Ato 1) |
| trabalhar | biscate | ganha dinheiro (sem XP técnica) |

### Progression tree (equipment)
```
Motorola V3 (240p) → Nokia N73 (480p) → Smartphone HD (720p)
→ Canon DSLR (1080p) → Sony A7 (4K) + Drone + Estabilizador
```

### Editing software progression
```
Windows Movie Maker → Sony Vegas → Premiere Pro / DaVinci
```

### Crew unlock tree
- Ato 1 (Canindé/Fortaleza): Junin (primo), Luan (irmão), Tirullipa (artista/contratante)
- Ato 2 (Porto/Lisboa): André (sócio, primeiros trabalhos)
- Ato 3 (empresa): André, Alex, Yuri, Luan, Rox, Bruni + freelancers

### Mapa de cenários por capítulo
Canindé → Fortaleza → estradas do Brasil (turnê) → Porto → Lisboa → Porto (empresa) → Warner Bros. / Ibiza / Egito

### Feedback loops
- Gravar com melhor equip → vídeo tem mais views → mais dinheiro → melhor equip
- Publicar com crew → aumenta reputação → desbloqueia contratos maiores
- Trabalhar biscate → paga conta → liberta tempo para gravar (trade-off)

### Information map
- Always visible: dinheiro, reputação, tempo (dias), equipamento atual
- On-demand: árvore de equipamentos, lista de crew, capítulo atual
- Hidden until unlocked: receitas de contratos futuros, membros de equipa

---

## §5 Prototype question

**Core question**: Does the resource loop (gravar→editar→publicar→ganhar) feel satisfying on mobile touch with the retro-pixel aesthetic?

Disposable prototype: canvas-drawn phone frame with a tap-to-record button, XP bar, and coin counter. Verify 60fps on mobile before full build.
