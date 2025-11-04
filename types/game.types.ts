/**
 * START_MODULE_game.types
 *
 * MODULE_CONTRACT:
 * PURPOSE: Определяет все TypeScript типы, интерфейсы и enums для игры Catan
 * SCOPE: Типизация всех игровых сущностей, состояний и действий
 * KEYWORDS: TypeScript, types, interfaces, enums, game state
 * LINKS_TO_MODULE: Используется во всех модулях проекта
 */

// ============================================================================
// ENUMS - Перечисления
// ============================================================================

/**
 * Типы ресурсов в игре
 */
export enum ResourceType {
  WOOD = 'WOOD',
  BRICK = 'BRICK',
  SHEEP = 'SHEEP',
  WHEAT = 'WHEAT',
  ORE = 'ORE',
}

/**
 * Типы местности гексагонов
 */
export enum TerrainType {
  FOREST = 'FOREST',       // Лес -> Дерево
  HILLS = 'HILLS',         // Холмы -> Глина
  PASTURE = 'PASTURE',     // Пастбища -> Овца
  FIELDS = 'FIELDS',       // Поля -> Пшеница
  MOUNTAINS = 'MOUNTAINS', // Горы -> Руда
  DESERT = 'DESERT',       // Пустыня -> Ничего
}

/**
 * Типы построек
 */
export enum BuildingType {
  SETTLEMENT = 'SETTLEMENT', // Поселение
  CITY = 'CITY',             // Город
}

/**
 * Типы карт развития
 */
export enum DevCardType {
  KNIGHT = 'KNIGHT',                   // Рыцарь
  VICTORY_POINT = 'VICTORY_POINT',     // Очко победы
  ROAD_BUILDING = 'ROAD_BUILDING',     // Строительство дорог
  YEAR_OF_PLENTY = 'YEAR_OF_PLENTY',   // Год изобилия
  MONOPOLY = 'MONOPOLY',               // Монополия
}

/**
 * Типы портов
 */
export enum PortType {
  GENERIC = 'GENERIC',     // Универсальный порт (3:1)
  WOOD = 'WOOD',           // Специализированный порт (2:1 дерево)
  BRICK = 'BRICK',         // Специализированный порт (2:1 глина)
  SHEEP = 'SHEEP',         // Специализированный порт (2:1 овца)
  WHEAT = 'WHEAT',         // Специализированный порт (2:1 пшеница)
  ORE = 'ORE',             // Специализированный порт (2:1 руда)
}

/**
 * Типы игроков
 */
export enum PlayerType {
  HUMAN = 'HUMAN', // Человек
  AI = 'AI',       // Компьютер
}

/**
 * Фазы игры
 */
export enum GamePhase {
  INITIAL_PLACEMENT = 'INITIAL_PLACEMENT', // Начальная расстановка
  MAIN_GAME = 'MAIN_GAME',                 // Основная игра
  GAME_OVER = 'GAME_OVER',                 // Игра окончена
}

/**
 * Фазы хода игрока
 */
export enum TurnPhase {
  DICE_ROLL = 'DICE_ROLL',             // Бросок кубиков
  ROBBER_ACTIVATION = 'ROBBER_ACTIVATION', // Активация разбойника
  ACTIONS = 'ACTIONS',                 // Фаза действий
}

// ============================================================================
// GAME OBJECTS - Игровые объекты
// ============================================================================

/**
 * Гексагон (тайл) на игровом поле
 */
export interface Hex {
  id: string;                    // Уникальный идентификатор
  terrain: TerrainType;          // Тип местности
  number: number | null;         // Номер токена (2-12, null для пустыни)
  hasRobber: boolean;            // Находится ли разбойник на этом гексе
  vertexIds: string[];           // ID вершин (6 штук)
  edgeIds: string[];             // ID ребер (6 штук)
}

/**
 * Вершина (место для постройки поселения/города)
 */
export interface Vertex {
  id: string;                    // Уникальный идентификатор
  hexIds: string[];              // ID соседних гексагонов (до 3)
  building: Building | null;     // Постройка на вершине
  neighborVertexIds: string[];   // ID соседних вершин (2-3 штуки)
  neighborEdgeIds: string[];     // ID соседних ребер (2-3 штуки)
  port: PortType | null;         // Порт (если есть)
}

/**
 * Ребро (место для постройки дороги)
 */
