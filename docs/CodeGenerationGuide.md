# Code Generation Guide - Catan Game
# Руководство по генерации кода - Игра Catan

---

## MODULE_CONTRACT

**PURPOSE:**
Этот документ является практическим руководством по генерации кода для игры Catan. Он содержит конкретные примеры кода, шаблоны и паттерны, которые должны использоваться при реализации.

**SCOPE:**
- Примеры семантической разметки кода
- Шаблоны для различных типов модулей
- Naming conventions
- Паттерны логирования
- Примеры из уже созданного кода
- Checklist для каждого типа файла

**INPUTS:**
- semantic_template.txt - базовый шаблон
- TechSpecification.md - требования
- DevelopmentPlan.md - архитектура
- ImplementationRoadmap.md - последовательность реализации

**OUTPUTS:**
- Конкретные примеры кода с семантической разметкой
- Шаблоны для копирования
- Понимание как генерировать код правильно

**KEYWORDS:**
- Code generation
- Semantic markup
- TypeScript patterns
- React components
- Logging patterns

**MODULE_MAP:**
```
SECTION [Общие правила генерации кода] => General_Rules
SECTION [Пример 1: TypeScript типы] => Example_Types
SECTION [Пример 2: Константы] => Example_Constants
SECTION [Пример 3: Игровая логика (pure functions)] => Example_Game_Logic
SECTION [Пример 4: React компоненты] => Example_React_Components
SECTION [Пример 5: Zustand store] => Example_Zustand_Store
SECTION [Пример 6: Утилиты] => Example_Utilities
SECTION [Naming Conventions] => Naming_Conventions
SECTION [Logging Patterns] => Logging_Patterns
SECTION [Checklist для генерации файлов] => Generation_Checklist
```

---

## START_SECTION_General_Rules
## Общие правила генерации кода

### Обязательные элементы в каждом файле

1. **MODULE_CONTRACT** в начале файла (в комментариях)
2. **FUNCTION_CONTRACT** для каждой экспортируемой функции
3. **START_BLOCK_** / **END_BLOCK_** для логических блоков внутри функций
4. **Логирование** критических операций (для серверной логики и сложных вычислений)
5. **TypeScript strict typing** - без `any` (кроме обоснованных случаев)

### Структура файла

```typescript
/**
 * START_MODULE_[module_name]
 *
 * MODULE_CONTRACT:
 * PURPOSE: [Что делает этот модуль]
 * SCOPE: [Какие задачи решает]
 * KEYWORDS: [Ключевые слова]
 * LINKS_TO_MODULE: [Связанные модули]
 */

// Импорты
import { ... } from '...';

// Типы (если нужны локальные)
interface LocalType { ... }

// Константы (если нужны локальные)
const LOCAL_CONSTANT = ...;

// Функции с FUNCTION_CONTRACT

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: [Что делает функция]
 * INPUTS:
 *   - param1: Type - описание
 *   - param2: Type - описание
 * OUTPUTS: ReturnType - описание
 * SIDE_EFFECTS: [Описание побочных эффектов или "None"]
 * KEYWORDS: [Ключевые слова]
 */
export function functionName(param1: Type, param2: Type): ReturnType {
  // START_BLOCK_[BLOCK_NAME]
  // Описание: [Что делает этот блок]

  // код

  // END_BLOCK_[BLOCK_NAME]

  return result;
}

/**
 * END_MODULE_[module_name]
 */
```

### TypeScript правила

- **Всегда** используй `interface` для объектов
- **Всегда** используй `enum` для перечислений
- **Всегда** используй `type` для union types
- **Всегда** указывай явный тип возврата функций
- **Всегда** используй `const` для неизменяемых значений
- **Избегай** `any` - используй `unknown` если тип действительно неизвестен

## END_SECTION_General_Rules

---

## START_SECTION_Example_Types
## Пример 1: TypeScript типы

