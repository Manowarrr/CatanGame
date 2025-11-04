/**
 * START_MODULE_ai.basic
 *
 * MODULE_CONTRACT:
 * PURPOSE: Базовая AI логика для автоматических ходов компьютерных игроков
 * SCOPE: Принятие решений для начальной расстановки и основной игры
 * KEYWORDS: AI, decision making, game logic
 * LINKS_TO_MODULE: types/game.types.ts, store/gameStore.ts
 */

import { GameState, GamePhase, TurnPhase, PlayerType, BuildingType } from '@/types/game.types';
import {
  getAvailableSettlementPositions,
  getAvailableRoadPositions,
} from '@/lib/utils/gameUtils';

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Определить, является ли текущий игрок AI
 * INPUTS:
 *   - gameState: GameState - текущее состояние игры
 * OUTPUTS: boolean - true если текущий игрок - AI
 * SIDE_EFFECTS: None
 * KEYWORDS: AI check
 */
export function isCurrentPlayerAI(gameState: GameState): boolean {
  const currentPlayer = gameState.players.find(
    (p) => p.id === gameState.currentPlayerId
  );
  return currentPlayer?.type === PlayerType.AI;
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Выбрать лучшую вершину для начальной расстановки (случайный выбор)
 * INPUTS:
 *   - gameState: GameState - текущее состояние игры
 * OUTPUTS: string | null - ID выбранной вершины или null
 * SIDE_EFFECTS: None (использует Math.random)
 * KEYWORDS: AI, initial placement, settlement
 */
export function chooseInitialSettlement(gameState: GameState): string | null {
  // START_BLOCK_AVAILABLE_VERTICES
  // Описание: Получение всех доступных вершин для начальной расстановки

  const availableVertices = gameState.vertices.filter((vertex) => {
    // Вершина должна быть свободна
    if (vertex.building !== null) return false;

    // Distance rule: нет соседних построек
    const hasAdjacentBuilding = vertex.neighborVertexIds.some((neighborId) => {
      const neighbor = gameState.vertices.find((v) => v.id === neighborId);
      return neighbor?.building !== null;
    });

    return !hasAdjacentBuilding;
  });
  // END_BLOCK_AVAILABLE_VERTICES

  // START_BLOCK_RANDOM_SELECTION
  // Описание: Случайный выбор из доступных вершин

  if (availableVertices.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * availableVertices.length);
  return availableVertices[randomIndex].id;
  // END_BLOCK_RANDOM_SELECTION
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Выбрать лучшее ребро для дороги после поселения (случайный выбор)
 * INPUTS:
 *   - gameState: GameState - текущее состояние игры
 *   - vertexId: string - ID вершины, где было построено поселение
 * OUTPUTS: string | null - ID выбранного ребра или null
 * SIDE_EFFECTS: None (использует Math.random)
 * KEYWORDS: AI, initial placement, road
 */
export function chooseInitialRoad(
  gameState: GameState,
  vertexId: string
): string | null {
  // START_BLOCK_VERTEX_LOOKUP
  // Описание: Поиск вершины по ID

  const vertex = gameState.vertices.find((v) => v.id === vertexId);
  if (!vertex) return null;
  // END_BLOCK_VERTEX_LOOKUP

  // START_BLOCK_AVAILABLE_EDGES
  // Описание: Получение доступных ребер вокруг вершины

  const availableEdges = vertex.neighborEdgeIds.filter((edgeId) => {
    const edge = gameState.edges.find((e) => e.id === edgeId);
    return edge?.road === null;
  });
  // END_BLOCK_AVAILABLE_EDGES

  // START_BLOCK_RANDOM_EDGE_SELECTION
  // Описание: Случайный выбор из доступных ребер

  if (availableEdges.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * availableEdges.length);
  return availableEdges[randomIndex];
  // END_BLOCK_RANDOM_EDGE_SELECTION
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Принять решение для хода AI в основной игре
 * INPUTS:
 *   - gameState: GameState - текущее состояние игры
 * OUTPUTS: AIAction | null - действие AI или null
 * SIDE_EFFECTS: None
 * KEYWORDS: AI, main game, decision
 */
export interface AIAction {
  type: 'ROLL_DICE' | 'BUILD_ROAD' | 'BUILD_SETTLEMENT' | 'BUILD_CITY' | 'END_TURN';
  edgeId?: string;
  vertexId?: string;
}

export function decideMainGameAction(gameState: GameState): AIAction | null {
  const currentPlayer = gameState.players.find(
    (p) => p.id === gameState.currentPlayerId
  );
  if (!currentPlayer) return null;

  // START_BLOCK_DICE_ROLL_PHASE
  // Описание: В фазе броска кубиков - бросить кубики

  if (gameState.turnPhase === TurnPhase.DICE_ROLL) {
    return { type: 'ROLL_DICE' };
  }
  // END_BLOCK_DICE_ROLL_PHASE

  // START_BLOCK_ACTIONS_PHASE
  // Описание: В фазе действий - пытаемся что-то построить или завершить ход

  if (gameState.turnPhase === TurnPhase.ACTIONS) {
    // START_BLOCK_TRY_BUILD_CITY
    // Описание: Попытка улучшить поселение до города

    const ownSettlements = gameState.vertices.filter(
      (v) => v.building?.playerId === currentPlayer.id && v.building?.type === BuildingType.SETTLEMENT
    );

    if (ownSettlements.length > 0) {
      // Проверить есть ли ресурсы для города (3 ore, 2 wheat)
      const canBuildCity =
        currentPlayer.resources.ORE >= 3 &&
        currentPlayer.resources.WHEAT >= 2 &&
        currentPlayer.cities > 0;

      if (canBuildCity) {
        // Выбрать случайное поселение для улучшения
        const randomSettlement = ownSettlements[Math.floor(Math.random() * ownSettlements.length)];
        return { type: 'BUILD_CITY', vertexId: randomSettlement.id };
      }
    }
    // END_BLOCK_TRY_BUILD_CITY

    // START_BLOCK_TRY_BUILD_SETTLEMENT
    // Описание: Попытка построить новое поселение

    const availableVertices = getAvailableSettlementPositions(currentPlayer.id, gameState);

    if (availableVertices.length > 0) {
      // Проверить есть ли ресурсы для поселения (1 wood, 1 brick, 1 sheep, 1 wheat)
      const canBuildSettlement =
        currentPlayer.resources.WOOD >= 1 &&
        currentPlayer.resources.BRICK >= 1 &&
        currentPlayer.resources.SHEEP >= 1 &&
        currentPlayer.resources.WHEAT >= 1 &&
        currentPlayer.settlements > 0;

      if (canBuildSettlement) {
        // Выбрать случайную доступную вершину
        const randomVertex = availableVertices[Math.floor(Math.random() * availableVertices.length)];
        return { type: 'BUILD_SETTLEMENT', vertexId: randomVertex };
      }
    }
    // END_BLOCK_TRY_BUILD_SETTLEMENT

    // START_BLOCK_TRY_BUILD_ROAD
    // Описание: Попытка построить дорогу

    const availableEdges = getAvailableRoadPositions(currentPlayer.id, gameState);

    if (availableEdges.length > 0) {
      // Проверить есть ли ресурсы для дороги (1 wood, 1 brick)
      const canBuildRoad =
        currentPlayer.resources.WOOD >= 1 &&
        currentPlayer.resources.BRICK >= 1 &&
        currentPlayer.roads > 0;

      if (canBuildRoad) {
        // Выбрать случайное доступное ребро
        const randomEdge = availableEdges[Math.floor(Math.random() * availableEdges.length)];
        return { type: 'BUILD_ROAD', edgeId: randomEdge };
      }
    }
    // END_BLOCK_TRY_BUILD_ROAD

    // START_BLOCK_END_TURN_DEFAULT
    // Описание: Если нечего строить - завершить ход
    return { type: 'END_TURN' };
    // END_BLOCK_END_TURN_DEFAULT
  }
  // END_BLOCK_ACTIONS_PHASE

  // START_BLOCK_ROBBER_ACTIVATION_PHASE
  // Описание: Фаза активации разбойника - AI должен переместить разбойника

  if (gameState.turnPhase === TurnPhase.ROBBER_ACTIVATION) {
    // Это состояние обрабатывается в app/game/page.tsx через handleHexClick
    // AI не нуждается в явном действии здесь, так как логика уже есть в UI слое
    return null;
  }
  // END_BLOCK_ROBBER_ACTIVATION_PHASE

  return null;
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Выбрать гекс для перемещения разбойника и игрока для кражи
 * INPUTS:
 *   - gameState: GameState - текущее состояние игры
 * OUTPUTS: { hexId: string, stealFromPlayerId: string | null } - выбранный гекс и жертва
 * SIDE_EFFECTS: None (использует Math.random)
 * KEYWORDS: AI, robber, theft
 */
export function chooseRobberTarget(gameState: GameState): {
  hexId: string;
  stealFromPlayerId: string | null;
} | null {
  // START_BLOCK_FIND_VALID_HEXES
  // Описание: Найти все гексы без разбойника

  const availableHexes = gameState.hexes.filter((h) => !h.hasRobber && h.terrain !== 'DESERT');

  if (availableHexes.length === 0) {
    // Если нет доступных гексов, выбрать любой кроме текущего
    const hexesWithoutRobber = gameState.hexes.filter((h) => !h.hasRobber);
    if (hexesWithoutRobber.length === 0) return null;

    const randomHex = hexesWithoutRobber[Math.floor(Math.random() * hexesWithoutRobber.length)];
    return { hexId: randomHex.id, stealFromPlayerId: null };
  }
  // END_BLOCK_FIND_VALID_HEXES

  // START_BLOCK_SELECT_HEX
  // Описание: Выбрать случайный гекс (в будущем можно добавить эвристики)

  const randomHex = availableHexes[Math.floor(Math.random() * availableHexes.length)];
  // END_BLOCK_SELECT_HEX

  // START_BLOCK_FIND_VICTIMS
  // Описание: Найти всех игроков на выбранном гексе

  const playersOnHex: Set<string> = new Set();

  // Найти все вершины соседние с выбранным гексом
  randomHex.vertexIds.forEach((vertexId) => {
    const vertex = gameState.vertices.find((v) => v.id === vertexId);
    if (vertex?.building && vertex.building.playerId !== gameState.currentPlayerId) {
      const player = gameState.players.find((p) => p.id === vertex.building!.playerId);
      // Проверить что у игрока есть ресурсы
      if (player) {
        const totalResources = Object.values(player.resources).reduce((sum, count) => sum + count, 0);
        if (totalResources > 0) {
          playersOnHex.add(vertex.building.playerId);
        }
      }
    }
  });
  // END_BLOCK_FIND_VICTIMS

  // START_BLOCK_SELECT_VICTIM
  // Описание: Выбрать случайную жертву

  const victims = Array.from(playersOnHex);
  const stealFromPlayerId = victims.length > 0 ? victims[Math.floor(Math.random() * victims.length)] : null;
  // END_BLOCK_SELECT_VICTIM

  return { hexId: randomHex.id, stealFromPlayerId };
}

/**
 * END_MODULE_ai.basic
 */
