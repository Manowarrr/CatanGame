/**
 * START_MODULE_calculators
 *
 * MODULE_CONTRACT:
 * PURPOSE: Вычисления игровых параметров (VP, longest road, распределение ресурсов)
 * SCOPE: Подсчет очков победы, поиск самой длинной дороги (DFS), распределение ресурсов при броске кубиков
 * KEYWORDS: calculations, victory points, longest road, DFS, resource distribution
 * LINKS_TO_MODULE: types/game.types.ts, lib/constants/game.constants.ts
 */

import {
  GameState,
  Player,
  ResourceType,
  ResourceBundle,
  BuildingType,
} from '@/types/game.types';
import { GAME_CONSTANTS, TERRAIN_TO_RESOURCE } from '@/lib/constants/game.constants';

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Вычислить общее количество очков победы игрока
 * INPUTS:
 *   - player: Player - игрок
 *   - gameState: GameState - текущее состояние игры
 * OUTPUTS: number - количество очков победы
 * SIDE_EFFECTS: None
 * KEYWORDS: victory points, scoring
 * LINKS: TechSpecification.md -> LOGIC_BLOCK_VICTORY_POINTS_CALCULATION
 */
export function calculateVictoryPoints(
  player: Player,
  gameState: GameState
): number {
  let points = 0;

  // START_BLOCK_BUILDING_POINTS
  // Описание: Подсчет очков за постройки

  gameState.vertices.forEach((vertex) => {
    if (vertex.building?.playerId === player.id) {
      if (vertex.building.type === BuildingType.SETTLEMENT) {
        points += GAME_CONSTANTS.VICTORY_POINTS.SETTLEMENT;
      } else if (vertex.building.type === BuildingType.CITY) {
        points += GAME_CONSTANTS.VICTORY_POINTS.CITY;
      }
    }
  });
  // END_BLOCK_BUILDING_POINTS

  // START_BLOCK_LONGEST_ROAD_POINTS
  // Описание: Очки за самую длинную дорогу

  if (player.hasLongestRoad) {
    points += GAME_CONSTANTS.VICTORY_POINTS.LONGEST_ROAD;
  }
  // END_BLOCK_LONGEST_ROAD_POINTS

  // START_BLOCK_LARGEST_ARMY_POINTS
  // Описание: Очки за самую большую армию

  if (player.hasLargestArmy) {
    points += GAME_CONSTANTS.VICTORY_POINTS.LARGEST_ARMY;
  }
  // END_BLOCK_LARGEST_ARMY_POINTS

  // START_BLOCK_VICTORY_CARD_POINTS
  // Описание: Очки за карты развития Victory Point

  const victoryCardCount = player.devCards.filter(
    (card) => card === 'VICTORY_POINT'
  ).length;
  points += victoryCardCount * GAME_CONSTANTS.VICTORY_POINTS.VICTORY_CARD;
  // END_BLOCK_VICTORY_CARD_POINTS

  console.log('[Calculators][calculateVictoryPoints][SUCCESS]', {
    playerId: player.id,
    points,
  });

  return points;
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Вычислить длину самой длинной дороги игрока используя DFS
 * INPUTS:
 *   - playerId: string - ID игрока
 *   - gameState: GameState - текущее состояние игры
 * OUTPUTS: number - длина самой длинной дороги
 * SIDE_EFFECTS: None
 * KEYWORDS: longest road, DFS, graph traversal
 * LINKS: TechSpecification.md -> LOGIC_BLOCK_LONGEST_ROAD_CALCULATION
 */
export function calculateLongestRoad(
  playerId: string,
  gameState: GameState
): number {
  console.log('[Calculators][calculateLongestRoad][START]', { playerId });

  // START_BLOCK_EDGE_COLLECTION
  // Описание: Сбор всех ребер игрока

  const playerEdges = gameState.edges.filter((e) => e.road?.playerId === playerId);

  if (playerEdges.length === 0) {
    console.log('[Calculators][calculateLongestRoad][SUCCESS]', {
      playerId,
      maxLength: 0,
    });
    return 0;
  }

  console.debug('[Calculators][calculateLongestRoad][EDGE_COLLECTION][INFO]', {
    edgeCount: playerEdges.length,
  });
  // END_BLOCK_EDGE_COLLECTION

  // START_BLOCK_DFS_TRAVERSAL
  // Описание: DFS обход для поиска самого длинного пути

  let maxLength = 0;

  // Запустить DFS от каждого ребра игрока
  for (const startEdge of playerEdges) {
    const visited = new Set<string>();
    const length = dfsRoadLength(startEdge.id, visited, gameState, playerId);

    if (length > maxLength) {
      maxLength = length;
      console.debug('[Calculators][calculateLongestRoad][DFS_TRAVERSAL][INFO]', {
        startEdgeId: startEdge.id,
        newMaxLength: length,
      });
    }
  }
  // END_BLOCK_DFS_TRAVERSAL

  console.log('[Calculators][calculateLongestRoad][SUCCESS]', {
    playerId,
    maxLength,
  });

  return maxLength;
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: DFS обход для подсчета длины пути дорог
 * INPUTS:
 *   - edgeId: string - ID текущего ребра
 *   - visited: Set<string> - множество посещенных ребер
 *   - gameState: GameState - состояние игры
 *   - playerId: string - ID игрока
 * OUTPUTS: number - длина пути от этого ребра
 * SIDE_EFFECTS: Модифицирует visited set
 * KEYWORDS: DFS, recursive, graph traversal
 */
function dfsRoadLength(
  edgeId: string,
  visited: Set<string>,
  gameState: GameState,
  playerId: string
): number {
  // START_BLOCK_VISITED_CHECK
  // Описание: Проверка что ребро еще не посещено

  if (visited.has(edgeId)) {
    return 0;
  }

  visited.add(edgeId);
  // END_BLOCK_VISITED_CHECK

  // START_BLOCK_NEIGHBOR_SEARCH
  // Описание: Поиск соседних ребер игрока

  const edge = gameState.edges.find((e) => e.id === edgeId);
  if (!edge) return 1;

  let maxNeighborLength = 0;

  // Для каждой вершины ребра найти соседние ребра игрока
  edge.vertexIds.forEach((vertexId) => {
    const vertex = gameState.vertices.find((v) => v.id === vertexId);
    if (!vertex) return;

    // Проверка: если на вершине есть чужая постройка, путь прерывается
    if (vertex.building && vertex.building.playerId !== playerId) {
      return;
    }

    // Проверить все соседние ребра
    vertex.neighborEdgeIds.forEach((neighborEdgeId) => {
      if (neighborEdgeId === edgeId) return; // Skip current edge

      const neighborEdge = gameState.edges.find((e) => e.id === neighborEdgeId);
      if (neighborEdge?.road?.playerId === playerId) {
        const length = dfsRoadLength(neighborEdgeId, visited, gameState, playerId);
        if (length > maxNeighborLength) {
          maxNeighborLength = length;
        }
      }
    });
  });
  // END_BLOCK_NEIGHBOR_SEARCH

  visited.delete(edgeId); // Backtrack для поиска других путей

  return 1 + maxNeighborLength;
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Распределить ресурсы всем игрокам на основе броска кубиков
 * INPUTS:
 *   - diceRoll: number - сумма кубиков (2-12)
 *   - gameState: GameState - текущее состояние игры
 * OUTPUTS: Record<string, ResourceBundle> - распределение ресурсов по игрокам
 * SIDE_EFFECTS: None (не модифицирует gameState, только возвращает распределение)
 * KEYWORDS: resource distribution, dice roll
 * LINKS: TechSpecification.md -> LOGIC_BLOCK_RESOURCE_DISTRIBUTION
 */
export function distributeResources(
  diceRoll: number,
  gameState: GameState
): Record<string, ResourceBundle> {
  console.log('[Calculators][distributeResources][START]', { diceRoll });

  const distribution: Record<string, ResourceBundle> = {};

  // START_BLOCK_INITIALIZE_DISTRIBUTION
  // Описание: Инициализация пустого распределения для всех игроков

  gameState.players.forEach((player) => {
    distribution[player.id] = {};
  });
  // END_BLOCK_INITIALIZE_DISTRIBUTION

  // START_BLOCK_FIND_MATCHING_HEXES
  // Описание: Найти все гексагоны с выпавшим номером

  const matchingHexes = gameState.hexes.filter(
    (hex) => hex.number === diceRoll && !hex.hasRobber
  );

  console.debug('[Calculators][distributeResources][FIND_MATCHING_HEXES][INFO]', {
    matchingHexCount: matchingHexes.length,
  });
  // END_BLOCK_FIND_MATCHING_HEXES

  // START_BLOCK_DISTRIBUTE_BY_HEX
  // Описание: Для каждого гексагона распределить ресурсы игрокам с постройками

  matchingHexes.forEach((hex) => {
    const resource = TERRAIN_TO_RESOURCE[hex.terrain];
    if (!resource) return; // Пустыня не дает ресурсов

    // Найти все вершины этого гексагона
    hex.vertexIds.forEach((vertexId) => {
      const vertex = gameState.vertices.find((v) => v.id === vertexId);
      if (!vertex?.building) return;

      const playerId = vertex.building.playerId;
      const amount =
        vertex.building.type === BuildingType.CITY
          ? 2 // Город дает 2 ресурса
          : 1; // Поселение дает 1 ресурс

      // Добавить ресурс в распределение
      if (!distribution[playerId][resource]) {
        distribution[playerId][resource] = 0;
      }
      distribution[playerId][resource]! += amount;
    });
  });
  // END_BLOCK_DISTRIBUTE_BY_HEX

  console.log('[Calculators][distributeResources][SUCCESS]', {
    diceRoll,
    distribution,
  });

  return distribution;
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Получить соседние вершины гексагона
 * INPUTS:
 *   - hexId: string - ID гексагона
 *   - gameState: GameState - состояние игры
 * OUTPUTS: string[] - массив ID вершин
 * SIDE_EFFECTS: None
 * KEYWORDS: graph, adjacency
 */
export function getAdjacentVertices(
  hexId: string,
  gameState: GameState
): string[] {
  // START_BLOCK_FIND_HEX
  // Описание: Поиск гексагона

  const hex = gameState.hexes.find((h) => h.id === hexId);
  if (!hex) return [];
  // END_BLOCK_FIND_HEX

  return hex.vertexIds;
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Получить соседние гексагоны вершины
 * INPUTS:
 *   - vertexId: string - ID вершины
 *   - gameState: GameState - состояние игры
 * OUTPUTS: string[] - массив ID гексагонов
 * SIDE_EFFECTS: None
 * KEYWORDS: graph, adjacency
 */
export function getAdjacentHexes(
  vertexId: string,
  gameState: GameState
): string[] {
  // START_BLOCK_FIND_VERTEX
  // Описание: Поиск вершины

  const vertex = gameState.vertices.find((v) => v.id === vertexId);
  if (!vertex) return [];
  // END_BLOCK_FIND_VERTEX

  return vertex.hexIds;
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Проверить имеет ли игрок самую длинную дорогу
 * INPUTS:
 *   - playerId: string - ID игрока
 *   - gameState: GameState - состояние игры
 * OUTPUTS: boolean - true если игрок имеет самую длинную дорогу
 * SIDE_EFFECTS: None
 * KEYWORDS: longest road, comparison
 */
export function checkLongestRoad(
  playerId: string,
  gameState: GameState
): boolean {
  // START_BLOCK_CALCULATE_PLAYER_ROAD
  // Описание: Вычисление длины дороги текущего игрока

  const playerRoadLength = calculateLongestRoad(playerId, gameState);

  if (playerRoadLength < GAME_CONSTANTS.LONGEST_ROAD_MIN) {
    return false; // Минимум 5 дорог для получения badge
  }
  // END_BLOCK_CALCULATE_PLAYER_ROAD

  // START_BLOCK_COMPARE_WITH_OTHERS
  // Описание: Сравнение с другими игроками

  const otherPlayersMaxLength = Math.max(
    ...gameState.players
      .filter((p) => p.id !== playerId)
      .map((p) => calculateLongestRoad(p.id, gameState))
  );

  return playerRoadLength > otherPlayersMaxLength;
  // END_BLOCK_COMPARE_WITH_OTHERS
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Проверить имеет ли игрок самую большую армию
 * INPUTS:
 *   - playerId: string - ID игрока
 *   - gameState: GameState - состояние игры
 * OUTPUTS: boolean - true если игрок имеет самую большую армию
 * SIDE_EFFECTS: None
 * KEYWORDS: largest army, knights
 */
export function checkLargestArmy(
  playerId: string,
  gameState: GameState
): boolean {
  // START_BLOCK_GET_PLAYER_KNIGHTS
  // Описание: Получение количества рыцарей игрока

  const player = gameState.players.find((p) => p.id === playerId);
  if (!player) return false;

  if (player.knightsPlayed < GAME_CONSTANTS.LARGEST_ARMY_MIN) {
    return false; // Минимум 3 рыцаря для получения badge
  }
  // END_BLOCK_GET_PLAYER_KNIGHTS

  // START_BLOCK_COMPARE_WITH_OTHERS
  // Описание: Сравнение с другими игроками

  const otherPlayersMaxKnights = Math.max(
    0,
    ...gameState.players
      .filter((p) => p.id !== playerId)
      .map((p) => p.knightsPlayed)
  );

  return player.knightsPlayed > otherPlayersMaxKnights;
  // END_BLOCK_COMPARE_WITH_OTHERS
}

/**
 * END_MODULE_calculators
 */
