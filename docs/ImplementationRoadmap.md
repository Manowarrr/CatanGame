# Implementation Roadmap - Catan Game Development
# Дорожная карта реализации - Разработка игры Catan

---

## MODULE_CONTRACT

**PURPOSE:**
Этот документ описывает пошаговую дорожную карту реализации игры Catan. Он разбивает процесс разработки на логические этапы, определяет зависимости между компонентами, приоритизирует задачи и предоставляет критерии готовности для каждой фазы.

**SCOPE:**
- Определение фаз разработки (Phases)
- Разбиение по спринтам (Sprints)
- Зависимости между компонентами и модулями
- Критерии приемки (Definition of Done) для каждой фазы
- Риски и митигации
- Порядок тестирования

**INPUTS:**
- TechSpecification.md - техническое задание с требованиями
- DevelopmentPlan.md - архитектурный план и семантический граф функций
- TechStackRationale.md - обоснование выбора технологий
- semantic_template.txt - шаблон семантической разметки кода

**OUTPUTS:**
- Структурированный план реализации по фазам
- Последовательность создания компонентов и модулей
- Чек-листы для каждого этапа
- План интеграционного тестирования

**KEYWORDS:**
- Implementation phases (фазы реализации)
- Sprint planning (планирование спринтов)
- Component dependencies (зависимости компонентов)
- Definition of Done (критерии готовности)
- Integration testing (интеграционное тестирование)
- Risk mitigation (митигация рисков)

**MODULE_MAP:**
```
SECTION [Общая структура реализации] => Overview
SECTION [Фаза 0: Инфраструктура проекта] => Phase_0_Infrastructure
SECTION [Фаза 1: Типы и модели данных] => Phase_1_Data_Models
SECTION [Фаза 2: Базовая логика игры] => Phase_2_Core_Game_Logic
SECTION [Фаза 3: UI компоненты - основа] => Phase_3_UI_Foundation
SECTION [Фаза 4: Игровой процесс - базовые действия] => Phase_4_Basic_Gameplay
SECTION [Фаза 5: Продвинутая механика] => Phase_5_Advanced_Mechanics
SECTION [Фаза 6: AI оппонент] => Phase_6_AI_Opponent
SECTION [Фаза 7: Достижения и статистика] => Phase_7_Achievements
SECTION [Фаза 8: Финальная полировка] => Phase_8_Polish
SECTION [График зависимостей компонентов] => Component_Dependency_Graph
SECTION [Критерии готовности (DoD)] => Definition_of_Done
SECTION [Риски и митигации] => Risks_And_Mitigations
SECTION [План тестирования] => Testing_Plan
```

---

## START_SECTION_Overview
## Общая структура реализации

### Принципы разработки

**Итеративная разработка:**
Проект разбит на 9 фаз (Phase 0 - Phase 8), каждая из которых завершается работающим функционалом, который можно протестировать.

**Incremental delivery:**
Каждая фаза добавляет новый функционал поверх предыдущего, обеспечивая постепенное наращивание сложности.

**Test-driven approach:**
Для каждого модуля сначала определяются критерии тестирования, затем пишется код.

**Semantic markup first:**
Весь код генерируется с соблюдением semantic_template.txt с первой строки.

### Общая последовательность фаз

```
Phase 0: Infrastructure (Инфраструктура)
         └─> Next.js проект, конфигурация, базовая структура папок

Phase 1: Data Models (Модели данных)
         └─> TypeScript типы, интерфейсы, константы

Phase 2: Core Game Logic (Базовая логика)
         └─> Генерация карты, валидация, базовые операции

Phase 3: UI Foundation (Основа UI)
         └─> Layout, Board, Tile, базовые компоненты

Phase 4: Basic Gameplay (Базовые действия)
         └─> Бросок кубиков, строительство, начальная расстановка

Phase 5: Advanced Mechanics (Продвинутая механика)
         └─> Торговля, карты развития, разбойник, longest road

Phase 6: AI Opponent (AI противник)
         └─> Логика AI, эвристики, действия AI

Phase 7: Achievements (Достижения и статистика)
         └─> Система достижений, история игр, статистика

Phase 8: Polish (Финальная полировка)
         └─> Анимации, звуки, UX улучшения, баг-фиксы
```

### Временная оценка

- **Phase 0**: ~2-4 часа (setup)
- **Phase 1**: ~4-6 часов (типы и константы)
- **Phase 2**: ~8-12 часов (core логика)
- **Phase 3**: ~6-10 часов (UI foundation)
- **Phase 4**: ~10-14 часов (gameplay actions)
- **Phase 5**: ~12-16 часов (advanced mechanics)
- **Phase 6**: ~10-14 часов (AI)
- **Phase 7**: ~6-8 часов (achievements)
- **Phase 8**: ~8-12 часов (polish)

**Итого**: ~66-96 часов чистого времени разработки

## END_SECTION_Overview

---

## START_SECTION_Phase_0_Infrastructure
## Фаза 0: Инфраструктура проекта

### Цель фазы
Создать базовую инфраструктуру Next.js проекта с правильной структурой папок, конфигурацией TypeScript, Tailwind CSS и настройкой линтеров.

### Задачи

#### TASK_0.1: Инициализация Next.js проекта
```bash
npx create-next-app@latest catan-game --typescript --tailwind --app --no-src-dir
```

**Конфигурация:**
- TypeScript: strict mode enabled
- App Router (Next.js 14+)
- Tailwind CSS 3.x
- ESLint configured

**Файлы:**
- `package.json` - зависимости
- `tsconfig.json` - TypeScript конфигурация
- `tailwind.config.ts` - Tailwind конфигурация
- `next.config.mjs` - Next.js конфигурация

#### TASK_0.2: Установка дополнительных зависимостей

```bash
npm install zustand lucide-react
npm install -D @types/node
```

**Зависимости:**
- `zustand` - state management
- `lucide-react` - иконки
- `@types/node` - типы для Node.js

#### TASK_0.3: Создание структуры папок

```
app/
  ├─ layout.tsx          # Root layout
  ├─ page.tsx            # Home screen
  ├─ game/
  │   └─ page.tsx        # Game screen
  └─ history/
      └─ page.tsx        # Game history screen

components/
  ├─ board/              # Игровое поле
  ├─ screens/            # Экраны
  ├─ modals/             # Модальные окна
  └─ ui/                 # UI компоненты

lib/
  ├─ game-logic/         # Игровая логика
  ├─ ai/                 # AI логика
  ├─ utils/              # Утилиты
  └─ constants/          # Константы

store/
  └─ gameStore.ts        # Zustand store

types/
  └─ game.types.ts       # TypeScript типы

public/
  └─ assets/             # Статические ресурсы
```

#### TASK_0.4: Конфигурация семантической разметки

Создать `.clauderc` или аналогичный файл с правилами:
- Все модули должны иметь MODULE_CONTRACT
- Все функции должны иметь FUNCTION_CONTRACT
- Обязательное использование START_/END_ блоков
- Обязательное логирование

#### TASK_0.5: Настройка базового layout и globals.css

**app/layout.tsx:**
- Root layout с metadata
- Подключение globals.css

**app/globals.css:**
- Tailwind directives
- Кастомные CSS переменные для цветов ресурсов
- Базовые стили

### Definition of Done (Phase 0) ✅ COMPLETED

- [x] Next.js проект успешно инициализирован
- [x] `npm run dev` запускает проект без ошибок
- [x] Структура папок создана согласно плану
- [x] TypeScript конфигурация включает strict mode
- [x] Tailwind CSS корректно применяется
- [x] ESLint не выдает критических ошибок
- [x] Создан базовый layout с правильным metadata
- [x] Документ CLAUDE.md с инструкциями по семантической разметке создан

### Зависимости
**Requires:** Ничего (начальная фаза)
**Enables:** Phase 1, Phase 3

## END_SECTION_Phase_0_Infrastructure

---

## START_SECTION_Phase_1_Data_Models
## Фаза 1: Типы и модели данных

### Цель фазы
Создать все TypeScript типы, интерфейсы, enums и константы, необходимые для игры.

### Задачи

#### TASK_1.1: Создать базовые enums

**Файл:** `types/game.types.ts`

**Enums:**
```typescript
// Resource types
enum ResourceType {
  WOOD = 'WOOD',
  BRICK = 'BRICK',
  SHEEP = 'SHEEP',
  WHEAT = 'WHEAT',
  ORE = 'ORE',
}

// Terrain types
enum TerrainType {
  FOREST = 'FOREST',
  HILLS = 'HILLS',
  PASTURE = 'PASTURE',
  FIELDS = 'FIELDS',
  MOUNTAINS = 'MOUNTAINS',
  DESERT = 'DESERT',
}

// Building types
enum BuildingType {
  SETTLEMENT = 'SETTLEMENT',
  CITY = 'CITY',
  ROAD = 'ROAD',
}

// Development card types
enum DevCardType {
  KNIGHT = 'KNIGHT',
  VICTORY_POINT = 'VICTORY_POINT',
  ROAD_BUILDING = 'ROAD_BUILDING',
  YEAR_OF_PLENTY = 'YEAR_OF_PLENTY',
  MONOPOLY = 'MONOPOLY',
}

// Player types
enum PlayerType {
  HUMAN = 'HUMAN',
  AI = 'AI',
}

// Game phases
enum GamePhase {
  INITIAL_PLACEMENT = 'INITIAL_PLACEMENT',
  MAIN_GAME = 'MAIN_GAME',
  GAME_OVER = 'GAME_OVER',
}

// Turn phases
enum TurnPhase {
  DICE_ROLL = 'DICE_ROLL',
  ROBBER_ACTIVATION = 'ROBBER_ACTIVATION',
  ACTIONS = 'ACTIONS',
}
```

