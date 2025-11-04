/**
 * START_MODULE_ai.basic
 *
 * MODULE_CONTRACT:
 * PURPOSE: Базовая AI логика для автоматических ходов компьютерных игроков
 * SCOPE: Принятие решений для начальной расстановки и основной игры
 * KEYWORDS: AI, decision making, game logic
 * LINKS_TO_MODULE: types/game.types.ts, store/gameStore.ts
 */

import { GameState, GamePhase, TurnPhase, PlayerType } from '@/types/game.types';
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
  // Описание: В фазе действий - пока просто завершить ход (базовый AI)

  if (gameState.turnPhase === TurnPhase.ACTIONS) {
    // TODO: В будущем добавить логику строительства
    // Пока AI просто завершает ход
    return { type: 'END_TURN' };
  }
  // END_BLOCK_ACTIONS_PHASE

  return null;
}

/**
 * END_MODULE_ai.basic
 */
