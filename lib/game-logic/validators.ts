/**
 * START_MODULE_validators
 *
 * MODULE_CONTRACT:
 * PURPOSE: Валидация игровых действий игроков
 * SCOPE: Проверка возможности строительства, покупки карт, игры карт развития
 * KEYWORDS: validation, game rules, building rules, resource validation
 * LINKS_TO_MODULE: types/game.types.ts, lib/constants/game.constants.ts
 */

import {
  GameState,
  Player,
  ValidationResult,
  ResourceType,
  DevCardType,
  ResourceBundle,
} from '@/types/game.types';
import { BUILDING_COSTS, GAME_CONSTANTS } from '@/lib/constants/game.constants';

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Проверить возможность строительства дороги игроком
 * INPUTS:
 *   - player: Player - игрок, который хочет построить дорогу
 *   - edgeId: string - ID ребра для строительства
 *   - gameState: GameState - текущее состояние игры
 *   - isInitialPlacement: boolean - флаг начальной расстановки (по умолчанию false)
 * OUTPUTS: ValidationResult - результат валидации с возможной ошибкой
 * SIDE_EFFECTS: None (чистая функция)
 * KEYWORDS: validation, road, building rules
 * LINKS: TechSpecification.md -> LOGIC_BLOCK_BUILD_ROAD_VALIDATION
 */
