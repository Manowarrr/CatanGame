/**
 * START_MODULE_robber.handlers
 *
 * MODULE_CONTRACT:
 * PURPOSE: Обработчики механики разбойника
 * SCOPE: Сброс ресурсов, перемещение разбойника, кража ресурсов
 * KEYWORDS: robber, discard, steal, game mechanics
 * LINKS_TO_MODULE: types/game.types.ts, lib/constants/game.constants.ts
 */

import { GameState, Player, ResourceType } from '@/types/game.types';
import { GAME_CONSTANTS } from '@/lib/constants/game.constants';

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Проверить, нужно ли игроку сбросить ресурсы
 * INPUTS:
 *   - player: Player - игрок для проверки
 * OUTPUTS: boolean - true если игроку нужно сбросить ресурсы
 * SIDE_EFFECTS: None
 * KEYWORDS: robber, discard, resources
 */
export function needsToDiscardResources(player: Player): boolean {
  // START_BLOCK_COUNT_RESOURCES
  // Описание: Подсчет общего количества ресурсов у игрока

  const totalResources = Object.values(player.resources).reduce(
    (sum, count) => sum + count,
    0
  );
  // END_BLOCK_COUNT_RESOURCES

  return totalResources > GAME_CONSTANTS.ROBBER.DISCARD_THRESHOLD;
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Вычислить количество ресурсов, которые нужно сбросить
 * INPUTS:
 *   - player: Player - игрок
 * OUTPUTS: number - количество ресурсов для сброса
 * SIDE_EFFECTS: None
 * KEYWORDS: robber, discard, calculation
 */
export function calculateDiscardAmount(player: Player): number {
  // START_BLOCK_CALCULATE_TOTAL
  // Описание: Подсчет общего количества ресурсов

  const totalResources = Object.values(player.resources).reduce(
    (sum, count) => sum + count,
    0
  );
  // END_BLOCK_CALCULATE_TOTAL

  // START_BLOCK_CALCULATE_DISCARD
  // Описание: Вычисление количества для сброса (половина, округление вниз)

  return Math.floor(totalResources / 2);
  // END_BLOCK_CALCULATE_DISCARD
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Сбросить выбранные ресурсы у игрока
 * INPUTS:
 *   - gameState: GameState - текущее состояние игры
 *   - playerId: string - ID игрока
 *   - resourcesToDiscard: Partial<Record<ResourceType, number>> - ресурсы для сброса
 * OUTPUTS: GameState - обновленное состояние игры
 * SIDE_EFFECTS: None (чистая функция)
 * KEYWORDS: robber, discard, resources
 */
export function handleDiscardResources(
  gameState: GameState,
  playerId: string,
  resourcesToDiscard: Partial<Record<ResourceType, number>>
): GameState {
  console.log('[RobberHandlers][handleDiscardResources][START]', {
    playerId,
    resourcesToDiscard,
  });

  // START_BLOCK_VALIDATE_DISCARD
  // Описание: Валидация сброса ресурсов

  const player = gameState.players.find((p) => p.id === playerId);
  if (!player) {
    console.error('[RobberHandlers][handleDiscardResources][ERROR]', {
      error: 'Player not found',
    });
    return gameState;
  }

  const discardAmount = calculateDiscardAmount(player);
  const totalDiscard = Object.values(resourcesToDiscard).reduce(
    (sum, count) => sum + (count || 0),
    0
  );

  if (totalDiscard !== discardAmount) {
    console.error('[RobberHandlers][handleDiscardResources][ERROR]', {
      error: 'Invalid discard amount',
      expected: discardAmount,
      actual: totalDiscard,
    });
    return gameState;
  }
  // END_BLOCK_VALIDATE_DISCARD

  // START_BLOCK_UPDATE_RESOURCES
  // Описание: Обновление ресурсов игрока после сброса

  const updatedPlayers = gameState.players.map((p) => {
    if (p.id !== playerId) return p;

    const updatedResources = { ...p.resources };

    Object.entries(resourcesToDiscard).forEach(([resource, amount]) => {
      const resourceType = resource as ResourceType;
      updatedResources[resourceType] = Math.max(
        0,
        updatedResources[resourceType] - (amount || 0)
      );
    });

    return {
      ...p,
      resources: updatedResources,
    };
  });
  // END_BLOCK_UPDATE_RESOURCES

  console.log('[RobberHandlers][handleDiscardResources][SUCCESS]', {
    playerId,
    discardAmount,
  });

  return {
    ...gameState,
    players: updatedPlayers,
  };
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Переместить разбойника на новый гексагон
 * INPUTS:
 *   - gameState: GameState - текущее состояние игры
 *   - hexId: string - ID гексагона для размещения разбойника
 * OUTPUTS: GameState - обновленное состояние игры
 * SIDE_EFFECTS: None (чистая функция)
 * KEYWORDS: robber, move, hex
 */
export function handleMoveRobber(gameState: GameState, hexId: string): GameState {
  console.log('[RobberHandlers][handleMoveRobber][START]', { hexId });

  // START_BLOCK_VALIDATE_HEX
  // Описание: Валидация нового гексагона

  const targetHex = gameState.hexes.find((h) => h.id === hexId);
  if (!targetHex) {
    console.error('[RobberHandlers][handleMoveRobber][ERROR]', {
      error: 'Hex not found',
    });
    return gameState;
  }

  // Проверка что разбойник не на том же гексе
  if (targetHex.hasRobber) {
    console.error('[RobberHandlers][handleMoveRobber][ERROR]', {
      error: 'Robber already on this hex',
    });
    return gameState;
  }
  // END_BLOCK_VALIDATE_HEX

  // START_BLOCK_UPDATE_HEXES
  // Описание: Обновление позиции разбойника

  const updatedHexes = gameState.hexes.map((hex) => {
    if (hex.id === hexId) {
      // Установить разбойника на новый гекс
      return { ...hex, hasRobber: true };
    } else if (hex.hasRobber) {
      // Убрать разбойника со старого гекса
      return { ...hex, hasRobber: false };
    }
    return hex;
  });
  // END_BLOCK_UPDATE_HEXES

  console.log('[RobberHandlers][handleMoveRobber][SUCCESS]', { hexId });

  return {
    ...gameState,
    hexes: updatedHexes,
  };
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Получить список игроков, у которых можно украсть ресурс
 * INPUTS:
 *   - gameState: GameState - текущее состояние игры
 *   - hexId: string - ID гексагона с разбойником
 *   - currentPlayerId: string - ID текущего игрока (не может украсть у себя)
 * OUTPUTS: string[] - массив ID игроков
 * SIDE_EFFECTS: None
 * KEYWORDS: robber, steal, players
 */
export function getPlayersToStealFrom(
  gameState: GameState,
  hexId: string,
  currentPlayerId: string
): string[] {
  // START_BLOCK_FIND_HEX
  // Описание: Поиск гексагона

  const hex = gameState.hexes.find((h) => h.id === hexId);
  if (!hex) return [];
  // END_BLOCK_FIND_HEX

  // START_BLOCK_FIND_ADJACENT_PLAYERS
  // Описание: Поиск игроков с постройками на вершинах гексагона

  const adjacentPlayerIds = new Set<string>();

  hex.vertexIds.forEach((vertexId) => {
    const vertex = gameState.vertices.find((v) => v.id === vertexId);
    if (vertex?.building && vertex.building.playerId !== currentPlayerId) {
      const player = gameState.players.find(
        (p) => p.id === vertex.building!.playerId
      );
      // Проверить что у игрока есть хотя бы один ресурс
      if (player) {
        const totalResources = Object.values(player.resources).reduce(
          (sum, count) => sum + count,
          0
        );
        if (totalResources > 0) {
          adjacentPlayerIds.add(vertex.building.playerId);
        }
      }
    }
  });
  // END_BLOCK_FIND_ADJACENT_PLAYERS

  return Array.from(adjacentPlayerIds);
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Украсть случайный ресурс у игрока
 * INPUTS:
 *   - gameState: GameState - текущее состояние игры
 *   - fromPlayerId: string - ID игрока, у которого крадут
 *   - toPlayerId: string - ID игрока, который крадет
 * OUTPUTS: GameState - обновленное состояние игры
 * SIDE_EFFECTS: None (использует Math.random)
 * KEYWORDS: robber, steal, resources
 */
export function handleStealResource(
  gameState: GameState,
  fromPlayerId: string,
  toPlayerId: string
): GameState {
  console.log('[RobberHandlers][handleStealResource][START]', {
    fromPlayerId,
    toPlayerId,
  });

  // START_BLOCK_FIND_PLAYERS
  // Описание: Поиск игроков

  const fromPlayer = gameState.players.find((p) => p.id === fromPlayerId);
  const toPlayer = gameState.players.find((p) => p.id === toPlayerId);

  if (!fromPlayer || !toPlayer) {
    console.error('[RobberHandlers][handleStealResource][ERROR]', {
      error: 'Player not found',
    });
    return gameState;
  }
  // END_BLOCK_FIND_PLAYERS

  // START_BLOCK_GET_AVAILABLE_RESOURCES
  // Описание: Получение списка доступных для кражи ресурсов

  const availableResources: ResourceType[] = [];
  Object.entries(fromPlayer.resources).forEach(([resource, count]) => {
    for (let i = 0; i < count; i++) {
      availableResources.push(resource as ResourceType);
    }
  });

  if (availableResources.length === 0) {
    console.log('[RobberHandlers][handleStealResource][NO_RESOURCES]');
    return gameState;
  }
  // END_BLOCK_GET_AVAILABLE_RESOURCES

  // START_BLOCK_STEAL_RANDOM_RESOURCE
  // Описание: Кража случайного ресурса

  const randomIndex = Math.floor(Math.random() * availableResources.length);
  const stolenResource = availableResources[randomIndex];

  const updatedPlayers = gameState.players.map((p) => {
    if (p.id === fromPlayerId) {
      return {
        ...p,
        resources: {
          ...p.resources,
          [stolenResource]: p.resources[stolenResource] - 1,
        },
      };
    } else if (p.id === toPlayerId) {
      return {
        ...p,
        resources: {
          ...p.resources,
          [stolenResource]: p.resources[stolenResource] + 1,
        },
      };
    }
    return p;
  });
  // END_BLOCK_STEAL_RANDOM_RESOURCE

  console.log('[RobberHandlers][handleStealResource][SUCCESS]', {
    stolenResource,
    fromPlayerId,
    toPlayerId,
  });

  return {
    ...gameState,
    players: updatedPlayers,
  };
}

/**
 * END_MODULE_robber.handlers
 */
