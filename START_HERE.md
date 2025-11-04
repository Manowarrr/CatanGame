# 🎮 Catan Project - Quick Start for AI Agent

**Status:** Phase 0-5 DONE (65%) | Phase 6 (Basic AI) DONE | Phase 6-8 TODO
**Stack:** Next.js 16 + TypeScript 5 + Zustand + Tailwind v3

---

## 📍 Current State

### ✅ What's Working
- **Core logic:** Map generation (DFS), validators, calculators (longest road), action handlers, resource distribution
- **UI:** Board (SVG hex grid), Hex/Vertex/Edge components, PlayerPanel, Button, DevCard panels, Modals
- **Game flow:** Initial placement (2 rounds), dice rolling, building (roads/settlements/cities), turn management
- **Robber mechanics:** Robber activation on 7, resource discard, stealing from players ✅
- **Development cards:** All cards implemented (Knight, Road Building, Year of Plenty, Monopoly, Victory Point) ✅
- **State management:** Zustand store with full game state + UI state
- **Types:** Complete type system in `types/game.types.ts` + `types/ai.types.ts`
- **AI (Basic):** AI players can play the game! Initial placement, building (roads/settlements/cities), robber handling ✅
- **Dev server:** `npm run dev` works, TypeScript compiles ✅
- **Playable:** Full game loop from initial placement to victory! Play against 3 AI opponents! ✅

### 🎯 Next Task: Phase 6 - Advanced AI & Phase 7 - Trading
Improve AI decision making with heuristics and scoring. Add trading system.
See: `docs/ImplementationRoadmap.md` Phase 6-7 sections.

---

## 📁 Key Files (Priority Order)

```
docs/
├── ImplementationRoadmap.md      # READ THIS FIRST - where we are, what's next
├── CodeGenerationGuide.md        # Code examples with semantic markup
└── TechSpecification.md          # Full requirements (read on demand)

knowledge_graph.xml               # Full project graph for semantic search

types/game.types.ts               # ALL game types (GameState, Player, etc)
lib/constants/game.constants.ts  # Game rules & costs
lib/game-logic/
├── mapGenerator.ts               # Generates 19 hexes + vertices + edges
├── validators.ts                 # canBuild* functions
├── calculators.ts                # VP, longest road (DFS), resource distribution
└── actionHandlers.ts             # handleBuild* functions
components/board/Board.tsx        # Main game board (SVG)
```

---

## ⚡ Quick Commands

**Find function:**
```
Grep pattern="START_FUNCTION_functionName" output_mode="content"
```

**Find all components:**
```
Glob pattern="components/**/*.tsx"
```

**Understand module:**
```
Read knowledge_graph.xml
# Search for <module_name> to see structure + links
```

---

## 🔑 Critical Rules

### 1. Semantic Markup = MANDATORY
Every file MUST have:
```typescript
// START_MODULE_[name]
// MODULE_CONTRACT: PURPOSE, SCOPE, KEYWORDS

// START_FUNCTION_[Name]
// FUNCTION_CONTRACT: PURPOSE, INPUTS, OUTPUTS, SIDE_EFFECTS
function name() {
  // START_BLOCK_[BLOCK_NAME]
  // Описание: [what this block does]
  // END_BLOCK_[BLOCK_NAME]
}
// END_FUNCTION_[Name]
```
**Why:** Enables AI navigation via Grep. See `docs/CodeGenerationGuide.md` for examples.

### 2. Tech Specifics
- ✅ Tailwind CSS **v3.4.1** (NOT v4 - we rolled back)
- ✅ ES modules (NO `"type": "commonjs"` in package.json)
- ✅ `tailwind.config.js` (NOT .ts)
- ✅ TypeScript strict mode, explicit return types
- ✅ Immutable state updates (spread operator)

### 3. Game Logic Essentials
- **Hex grid:** 19 hexes in offset layout (3-4-5-4-3 rows)
- **Graph:** Hex → Vertex (54) → Edge (72)
- **Distance rule:** Settlements must be 2+ edges apart
- **Longest road:** DFS algorithm in `calculators.ts:calculateLongestRoad()`

---

## ✅ Phase 4 Complete! (2025-10-31)

```
[✅] Create store/gameStore.ts (Zustand)
     - initializeGame, rollDice, buildRoad, buildSettlement, buildCity, endTurn actions
     - UI state management (buildMode, highlights)

[✅] Create app/game/page.tsx
     - Integrated Board + PlayerPanel
     - Initial placement UI (2 rounds with automatic highlights)
     - Dice roll panel
     - Action buttons panel
     - Current player resources display

[✅] Add distributeResources to gameUtils.ts
     - Resource distribution on dice roll
     - Building type consideration (settlement=1, city=2)

[✅] Test: Full game playable from initial placement to victory
```

**See full details:** [PHASE_4_COMPLETE.md](./PHASE_4_COMPLETE.md)

---

## 🆘 Common Issues

**Q: Where to start?**
A: Read `docs/ImplementationRoadmap.md` Phase 4 → Create `store/gameStore.ts` → Create game page

**Q: How to find function X?**
A: `Grep pattern="START_FUNCTION_X"` OR check `knowledge_graph.xml`

**Q: Code example with markup?**
A: Read `lib/game-logic/calculators.ts` OR `docs/CodeGenerationGuide.md`

**Q: Can I use Tailwind v4?**
A: ❌ NO - project uses v3.4.1 (we rolled back due to PostCSS issues)

---

## 📚 Full Docs (Reference)

- `AI_ONBOARDING.md` - Detailed guide (~350 lines)
- `docs/DevelopmentPlan.md` - Algorithms + XML function graph
- `docs/TechStackRationale.md` - Why these technologies

---

## ✅ Ready to Code?

1. Read `docs/ImplementationRoadmap.md` Phase 4 (10 min)
2. Read `docs/CodeGenerationGuide.md` Zustand example (5 min)
3. Look at existing `lib/game-logic/actionHandlers.ts` (5 min)
4. **Start:** Create `store/gameStore.ts` with semantic markup

**Time to first code:** ~20 minutes
**Next PR:** Phase 4 complete 🚀
