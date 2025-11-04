/**
 * START_MODULE_actionHandlers
 *
 * MODULE_CONTRACT:
 * PURPOSE: Обработчики игровых действий (строительство, покупка карт, игра карт)
 * SCOPE: Модификация gameState при выполнении валидных действий
 * KEYWORDS: action handlers, game logic, state mutations
 * LINKS_TO_MODULE: types/game.types.ts, lib/game-logic/validators.ts, lib/game-logic/calculators.ts
 */

import {
  GameState,
  ResourceType,
  BuildingType,
  DevCardType,
  Player,
} from '@/types/game.types';
import {
  canBuildRoad,
  canBuildSettlement,
  canBuildCity,
  canBuyDevCard,
} from './validators';
import { BUILDING_COSTS, TERRAIN_TO_RESOURCE } from '@/lib/constants/game.constants';
import { checkLongestRoad, checkLargestArmy } from './calculators';

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Обработать строительство дороги
 * INPUTS:
 *   - playerId: string - ID игрока
 *   - edgeId: string - ID ребра для строительства
 *   - gameState: GameState - текущее состояние игры
 * OUTPUTS: GameState - новое состояние игры
 * SIDE_EFFECTS: None (возвращает новый объект)
 * KEYWORDS: build road, state update
 * LINKS: TechSpecification.md -> LOGIC_BLOCK_BUILD_ROAD
 */