#### TASK_1.2: Создать интерфейсы для игровых объектов

**Hex (гексагон):**
```typescript
interface Hex {
  id: string;
  terrain: TerrainType;
  number: number | null; // null для пустыни
  hasRobber: boolean;
  vertexIds: string[]; // 6 вершин
  edgeIds: string[];   // 6 ребер
}
```

**Vertex (вершина):**
```typescript
interface Vertex {
  id: string;
  hexIds: string[];         // до 3 гексагонов
  building: Building | null;
  neighborVertexIds: string[];
  neighborEdgeIds: string[];
}
```

**Edge (ребро):**
```typescript
interface Edge {
  id: string;
  vertexIds: [string, string]; // 2 вершины
  hexIds: string[];            // 1-2 гексагона
  road: Road | null;
}
```

**Building (здание):**
```typescript
interface Building {
  type: BuildingType;
  playerId: string;
}
```

**Road (дорога):**
```typescript
interface Road {
  playerId: string;
}
```

**Player (игрок):**
```typescript
interface Player {
  id: string;
  name: string;
  color: string;
  type: PlayerType;
  resources: Record<ResourceType, number>;
  settlements: number; // оставшиеся в запасе
  cities: number;
  roads: number;
  devCards: DevCardType[];
  playedDevCards: DevCardType[];
  knightsPlayed: number;
  victoryPoints: number;
  hasLongestRoad: boolean;
  hasLargestArmy: boolean;
}
```

**DevelopmentCard:**
```typescript
interface DevelopmentCard {
  type: DevCardType;
  canPlayThisTurn: boolean; // false если куплена в этот ход
}
```

**TradeOffer (предложение обмена):**
```typescript
interface TradeOffer {
  playerId: string;
  offering: Partial<Record<ResourceType, number>>;
  requesting: Partial<Record<ResourceType, number>>;
}
```

**GameState (состояние игры):**
```typescript
interface GameState {
  phase: GamePhase;
  turnPhase: TurnPhase;
  currentPlayerId: string;
  players: Player[];
  hexes: Hex[];
  vertices: Vertex[];
  edges: Edge[];
  devCardDeck: DevCardType[];
  lastDiceRoll: [number, number] | null;
  longestRoadPlayerId: string | null;
  largestArmyPlayerId: string | null;
  turnNumber: number;
  winner: string | null;
}
```

#### TASK_1.3: Создать константы

**Файл:** `lib/constants/game.constants.ts`

```typescript
export const GAME_CONSTANTS = {
  VICTORY_POINTS_TO_WIN: 10,

  INITIAL_RESOURCES: {
    WOOD: 0,
    BRICK: 0,
    SHEEP: 0,
    WHEAT: 0,
    ORE: 0,
  },

  INITIAL_PIECES: {
    SETTLEMENTS: 5,
    CITIES: 4,
    ROADS: 15,
  },

  BUILDING_COSTS: {
    ROAD: { WOOD: 1, BRICK: 1 },
    SETTLEMENT: { WOOD: 1, BRICK: 1, SHEEP: 1, WHEAT: 1 },
    CITY: { WHEAT: 2, ORE: 3 },
    DEV_CARD: { SHEEP: 1, WHEAT: 1, ORE: 1 },
  },

  BANK_TRADE_RATIO: 4,
  PORT_TRADE_RATIO: 3,
  RESOURCE_PORT_RATIO: 2,

  LONGEST_ROAD_MIN: 5,
  LARGEST_ARMY_MIN: 3,

  DEV_CARD_DECK: {
    KNIGHT: 14,
    VICTORY_POINT: 5,
    ROAD_BUILDING: 2,
    YEAR_OF_PLENTY: 2,
    MONOPOLY: 2,
  },

  TERRAIN_DISTRIBUTION: [
    { terrain: TerrainType.FOREST, count: 4 },
    { terrain: TerrainType.HILLS, count: 3 },
    { terrain: TerrainType.PASTURE, count: 4 },
    { terrain: TerrainType.FIELDS, count: 4 },
    { terrain: TerrainType.MOUNTAINS, count: 3 },
    { terrain: TerrainType.DESERT, count: 1 },
  ],

  NUMBER_TOKENS: [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12],

  ROBBER_ACTIVATION_ROLL: 7,
  ROBBER_STEAL_THRESHOLD: 7, // >7 ресурсов = сброс половины
};

export const RESOURCE_TO_TERRAIN: Record<TerrainType, ResourceType | null> = {
  [TerrainType.FOREST]: ResourceType.WOOD,
  [TerrainType.HILLS]: ResourceType.BRICK,
  [TerrainType.PASTURE]: ResourceType.SHEEP,
  [TerrainType.FIELDS]: ResourceType.WHEAT,
  [TerrainType.MOUNTAINS]: ResourceType.ORE,
  [TerrainType.DESERT]: null,
};

export const PLAYER_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];
```

#### TASK_1.4: Создать типы для AI

**Файл:** `types/ai.types.ts`

```typescript
interface AIAction {
  type: 'BUILD_ROAD' | 'BUILD_SETTLEMENT' | 'BUILD_CITY' | 'BUY_DEV_CARD' | 'PLAY_DEV_CARD' | 'END_TURN';
  priority: number;
  params?: any;
}

interface AIStrategy {
  targetResource: ResourceType | null;
  expansionVertices: string[];
  developmentFocus: 'MILITARY' | 'CITIES' | 'EXPANSION';
}

interface AIEvaluation {
  vertexId: string;
  score: number;
  reasoning: string;
}
```

#### TASK_1.5: Создать utility types

**Файл:** `types/utils.types.ts`

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type ResourceBundle = Partial<Record<ResourceType, number>>;

type ValidationResult = {
  valid: boolean;
  error?: string;
};

type GameAction =
  | { type: 'ROLL_DICE' }
  | { type: 'BUILD_ROAD'; edgeId: string }
  | { type: 'BUILD_SETTLEMENT'; vertexId: string }
  | { type: 'BUILD_CITY'; vertexId: string }
  | { type: 'BUY_DEV_CARD' }
  | { type: 'PLAY_DEV_CARD'; cardType: DevCardType; params?: any }
  | { type: 'END_TURN' }
  | { type: 'TRADE_WITH_BANK'; offer: ResourceBundle; receive: ResourceBundle };