**Файл:** `types/game.types.ts`

**Уже создан** - используй как reference.

### Ключевые паттерны:

```typescript
/**
 * START_MODULE_game.types
 *
 * MODULE_CONTRACT:
 * PURPOSE: Определяет все TypeScript типы, интерфейсы и enums для игры Catan
 * SCOPE: Типизация всех игровых сущностей, состояний и действий
 * KEYWORDS: TypeScript, types, interfaces, enums, game state
 * LINKS_TO_MODULE: Используется во всех модулях проекта
 */

// ENUMS - всегда с комментариями
export enum ResourceType {
  WOOD = 'WOOD',
  BRICK = 'BRICK',
  // ...
}

// INTERFACES - всегда с JSDoc комментариями для каждого поля
export interface Player {
  id: string;                              // Уникальный идентификатор
  name: string;                            // Имя игрока
  color: string;                           // Цвет игрока (hex)
  type: PlayerType;                        // Тип игрока (человек/AI)
  resources: Record<ResourceType, number>; // Ресурсы игрока
  // ...
}

// UTILITY TYPES
export type ResourceBundle = Partial<Record<ResourceType, number>>;

// UNION TYPES для действий
export type GameAction =
  | { type: 'ROLL_DICE' }
  | { type: 'BUILD_ROAD'; edgeId: string }
  | { type: 'BUILD_SETTLEMENT'; vertexId: string };

/**
 * END_MODULE_game.types
 */
```

### Checklist для типов:

- [ ] MODULE_CONTRACT в начале
- [ ] Все enums экспортированы
- [ ] Все interfaces имеют комментарии для полей
- [ ] Нет `any` типов
- [ ] END_MODULE в конце

## END_SECTION_Example_Types

---

## START_SECTION_Example_Constants
## Пример 2: Константы

**Файл:** `lib/constants/game.constants.ts`

**Уже создан** - используй как reference.

### Ключевые паттерны:

```typescript
/**
 * START_MODULE_game.constants
 *
 * MODULE_CONTRACT:
 * PURPOSE: Определяет все игровые константы для игры Catan
 * SCOPE: Константы для стоимости построек, распределения ресурсов, правил игры
 * KEYWORDS: constants, game rules, building costs, resource distribution
 * LINKS_TO_MODULE: types/game.types.ts
 */

import { ResourceType, TerrainType } from '@/types/game.types';

// Группируй константы по смыслу с комментариями

/**
 * Основные константы игры
 */
export const GAME_CONSTANTS = {
  /** Количество очков победы для выигрыша */
  VICTORY_POINTS_TO_WIN: 10,

  /** Начальные ресурсы игрока (все по 0) */
  INITIAL_RESOURCES: {
    [ResourceType.WOOD]: 0,
    [ResourceType.BRICK]: 0,
    // ...
  },
} as const; // ВАЖНО: as const для immutability

// Отдельные константы для группировки
export const BUILDING_COSTS = {
  ROAD: {
    [ResourceType.WOOD]: 1,
    [ResourceType.BRICK]: 1,
  },
  // ...
} as const;

/**
 * END_MODULE_game.constants
 */
```

### Checklist для констант:

- [ ] MODULE_CONTRACT
- [ ] Группировка по смыслу
- [ ] JSDoc комментарии для каждой группы
- [ ] `as const` для immutability
- [ ] Импорты типов из types/

## END_SECTION_Example_Constants

---

## START_SECTION_Example_Game_Logic
## Пример 3: Игровая логика (pure functions)

**Паттерн:** Модуль с чистыми функциями (validators, calculators, generators)

### Пример: validators.ts