export function handleBuildRoad(
  playerId: string,
  edgeId: string,
  gameState: GameState,
  isInitialPlacement: boolean = false
): GameState {
  console.log('[ActionHandlers][handleBuildRoad][START]', { playerId, edgeId, isInitialPlacement });

  // START_BLOCK_VALIDATION
  // Описание: Валидация действия

  const player = gameState.players.find((p) => p.id === playerId);
  if (!player) {
    console.error('[ActionHandlers][handleBuildRoad][VALIDATION][FAIL]', {
      error: 'Player not found',
    });
    return gameState;
  }

  const validation = canBuildRoad(player, edgeId, gameState, isInitialPlacement);
  if (!validation.valid) {
    console.error('[ActionHandlers][handleBuildRoad][VALIDATION][FAIL]', {
      error: validation.error,
    });
    return gameState;
  }
  // END_BLOCK_VALIDATION

  // START_BLOCK_RESOURCE_DEDUCTION
  // Описание: Вычитание ресурсов (только если не начальная расстановка)

  const updatedPlayer = {
    ...player,
    resources: { ...player.resources },
    roads: player.roads - 1,
  };

  // При начальной расстановке дороги бесплатные
  if (!isInitialPlacement) {
    Object.entries(BUILDING_COSTS.ROAD).forEach(([resource, amount]) => {
      updatedPlayer.resources[resource as ResourceType] -= amount;
    });
  }
  // END_BLOCK_RESOURCE_DEDUCTION

  // START_BLOCK_ROAD_PLACEMENT
  // Описание: Размещение дороги на ребре

  const updatedEdges = gameState.edges.map((edge) =>
    edge.id === edgeId ? { ...edge, road: { playerId } } : edge
  );
  // END_BLOCK_ROAD_PLACEMENT

  // START_BLOCK_STATE_UPDATE
  // Описание: Обновление состояния игры

  const updatedPlayers = gameState.players.map((p) =>
    p.id === playerId ? updatedPlayer : p
  );

  const newState: GameState = {
    ...gameState,
    players: updatedPlayers,
    edges: updatedEdges,
  };
  // END_BLOCK_STATE_UPDATE

  // START_BLOCK_LONGEST_ROAD_CHECK
  // Описание: Проверка и обновление "Самой длинной дороги"

  const updatedStateWithLongestRoad = updateLongestRoad(newState, playerId);
  // END_BLOCK_LONGEST_ROAD_CHECK

  console.log('[ActionHandlers][handleBuildRoad][SUCCESS]', { playerId, edgeId });

  return updatedStateWithLongestRoad;
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Обработать строительство поселения
 * INPUTS:
 *   - playerId: string - ID игрока
 *   - vertexId: string - ID вершины
 *   - gameState: GameState - текущее состояние
 *   - isInitialPlacement: boolean - флаг начальной расстановки (по умолчанию false)
 * OUTPUTS: GameState - новое состояние
 * SIDE_EFFECTS: None
 * KEYWORDS: build settlement, state update
 */
export function handleBuildSettlement(
  playerId: string,
  vertexId: string,
  gameState: GameState,
  isInitialPlacement: boolean = false
): GameState {
  console.log('[ActionHandlers][handleBuildSettlement][START]', {
    playerId,
    vertexId,
    isInitialPlacement,
  });

  const player = gameState.players.find((p) => p.id === playerId);
  if (!player) return gameState;

  const validation = canBuildSettlement(player, vertexId, gameState, isInitialPlacement);
  if (!validation.valid) {
    console.error('[ActionHandlers][handleBuildSettlement][VALIDATION][FAIL]', {
      error: validation.error,
    });
    return gameState;
  }

  // Вычитание ресурсов (только если не начальная расстановка)
  const updatedPlayer = {
    ...player,
    resources: { ...player.resources },
    settlements: player.settlements - 1,
  };

  if (!isInitialPlacement) {
    Object.entries(BUILDING_COSTS.SETTLEMENT).forEach(([resource, amount]) => {
      updatedPlayer.resources[resource as ResourceType] -= amount;
    });
  }

  // Если это второе поселение в начальной расстановке (раунд 2), дать ресурсы
  if (isInitialPlacement && gameState.initialPlacementRound === 2) {
    const vertex = gameState.vertices.find((v) => v.id === vertexId);
    if (vertex) {
      // Найти все гексы соседние с этой вершиной
      const adjacentHexes = gameState.hexes.filter((hex) =>
        hex.vertexIds.includes(vertexId)
      );

      // Добавить по 1 ресурсу от каждого соседнего гекса (кроме пустыни)
      adjacentHexes.forEach((hex) => {
        const resource = TERRAIN_TO_RESOURCE[hex.terrain];
        if (resource) {
          updatedPlayer.resources[resource] += 1;
        }
      });

      console.log('[ActionHandlers][handleBuildSettlement][INITIAL_RESOURCES]', {
        playerId,
        adjacentHexes: adjacentHexes.map((h) => h.terrain),
        resources: updatedPlayer.resources,
      });
    }
  }

  // Размещение поселения
  const updatedVertices = gameState.vertices.map((vertex) =>
    vertex.id === vertexId
      ? { ...vertex, building: { type: BuildingType.SETTLEMENT, playerId } }
      : vertex
  );

  // Обновление состояния
  const updatedPlayers = gameState.players.map((p) =>
    p.id === playerId ? updatedPlayer : p
  );

  console.log('[ActionHandlers][handleBuildSettlement][SUCCESS]', {
    playerId,
    vertexId,
  });

  return {
    ...gameState,
    players: updatedPlayers,
    vertices: updatedVertices,
  };
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Обработать строительство города (upgrade от поселения)
 * INPUTS:
 *   - playerId: string - ID игрока
 *   - vertexId: string - ID вершины
 *   - gameState: GameState - текущее состояние
 * OUTPUTS: GameState - новое состояние
 * SIDE_EFFECTS: None
 * KEYWORDS: build city, upgrade, state update
 */
export function handleBuildCity(
  playerId: string,
  vertexId: string,
  gameState: GameState
): GameState {
  console.log('[ActionHandlers][handleBuildCity][START]', { playerId, vertexId });

  const player = gameState.players.find((p) => p.id === playerId);
  if (!player) return gameState;

  const validation = canBuildCity(player, vertexId, gameState);
  if (!validation.valid) {
    console.error('[ActionHandlers][handleBuildCity][VALIDATION][FAIL]', {
      error: validation.error,
    });
    return gameState;
  }

  // Вычитание ресурсов, возврат поселения в запас, уменьшение городов
  const updatedPlayer = {
    ...player,
    resources: { ...player.resources },
    settlements: player.settlements + 1, // Возврат поселения
    cities: player.cities - 1,
  };

  Object.entries(BUILDING_COSTS.CITY).forEach(([resource, amount]) => {
    updatedPlayer.resources[resource as ResourceType] -= amount;
  });

  // Upgrade поселения в город
  const updatedVertices = gameState.vertices.map((vertex) =>
    vertex.id === vertexId
      ? { ...vertex, building: { type: BuildingType.CITY, playerId } }
      : vertex
  );

  const updatedPlayers = gameState.players.map((p) =>
    p.id === playerId ? updatedPlayer : p
  );

  console.log('[ActionHandlers][handleBuildCity][SUCCESS]', { playerId, vertexId });

  return {
    ...gameState,
    players: updatedPlayers,
    vertices: updatedVertices,
  };
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Обработать покупку карты развития
 * INPUTS:
 *   - playerId: string - ID игрока
 *   - gameState: GameState - текущее состояние
 * OUTPUTS: GameState - новое состояние
 * SIDE_EFFECTS: None
 * KEYWORDS: buy development card, state update
 */
export function handleBuyDevCard(
  playerId: string,
  gameState: GameState
): GameState {
  console.log('[ActionHandlers][handleBuyDevCard][START]', { playerId });

  const player = gameState.players.find((p) => p.id === playerId);
  if (!player) return gameState;

  const validation = canBuyDevCard(player, gameState);
  if (!validation.valid) {
    console.error('[ActionHandlers][handleBuyDevCard][VALIDATION][FAIL]', {
      error: validation.error,
    });
    return gameState;
  }

  // Вычитание ресурсов
  const updatedPlayer = {
    ...player,
    resources: { ...player.resources },
    devCards: [...player.devCards],
  };

  Object.entries(BUILDING_COSTS.DEV_CARD).forEach(([resource, amount]) => {
    updatedPlayer.resources[resource as ResourceType] -= amount;
  });

  // Взять карту из колоды
  const newDeck = [...gameState.devCardDeck];
  const drawnCard = newDeck.pop();
  if (drawnCard) {
    updatedPlayer.devCards.push(drawnCard);
  }

  const updatedPlayers = gameState.players.map((p) =>
    p.id === playerId ? updatedPlayer : p
  );

  console.log('[ActionHandlers][handleBuyDevCard][SUCCESS]', {
    playerId,
    cardType: drawnCard,
  });

  return {
    ...gameState,
    players: updatedPlayers,
    devCardDeck: newDeck,
  };
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Обработать игру карты Knight (перемещение разбойника)
 * INPUTS:
 *   - playerId: string - ID игрока
 *   - targetHexId: string - ID гексагона для перемещения разбойника
 *   - stealFromPlayerId: string | null - ID игрока для кражи ресурса
 *   - gameState: GameState - текущее состояние
 * OUTPUTS: GameState - новое состояние
 * SIDE_EFFECTS: None
 * KEYWORDS: knight card, robber, steal resource
 */
export function handlePlayKnight(
  playerId: string,
  targetHexId: string,
  stealFromPlayerId: string | null,
  gameState: GameState
): GameState {
  console.log('[ActionHandlers][handlePlayKnight][START]', {
    playerId,
    targetHexId,
    stealFromPlayerId,
  });

  const player = gameState.players.find((p) => p.id === playerId);
  if (!player) return gameState;

  // Удалить карту Knight из руки
  const updatedPlayer = {
    ...player,
    devCards: [...player.devCards],
    playedDevCards: [...player.playedDevCards, DevCardType.KNIGHT],
    knightsPlayed: player.knightsPlayed + 1,
  };

  const knightIndex = updatedPlayer.devCards.indexOf(DevCardType.KNIGHT);
  if (knightIndex !== -1) {
    updatedPlayer.devCards.splice(knightIndex, 1);
  }

  // Переместить разбойника
  const updatedHexes = gameState.hexes.map((hex) => ({
    ...hex,
    hasRobber: hex.id === targetHexId,
  }));

  // Украсть ресурс (если указан игрок)
  let updatedPlayers = gameState.players.map((p) =>
    p.id === playerId ? updatedPlayer : p
  );

  if (stealFromPlayerId) {
    updatedPlayers = stealRandomResource(
      updatedPlayers,
      playerId,
      stealFromPlayerId
    );
  }

  const newState: GameState = {
    ...gameState,
    players: updatedPlayers,
    hexes: updatedHexes,
  };

  // Проверить и обновить Largest Army
  const updatedStateWithLargestArmy = updateLargestArmy(newState, playerId);

  console.log('[ActionHandlers][handlePlayKnight][SUCCESS]', { playerId });

  return updatedStateWithLargestArmy;
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Обновить badge "Самая длинная дорога"
 * INPUTS:
 *   - gameState: GameState - текущее состояние
 *   - playerId: string - ID игрока который только что построил дорогу
 * OUTPUTS: GameState - обновленное состояние
 * SIDE_EFFECTS: None
 * KEYWORDS: longest road, badge update
 */
function updateLongestRoad(gameState: GameState, playerId: string): GameState {
  const hasLongestRoad = checkLongestRoad(playerId, gameState);

  if (hasLongestRoad) {
    // Передать badge этому игроку, убрать у других
    const updatedPlayers = gameState.players.map((p) => ({
      ...p,
      hasLongestRoad: p.id === playerId,
    }));

    return {
      ...gameState,
      players: updatedPlayers,
      longestRoadPlayerId: playerId,
    };
  }

  return gameState;
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Обновить badge "Самая большая армия"
 * INPUTS:
 *   - gameState: GameState - текущее состояние
 *   - playerId: string - ID игрока который только что сыграл knight
 * OUTPUTS: GameState - обновленное состояние
 * SIDE_EFFECTS: None
 * KEYWORDS: largest army, badge update
 */
function updateLargestArmy(gameState: GameState, playerId: string): GameState {
  const hasLargestArmy = checkLargestArmy(playerId, gameState);

  if (hasLargestArmy) {
    const updatedPlayers = gameState.players.map((p) => ({
      ...p,
      hasLargestArmy: p.id === playerId,
    }));

    return {
      ...gameState,
      players: updatedPlayers,
      largestArmyPlayerId: playerId,
    };
  }

  return gameState;
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Украсть случайный ресурс у игрока
 * INPUTS:
 *   - players: Player[] - массив игроков
 *   - stealerId: string - ID вора
 *   - victimId: string - ID жертвы
 * OUTPUTS: Player[] - обновленный массив игроков
 * SIDE_EFFECTS: Использует Math.random
 * KEYWORDS: steal resource, robber
 */
function stealRandomResource(
  players: Player[],
  stealerId: string,
  victimId: string
): Player[] {
  const victim = players.find((p) => p.id === victimId);
  if (!victim) return players;

  // Собрать все ресурсы жертвы
  const availableResources: ResourceType[] = [];
  Object.entries(victim.resources).forEach(([resource, amount]) => {
    for (let i = 0; i < amount; i++) {
      availableResources.push(resource as ResourceType);
    }
  });

  if (availableResources.length === 0) return players;

  // Случайный выбор ресурса
  const randomIndex = Math.floor(Math.random() * availableResources.length);
  const stolenResource = availableResources[randomIndex];

  // Обновить игроков
  return players.map((p) => {
    if (p.id === victimId) {
      return {
        ...p,
        resources: {
          ...p.resources,
          [stolenResource]: p.resources[stolenResource] - 1,
        },
      };
    }
    if (p.id === stealerId) {
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
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Обработать игру карты Year of Plenty (взять 2 ресурса из банка)
 * INPUTS:
 *   - playerId: string - ID игрока
 *   - resources: ResourceType[] - массив из 2 ресурсов
 *   - gameState: GameState - текущее состояние
 * OUTPUTS: GameState - новое состояние
 * SIDE_EFFECTS: None
 * KEYWORDS: year of plenty, development card, resources
 */
export function handlePlayYearOfPlenty(
  playerId: string,
  resources: ResourceType[],
  gameState: GameState
): GameState {
  console.log('[ActionHandlers][handlePlayYearOfPlenty][START]', {
    playerId,
    resources,
  });

  const player = gameState.players.find((p) => p.id === playerId);
  if (!player) return gameState;

  // Удалить карту Year of Plenty из руки
  const updatedPlayer = {
    ...player,
    devCards: [...player.devCards],
    playedDevCards: [...player.playedDevCards, DevCardType.YEAR_OF_PLENTY],
    resources: { ...player.resources },
  };

  const cardIndex = updatedPlayer.devCards.indexOf(DevCardType.YEAR_OF_PLENTY);
  if (cardIndex !== -1) {
    updatedPlayer.devCards.splice(cardIndex, 1);
  }

  // Добавить выбранные ресурсы
  resources.forEach((resource) => {
    updatedPlayer.resources[resource] += 1;
  });

  const updatedPlayers = gameState.players.map((p) =>
    p.id === playerId ? updatedPlayer : p
  );

  console.log('[ActionHandlers][handlePlayYearOfPlenty][SUCCESS]', { playerId });

  return {
    ...gameState,
    players: updatedPlayers,
  };
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Обработать игру карты Monopoly (забрать все ресурсы одного типа)
 * INPUTS:
 *   - playerId: string - ID игрока
 *   - resourceType: ResourceType - тип ресурса для монополии
 *   - gameState: GameState - текущее состояние
 * OUTPUTS: GameState - новое состояние
 * SIDE_EFFECTS: None
 * KEYWORDS: monopoly, development card, resources
 */
export function handlePlayMonopoly(
  playerId: string,
  resourceType: ResourceType,
  gameState: GameState
): GameState {
  console.log('[ActionHandlers][handlePlayMonopoly][START]', {
    playerId,
    resourceType,
  });

  const player = gameState.players.find((p) => p.id === playerId);
  if (!player) return gameState;

  // Удалить карту Monopoly из руки
  let updatedPlayer = {
    ...player,
    devCards: [...player.devCards],
    playedDevCards: [...player.playedDevCards, DevCardType.MONOPOLY],
    resources: { ...player.resources },
  };

  const cardIndex = updatedPlayer.devCards.indexOf(DevCardType.MONOPOLY);
  if (cardIndex !== -1) {
    updatedPlayer.devCards.splice(cardIndex, 1);
  }

  // Забрать все ресурсы выбранного типа у всех игроков
  let totalCollected = 0;
  const updatedPlayers = gameState.players.map((p) => {
    if (p.id === playerId) {
      return updatedPlayer;
    } else {
      const amountToTake = p.resources[resourceType];
      totalCollected += amountToTake;
      return {
        ...p,
        resources: {
          ...p.resources,
          [resourceType]: 0,
        },
      };
    }
  });

  // Добавить собранные ресурсы текущему игроку
  const finalPlayers = updatedPlayers.map((p) => {
    if (p.id === playerId) {
      return {
        ...p,
        resources: {
          ...p.resources,
          [resourceType]: p.resources[resourceType] + totalCollected,
        },
      };
    }
    return p;
  });

  console.log('[ActionHandlers][handlePlayMonopoly][SUCCESS]', {
    playerId,
    totalCollected,
  });

  return {
    ...gameState,
    players: finalPlayers,
  };
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Обработать игру карты Road Building (построить 2 бесплатные дороги)
 * INPUTS:
 *   - playerId: string - ID игрока
 *   - edgeIds: string[] - массив из 1-2 ID ребер для дорог
 *   - gameState: GameState - текущее состояние
 * OUTPUTS: GameState - новое состояние
 * SIDE_EFFECTS: None
 * KEYWORDS: road building, development card, roads
 */
export function handlePlayRoadBuilding(
  playerId: string,
  edgeIds: string[],
  gameState: GameState
): GameState {
  console.log('[ActionHandlers][handlePlayRoadBuilding][START]', {
    playerId,
    edgeIds,
  });

  const player = gameState.players.find((p) => p.id === playerId);
  if (!player) return gameState;

  // Удалить карту Road Building из руки
  const updatedPlayer = {
    ...player,
    devCards: [...player.devCards],
    playedDevCards: [...player.playedDevCards, DevCardType.ROAD_BUILDING],
  };

  const cardIndex = updatedPlayer.devCards.indexOf(DevCardType.ROAD_BUILDING);
  if (cardIndex !== -1) {
    updatedPlayer.devCards.splice(cardIndex, 1);
  }

  let currentState: GameState = {
    ...gameState,
    players: gameState.players.map((p) => (p.id === playerId ? updatedPlayer : p)),
  };

  // Построить дороги (до 2, или сколько есть в запасе)
  const maxRoads = Math.min(edgeIds.length, 2, player.roads);
  for (let i = 0; i < maxRoads; i++) {
    // Построить дорогу бесплатно (используем isInitialPlacement=true для бесплатной постройки)
    currentState = handleBuildRoad(playerId, edgeIds[i], currentState, true);
  }

  console.log('[ActionHandlers][handlePlayRoadBuilding][SUCCESS]', {
    playerId,
    roadsBuilt: maxRoads,
  });

  return currentState;
}

/**
 * END_MODULE_actionHandlers
 */