```

### Definition of Done (Phase 1) ✅ COMPLETED

- [x] Все enums определены и экспортированы
- [x] Все интерфейсы созданы с полной типизацией
- [x] Файл constants/game.constants.ts содержит все константы
- [x] AI типы определены
- [x] Utility types созданы
- [x] Нет ошибок TypeScript при компиляции
- [x] Все типы имеют JSDoc комментарии
- [x] Семантическая разметка MODULE_CONTRACT присутствует

### Зависимости
**Requires:** Phase 0
**Enables:** Phase 2, Phase 3

## END_SECTION_Phase_1_Data_Models

---

## START_SECTION_Phase_2_Core_Game_Logic
## Фаза 2: Базовая логика игры

### Цель фазы
Создать core игровую логику: генерация карты, валидация действий, расчеты, базовые операции.

### Задачи

#### TASK_2.1: Создать генератор карты

**Файл:** `lib/game-logic/mapGenerator.ts`

**Функции:**
- `generateMap(): { hexes: Hex[], vertices: Vertex[], edges: Edge[] }`
- `generateHexGrid(): Hex[]` - создает 19 гексагонов
- `assignTerrains(hexes: Hex[]): void` - назначает местности
- `assignNumbers(hexes: Hex[]): void` - назначает числа 2-12
- `generateVertices(hexes: Hex[]): Vertex[]` - создает вершины
- `generateEdges(hexes: Hex[], vertices: Vertex[]): Edge[]` - создает ребра
- `calculateNeighbors(vertices: Vertex[], edges: Edge[]): void` - вычисляет соседей

**Semantic markup:**
- MODULE_CONTRACT с PURPOSE, INPUTS, OUTPUTS
- Каждая функция с FUNCTION_CONTRACT
- Логические блоки: START_BLOCK_HEX_GENERATION, START_BLOCK_VERTEX_GENERATION, etc.
- Обязательное логирование

**Тестирование:**
- Проверить что создается ровно 19 гексагонов
- Проверить корректное распределение местностей
- Проверить что пустыня не имеет номера
- Проверить что создается правильное количество вершин и ребер

#### TASK_2.2: Создать валидаторы

**Файл:** `lib/game-logic/validators.ts`

**Функции:**
- `canBuildRoad(player: Player, edgeId: string, gameState: GameState): ValidationResult`
- `canBuildSettlement(player: Player, vertexId: string, gameState: GameState): ValidationResult`
- `canBuildCity(player: Player, vertexId: string, gameState: GameState): ValidationResult`
- `canBuyDevCard(player: Player): ValidationResult`
- `canPlayDevCard(player: Player, cardType: DevCardType): ValidationResult`
- `hasResources(player: Player, cost: ResourceBundle): boolean`
- `isVertexAvailable(vertexId: string, vertices: Vertex[]): boolean` - distance rule
- `isEdgeAvailable(edgeId: string, playerId: string, gameState: GameState): boolean`

**Правила валидации:**
- **Road**: примыкает к дороге/поселению игрока, свободна, есть ресурсы, есть дороги в запасе
- **Settlement**: свободна, distance rule (2 ребра от других поселений), примыкает к дороге игрока, есть ресурсы, есть поселения в запасе
- **City**: на вершине есть settlement игрока, есть ресурсы, есть города в запасе
- **Dev Card**: есть ресурсы, колода не пуста
- **Play Dev Card**: карта есть у игрока, не куплена в этот ход, еще не играл карту в этот ход (кроме Victory Point)

**Semantic markup:**
- FUNCTION_CONTRACT для каждой функции
- START_BLOCK_RESOURCE_CHECK, START_BLOCK_PLACEMENT_CHECK, etc.

#### TASK_2.3: Создать калькуляторы

**Файл:** `lib/game-logic/calculators.ts`

**Функции:**
- `calculateVictoryPoints(player: Player, gameState: GameState): number`
- `calculateLongestRoad(playerId: string, gameState: GameState): number` - DFS алгоритм
- `calculateLargestArmy(playerId: string, gameState: GameState): number`
- `distributeResources(diceRoll: number, gameState: GameState): Record<string, ResourceBundle>`
- `getAdjacentVertices(hexId: string, gameState: GameState): string[]`
- `getAdjacentHexes(vertexId: string, gameState: GameState): string[]`

**calculateLongestRoad алгоритм:**
```
1. Найти все ребра игрока
2. Для каждого ребра запустить DFS
3. DFS рекурсивно проходит по дорогам игрока
4. Отслеживает visited ребра чтобы избежать циклов
5. Возвращает максимальную длину пути
```

**Semantic markup:**
- FUNCTION_CONTRACT
- START_BLOCK_DFS_TRAVERSAL для longest road
- Логирование на каждом шаге DFS

#### TASK_2.4: Создать обработчики действий

**Файл:** `lib/game-logic/actionHandlers.ts`

**Функции:**
- `handleBuildRoad(playerId: string, edgeId: string, gameState: GameState): GameState`
- `handleBuildSettlement(playerId: string, vertexId: string, gameState: GameState): GameState`
- `handleBuildCity(playerId: string, vertexId: string, gameState: GameState): GameState`
- `handleBuyDevCard(playerId: string, gameState: GameState): GameState`
- `handlePlayKnight(playerId: string, targetHexId: string, stealFromPlayerId: string | null, gameState: GameState): GameState`
- `handleRoadBuilding(playerId: string, edge1: string, edge2: string, gameState: GameState): GameState`
- `handleYearOfPlenty(playerId: string, resource1: ResourceType, resource2: ResourceType, gameState: GameState): GameState`
- `handleMonopoly(playerId: string, resourceType: ResourceType, gameState: GameState): GameState`

**Каждая функция:**
1. Валидирует действие
2. Обновляет gameState (immutable)
3. Вычитает ресурсы
4. Добавляет здание/дорогу
5. Пересчитывает longest road / largest army если нужно
6. Логирует действие
7. Возвращает новый gameState

**Semantic markup:**
- FUNCTION_CONTRACT
- START_BLOCK_VALIDATION, START_BLOCK_RESOURCE_DEDUCTION, START_BLOCK_STATE_UPDATE

#### TASK_2.5: Создать утилиты

**Файл:** `lib/utils/gameUtils.ts`

**Функции:**
- `rollDice(): [number, number]` - бросок двух кубиков
- `shuffleArray<T>(array: T[]): T[]` - перемешать массив
- `createPlayer(id: string, name: string, color: string, type: PlayerType): Player`
- `createInitialGameState(players: Player[]): GameState`
- `cloneGameState(gameState: GameState): GameState` - deep clone
- `getPlayerById(playerId: string, gameState: GameState): Player | null`
- `getNextPlayer(gameState: GameState): Player`

**Semantic markup:**
- MODULE_CONTRACT
- FUNCTION_CONTRACT для каждой функции

### Definition of Done (Phase 2) ✅ COMPLETED

- [x] mapGenerator.ts создан и генерирует корректную карту
- [x] validators.ts содержит все валидаторы с полной логикой
- [x] calculators.ts содержит все калькуляторы включая DFS для longest road
- [x] actionHandlers.ts содержит обработчики всех действий
- [x] gameUtils.ts содержит утилиты
- [x] Все функции имеют FUNCTION_CONTRACT
- [x] Все модули имеют MODULE_CONTRACT
- [x] Добавлено логирование в критических местах
- [ ] Unit тесты написаны для ключевых функций (опционально на этом этапе)
- [x] TypeScript компилируется без ошибок

### Зависимости
**Requires:** Phase 1
**Enables:** Phase 4, Phase 5

## END_SECTION_Phase_2_Core_Game_Logic

---

## START_SECTION_Phase_3_UI_Foundation
## Фаза 3: UI компоненты - основа

### Цель фазы
Создать базовые UI компоненты: layout, игровое поле, тайлы, вершины, ребра, базовые кнопки.

### Задачи

#### TASK_3.1: Создать Root Layout и глобальные стили

**Файл:** `app/layout.tsx`

**Структура:**
- Metadata (title, description)
- Подключение globals.css
- Root HTML structure

**Файл:** `app/globals.css`

**CSS переменные:**
```css
:root {
  --color-wood: #8B4513;
  --color-brick: #CD5C5C;
  --color-sheep: #90EE90;
  --color-wheat: #FFD700;
  --color-ore: #708090;
  --color-desert: #F4A460;

  --color-player-1: #FF6B6B;
  --color-player-2: #4ECDC4;
  --color-player-3: #45B7D1;
  --color-player-4: #FFA07A;

  --hex-size: 80px;
  --vertex-size: 16px;
  --road-width: 8px;
}
```

**Semantic markup:**
- MODULE_CONTRACT в комментариях

#### TASK_3.2: Создать базовые UI компоненты

**Файл:** `components/ui/Button.tsx`

**Props:**
```typescript
interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}
```

**Файл:** `components/ui/Card.tsx` - карточка для информации

**Файл:** `components/ui/Modal.tsx` - базовый модальный компонент

**Semantic markup:**
- FUNCTION_CONTRACT для каждого компонента

#### TASK_3.3: Создать компонент Hex (гексагон)

**Файл:** `components/board/Hex.tsx`

**Props:**
```typescript
interface HexProps {
  hex: Hex;
  onClick?: (hexId: string) => void;
  highlight?: boolean;
}
```

**Рендеринг:**
- SVG polygon для гексагона
- Цвет в зависимости от terrain
- Номер токена в центре (если не пустыня)
- Иконка разбойника если hasRobber === true
- Highlight эффект при hover

**Позиционирование:**
- Использовать offset grid layout для гексагонов

**Semantic markup:**
- FUNCTION_CONTRACT
- START_BLOCK_SVG_RENDERING, START_BLOCK_ROBBER_ICON

#### TASK_3.4: Создать компонент Vertex (вершина)

**Файл:** `components/board/Vertex.tsx`

**Props:**
```typescript
interface VertexProps {
  vertex: Vertex;
  onClick?: (vertexId: string) => void;
  highlight?: boolean;
}
```

**Рендеринг:**
- Круг если пусто
- Домик если settlement (цвет игрока)
- Город (квадрат) если city (цвет игрока)
- Highlight если доступно для строительства

**Semantic markup:**
- FUNCTION_CONTRACT
- START_BLOCK_BUILDING_RENDER

#### TASK_3.5: Создать компонент Edge (ребро)

**Файл:** `components/board/Edge.tsx`

**Props:**
```typescript
interface EdgeProps {
  edge: Edge;
  startVertex: Vertex;
  endVertex: Vertex;
  onClick?: (edgeId: string) => void;
  highlight?: boolean;
}
```

**Рендеринг:**
- Линия между двумя вершинами
- Цвет игрока если есть дорога
- Highlight если доступно для строительства

**Semantic markup:**
- FUNCTION_CONTRACT
- START_BLOCK_LINE_CALCULATION

#### TASK_3.6: Создать компонент Board (игровое поле)

**Файл:** `components/board/Board.tsx`

**Props:**
```typescript
interface BoardProps {
  gameState: GameState;
  onHexClick?: (hexId: string) => void;
  onVertexClick?: (vertexId: string) => void;
  onEdgeClick?: (edgeId: string) => void;
  highlightedVertices?: string[];
  highlightedEdges?: string[];
  highlightedHexes?: string[];
}
```

**Структура:**
- SVG viewBox для всей карты
- Рендерит все Hex компоненты
- Рендерит все Vertex компоненты
- Рендерит все Edge компоненты
- Обрабатывает клики и передает в parent

**Layout:**
- Offset grid для гексагонов (3 ряда: 3-4-5-4-3)
- Вычисление позиций вершин и ребер на основе позиций гексагонов

**Semantic markup:**
- FUNCTION_CONTRACT
- START_BLOCK_HEX_RENDERING, START_BLOCK_VERTEX_RENDERING, START_BLOCK_EDGE_RENDERING

#### TASK_3.7: Создать компонент PlayerPanel

**Файл:** `components/ui/PlayerPanel.tsx`

**Props:**
```typescript
interface PlayerPanelProps {
  player: Player;
  isCurrentPlayer: boolean;
}
```

**Отображает:**
- Имя игрока и цвет
- Ресурсы (количество)
- Victory Points
- Количество карт развития
- Longest Road / Largest Army badges

**Semantic markup:**
- FUNCTION_CONTRACT

### Definition of Done (Phase 3) ✅ COMPLETED

- [x] layout.tsx и globals.css созданы
- [x] Базовые UI компоненты (Button, Card, Modal) созданы
- [x] Компонент Hex корректно рендерит гексагоны с номерами
- [x] Компонент Vertex корректно рендерит вершины и здания
- [x] Компонент Edge корректно рендерит ребра и дороги
- [x] Компонент Board корректно компонует карту
- [x] PlayerPanel отображает информацию об игроке
- [x] Все компоненты типизированы с TypeScript
- [x] Семантическая разметка присутствует в каждом компоненте
- [x] Tailwind CSS используется для стилизации
- [x] Компоненты отображаются корректно в браузере

### Зависимости
**Requires:** Phase 0, Phase 1
**Enables:** Phase 4

## END_SECTION_Phase_3_UI_Foundation

---

## START_SECTION_Phase_4_Basic_Gameplay
## Фаза 4: Игровой процесс - базовые действия

### Цель фазы
Реализовать базовый игровой процесс: начальная расстановка, бросок кубиков, строительство (дороги, поселения, города), смена хода.

### Задачи

#### TASK_4.1: Создать Zustand store

**Файл:** `store/gameStore.ts`

**State:**
```typescript
interface GameStore {
  gameState: GameState | null;