```typescript
/**
 * START_MODULE_validators
 *
 * MODULE_CONTRACT:
 * PURPOSE: Валидация игровых действий
 * SCOPE: Проверка возможности строительства, покупки, игры карт
 * KEYWORDS: validation, game rules, building rules
 * LINKS_TO_MODULE: types/game.types.ts, lib/constants/game.constants.ts
 */

import { GameState, Player, ValidationResult, ResourceType } from '@/types/game.types';
import { BUILDING_COSTS, GAME_CONSTANTS } from '@/lib/constants/game.constants';

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Проверить возможность строительства дороги игроком
 * INPUTS:
 *   - player: Player - игрок, который хочет построить дорогу
 *   - edgeId: string - ID ребра для строительства
 *   - gameState: GameState - текущее состояние игры
 * OUTPUTS: ValidationResult - результат валидации с возможной ошибкой
 * SIDE_EFFECTS: None (чистая функция)
 * KEYWORDS: validation, road, building rules
 * LINKS:
 *   - TechSpecification.md -> LOGIC_BLOCK_BUILD_ROAD_VALIDATION
 *   - canBuildSettlement - аналогичная функция для поселений
 */
export function canBuildRoad(
  player: Player,
  edgeId: string,
  gameState: GameState
): ValidationResult {

  // START_BLOCK_RESOURCE_CHECK
  // Описание: Проверка наличия необходимых ресурсов у игрока

  const hasWood = player.resources[ResourceType.WOOD] >= BUILDING_COSTS.ROAD[ResourceType.WOOD];
  const hasBrick = player.resources[ResourceType.BRICK] >= BUILDING_COSTS.ROAD[ResourceType.BRICK];

  if (!hasWood || !hasBrick) {
    return {
      valid: false,
      error: 'Not enough resources to build a road',
    };
  }
  // END_BLOCK_RESOURCE_CHECK

  // START_BLOCK_PIECE_AVAILABILITY_CHECK
  // Описание: Проверка наличия дорог в запасе

  if (player.roads <= 0) {
    return {
      valid: false,
      error: 'No roads left in stock',
    };
  }
  // END_BLOCK_PIECE_AVAILABILITY_CHECK

  // START_BLOCK_EDGE_AVAILABILITY_CHECK
  // Описание: Проверка что ребро свободно

  const edge = gameState.edges.find(e => e.id === edgeId);
  if (!edge) {
    return { valid: false, error: 'Edge not found' };
  }

  if (edge.road !== null) {
    return { valid: false, error: 'Edge already has a road' };
  }
  // END_BLOCK_EDGE_AVAILABILITY_CHECK

  // START_BLOCK_ADJACENCY_CHECK
  // Описание: Проверка что дорога примыкает к дороге или постройке игрока

  const isAdjacentToPlayerRoad = edge.vertexIds.some(vertexId => {
    const vertex = gameState.vertices.find(v => v.id === vertexId);
    if (!vertex) return false;

    // Проверка построек на вершине
    if (vertex.building?.playerId === player.id) return true;

    // Проверка соседних дорог
    return vertex.neighborEdgeIds.some(neighborEdgeId => {
      const neighborEdge = gameState.edges.find(e => e.id === neighborEdgeId);
      return neighborEdge?.road?.playerId === player.id;
    });
  });

  if (!isAdjacentToPlayerRoad) {
    return {
      valid: false,
      error: 'Road must be adjacent to your road or building',
    };
  }
  // END_BLOCK_ADJACENCY_CHECK

  return { valid: true };
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Проверить наличие ресурсов у игрока
 * INPUTS:
 *   - player: Player - игрок
 *   - cost: Partial<Record<ResourceType, number>> - требуемые ресурсы
 * OUTPUTS: boolean - true если ресурсов достаточно
 * SIDE_EFFECTS: None (чистая функция)
 * KEYWORDS: resources, validation
 */
export function hasResources(
  player: Player,
  cost: Partial<Record<ResourceType, number>>
): boolean {
  // START_BLOCK_RESOURCE_COMPARISON
  // Описание: Сравнение ресурсов игрока с требуемыми

  return Object.entries(cost).every(([resource, amount]) => {
    const playerAmount = player.resources[resource as ResourceType] ?? 0;
    return playerAmount >= (amount ?? 0);
  });
  // END_BLOCK_RESOURCE_COMPARISON
}

/**
 * END_MODULE_validators
 */
```