export function canBuildRoad(
  player: Player,
  edgeId: string,
  gameState: GameState,
  isInitialPlacement: boolean = false
): ValidationResult {
  // START_BLOCK_RESOURCE_CHECK
  // Описание: Проверка наличия необходимых ресурсов у игрока (только если не начальная расстановка)

  if (!isInitialPlacement && !hasResources(player, BUILDING_COSTS.ROAD)) {
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

  const edge = gameState.edges.find((e) => e.id === edgeId);
  if (!edge) {
    return { valid: false, error: 'Edge not found' };
  }

  if (edge.road !== null) {
    return { valid: false, error: 'Edge already has a road' };
  }
  // END_BLOCK_EDGE_AVAILABILITY_CHECK

  // START_BLOCK_ADJACENCY_CHECK
  // Описание: Проверка что дорога примыкает к дороге или постройке игрока

  const isAdjacentToPlayerStructure = edge.vertexIds.some((vertexId) => {
    const vertex = gameState.vertices.find((v) => v.id === vertexId);
    if (!vertex) return false;

    // Проверка построек на вершине
    if (vertex.building?.playerId === player.id) return true;

    // Проверка соседних дорог
    return vertex.neighborEdgeIds.some((neighborEdgeId) => {
      const neighborEdge = gameState.edges.find((e) => e.id === neighborEdgeId);
      return neighborEdge?.road?.playerId === player.id;
    });
  });

  if (!isAdjacentToPlayerStructure) {
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
 * PURPOSE: Проверить возможность строительства поселения игроком
 * INPUTS:
 *   - player: Player - игрок
 *   - vertexId: string - ID вершины для строительства
 *   - gameState: GameState - текущее состояние игры
 *   - isInitialPlacement: boolean - флаг начальной расстановки (по умолчанию false)
 * OUTPUTS: ValidationResult - результат валидации
 * SIDE_EFFECTS: None
 * KEYWORDS: validation, settlement, distance rule
 * LINKS: TechSpecification.md -> LOGIC_BLOCK_BUILD_SETTLEMENT_VALIDATION
 */
export function canBuildSettlement(
  player: Player,
  vertexId: string,
  gameState: GameState,
  isInitialPlacement: boolean = false
): ValidationResult {
  // START_BLOCK_RESOURCE_CHECK
  // Описание: Проверка ресурсов (только если не начальная расстановка)

  if (!isInitialPlacement && !hasResources(player, BUILDING_COSTS.SETTLEMENT)) {
    return {
      valid: false,
      error: 'Not enough resources to build a settlement',
    };
  }
  // END_BLOCK_RESOURCE_CHECK

  // START_BLOCK_PIECE_AVAILABILITY_CHECK
  // Описание: Проверка наличия поселений в запасе

  if (player.settlements <= 0) {
    return {
      valid: false,
      error: 'No settlements left in stock',
    };
  }
  // END_BLOCK_PIECE_AVAILABILITY_CHECK

  // START_BLOCK_VERTEX_AVAILABILITY_CHECK
  // Описание: Проверка что вершина свободна

  const vertex = gameState.vertices.find((v) => v.id === vertexId);
  if (!vertex) {
    return { valid: false, error: 'Vertex not found' };
  }

  if (vertex.building !== null) {
    return { valid: false, error: 'Vertex already has a building' };
  }
  // END_BLOCK_VERTEX_AVAILABILITY_CHECK

  // START_BLOCK_DISTANCE_RULE_CHECK
  // Описание: Проверка правила расстояния (2 ребра от других поселений)

  const hasAdjacentBuilding = vertex.neighborVertexIds.some((neighborId) => {
    const neighborVertex = gameState.vertices.find((v) => v.id === neighborId);
    return neighborVertex?.building !== null;
  });

  if (hasAdjacentBuilding) {
    return {
      valid: false,
      error: 'Settlement must be at least 2 edges away from other settlements',
    };
  }
  // END_BLOCK_DISTANCE_RULE_CHECK

  // START_BLOCK_ROAD_ADJACENCY_CHECK
  // Описание: Проверка что вершина примыкает к дороге игрока (только если не начальная расстановка)

  if (!isInitialPlacement) {
    const hasAdjacentRoad = vertex.neighborEdgeIds.some((edgeId) => {
      const edge = gameState.edges.find((e) => e.id === edgeId);
      return edge?.road?.playerId === player.id;
    });

    if (!hasAdjacentRoad) {
      return {
        valid: false,
        error: 'Settlement must be adjacent to your road',
      };
    }
  }
  // END_BLOCK_ROAD_ADJACENCY_CHECK

  return { valid: true };
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Проверить возможность строительства города (upgrade от поселения)
 * INPUTS:
 *   - player: Player - игрок
 *   - vertexId: string - ID вершины для строительства города
 *   - gameState: GameState - текущее состояние игры
 * OUTPUTS: ValidationResult - результат валидации
 * SIDE_EFFECTS: None
 * KEYWORDS: validation, city, upgrade
 */
export function canBuildCity(
  player: Player,
  vertexId: string,
  gameState: GameState
): ValidationResult {
  // START_BLOCK_RESOURCE_CHECK
  // Описание: Проверка ресурсов

  if (!hasResources(player, BUILDING_COSTS.CITY)) {
    return {
      valid: false,
      error: 'Not enough resources to build a city',
    };
  }
  // END_BLOCK_RESOURCE_CHECK

  // START_BLOCK_PIECE_AVAILABILITY_CHECK
  // Описание: Проверка наличия городов в запасе

  if (player.cities <= 0) {
    return {
      valid: false,
      error: 'No cities left in stock',
    };
  }
  // END_BLOCK_PIECE_AVAILABILITY_CHECK

  // START_BLOCK_SETTLEMENT_CHECK
  // Описание: Проверка что на вершине есть поселение игрока

  const vertex = gameState.vertices.find((v) => v.id === vertexId);
  if (!vertex) {
    return { valid: false, error: 'Vertex not found' };
  }

  if (vertex.building?.playerId !== player.id) {
    return {
      valid: false,
      error: 'You must have a settlement on this vertex to build a city',
    };
  }

  if (vertex.building?.type !== 'SETTLEMENT') {
    return {
      valid: false,
      error: 'This vertex already has a city',
    };
  }
  // END_BLOCK_SETTLEMENT_CHECK

  return { valid: true };
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Проверить возможность покупки карты развития
 * INPUTS:
 *   - player: Player - игрок
 *   - gameState: GameState - текущее состояние игры
 * OUTPUTS: ValidationResult - результат валидации
 * SIDE_EFFECTS: None
 * KEYWORDS: validation, development card
 */
export function canBuyDevCard(
  player: Player,
  gameState: GameState
): ValidationResult {
  // START_BLOCK_RESOURCE_CHECK
  // Описание: Проверка ресурсов

  if (!hasResources(player, BUILDING_COSTS.DEV_CARD)) {
    return {
      valid: false,
      error: 'Not enough resources to buy a development card',
    };
  }
  // END_BLOCK_RESOURCE_CHECK

  // START_BLOCK_DECK_AVAILABILITY_CHECK
  // Описание: Проверка что колода не пуста

  if (gameState.devCardDeck.length === 0) {
    return {
      valid: false,
      error: 'Development card deck is empty',
    };
  }
  // END_BLOCK_DECK_AVAILABILITY_CHECK

  return { valid: true };
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Проверить возможность игры карты развития
 * INPUTS:
 *   - player: Player - игрок
 *   - cardType: DevCardType - тип карты для игры
 *   - turnNumber: number - текущий номер хода
 * OUTPUTS: ValidationResult - результат валидации
 * SIDE_EFFECTS: None
 * KEYWORDS: validation, development card, play card
 */
export function canPlayDevCard(
  player: Player,
  cardType: DevCardType,
  turnNumber: number
): ValidationResult {
  // START_BLOCK_CARD_OWNERSHIP_CHECK
  // Описание: Проверка что карта есть у игрока

  const hasCard = player.devCards.includes(cardType);
  if (!hasCard) {
    return {
      valid: false,
      error: `You don't have a ${cardType} card`,
    };
  }
  // END_BLOCK_CARD_OWNERSHIP_CHECK

  // START_BLOCK_ALREADY_PLAYED_CHECK
  // Описание: Проверка что игрок еще не играл карту в этот ход (кроме Victory Point)

  if (cardType !== DevCardType.VICTORY_POINT) {
    // Проверка что карта не куплена в этот же ход (простая эвристика)
    // В реальной реализации нужно хранить turnBought для каждой карты

    // Проверка что игрок еще не играл другую карту в этот ход
    // Эта логика будет в actionHandlers - здесь базовая проверка
  }
  // END_BLOCK_ALREADY_PLAYED_CHECK

  return { valid: true };
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Проверить возможность торговли с банком
 * INPUTS:
 *   - player: Player - игрок
 *   - offer: ResourceBundle - ресурсы которые игрок предлагает
 *   - receive: ResourceBundle - ресурсы которые игрок получает
 *   - ratio: number - соотношение обмена (4:1, 3:1, 2:1)
 * OUTPUTS: ValidationResult - результат валидации
 * SIDE_EFFECTS: None
 * KEYWORDS: validation, trade, bank
 */
export function canTradeWithBank(
  player: Player,
  offer: ResourceBundle,
  receive: ResourceBundle,
  ratio: number = GAME_CONSTANTS.TRADE_RATIOS.BANK
): ValidationResult {
  // START_BLOCK_RESOURCE_CHECK
  // Описание: Проверка что у игрока есть предлагаемые ресурсы

  if (!hasResources(player, offer)) {
    return {
      valid: false,
      error: 'Not enough resources to trade',
    };
  }
  // END_BLOCK_RESOURCE_CHECK

  // START_BLOCK_RATIO_CHECK
  // Описание: Проверка правильности соотношения обмена

  const offerCount = Object.values(offer).reduce((sum, val) => sum + (val ?? 0), 0);
  const receiveCount = Object.values(receive).reduce((sum, val) => sum + (val ?? 0), 0);

  if (offerCount !== ratio * receiveCount) {
    return {
      valid: false,
      error: `Trade ratio must be ${ratio}:1`,
    };
  }
  // END_BLOCK_RATIO_CHECK

  return { valid: true };
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Проверить наличие ресурсов у игрока
 * INPUTS:
 *   - player: Player - игрок
 *   - cost: ResourceBundle - требуемые ресурсы
 * OUTPUTS: boolean - true если ресурсов достаточно
 * SIDE_EFFECTS: None
 * KEYWORDS: resources, validation
 */
export function hasResources(player: Player, cost: ResourceBundle): boolean {
  // START_BLOCK_RESOURCE_COMPARISON
  // Описание: Сравнение ресурсов игрока с требуемыми

  return Object.entries(cost).every(([resource, amount]) => {
    const playerAmount = player.resources[resource as ResourceType] ?? 0;
    return playerAmount >= (amount ?? 0);
  });
  // END_BLOCK_RESOURCE_COMPARISON
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Проверить доступность вершины для начальной расстановки
 * INPUTS:
 *   - vertexId: string - ID вершины
 *   - gameState: GameState - текущее состояние игры
 * OUTPUTS: ValidationResult - результат валидации
 * SIDE_EFFECTS: None
 * KEYWORDS: validation, initial placement, distance rule
 */
export function canPlaceInitialSettlement(
  vertexId: string,
  gameState: GameState
): ValidationResult {
  // START_BLOCK_VERTEX_CHECK
  // Описание: Проверка что вершина существует и свободна

  const vertex = gameState.vertices.find((v) => v.id === vertexId);
  if (!vertex) {
    return { valid: false, error: 'Vertex not found' };
  }

  if (vertex.building !== null) {
    return { valid: false, error: 'Vertex already has a building' };
  }
  // END_BLOCK_VERTEX_CHECK

  // START_BLOCK_DISTANCE_RULE_CHECK
  // Описание: Проверка правила расстояния

  const hasAdjacentBuilding = vertex.neighborVertexIds.some((neighborId) => {
    const neighborVertex = gameState.vertices.find((v) => v.id === neighborId);
    return neighborVertex?.building !== null;
  });

  if (hasAdjacentBuilding) {
    return {
      valid: false,
      error: 'Settlement must be at least 2 edges away from other settlements',
    };
  }
  // END_BLOCK_DISTANCE_RULE_CHECK

  return { valid: true };
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Проверить доступность ребра для начальной расстановки
 * INPUTS:
 *   - edgeId: string - ID ребра
 *   - vertexId: string - ID вершины где только что построено поселение
 *   - gameState: GameState - текущее состояние игры
 * OUTPUTS: ValidationResult - результат валидации
 * SIDE_EFFECTS: None
 * KEYWORDS: validation, initial placement, road
 */
export function canPlaceInitialRoad(
  edgeId: string,
  vertexId: string,
  gameState: GameState
): ValidationResult {
  // START_BLOCK_EDGE_CHECK
  // Описание: Проверка что ребро существует и свободно

  const edge = gameState.edges.find((e) => e.id === edgeId);
  if (!edge) {
    return { valid: false, error: 'Edge not found' };
  }

  if (edge.road !== null) {
    return { valid: false, error: 'Edge already has a road' };
  }
  // END_BLOCK_EDGE_CHECK

  // START_BLOCK_ADJACENCY_CHECK
  // Описание: Проверка что ребро примыкает к только что построенному поселению

  const isAdjacentToSettlement = edge.vertexIds.includes(vertexId);

  if (!isAdjacentToSettlement) {
    return {
      valid: false,
      error: 'Road must be adjacent to your settlement',
    };
  }
  // END_BLOCK_ADJACENCY_CHECK

  return { valid: true };
}

/**
 * END_MODULE_validators
 */