  // Actions
  initializeGame: (playerNames: string[], aiCount: number) => void;
  rollDice: () => void;
  buildRoad: (edgeId: string) => void;
  buildSettlement: (vertexId: string) => void;
  buildCity: (vertexId: string) => void;
  endTurn: () => void;

  // UI state
  selectedHex: string | null;
  selectedVertex: string | null;
  selectedEdge: string | null;
  highlightedVertices: string[];
  highlightedEdges: string[];

  setSelectedHex: (hexId: string | null) => void;
  setSelectedVertex: (vertexId: string | null) => void;
  setSelectedEdge: (edgeId: string | null) => void;
}
```

**Функции:**
- `initializeGame`: создает начальный GameState, вызывает generateMap, создает игроков
- `rollDice`: бросает кубики, обновляет lastDiceRoll, вызывает distributeResources
- `buildRoad/Settlement/City`: вызывают соответствующие actionHandlers, обновляют state
- `endTurn`: переключает currentPlayerId на следующего игрока

**Semantic markup:**
- MODULE_CONTRACT
- FUNCTION_CONTRACT для каждого action

#### TASK_4.2: Создать экран Home

**Файл:** `app/page.tsx`

**Интерфейс:**
- Заголовок "Catan Game"
- Кнопка "New Game" → переход на /game
- Кнопка "Game History" → переход на /history

**Semantic markup:**
- FUNCTION_CONTRACT

#### TASK_4.3: Создать экран Game - начальная расстановка

**Файл:** `app/game/page.tsx`

**Логика:**
1. При mount вызывает `initializeGame` из store
2. Если `gameState.phase === INITIAL_PLACEMENT`:
   - Показывает инструкцию: "Place your first settlement"
   - Highlight доступных вершин (все вершины с distance rule)
   - При клике на вершину:
     - Строит settlement
     - Автоматически предлагает построить дорогу (highlight соседних ребер)
     - После строительства дороги переключает на следующего игрока
   - После первого круга (все построили 1 settlement + 1 road):
     - Второй круг в обратном порядке
     - При строительстве второго settlement игрок получает ресурсы от соседних гексагонов
3. После завершения начальной расстановки:
   - `gameState.phase = MAIN_GAME`

**Компоненты:**
- Board (игровое поле)
- PlayerPanel для каждого игрока
- ActionPanel (кнопки действий)

**Semantic markup:**
- FUNCTION_CONTRACT
- START_BLOCK_INITIAL_PLACEMENT, START_BLOCK_MAIN_GAME

#### TASK_4.4: Реализовать бросок кубиков

**Компонент:** `components/game/DicePanel.tsx`

**Интерфейс:**
- Отображает два кубика с последними значениями
- Кнопка "Roll Dice" (активна только если текущий игрок и turnPhase === DICE_ROLL)
- При клике:
  - Вызывает `rollDice()` из store
  - Анимация броска (опционально)
  - Обновляет lastDiceRoll
  - Если 7 → активирует разбойника (Phase 5)
  - Иначе → распределяет ресурсы, переключает в turnPhase = ACTIONS

**Semantic markup:**
- FUNCTION_CONTRACT
- START_BLOCK_DICE_ANIMATION, START_BLOCK_RESOURCE_DISTRIBUTION

#### TASK_4.5: Реализовать строительство

**Компонент:** `components/game/ActionPanel.tsx`

**Кнопки:**
- "Build Road" → показывает доступные ребра (highlight)
- "Build Settlement" → показывает доступные вершины (highlight)
- "Build City" → показывает settlements игрока (highlight)
- "End Turn"

**Логика:**
- При клике на "Build Road":
  - `setHighlightedEdges(availableEdges)`
  - При клике на edge → `buildRoad(edgeId)`
- При клике на "Build Settlement":
  - `setHighlightedVertices(availableVertices)`
  - При клике на vertex → `buildSettlement(vertexId)`
- При клике на "Build City":
  - `setHighlightedVertices(playerSettlements)`
  - При клике на vertex → `buildCity(vertexId)`

**Валидация:**
- Кнопки disabled если игрок не может выполнить действие (нет ресурсов, нет доступных мест)

**Semantic markup:**
- FUNCTION_CONTRACT
- START_BLOCK_BUILD_ROAD, START_BLOCK_BUILD_SETTLEMENT, START_BLOCK_BUILD_CITY

#### TASK_4.6: Реализовать смену хода

**Функция:** `endTurn()` в gameStore

**Логика:**
1. Сбросить turnPhase в DICE_ROLL
2. Переключить currentPlayerId на следующего игрока
3. Если следующий игрок AI → запустить AI turn (Phase 6)
4. Обнулить selectedHex/Vertex/Edge
5. Проверить условие победы

**Semantic markup:**
- FUNCTION_CONTRACT
- START_BLOCK_TURN_SWITCH, START_BLOCK_VICTORY_CHECK

#### TASK_4.7: Реализовать проверку победы

**Функция:** `checkVictoryCondition(gameState: GameState): string | null`

**Логика:**
1. Для каждого игрока вычислить victoryPoints
2. Если >= 10 → вернуть playerId
3. Если победитель найден → установить gameState.winner, gameState.phase = GAME_OVER

**UI:**
- Модальное окно "Player X wins!"
- Кнопка "New Game"

**Semantic markup:**
- FUNCTION_CONTRACT
- START_BLOCK_VICTORY_CALCULATION

### Definition of Done (Phase 4)

- [ ] Zustand store создан с базовыми actions
- [ ] Home экран работает и переходит на /game
- [ ] Начальная расстановка (2 круга) работает корректно
- [ ] Бросок кубиков работает и распределяет ресурсы
- [ ] Строительство дорог работает с валидацией
- [ ] Строительство поселений работает с distance rule
- [ ] Upgrade в города работает
- [ ] Смена хода корректно переключает игроков
- [ ] Проверка победы срабатывает при достижении 10 VP
- [ ] Модальное окно победы отображается
- [ ] Семантическая разметка присутствует во всех модулях
- [ ] TypeScript без ошибок
- [ ] Игра играбельна для человека против себя

### Зависимости
**Requires:** Phase 2, Phase 3
**Enables:** Phase 5, Phase 6

## END_SECTION_Phase_4_Basic_Gameplay

---

## START_SECTION_Phase_5_Advanced_Mechanics
## Фаза 5: Продвинутая механика

### Цель фазы
Реализовать продвинутую механику: разбойник, карты развития, торговля, longest road, largest army.

### Задачи

#### TASK_5.1: Реализовать активацию разбойника

**Логика при броске 7:**
1. Если игрок имеет >7 ресурсов → сброс половины (округление вниз)
2. Текущий игрок должен переместить разбойника
3. Если на новом гексе есть чужие поселения/города → украсть 1 случайный ресурс

**Компонент:** `components/modals/RobberModal.tsx`

**Интерфейс:**
1. Модальное окно "You rolled 7!"
2. Для каждого игрока с >7 ресурсов:
   - Показать UI для выбора ресурсов на сброс
   - После выбора → убрать ресурсы
3. Highlight всех гексагонов (кроме текущего с разбойником)
4. При клике на гекс:
   - Переместить разбойника
   - Показать список игроков с постройками на этом гексе
   - Выбрать игрока → украсть случайный ресурс
5. После завершения → turnPhase = ACTIONS

**Semantic markup:**
- FUNCTION_CONTRACT
- START_BLOCK_RESOURCE_DISCARD, START_BLOCK_ROBBER_MOVE, START_BLOCK_STEAL_RESOURCE

#### TASK_5.2: Реализовать покупку карт развития

**Action:** `buyDevCard()` в gameStore

**Логика:**
1. Валидация (есть ресурсы, колода не пуста)
2. Убрать ресурсы
3. Взять случайную карту из devCardDeck
4. Добавить в player.devCards с canPlayThisTurn = false
5. В начале следующего хода → canPlayThisTurn = true

**UI:**
- Кнопка "Buy Development Card" в ActionPanel
- После покупки → показать какую карту получил (если не Victory Point)

**Semantic markup:**
- FUNCTION_CONTRACT
- START_BLOCK_CARD_PURCHASE, START_BLOCK_DECK_SHUFFLE

#### TASK_5.3: Реализовать игру карт развития

**Компонент:** `components/game/DevCardPanel.tsx`

**Отображает:**
- Список карт игрока
- Кнопки для каждой карты (disabled если нельзя играть)

**Knight:**
- Модальное окно как при roll 7
- Переместить разбойника, украсть ресурс
- Увеличить knightsPlayed
- Проверить Largest Army

**Road Building:**
- Highlight доступные ребра
- Построить 2 дороги бесплатно
- Проверить Longest Road

**Year of Plenty:**
- Модальное окно с выбором 2 ресурсов
- Добавить ресурсы игроку

**Monopoly:**
- Модальное окно с выбором типа ресурса
- Забрать все ресурсы этого типа у других игроков

**Victory Point:**
- Автоматически добавляет 1 VP (скрыта от других игроков до победы)

**Semantic markup:**
- FUNCTION_CONTRACT для каждого типа карты
- START_BLOCK_KNIGHT, START_BLOCK_ROAD_BUILDING, etc.

#### TASK_5.4: Реализовать Longest Road

**Логика:**
- После каждого строительства дороги → пересчитать longest road для игрока
- Если длина >= 5 и больше текущего держателя → передать badge
- +2 VP для держателя

**Функция:** `updateLongestRoad(gameState: GameState): GameState`

**Semantic markup:**
- FUNCTION_CONTRACT
- START_BLOCK_CALCULATE_ROADS, START_BLOCK_UPDATE_BADGE

#### TASK_5.5: Реализовать Largest Army

**Логика:**
- После игры Knight → проверить knightsPlayed
- Если >= 3 и больше текущего держателя → передать badge
- +2 VP для держателя

**Функция:** `updateLargestArmy(gameState: GameState): GameState`

**Semantic markup:**
- FUNCTION_CONTRACT
- START_BLOCK_CALCULATE_KNIGHTS, START_BLOCK_UPDATE_BADGE

#### TASK_5.6: Реализовать торговлю с банком

**Компонент:** `components/modals/BankTradeModal.tsx`

**Интерфейс:**
1. Выбор ресурсов для обмена (4:1 по умолчанию)
2. Выбор ресурса для получения
3. Кнопка "Trade"
4. Валидация (есть достаточно ресурсов)

**Action:** `tradeWithBank(offer: ResourceBundle, receive: ResourceBundle)` в gameStore

**Логика:**
1. Валидация соотношения (4:1 или 3:1 если порт - Phase 8)
2. Убрать offer ресурсы
3. Добавить receive ресурсы

**Semantic markup:**
- FUNCTION_CONTRACT
- START_BLOCK_TRADE_VALIDATION, START_BLOCK_RESOURCE_EXCHANGE

### Definition of Done (Phase 5)

- [ ] Разбойник активируется при броске 7
- [ ] Сброс ресурсов работает при >7 ресурсах
- [ ] Разбойника можно переместить и украсть ресурс
- [ ] Покупка карт развития работает
- [ ] Все карты развития играются корректно (Knight, Road Building, Year of Plenty, Monopoly, Victory Point)
- [ ] Longest Road пересчитывается и badge передается
- [ ] Largest Army пересчитывается и badge передается
- [ ] Торговля с банком 4:1 работает
- [ ] Семантическая разметка присутствует во всех модулях
- [ ] TypeScript без ошибок
- [ ] Игра полностью играбельна для человека

### Зависимости
**Requires:** Phase 4
**Enables:** Phase 6

## END_SECTION_Phase_5_Advanced_Mechanics

---

## START_SECTION_Phase_6_AI_Opponent
## Фаза 6: AI оппонент

### Цель фазы
Реализовать AI оппонента с эвристиками для начальной расстановки и основной игры.

### Задачи

#### TASK_6.1: Создать AI модуль

**Файл:** `lib/ai/aiPlayer.ts`

**Функции:**
- `executeAITurn(gameState: GameState): GameState` - главная функция AI хода
- `aiInitialPlacement(gameState: GameState): { vertexId: string, edgeId: string }` - начальная расстановка
- `aiDicePhase(gameState: GameState): GameState` - бросок кубиков
- `aiActionPhase(gameState: GameState): GameState` - фаза действий

**Semantic markup:**
- MODULE_CONTRACT
- FUNCTION_CONTRACT для каждой функции

#### TASK_6.2: Реализовать AI начальную расстановку

**Функция:** `aiInitialPlacement(gameState: GameState): { vertexId: string, edgeId: string }`

**Логика:**
1. Оценить все доступные вершины по формуле:
   ```
   score = Σ (probability[number] * value[resource])
   ```
   - probability[2] = 1/36, probability[3] = 2/36, ..., probability[6] = 5/36, etc.
   - value[WHEAT] = value[ORE] = 1.2 (приоритет)
   - value[WOOD] = value[BRICK] = value[SHEEP] = 1.0
2. Добавить бонус за разнообразие ресурсов (+0.5 за каждый уникальный тип)
3. Выбрать вершину с максимальным score
4. Выбрать ребро от этой вершины (случайно среди доступных)

**Semantic markup:**
- FUNCTION_CONTRACT
- START_BLOCK_VERTEX_EVALUATION, START_BLOCK_PROBABILITY_CALCULATION

#### TASK_6.3: Реализовать AI оценку действий

**Файл:** `lib/ai/aiEvaluator.ts`

**Функции:**
- `evaluateActions(gameState: GameState, playerId: string): AIAction[]` - оценить все возможные действия
- `evaluateBuildRoad(gameState: GameState, playerId: string): AIAction[]`
- `evaluateBuildSettlement(gameState: GameState, playerId: string): AIAction[]`
- `evaluateBuildCity(gameState: GameState, playerId: string): AIAction[]`
- `evaluateBuyDevCard(gameState: GameState, playerId: string): AIAction | null`

**Приоритеты:**
1. **BUILD_CITY** (если есть ресурсы) - priority 100
2. **BUILD_SETTLEMENT** (если есть место) - priority 80-90 (зависит от score вершины)
3. **BUY_DEV_CARD** (если близко к Largest Army или нужен VP) - priority 70
4. **BUILD_ROAD** (если нужно для расширения) - priority 50-60
5. **END_TURN** - priority 0

**Semantic markup:**
- FUNCTION_CONTRACT
- START_BLOCK_ACTION_EVALUATION

#### TASK_6.4: Реализовать AI фазу действий

**Функция:** `aiActionPhase(gameState: GameState): GameState`

**Логика:**
1. Вызвать `evaluateActions()`
2. Отсортировать по priority (desc)
3. Выполнить первое доступное действие
4. Повторить пока есть действия с priority > 0
5. Вызвать `endTurn()`

**Задержка:**
- Добавить setTimeout между действиями (500-1000ms) для UX

**Semantic markup:**
- FUNCTION_CONTRACT
- START_BLOCK_ACTION_SELECTION, START_BLOCK_ACTION_EXECUTION

#### TASK_6.5: Реализовать AI игру карт развития

**Функция:** `aiPlayDevCards(gameState: GameState): GameState`

**Логика:**
- **Knight**: играть если нужно приблизиться к Largest Army или заблокировать противника
- **Road Building**: играть если близко к Longest Road
- **Year of Plenty**: играть если не хватает 1-2 ресурсов для важной постройки
- **Monopoly**: играть если много игроков имеют нужный ресурс

**Semantic markup:**
- FUNCTION_CONTRACT
- START_BLOCK_KNIGHT_DECISION, START_BLOCK_ROAD_BUILDING_DECISION

#### TASK_6.6: Реализовать AI обработку разбойника

**Функция:** `aiHandleRobber(gameState: GameState): { hexId: string, stealFromPlayerId: string | null }`

**Логика:**
1. Выбрать гекс:
   - Приоритет гексам с противниками у которых много VP
   - Приоритет гексам с высокими числами (6, 8)
   - Избегать гексов где есть свои постройки
2. Выбрать жертву:
   - Приоритет игроку с наибольшим количеством VP

**Semantic markup:**
- FUNCTION_CONTRACT
- START_BLOCK_HEX_SELECTION, START_BLOCK_VICTIM_SELECTION

#### TASK_6.7: Интеграция AI в gameStore

**Модификация:** `endTurn()` в gameStore

**Логика:**
1. После смены currentPlayerId
2. Проверить `if (currentPlayer.type === AI)`
3. Вызвать `executeAITurn(gameState)` асинхронно с задержкой
4. Обновить gameState после AI хода

**Semantic markup:**
- Обновить FUNCTION_CONTRACT для endTurn

### Definition of Done (Phase 6)

- [ ] AI модуль создан
- [ ] AI корректно выбирает места для начальной расстановки
- [ ] AI корректно оценивает и выполняет действия
- [ ] AI играет карты развития разумно
- [ ] AI обрабатывает разбойника корректно
- [ ] AI интегрирован в gameStore
- [ ] Можно играть против AI и AI делает осмысленные ходы
- [ ] Семантическая разметка присутствует во всех AI модулях
- [ ] TypeScript без ошибок

### Зависимости
**Requires:** Phase 4, Phase 5
**Enables:** Phase 7

## END_SECTION_Phase_6_AI_Opponent

---

## START_SECTION_Phase_7_Achievements
## Фаза 7: Достижения и статистика

### Цель фазы
Реализовать систему достижений, сохранение истории игр, отображение статистики.

### Задачи

#### TASK_7.1: Создать типы для достижений

**Файл:** `types/achievements.types.ts`

**Интерфейсы:**
```typescript
enum AchievementType {
  FIRST_WIN = 'FIRST_WIN',
  WIN_10_GAMES = 'WIN_10_GAMES',
  LONGEST_ROAD_5 = 'LONGEST_ROAD_5',
  LARGEST_ARMY_5 = 'LARGEST_ARMY_5',
  BUILD_ALL_SETTLEMENTS = 'BUILD_ALL_SETTLEMENTS',
  PLAY_10_KNIGHTS = 'PLAY_10_KNIGHTS',
  WIN_WITHOUT_CITIES = 'WIN_WITHOUT_CITIES',
  // и т.д.
}