### Checklist для game logic:

- [ ] MODULE_CONTRACT
- [ ] FUNCTION_CONTRACT для каждой функции
- [ ] START_BLOCK_ / END_BLOCK_ с описанием
- [ ] Чистые функции (no side effects если возможно)
- [ ] Explicit return types
- [ ] Валидация входных данных

## END_SECTION_Example_Game_Logic

---

## START_SECTION_Example_React_Components
## Пример 4: React компоненты

### Пример: Button.tsx (UI компонент)

```typescript
/**
 * START_MODULE_ui.button
 *
 * MODULE_CONTRACT:
 * PURPOSE: Переиспользуемый компонент кнопки
 * SCOPE: UI компонент с вариантами стилей и состояниями
 * KEYWORDS: React, button, UI component
 */

import React from 'react';

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Переиспользуемая кнопка с различными вариантами стилей
 * INPUTS:
 *   - onClick: () => void - обработчик клика
 *   - children: React.ReactNode - содержимое кнопки
 *   - disabled: boolean (optional) - отключена ли кнопка
 *   - variant: 'primary' | 'secondary' | 'danger' (optional) - вариант стиля
 *   - className: string (optional) - дополнительные CSS классы
 * OUTPUTS: React.ReactElement - JSX элемент кнопки
 * SIDE_EFFECTS: None
 * KEYWORDS: button, UI
 */

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}

export function Button({
  onClick,
  children,
  disabled = false,
  variant = 'primary',
  className = '',
}: ButtonProps) {
  // START_BLOCK_STYLE_CALCULATION
  // Описание: Вычисление CSS классов на основе variant

  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`.trim();
  // END_BLOCK_STYLE_CALCULATION

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}

/**
 * END_MODULE_ui.button
 */
```

### Пример: Hex.tsx (игровой компонент)

```typescript
/**
 * START_MODULE_board.hex
 *
 * MODULE_CONTRACT:
 * PURPOSE: Компонент гексагона игрового поля
 * SCOPE: Отрисовка гексагона, отображение местности, номера, разбойника
 * KEYWORDS: React, SVG, hexagon, game board
 * LINKS_TO_MODULE: types/game.types.ts
 */

import React from 'react';
import { Hex as HexType, TerrainType } from '@/types/game.types';

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Отрисовка одного гексагона на игровом поле
 * INPUTS:
 *   - hex: HexType - данные гексагона
 *   - onClick: (hexId: string) => void (optional) - обработчик клика
 *   - highlight: boolean (optional) - подсветить ли гексагон
 * OUTPUTS: React.ReactElement - SVG элемент гексагона
 * SIDE_EFFECTS: None
 * KEYWORDS: hexagon, SVG, terrain
 */

interface HexProps {
  hex: HexType;
  onClick?: (hexId: string) => void;
  highlight?: boolean;
}

