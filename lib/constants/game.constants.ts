/**
 * START_MODULE_game.constants
 *
 * MODULE_CONTRACT:
 * PURPOSE: Определяет все игровые константы для игры Catan
 * SCOPE: Константы для стоимости построек, распределения ресурсов, правил игры
 * KEYWORDS: constants, game rules, building costs, resource distribution
 * LINKS_TO_MODULE: types/game.types.ts
 */

import { ResourceType, TerrainType, DevCardType } from '@/types/game.types';

// ============================================================================
// GAME RULES - Правила игры
// ============================================================================

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
    [ResourceType.SHEEP]: 0,
    [ResourceType.WHEAT]: 0,
    [ResourceType.ORE]: 0,
  },

  /** Начальное количество построек у каждого игрока */
  INITIAL_PIECES: {
    SETTLEMENTS: 5,  // Поселений
    CITIES: 4,       // Городов
    ROADS: 15,       // Дорог
  },

  /** Минимальная длина дороги для "Самой длинной дороги" */
  LONGEST_ROAD_MIN: 5,

  /** Минимальное количество рыцарей для "Самой большой армии" */
  LARGEST_ARMY_MIN: 3,

  /** Очки победы за достижения */
  VICTORY_POINTS: {
    SETTLEMENT: 1,      // За каждое поселение
    CITY: 2,            // За каждый город
    LONGEST_ROAD: 2,    // За самую длинную дорогу
    LARGEST_ARMY: 2,    // За самую большую армию
    VICTORY_CARD: 1,    // За карту победы
  },

  /** Соотношения обмена с банком */
  TRADE_RATIOS: {
    BANK: 4,         // 4:1 обмен с банком (без порта)
    PORT: 3,         // 3:1 обмен через универсальный порт
    RESOURCE_PORT: 2, // 2:1 обмен через специализированный порт
  },

  /** Правила разбойника */
  ROBBER: {
    ACTIVATION_ROLL: 7,           // Выпадение 7 активирует разбойника
    DISCARD_THRESHOLD: 7,         // >7 ресурсов = сброс половины
  },
} as const;

// ============================================================================
// BUILDING COSTS - Стоимость построек
// ============================================================================

/**
 * Стоимость построек в ресурсах
 */
export const BUILDING_COSTS = {
  /** Стоимость дороги */
  ROAD: {
    [ResourceType.WOOD]: 1,
    [ResourceType.BRICK]: 1,
  },

  /** Стоимость поселения */
  SETTLEMENT: {
    [ResourceType.WOOD]: 1,
    [ResourceType.BRICK]: 1,
    [ResourceType.SHEEP]: 1,
    [ResourceType.WHEAT]: 1,
  },

  /** Стоимость города (upgrade от поселения) */
  CITY: {
    [ResourceType.WHEAT]: 2,
    [ResourceType.ORE]: 3,
  },

  /** Стоимость карты развития */
  DEV_CARD: {
    [ResourceType.SHEEP]: 1,
    [ResourceType.WHEAT]: 1,
    [ResourceType.ORE]: 1,
  },
} as const;

// ============================================================================
// MAP GENERATION - Генерация карты
// ============================================================================

/**
 * Распределение типов местности на карте
 */
export const TERRAIN_DISTRIBUTION: Array<{ terrain: TerrainType; count: number }> = [
  { terrain: TerrainType.FOREST, count: 4 },     // 4 леса
  { terrain: TerrainType.HILLS, count: 3 },      // 3 холма
  { terrain: TerrainType.PASTURE, count: 4 },    // 4 пастбища
  { terrain: TerrainType.FIELDS, count: 4 },     // 4 поля
  { terrain: TerrainType.MOUNTAINS, count: 3 },  // 3 горы
  { terrain: TerrainType.DESERT, count: 1 },     // 1 пустыня
];

/**
 * Номера токенов для гексагонов (2-12, исключая 7)
 * Всего 18 токенов для 18 гексагонов (19-й гекс - пустыня без токена)
 */
export const NUMBER_TOKENS: number[] = [
  2,         // 1/36 вероятность
  3, 3,      // 2/36 вероятность
  4, 4,      // 3/36 вероятность
  5, 5,      // 4/36 вероятность
  6, 6,      // 5/36 вероятность
  8, 8,      // 5/36 вероятность
  9, 9,      // 4/36 вероятность
  10, 10,    // 3/36 вероятность
  11, 11,    // 2/36 вероятность
  12,        // 1/36 вероятность
];