interface Achievement {
  id: AchievementType;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface GameHistory {
  id: string;
  date: Date;
  winner: string;
  players: {
    name: string;
    victoryPoints: number;
    isAI: boolean;
  }[];
  turnCount: number;
  duration: number; // секунды
}

interface PlayerStats {
  totalGames: number;
  wins: number;
  losses: number;
  averageVP: number;
  longestRoadRecord: number;
  largestArmyRecord: number;
  achievements: Achievement[];
}
```

#### TASK_7.2: Создать persistence layer

**Файл:** `lib/utils/storage.ts`

**Функции:**
- `saveGameHistory(game: GameHistory): void` - сохранить в localStorage
- `getGameHistory(): GameHistory[]` - получить все игры
- `savePlayerStats(stats: PlayerStats): void`
- `getPlayerStats(): PlayerStats`
- `unlockAchievement(achievementId: AchievementType): void`

**Semantic markup:**
- MODULE_CONTRACT
- FUNCTION_CONTRACT для каждой функции

#### TASK_7.3: Реализовать отслеживание достижений

**Файл:** `lib/achievements/achievementTracker.ts`

**Функции:**
- `checkAchievements(gameState: GameState, gameHistory: GameHistory[]): AchievementType[]` - проверить после игры
- `checkFirstWin(gameHistory: GameHistory[]): boolean`
- `checkWin10Games(gameHistory: GameHistory[]): boolean`
- `checkLongestRoad5(game: GameHistory): boolean`
- и т.д.

**Логика:**
- После завершения игры вызвать checkAchievements
- Разблокировать новые достижения
- Показать notification о разблокированных

**Semantic markup:**
- MODULE_CONTRACT
- FUNCTION_CONTRACT для каждой функции

#### TASK_7.4: Создать экран Game History

**Файл:** `app/history/page.tsx`

**Интерфейс:**
- Таблица всех сыгранных игр
- Колонки: Date, Winner, VP, Duration, Turn Count
- Сортировка по дате (desc)
- Кнопка "Clear History"

**Semantic markup:**
- FUNCTION_CONTRACT

#### TASK_7.5: Создать экран Achievements

**Файл:** `app/achievements/page.tsx`

**Интерфейс:**
- Сетка карточек достижений
- Unlocked достижения подсвечены
- Locked достижения серые с замком
- Progress bar для прогрессивных достижений (например, "Win 10 games" - 5/10)

**Semantic markup:**
- FUNCTION_CONTRACT

#### TASK_7.6: Создать Stats Panel

**Компонент:** `components/ui/StatsPanel.tsx`

**Отображает:**
- Total Games
- Win Rate
- Average VP
- Longest Road Record
- Largest Army Record
- Most Played Resource

**Semantic markup:**
- FUNCTION_CONTRACT

#### TASK_7.7: Интеграция в gameStore

**Модификация:** При завершении игры (checkVictoryCondition)

**Логика:**
1. Создать объект GameHistory
2. Сохранить через saveGameHistory
3. Обновить PlayerStats
4. Проверить достижения
5. Показать модальное окно с результатом + новые достижения

**Semantic markup:**
- Обновить FUNCTION_CONTRACT

### Definition of Done (Phase 7)

- [ ] Типы для достижений и истории созданы
- [ ] localStorage persistence работает
- [ ] Achievement tracker корректно проверяет условия
- [ ] Game History экран отображает все игры
- [ ] Achievements экран отображает достижения
- [ ] Stats Panel показывает статистику
- [ ] После игры сохраняется история и обновляется статистика
- [ ] Достижения разблокируются корректно
- [ ] Семантическая разметка присутствует
- [ ] TypeScript без ошибок

### Зависимости
**Requires:** Phase 6
**Enables:** Phase 8

## END_SECTION_Phase_7_Achievements

---

## START_SECTION_Phase_8_Polish
## Фаза 8: Финальная полировка

### Цель фазы
Добавить анимации, звуки, улучшить UX, исправить баги, оптимизировать производительность.

### Задачи

#### TASK_8.1: Добавить анимации

**Tailwind transitions:**
- Hover эффекты на кнопках
- Highlight анимации для вершин/ребер
- Fade in/out для модальных окон

**Framer Motion (опционально):**
- Анимация броска кубиков
- Анимация строительства (появление здания)
- Анимация перемещения разбойника

**Semantic markup:**
- Обновить FUNCTION_CONTRACT компонентов с анимациями

#### TASK_8.2: Добавить звуковые эффекты (опционально)

**Звуки:**
- Бросок кубиков
- Строительство
- Покупка карты развития
- Игра карты развития
- Победа

**Реализация:**
- Использовать HTML5 Audio API
- Создать soundManager.ts
- Добавить toggle для звуков в настройках

**Semantic markup:**
- MODULE_CONTRACT для soundManager

#### TASK_8.3: Улучшить UX

**Подсказки:**
- Tooltip на кнопках с описанием действия и стоимостью
- Tooltip на вершинах/ребрах с информацией
- Highlight ресурсов при hover над зданием

**Feedback:**
- Toast notifications для действий (built road, bought card, etc.)
- Error messages при невалидных действиях

**Responsive design:**
- Адаптация под планшеты (опционально)

**Semantic markup:**
- Обновить компоненты

#### TASK_8.4: Оптимизация производительности

**React.memo:**
- Мемоизировать Hex, Vertex, Edge компоненты
- Избежать лишних re-renders

**useMemo/useCallback:**
- Мемоизировать сложные вычисления (longest road, available positions)

**Lazy loading:**
- Динамический импорт модальных окон

**Semantic markup:**
- Обновить FUNCTION_CONTRACT с performance notes

#### TASK_8.5: Баг-фиксы

**Тестирование:**
- Сыграть несколько полных игр
- Проверить все edge cases
- Исправить найденные баги

**Known issues:**
- Проверить distance rule для settlements
- Проверить longest road calculation (корректность DFS)
- Проверить AI корректность действий

**Semantic markup:**
- Логировать исправленные баги в комментариях

#### TASK_8.6: Документация

**README.md:**
- Описание проекта
- Инструкции по запуску
- Технологический стек
- Архитектура

**Inline документация:**
- JSDoc комментарии для всех публичных функций

**Semantic markup:**
- Обновить MODULE_CONTRACT с финальной информацией

#### TASK_8.7: Финальный аудит

**Чек-лист:**
- [ ] Все функции работают корректно
- [ ] Нет критических багов
- [ ] TypeScript без ошибок и warnings
- [ ] ESLint без ошибок
- [ ] Семантическая разметка присутствует во всех модулях
- [ ] Логирование работает корректно
- [ ] Игра играбельна и enjoyable
- [ ] Performance приемлемая

### Definition of Done (Phase 8)

- [ ] Анимации добавлены
- [ ] Звуковые эффекты добавлены (опционально)
- [ ] UX улучшен (tooltips, notifications)
- [ ] Производительность оптимизирована
- [ ] Все баги исправлены
- [ ] README.md создан
- [ ] Финальный аудит пройден
- [ ] Проект готов к деплою

### Зависимости
**Requires:** Phase 7
**Enables:** Deployment

## END_SECTION_Phase_8_Polish

---

## START_SECTION_Component_Dependency_Graph
## График зависимостей компонентов

### Легенда
- **→** : зависит от (imports/uses)
- **[P]** : Phase в которой создается

### Модули данных
```
[P1] types/game.types.ts
     └─> используется везде

[P1] types/ai.types.ts
     └─> используется в lib/ai/*

[P1] lib/constants/game.constants.ts
     └─> используется в lib/game-logic/*
```

### Core логика
```
[P2] lib/game-logic/mapGenerator.ts
     → types/game.types.ts
     → lib/constants/game.constants.ts

[P2] lib/game-logic/validators.ts
     → types/game.types.ts
     → lib/constants/game.constants.ts

[P2] lib/game-logic/calculators.ts
     → types/game.types.ts
     → lib/game-logic/validators.ts (для некоторых проверок)

[P2] lib/game-logic/actionHandlers.ts
     → types/game.types.ts
     → lib/game-logic/validators.ts
     → lib/game-logic/calculators.ts

[P2] lib/utils/gameUtils.ts
     → types/game.types.ts
```

### AI логика
```
[P6] lib/ai/aiPlayer.ts
     → types/game.types.ts
     → types/ai.types.ts
     → lib/ai/aiEvaluator.ts

[P6] lib/ai/aiEvaluator.ts
     → types/game.types.ts
     → types/ai.types.ts
     → lib/game-logic/validators.ts
     → lib/game-logic/calculators.ts
```

### State management
```
[P4] store/gameStore.ts
     → types/game.types.ts
     → lib/game-logic/mapGenerator.ts
     → lib/game-logic/actionHandlers.ts
     → lib/game-logic/calculators.ts
     → lib/utils/gameUtils.ts
     → lib/ai/aiPlayer.ts (в Phase 6)
```

### UI компоненты
```
[P3] components/ui/Button.tsx
[P3] components/ui/Card.tsx
[P3] components/ui/Modal.tsx

[P3] components/board/Hex.tsx
     → types/game.types.ts

[P3] components/board/Vertex.tsx
     → types/game.types.ts

[P3] components/board/Edge.tsx
     → types/game.types.ts

[P3] components/board/Board.tsx
     → types/game.types.ts
     → components/board/Hex.tsx
     → components/board/Vertex.tsx
     → components/board/Edge.tsx

[P3] components/ui/PlayerPanel.tsx
     → types/game.types.ts

[P4] components/game/DicePanel.tsx
     → store/gameStore.ts

[P4] components/game/ActionPanel.tsx
     → store/gameStore.ts
     → lib/game-logic/validators.ts

[P5] components/game/DevCardPanel.tsx
     → store/gameStore.ts
     → types/game.types.ts

[P5] components/modals/RobberModal.tsx
     → store/gameStore.ts
     → components/ui/Modal.tsx

[P5] components/modals/BankTradeModal.tsx
     → store/gameStore.ts
     → components/ui/Modal.tsx
```

### Screens
```
[P4] app/page.tsx (Home)
     → components/ui/Button.tsx

[P4] app/game/page.tsx (Game)
     → store/gameStore.ts
     → components/board/Board.tsx
     → components/ui/PlayerPanel.tsx
     → components/game/DicePanel.tsx
     → components/game/ActionPanel.tsx
     → components/game/DevCardPanel.tsx (Phase 5)

[P7] app/history/page.tsx
     → lib/utils/storage.ts

[P7] app/achievements/page.tsx
     → lib/utils/storage.ts
     → lib/achievements/achievementTracker.ts
```

### Achievements & Stats
```
[P7] lib/utils/storage.ts
     → types/achievements.types.ts

[P7] lib/achievements/achievementTracker.ts
     → types/achievements.types.ts
     → lib/utils/storage.ts
```

### Критический путь (последовательность разработки)
```
Phase 0: Infrastructure
         ↓
Phase 1: Types & Constants
         ↓
Phase 2: Core Game Logic ←─┐
         ↓                  │
Phase 3: UI Foundation      │
         ↓                  │
Phase 4: Basic Gameplay ────┘ (зависит от Phase 2 и Phase 3)
         ↓
Phase 5: Advanced Mechanics
         ↓
Phase 6: AI Opponent
         ↓
Phase 7: Achievements
         ↓
Phase 8: Polish
```

## END_SECTION_Component_Dependency_Graph

---

## START_SECTION_Definition_of_Done
## Критерии готовности (Definition of Done)

### Критерии для каждого модуля/компонента

**Код:**
- [ ] TypeScript типизация без `any` (кроме обоснованных случаев)
- [ ] Нет ошибок TypeScript при компиляции
- [ ] Нет warnings ESLint (критических)
- [ ] Семантическая разметка MODULE_CONTRACT присутствует
- [ ] Все функции имеют FUNCTION_CONTRACT
- [ ] Логические блоки обернуты в START_/END_ теги
- [ ] Обязательное логирование в критических местах

**Функциональность:**
- [ ] Функционал работает согласно ТЗ
- [ ] Валидация входных данных присутствует
- [ ] Обработка ошибок реализована
- [ ] Edge cases учтены

**UI компоненты:**
- [ ] Responsive (или адаптивный если требуется)
- [ ] Доступность (accessibility) - базовая (кнопки имеют aria-labels)
- [ ] Стилизация завершена (Tailwind CSS)
- [ ] Hover/focus состояния реализованы

**Тестирование (опционально на ранних фазах):**
- [ ] Unit тесты для core логики (validators, calculators)
- [ ] Integration тесты для ключевых сценариев
- [ ] Manual тестирование пройдено

**Документация:**
- [ ] JSDoc комментарии для публичных функций
- [ ] README.md обновлен (если нужно)
- [ ] Semantic markup актуален

### Критерии для каждой фазы

**Phase completion:**
- [ ] Все задачи фазы выполнены
- [ ] Definition of Done для фазы выполнены
- [ ] Код скомпилирован без ошибок
- [ ] Manual тестирование основных сценариев пройдено
- [ ] Git commit создан с описанием фазы

**Integration:**
- [ ] Новый функционал интегрирован с существующим
- [ ] Нет регрессий в предыдущем функционале
- [ ] Zustand store обновлен корректно

### Критерии готовности всего проекта

**Функциональность:**
- [ ] Все 8 фаз завершены
- [ ] Игра полностью играбельна
- [ ] AI оппонент работает разумно
- [ ] Все правила Catan реализованы корректно
- [ ] Достижения и статистика работают

**Качество кода:**
- [ ] Семантическая разметка присутствует во всех модулях
- [ ] TypeScript strict mode без ошибок
- [ ] ESLint без критических warnings
- [ ] Код следует единому стилю

**UX:**
- [ ] Интерфейс интуитивен
- [ ] Нет критических UX проблем
- [ ] Анимации и звуки работают (если реализованы)
- [ ] Performance приемлемая (no lag)

**Документация:**
- [ ] README.md полный и актуальный
- [ ] Inline документация присутствует
- [ ] Semantic markup актуален

**Deployment:**
- [ ] Проект может быть развернут (npm run build успешен)
- [ ] Production build работает корректно
- [ ] Нет console errors в production

## END_SECTION_Definition_of_Done

---

## START_SECTION_Risks_And_Mitigations
## Риски и митигации

### RISK_1: Сложность генерации карты
**Описание:** Генерация гексагональной сетки с правильными координатами и связями может быть сложной.

**Вероятность:** Medium
**Воздействие:** High (без карты игра не работает)

**Митигация:**
- Использовать четкую математическую модель offset grid
- Создать вспомогательные функции для вычисления координат
- Протестировать генерацию отдельно перед интеграцией
- Визуализировать вершины и ребра для отладки

**Fallback:**
- Использовать готовую библиотеку для hexagonal grids (honeycomb-grid)

---

### RISK_2: Производительность при большом количестве компонентов
**Описание:** Рендеринг 19 гексагонов, 54 вершин, 72 ребер может вызвать проблемы с производительностью.

**Вероятность:** Low-Medium
**Воздействие:** Medium (lag в UI)

**Митигация:**
- Использовать React.memo для компонентов
- Избегать лишних re-renders (useMemo, useCallback)
- SVG оптимизация (minimize DOM nodes)
- Lazy rendering для скрытых элементов

**Fallback:**
- Использовать Canvas API вместо SVG (более производительно)

---

### RISK_3: Сложность алгоритма Longest Road
**Описание:** DFS для вычисления longest road может иметь баги (циклы, неправильный обход).

**Вероятность:** Medium
**Воздействие:** Medium (неправильный расчет longest road)

**Митигация:**
- Четко описать алгоритм в DevelopmentPlan.md
- Написать unit тесты с известными сценариями
- Логировать каждый шаг DFS для отладки
- Протестировать на граничных случаях (развилки, циклы)

**Fallback:**
- Использовать более простую эвристику (подсчет всех дорог игрока)

---

### RISK_4: AI слишком слабый или слишком сильный
**Описание:** Баланс AI может быть неправильным - либо AI легко побить, либо слишком сложно.

**Вероятность:** Medium
**Воздействие:** Low (игра играбельна, но не интересна)

**Митигация:**
- Использовать настраиваемые эвристики
- Тестировать AI против человека
- Добавить уровни сложности (easy/medium/hard) в будущем
- Логировать решения AI для анализа

**Fallback:**
- Добавить random factor в AI решения для снижения предсказуемости

---

### RISK_5: Семантическая разметка занимает много времени
**Описание:** Создание MODULE_CONTRACT, FUNCTION_CONTRACT, START_/END_ блоков для каждой функции может замедлить разработку.

**Вероятность:** High
**Воздействие:** Low (только время разработки)

**Митигация:**
- Использовать templates/snippets для быстрой вставки
- Генерировать базовую разметку автоматически (скрипт)
- Приоритизировать разметку для критических модулей

**Fallback:**
- Добавить разметку после написания кода (хотя это нарушает принцип)

---

### RISK_6: Сложность тестирования UI компонентов
**Описание:** Тестирование React компонентов с Zustand и сложным gameState может быть трудоемким.

**Вероятность:** Medium
**Воздействие:** Low (можно полагаться на manual testing)

**Митигация:**
- Использовать React Testing Library для ключевых компонентов
- Mock Zustand store для изоляции компонентов
- Приоритизировать тестирование core логики (validators, calculators)

**Fallback:**
- Полагаться на manual testing и E2E тесты

---

### RISK_7: localStorage недостаточно для больших данных
**Описание:** История игр и достижения могут превысить лимит localStorage (5-10MB).

**Вероятность:** Low
**Воздействие:** Low (только после многих игр)

**Митигация:**
- Ограничить историю до последних 100 игр
- Сжимать данные (JSON.stringify + compression)
- Проверять размер перед сохранением

**Fallback:**
- Использовать IndexedDB для больших объемов данных

---

### RISK_8: Недостаточное время на Phase 8 (Polish)
**Описание:** Может не хватить времени на анимации, звуки, баг-фиксы.

**Вероятность:** Medium
**Воздействие:** Medium (игра работает, но не полирована)

**Митигация:**
- Приоритизировать баг-фиксы над анимациями
- Использовать простые Tailwind transitions вместо сложных анимаций
- Опустить звуковые эффекты если не хватает времени

**Fallback:**
- Релизить MVP без полировки, добавить polish позже

## END_SECTION_Risks_And_Mitigations

---

## START_SECTION_Testing_Plan
## План тестирования

### Unit Tests (приоритет HIGH для core логики)

**lib/game-logic/mapGenerator.ts:**
- [ ] `generateMap()` создает 19 гексагонов
- [ ] Terrain распределение корректно (4 леса, 3 холма, и т.д.)
- [ ] Пустыня не имеет номера
- [ ] Номера 2-12 распределены корректно (нет 7)
- [ ] Вершины и ребра созданы с правильными связями

**lib/game-logic/validators.ts:**
- [ ] `canBuildRoad()` корректно проверяет доступность
- [ ] `canBuildSettlement()` корректно применяет distance rule
- [ ] `canBuildCity()` проверяет наличие settlement
- [ ] `hasResources()` корректно сравнивает ресурсы

**lib/game-logic/calculators.ts:**
- [ ] `calculateVictoryPoints()` правильно считает VP
- [ ] `calculateLongestRoad()` находит самый длинный путь (DFS тест)
  - Тест 1: Простая прямая дорога (5 ребер) → 5
  - Тест 2: Развилка (выбирает более длинный путь)
  - Тест 3: Цикл (не зацикливается, возвращает корректную длину)
- [ ] `distributeResources()` корректно распределяет ресурсы по броску

**lib/game-logic/actionHandlers.ts:**
- [ ] `handleBuildRoad()` корректно обновляет gameState
- [ ] `handleBuildSettlement()` вычитает ресурсы и добавляет здание
- [ ] `handleBuildCity()` корректно обновляет settlement → city
- [ ] `handlePlayKnight()` перемещает разбойника и крадет ресурс

### Integration Tests (приоритет MEDIUM)

**Initial Placement Flow:**
- [ ] Игрок может разместить первое поселение и дорогу
- [ ] Второй круг расстановки идет в обратном порядке
- [ ] При втором поселении игрок получает ресурсы

**Dice Roll and Resource Distribution:**
- [ ] Бросок кубиков распределяет ресурсы корректно
- [ ] Бросок 7 активирует разбойника
- [ ] Игроки с >7 ресурсов сбрасывают половину

**Building Actions:**
- [ ] Строительство дороги работает end-to-end
- [ ] Строительство поселения работает с валидацией
- [ ] Upgrade в город работает корректно

**Development Cards:**
- [ ] Покупка карты развития работает
- [ ] Игра Knight перемещает разбойника
- [ ] Road Building строит 2 дороги бесплатно
- [ ] Year of Plenty дает 2 ресурса
- [ ] Monopoly забирает ресурсы у других игроков

**Longest Road / Largest Army:**
- [ ] Longest road badge передается при превышении
- [ ] Largest army badge передается при >= 3 knights

**AI Turn:**
- [ ] AI корректно выполняет ход
- [ ] AI не делает невалидных действий
- [ ] AI ход заканчивается с endTurn

### E2E Tests (приоритет LOW, manual testing)

**Full Game Flow:**
- [ ] Новая игра инициализируется корректно
- [ ] Начальная расстановка (2 круга) проходит успешно
- [ ] Основная игра играбельна
- [ ] Победа определяется при достижении 10 VP
- [ ] История игры сохраняется
- [ ] Достижения разблокируются

**AI Game:**
- [ ] Можно сыграть полную игру против AI
- [ ] AI делает разумные ходы
- [ ] Игра завершается корректно

### Performance Tests (опционально)

**Rendering Performance:**
- [ ] Board рендерится без заметного lag
- [ ] Re-render при изменении gameState быстрый (<100ms)
- [ ] SVG элементы не вызывают проблем с памятью

**Longest Road Calculation:**
- [ ] DFS завершается быстро даже для сложных графов (<50ms)

### Regression Tests (после каждой фазы)

**После Phase 4:**
- [ ] Начальная расстановка работает
- [ ] Бросок кубиков работает
- [ ] Строительство дорог/поселений/городов работает

**После Phase 5:**
- [ ] Все предыдущие тесты проходят
- [ ] Разбойник работает
- [ ] Карты развития работают

**После Phase 6:**
- [ ] Все предыдущие тесты проходят
- [ ] AI ход не ломает игру

**После Phase 7:**
- [ ] Все предыдущие тесты проходят
- [ ] Достижения не ломают gameState

### Manual Testing Checklist

**Before each Phase completion:**
- [ ] `npm run dev` запускается без ошибок
- [ ] TypeScript компилируется без ошибок
- [ ] ESLint не выдает критических warnings
- [ ] Console не содержит errors
- [ ] Основной функционал фазы работает

**Before Phase 8 completion (final):**
- [ ] Сыграть полную игру (human vs human)
- [ ] Сыграть полную игру (human vs AI)
- [ ] Проверить все edge cases:
  - [ ] Разбойник на 7
  - [ ] Сброс ресурсов при >7
  - [ ] Distance rule для settlements
  - [ ] Longest road при сложном графе
  - [ ] Largest army при нескольких игроках с knights
  - [ ] Victory при ровно 10 VP
- [ ] Проверить UI/UX:
  - [ ] Все кнопки кликабельны
  - [ ] Tooltips отображаются
  - [ ] Модальные окна работают
  - [ ] Notifications показываются
- [ ] Проверить persistence:
  - [ ] История сохраняется
  - [ ] Достижения сохраняются
  - [ ] После перезагрузки данные доступны

## END_SECTION_Testing_Plan

---

## FINAL NOTES

Этот документ является живой дорожной картой. По мере разработки он может обновляться с учетом новых требований, найденных багов и изменений в приоритетах.

**Принципы следования дорожной карте:**
1. Строго следовать последовательности фаз
2. Не переходить к следующей фазе пока не выполнены все DoD текущей
3. Использовать семантическую разметку с первой строки кода
4. Регулярно проводить manual testing
5. Логировать все важные операции для отладки

**Контакт для вопросов:**
Если возникают неясности в процессе реализации - обращаться к TechSpecification.md, DevelopmentPlan.md и semantic_template.txt для уточнений.

---

**END_OF_DOCUMENT**