export function Hex({ hex, onClick, highlight = false }: HexProps) {

  // START_BLOCK_COLOR_CALCULATION
  // Описание: Определение цвета гексагона на основе типа местности

  const terrainColors: Record<TerrainType, string> = {
    [TerrainType.FOREST]: '#8B4513',
    [TerrainType.HILLS]: '#CD5C5C',
    [TerrainType.PASTURE]: '#90EE90',
    [TerrainType.FIELDS]: '#FFD700',
    [TerrainType.MOUNTAINS]: '#708090',
    [TerrainType.DESERT]: '#F4A460',
  };

  const fillColor = terrainColors[hex.terrain];
  // END_BLOCK_COLOR_CALCULATION

  // START_BLOCK_SVG_PATH_CALCULATION
  // Описание: Вычисление точек для SVG polygon (правильный шестиугольник)

  const size = 80; // HEX_SIZE
  const points: Array<[number, number]> = [];

  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const x = size * Math.cos(angle);
    const y = size * Math.sin(angle);
    points.push([x, y]);
  }

  const pathData = points.map(([x, y]) => `${x},${y}`).join(' ');
  // END_BLOCK_SVG_PATH_CALCULATION

  // START_BLOCK_CLICK_HANDLER
  // Описание: Обработка клика на гексагон

  const handleClick = () => {
    if (onClick) {
      onClick(hex.id);
    }
  };
  // END_BLOCK_CLICK_HANDLER

  return (
    <g
      onClick={handleClick}
      className={`hex ${highlight ? 'highlighted' : ''}`}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Polygon - тело гексагона */}
      <polygon
        points={pathData}
        fill={fillColor}
        stroke="#333"
        strokeWidth="2"
      />

      {/* Номер токена (если не пустыня) */}
      {hex.number !== null && (
        <text
          x="0"
          y="0"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="24"
          fontWeight="bold"
          fill="#000"
        >
          {hex.number}
        </text>
      )}

      {/* Иконка разбойника */}
      {hex.hasRobber && (
        <circle
          cx="0"
          cy="-20"
          r="12"
          fill="#000"
        />
      )}
    </g>
  );
}

/**
 * END_MODULE_board.hex
 */
```

### Checklist для React компонентов:

- [ ] MODULE_CONTRACT
- [ ] FUNCTION_CONTRACT для компонента
- [ ] Props interface определен
- [ ] Explicit типы для props
- [ ] START_BLOCK_ для логических частей (style calculation, event handlers, etc.)
- [ ] Default values для optional props
- [ ] Комментарии для JSX элементов (если логика сложная)

## END_SECTION_Example_React_Components

---

## START_SECTION_Example_Zustand_Store
## Пример 5: Zustand store

```typescript
/**
 * START_MODULE_game.store
 *
 * MODULE_CONTRACT:
 * PURPOSE: Centralized state management для игры Catan
 * SCOPE: Управление состоянием игры, actions для изменения состояния
 * KEYWORDS: Zustand, state management, game state
 * LINKS_TO_MODULE: types/game.types.ts, lib/game-logic/*
 */

import { create } from 'zustand';
import { GameState, Player, GamePhase, TurnPhase } from '@/types/game.types';
import { generateMap } from '@/lib/game-logic/mapGenerator';
import { createPlayer, rollDice } from '@/lib/utils/gameUtils';
import { handleBuildRoad, handleBuildSettlement } from '@/lib/game-logic/actionHandlers';

/**
 * Интерфейс store
 */
interface GameStore {
  // State
  gameState: GameState | null;

  // UI state
  selectedHex: string | null;
  selectedVertex: string | null;
  selectedEdge: string | null;
  highlightedVertices: string[];
  highlightedEdges: string[];

  // Actions
  initializeGame: (playerNames: string[], aiCount: number) => void;
  rollDice: () => void;
  buildRoad: (edgeId: string) => void;
  buildSettlement: (vertexId: string) => void;
  endTurn: () => void;