/**
 * Соответствие типа местности и ресурса
 */
export const TERRAIN_TO_RESOURCE: Record<TerrainType, ResourceType | null> = {
  [TerrainType.FOREST]: ResourceType.WOOD,
  [TerrainType.HILLS]: ResourceType.BRICK,
  [TerrainType.PASTURE]: ResourceType.SHEEP,
  [TerrainType.FIELDS]: ResourceType.WHEAT,
  [TerrainType.MOUNTAINS]: ResourceType.ORE,
  [TerrainType.DESERT]: null, // Пустыня не дает ресурсов
};

// ============================================================================
// DEVELOPMENT CARDS - Карты развития
// ============================================================================

/**
 * Состав колоды карт развития (всего 25 карт)
 */
export const DEV_CARD_DECK: Record<DevCardType, number> = {
  [DevCardType.KNIGHT]: 14,           // 14 рыцарей
  [DevCardType.VICTORY_POINT]: 5,     // 5 очков победы
  [DevCardType.ROAD_BUILDING]: 2,     // 2 строительства дорог
  [DevCardType.YEAR_OF_PLENTY]: 2,    // 2 года изобилия
  [DevCardType.MONOPOLY]: 2,          // 2 монополии
};

// ============================================================================
// PLAYER COLORS - Цвета игроков
// ============================================================================

/**
 * Предустановленные цвета для игроков
 */
export const PLAYER_COLORS: string[] = [
  '#FF6B6B', // Красный
  '#4ECDC4', // Бирюзовый
  '#45B7D1', // Голубой
  '#FFA07A', // Оранжевый
];

// ============================================================================
// DICE PROBABILITIES - Вероятности выпадения кубиков
// ============================================================================

/**
 * Вероятности выпадения каждого числа на двух кубиках
 * Используется AI для оценки позиций
 */
export const DICE_PROBABILITIES: Record<number, number> = {
  2: 1 / 36,   // 1 комбинация: (1,1)
  3: 2 / 36,   // 2 комбинации: (1,2), (2,1)
  4: 3 / 36,   // 3 комбинации: (1,3), (2,2), (3,1)
  5: 4 / 36,   // 4 комбинации
  6: 5 / 36,   // 5 комбинаций
  7: 6 / 36,   // 6 комбинаций (не используется для ресурсов)
  8: 5 / 36,   // 5 комбинаций
  9: 4 / 36,   // 4 комбинации
  10: 3 / 36,  // 3 комбинации
  11: 2 / 36,  // 2 комбинации
  12: 1 / 36,  // 1 комбинация: (6,6)
};

/**
 * Приоритет ресурсов для AI (чем выше, тем важнее)
 */
export const RESOURCE_PRIORITY: Record<ResourceType, number> = {
  [ResourceType.WHEAT]: 1.2,  // Пшеница - высокий приоритет (для городов и карт развития)
  [ResourceType.ORE]: 1.2,    // Руда - высокий приоритет (для городов и карт развития)
  [ResourceType.WOOD]: 1.0,   // Дерево - средний приоритет
  [ResourceType.BRICK]: 1.0,  // Глина - средний приоритет
  [ResourceType.SHEEP]: 1.0,  // Овца - средний приоритет
};

// ============================================================================
// HEX GRID LAYOUT - Структура гексагональной сетки
// ============================================================================

/**
 * Количество гексагонов в каждом ряду (offset grid)
 * Всего 19 гексагонов в 5 рядах:
 * Ряд 0: 3 гекса
 * Ряд 1: 4 гекса
 * Ряд 2: 5 гексов (центральный ряд)
 * Ряд 3: 4 гекса
 * Ряд 4: 3 гекса
 */
export const HEX_GRID_ROWS: number[] = [3, 4, 5, 4, 3];

/**
 * Размер гексагона в пикселях (для отрисовки)
 */
export const HEX_SIZE = 80;

/**
 * Размер вершины в пикселях
 */
export const VERTEX_SIZE = 16;

/**
 * Ширина дороги в пикселях
 */
export const ROAD_WIDTH = 8;

/**
 * END_MODULE_game.constants
 */