export interface Edge {
  id: string;                    // Уникальный идентификатор
  vertexIds: [string, string];   // ID двух вершин
  hexIds: string[];              // ID соседних гексагонов (1-2)
  road: Road | null;             // Дорога на ребре
}

/**
 * Постройка (поселение или город)
 */
export interface Building {
  type: BuildingType;            // Тип постройки
  playerId: string;              // ID владельца
}

/**
 * Дорога
 */
export interface Road {
  playerId: string;              // ID владельца
}

/**
 * Игрок
 */
export interface Player {
  id: string;                              // Уникальный идентификатор
  name: string;                            // Имя игрока
  color: string;                           // Цвет игрока (hex)
  type: PlayerType;                        // Тип игрока (человек/AI)
  resources: Record<ResourceType, number>; // Ресурсы игрока
  settlements: number;                     // Оставшиеся поселения в запасе
  cities: number;                          // Оставшиеся города в запасе
  roads: number;                           // Оставшиеся дороги в запасе
  devCards: DevCardType[];                 // Карты развития на руках
  playedDevCards: DevCardType[];           // Сыгранные карты развития
  knightsPlayed: number;                   // Количество сыгранных рыцарей
  victoryPoints: number;                   // Очки победы
  hasLongestRoad: boolean;                 // Имеет ли самую длинную дорогу
  hasLargestArmy: boolean;                 // Имеет ли самую большую армию
}

/**
 * Карта развития (расширенная информация)
 */
export interface DevelopmentCard {
  type: DevCardType;             // Тип карты
  canPlayThisTurn: boolean;      // Можно ли сыграть в этот ход
}

/**
 * Предложение обмена
 */
export interface TradeOffer {
  playerId: string;                              // ID игрока, предлагающего обмен
  offering: Partial<Record<ResourceType, number>>; // Что предлагает
  requesting: Partial<Record<ResourceType, number>>; // Что запрашивает
}

/**
 * Состояние игры (главный объект состояния)
 */
export interface GameState {
  phase: GamePhase;                  // Текущая фаза игры
  turnPhase: TurnPhase;              // Текущая фаза хода
  currentPlayerId: string;           // ID текущего игрока
  players: Player[];                 // Массив игроков
  hexes: Hex[];                      // Массив гексагонов
  vertices: Vertex[];                // Массив вершин
  edges: Edge[];                     // Массив ребер
  devCardDeck: DevCardType[];        // Колода карт развития
  lastDiceRoll: [number, number] | null; // Последний бросок кубиков
  longestRoadPlayerId: string | null; // ID игрока с самой длинной дорогой
  largestArmyPlayerId: string | null; // ID игрока с самой большой армией
  turnNumber: number;                // Номер хода
  winner: string | null;             // ID победителя (если игра окончена)
  initialPlacementRound: number;     // Раунд начальной расстановки (1 или 2)
  currentTradeOffer?: TradeOffer;    // Текущее предложение обмена (если есть)
}

// ============================================================================
// UTILITY TYPES - Вспомогательные типы
// ============================================================================

/**
 * Deep Partial - делает все свойства объекта и вложенных объектов опциональными
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Набор ресурсов (частичный)
 */
export type ResourceBundle = Partial<Record<ResourceType, number>>;

/**
 * Результат валидации
 */
export interface ValidationResult {
  valid: boolean;   // Валидно ли действие
  error?: string;   // Сообщение об ошибке (если не валидно)
}

/**
 * Действия игрока (union type для всех возможных действий)
 */
export type GameAction =
  | { type: 'ROLL_DICE' }
  | { type: 'BUILD_ROAD'; edgeId: string }
  | { type: 'BUILD_SETTLEMENT'; vertexId: string }
  | { type: 'BUILD_CITY'; vertexId: string }
  | { type: 'BUY_DEV_CARD' }
  | { type: 'PLAY_DEV_CARD'; cardType: DevCardType; params?: unknown }
  | { type: 'END_TURN' }
  | { type: 'TRADE_WITH_BANK'; offer: ResourceBundle; receive: ResourceBundle }
  | { type: 'MOVE_ROBBER'; hexId: string; stealFromPlayerId: string | null };

/**
 * Позиция для начальной расстановки
 */
export interface InitialPlacement {
  vertexId: string; // Вершина для поселения
  edgeId: string;   // Ребро для дороги
}

/**
 * END_MODULE_game.types
 */