  // UI actions
  setSelectedHex: (hexId: string | null) => void;
  setSelectedVertex: (vertexId: string | null) => void;
  setSelectedEdge: (edgeId: string | null) => void;
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Создать Zustand store для управления состоянием игры
 * OUTPUTS: GameStore - store с состоянием и actions
 * SIDE_EFFECTS: Создает глобальное состояние
 * KEYWORDS: Zustand, store, state
 */
export const useGameStore = create<GameStore>((set, get) => ({

  // Initial state
  gameState: null,
  selectedHex: null,
  selectedVertex: null,
  selectedEdge: null,
  highlightedVertices: [],
  highlightedEdges: [],

  /**
   * FUNCTION_CONTRACT:
   * PURPOSE: Инициализировать новую игру
   * INPUTS:
   *   - playerNames: string[] - имена игроков-людей
   *   - aiCount: number - количество AI противников
   * OUTPUTS: void
   * SIDE_EFFECTS: Обновляет gameState в store
   * KEYWORDS: initialization, game start
   */
  initializeGame: (playerNames: string[], aiCount: number) => {
    // START_BLOCK_PLAYER_CREATION
    // Описание: Создание массива игроков (люди + AI)

    const players: Player[] = [];

    playerNames.forEach((name, index) => {
      players.push(createPlayer(
        `player-${index}`,
        name,
        PLAYER_COLORS[index],
        PlayerType.HUMAN
      ));
    });

    for (let i = 0; i < aiCount; i++) {
      const index = playerNames.length + i;
      players.push(createPlayer(
        `ai-${i}`,
        `AI ${i + 1}`,
        PLAYER_COLORS[index],
        PlayerType.AI
      ));
    }
    // END_BLOCK_PLAYER_CREATION

    // START_BLOCK_MAP_GENERATION
    // Описание: Генерация игровой карты

    const { hexes, vertices, edges } = generateMap();
    // END_BLOCK_MAP_GENERATION

    // START_BLOCK_STATE_INITIALIZATION
    // Описание: Создание начального состояния игры

    const initialState: GameState = {
      phase: GamePhase.INITIAL_PLACEMENT,
      turnPhase: TurnPhase.ACTIONS,
      currentPlayerId: players[0].id,
      players,
      hexes,
      vertices,
      edges,
      devCardDeck: createDevCardDeck(),
      lastDiceRoll: null,
      longestRoadPlayerId: null,
      largestArmyPlayerId: null,
      turnNumber: 1,
      winner: null,
      initialPlacementRound: 1,
    };

    set({ gameState: initialState });
    // END_BLOCK_STATE_INITIALIZATION
  },

  /**
   * FUNCTION_CONTRACT:
   * PURPOSE: Бросить кубики и распределить ресурсы
   * OUTPUTS: void
   * SIDE_EFFECTS: Обновляет lastDiceRoll и ресурсы игроков
   * KEYWORDS: dice roll, resources
   */
  rollDice: () => {
    const state = get().gameState;
    if (!state) return;

    // START_BLOCK_DICE_ROLL
    // Описание: Бросок двух кубиков

    const dice = rollDice();
    const sum = dice[0] + dice[1];
    // END_BLOCK_DICE_ROLL

    // START_BLOCK_RESOURCE_DISTRIBUTION
    // Описание: Распределение ресурсов если не 7

    if (sum !== 7) {
      const updatedState = distributeResources(sum, state);
      set({ gameState: { ...updatedState, lastDiceRoll: dice } });
    } else {
      // Активация разбойника
      set({
        gameState: {
          ...state,
          lastDiceRoll: dice,
          turnPhase: TurnPhase.ROBBER_ACTIVATION,
        },
      });
    }
    // END_BLOCK_RESOURCE_DISTRIBUTION
  },

  // Другие actions аналогично...

  buildRoad: (edgeId: string) => {
    const state = get().gameState;
    if (!state) return;

    const currentPlayer = state.players.find(p => p.id === state.currentPlayerId);
    if (!currentPlayer) return;

    const newState = handleBuildRoad(currentPlayer.id, edgeId, state);
    set({ gameState: newState });
  },

  // UI actions
  setSelectedHex: (hexId) => set({ selectedHex: hexId }),
  setSelectedVertex: (vertexId) => set({ selectedVertex: vertexId }),
  setSelectedEdge: (edgeId) => set({ selectedEdge: edgeId }),
}));

/**
 * END_MODULE_game.store
 */
```

### Checklist для Zustand store:

- [ ] MODULE_CONTRACT
- [ ] Interface для store типизирован
- [ ] FUNCTION_CONTRACT для create функции
- [ ] FUNCTION_CONTRACT для каждого action (в JSDoc)
- [ ] START_BLOCK_ внутри actions
- [ ] Immutable updates (используй spread operator)

## END_SECTION_Example_Zustand_Store

---

## START_SECTION_Naming_Conventions
## Naming Conventions

### Файлы и папки

```
components/
  board/
    Hex.tsx           # PascalCase для React компонентов
    Vertex.tsx
  ui/
    Button.tsx

lib/
  game-logic/
    mapGenerator.ts   # camelCase для модулей
    validators.ts
  utils/
    gameUtils.ts

types/
  game.types.ts       # camelCase + .types суффикс

store/
  gameStore.ts        # camelCase + Store суффикс
```

### Переменные и функции

```typescript
// camelCase для переменных и функций
const playerCount = 4;
function calculateVictoryPoints() { }

// PascalCase для типов, интерфейсов, enums
interface GameState { }
enum ResourceType { }
type ValidationResult = { };

// UPPER_SNAKE_CASE для констант
const VICTORY_POINTS_TO_WIN = 10;
const BUILDING_COSTS = { };
```

### React компоненты

```typescript
// PascalCase для компонентов
export function PlayerPanel() { }
export function GameBoard() { }

// camelCase для props
interface PlayerPanelProps {
  playerId: string;
  isCurrentPlayer: boolean;
}
```

### START_BLOCK_ / END_BLOCK_ naming

```typescript
// UPPER_SNAKE_CASE для block names
// START_BLOCK_RESOURCE_CHECK
// END_BLOCK_RESOURCE_CHECK

// START_BLOCK_VALIDATION
// END_BLOCK_VALIDATION

// Должно быть описательным и отражать суть блока
```

## END_SECTION_Naming_Conventions

---

## START_SECTION_Logging_Patterns
## Logging Patterns

### Когда логировать

В контексте Next.js клиентского приложения логирование менее критично чем в backend, но используй для:

1. **Ошибки и исключения**
2. **Важные операции** (инициализация игры, смена фаз)
3. **Сложные вычисления** (DFS для longest road, AI решения)
4. **Debug информация** (для разработки)

### Паттерн логирования

```typescript
// Для клиентского кода используй console с префиксами

// START_BLOCK_EXAMPLE_WITH_LOGGING
// Описание: Пример блока с логированием

console.log('[GameStore][initializeGame][PLAYER_CREATION][START] Creating players');

const players = createPlayers(playerNames, aiCount);

console.log('[GameStore][initializeGame][PLAYER_CREATION][SUCCESS]', {
  playerCount: players.length,
  humanCount: playerNames.length,
  aiCount,
});

// END_BLOCK_EXAMPLE_WITH_LOGGING
```

### Формат логов

```
[ModuleName][FunctionName][BlockName][Status] Message [Data]
```

Примеры:

```typescript
console.log('[MapGenerator][generateMap][HEX_GENERATION][START]');
console.log('[MapGenerator][generateMap][HEX_GENERATION][SUCCESS]', { hexCount: 19 });
console.error('[Validators][canBuildRoad][RESOURCE_CHECK][FAIL]', { error: 'Not enough resources' });
console.debug('[AI][evaluateVertex][SCORE_CALCULATION][INFO]', { vertexId, score });
```

### Уровни логирования

- `console.log` - обычная информация
- `console.debug` - детальная debug информация
- `console.warn` - предупреждения
- `console.error` - ошибки

### Пример в функции

```typescript
export function calculateLongestRoad(playerId: string, gameState: GameState): number {
  console.log('[Calculators][calculateLongestRoad][START]', { playerId });

  // START_BLOCK_EDGE_COLLECTION
  const playerEdges = gameState.edges.filter(e => e.road?.playerId === playerId);
  console.debug('[Calculators][calculateLongestRoad][EDGE_COLLECTION][INFO]', {
    edgeCount: playerEdges.length,
  });
  // END_BLOCK_EDGE_COLLECTION

  // START_BLOCK_DFS_TRAVERSAL
  let maxLength = 0;

  for (const edge of playerEdges) {
    const length = dfsRoadLength(edge.id, new Set(), playerEdges);
    if (length > maxLength) {
      maxLength = length;
      console.debug('[Calculators][calculateLongestRoad][DFS_TRAVERSAL][INFO]', {
        edgeId: edge.id,
        newMaxLength: length,
      });
    }
  }
  // END_BLOCK_DFS_TRAVERSAL

  console.log('[Calculators][calculateLongestRoad][SUCCESS]', { maxLength });
  return maxLength;
}
```

## END_SECTION_Logging_Patterns

---

## START_SECTION_Generation_Checklist
## Checklist для генерации файлов

### Для ЛЮБОГО файла

- [ ] `START_MODULE_[name]` в начале (в комментариях)
- [ ] `MODULE_CONTRACT` заполнен (PURPOSE, SCOPE, KEYWORDS, LINKS_TO_MODULE)
- [ ] `END_MODULE_[name]` в конце
- [ ] Импорты сгруппированы логически
- [ ] TypeScript strict typing (без any)

### Для файла с типами (types/*.ts)

- [ ] Все enums экспортированы
- [ ] Все interfaces экспортированы
- [ ] JSDoc комментарии для каждого поля interface
- [ ] Utility types в конце файла

### Для файла с константами (lib/constants/*.ts)

- [ ] Константы сгруппированы по смыслу
- [ ] JSDoc комментарии для каждой группы
- [ ] `as const` для immutability
- [ ] Импорты типов из types/

### Для файла с игровой логикой (lib/game-logic/*.ts, lib/ai/*.ts)

- [ ] FUNCTION_CONTRACT для каждой экспортируемой функции
- [ ] START_BLOCK_ / END_BLOCK_ для логических блоков
- [ ] Explicit return types
- [ ] Валидация входных данных
- [ ] Логирование критических операций
- [ ] Pure functions где возможно (no side effects)

### Для React компонента (components/**/*.tsx)

- [ ] FUNCTION_CONTRACT для компонента
- [ ] Props interface определен и типизирован
- [ ] Default values для optional props
- [ ] START_BLOCK_ для сложных вычислений/логики
- [ ] Комментарии для сложных JSX частей
- [ ] Использование Tailwind CSS для стилей

### Для Zustand store (store/*.ts)

- [ ] Interface для store типизирован
- [ ] FUNCTION_CONTRACT для create функции
- [ ] JSDoc для каждого action
- [ ] START_BLOCK_ внутри actions
- [ ] Immutable updates (spread operator)

### Для утилит (lib/utils/*.ts)

- [ ] FUNCTION_CONTRACT для каждой функции
- [ ] Pure functions
- [ ] Explicit return types
- [ ] START_BLOCK_ для логических блоков

### Для Next.js страниц (app/**/*.tsx)

- [ ] MODULE_CONTRACT
- [ ] FUNCTION_CONTRACT для page компонента
- [ ] Metadata экспортирован (если нужен)
- [ ] Использование компонентов из components/

---

## FINAL NOTES

Этот Code Generation Guide является **обязательным** к использованию при генерации кода. Каждый файл должен следовать этим паттернам для обеспечения единообразия и возможности навигации AI агентом.

**Ключевые принципы:**
1. Семантическая разметка - не опция, а требование
2. Типизация строгая - no compromises
3. Структура предсказуемая - шаблоны для всего
4. Комментарии полезные - не повторяют код, а объясняют WHY

**Использование:**
При генерации нового файла:
1. Определи тип файла (types/constants/logic/component/store)
2. Найди соответствующий пример в этом guide
3. Скопируй структуру
4. Заполни своим кодом
5. Проверь по checklist

---

**END_OF_DOCUMENT**
