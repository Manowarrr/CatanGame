/**
 * START_MODULE_gameUtils
 *
 * MODULE_CONTRACT:
 * PURPOSE: Вспомогательные утилиты для игры
 * SCOPE: Создание игроков, начального состояния, бросок кубиков, deep clone
 * KEYWORDS: utilities, helpers, game initialization
 * LINKS_TO_MODULE: types/game.types.ts, lib/constants/game.constants.ts
 */

import {
  Player,
  PlayerType,
  GameState,
  GamePhase,
  TurnPhase,
  DevCardType,
  BuildingType,
  Hex,
  Vertex,
  Edge,
} from '@/types/game.types';
import {
  GAME_CONSTANTS,
  DEV_CARD_DECK,
  TERRAIN_TO_RESOURCE,
} from '@/lib/constants/game.constants';

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Бросить два кубика
 * INPUTS: None
 * OUTPUTS: [number, number] - значения двух кубиков (1-6 каждый)
 * SIDE_EFFECTS: Использует Math.random
 * KEYWORDS: dice roll, random
 */
export function rollDice(): [number, number] {
  // START_BLOCK_DICE_ROLL
  // Описание: Генерация двух случайных чисел от 1 до 6

  const die1 = Math.floor(Math.random() * 6) + 1;
  const die2 = Math.floor(Math.random() * 6) + 1;
  // END_BLOCK_DICE_ROLL

  console.log('[GameUtils][rollDice][SUCCESS]', { die1, die2, sum: die1 + die2 });

  return [die1, die2];
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Создать игрока с начальными параметрами
 * INPUTS:
 *   - id: string - уникальный ID игрока
 *   - name: string - имя игрока
 *   - color: string - цвет игрока (hex)
 *   - type: PlayerType - тип игрока (HUMAN или AI)
 * OUTPUTS: Player - объект игрока
 * SIDE_EFFECTS: None
 * KEYWORDS: player creation, initialization
 */
export function createPlayer(
  id: string,
  name: string,
  color: string,
  type: PlayerType
): Player {
  // START_BLOCK_PLAYER_INITIALIZATION
  // Описание: Создание объекта игрока с начальными значениями

  const player: Player = {
    id,
    name,
    color,
    type,
    resources: { ...GAME_CONSTANTS.INITIAL_RESOURCES },
    settlements: GAME_CONSTANTS.INITIAL_PIECES.SETTLEMENTS,
    cities: GAME_CONSTANTS.INITIAL_PIECES.CITIES,
    roads: GAME_CONSTANTS.INITIAL_PIECES.ROADS,
    devCards: [],
    playedDevCards: [],
    knightsPlayed: 0,
    victoryPoints: 0,
    hasLongestRoad: false,
    hasLargestArmy: false,
  };
  // END_BLOCK_PLAYER_INITIALIZATION

  console.log('[GameUtils][createPlayer][SUCCESS]', { id, name, type });

  return player;
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Создать начальное состояние игры
 * INPUTS:
 *   - players: Player[] - массив игроков
 *   - hexes: Hex[] - массив гексагонов
 *   - vertices: Vertex[] - массив вершин
 *   - edges: Edge[] - массив ребер
 * OUTPUTS: GameState - начальное состояние игры
 * SIDE_EFFECTS: None
 * KEYWORDS: game state, initialization
 */
export function createInitialGameState(
  players: Player[],
  hexes: Hex[],
  vertices: Vertex[],
  edges: Edge[]
): GameState {
  // START_BLOCK_DEV_CARD_DECK_CREATION
  // Описание: Создание и перемешивание колоды карт развития

  const devCardDeck: DevCardType[] = [];
  Object.entries(DEV_CARD_DECK).forEach(([cardType, count]) => {
    for (let i = 0; i < count; i++) {
      devCardDeck.push(cardType as DevCardType);
    }
  });

  // Перемешать колоду
  for (let i = devCardDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [devCardDeck[i], devCardDeck[j]] = [devCardDeck[j], devCardDeck[i]];
  }
  // END_BLOCK_DEV_CARD_DECK_CREATION

  // START_BLOCK_GAME_STATE_INITIALIZATION
  // Описание: Создание объекта GameState

  const gameState: GameState = {
    phase: GamePhase.INITIAL_PLACEMENT,
    turnPhase: TurnPhase.ACTIONS,
    currentPlayerId: players[0].id,
    players,
    hexes,
    vertices,
    edges,
    devCardDeck,
    lastDiceRoll: null,
    longestRoadPlayerId: null,
    largestArmyPlayerId: null,
    turnNumber: 1,
    winner: null,
    initialPlacementRound: 1,
  };
  // END_BLOCK_GAME_STATE_INITIALIZATION

  console.log('[GameUtils][createInitialGameState][SUCCESS]', {
    playerCount: players.length,
    hexCount: hexes.length,
    devCardDeckSize: devCardDeck.length,
  });

  return gameState;
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Получить игрока по ID
 * INPUTS:
 *   - playerId: string - ID игрока
 *   - gameState: GameState - состояние игры
 * OUTPUTS: Player | null - найденный игрок или null
 * SIDE_EFFECTS: None
 * KEYWORDS: player lookup
 */
export function getPlayerById(
  playerId: string,
  gameState: GameState
): Player | null {
  return gameState.players.find((p) => p.id === playerId) ?? null;
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Получить следующего игрока в порядке хода
 * INPUTS:
 *   - gameState: GameState - состояние игры
 * OUTPUTS: Player - следующий игрок
 * SIDE_EFFECTS: None
 * KEYWORDS: turn order, next player
 */
export function getNextPlayer(gameState: GameState): Player {
  // START_BLOCK_FIND_CURRENT_INDEX
  // Описание: Поиск индекса текущего игрока

  const currentIndex = gameState.players.findIndex(
    (p) => p.id === gameState.currentPlayerId
  );
  // END_BLOCK_FIND_CURRENT_INDEX

  // START_BLOCK_CALCULATE_NEXT_INDEX
  // Описание: Вычисление индекса следующего игрока

  let nextIndex: number;

  if (gameState.phase === GamePhase.INITIAL_PLACEMENT) {
    // В начальной расстановке: 1 круг вперед, 2 круг назад
    if (gameState.initialPlacementRound === 1) {
      nextIndex = currentIndex + 1;
      if (nextIndex >= gameState.players.length) {
        // Переход ко второму кругу
        nextIndex = gameState.players.length - 1;
      }
    } else {
      // Второй круг - в обратном порядке
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) {
        nextIndex = 0; // Конец начальной расстановки
      }
    }
  } else {
    // Основная игра - круговой порядок
    nextIndex = (currentIndex + 1) % gameState.players.length;
  }
  // END_BLOCK_CALCULATE_NEXT_INDEX

  return gameState.players[nextIndex];
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Deep clone объекта GameState
 * INPUTS:
 *   - gameState: GameState - состояние для клонирования
 * OUTPUTS: GameState - глубокая копия
 * SIDE_EFFECTS: None
 * KEYWORDS: deep clone, immutability
 */
export function cloneGameState(gameState: GameState): GameState {
  // START_BLOCK_JSON_CLONE
  // Описание: Использование JSON для deep clone

  return JSON.parse(JSON.stringify(gameState));
  // END_BLOCK_JSON_CLONE
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Проверить победил ли игрок (достиг 10 VP)
 * INPUTS:
 *   - player: Player - игрок для проверки
 *   - gameState: GameState - состояние игры
 * OUTPUTS: boolean - true если игрок победил
 * SIDE_EFFECTS: None
 * KEYWORDS: victory condition, win check
 */
export function checkVictory(player: Player, gameState: GameState): boolean {
  // Вычисление VP будет в calculators.ts
  // Здесь простая проверка на основе player.victoryPoints
  return player.victoryPoints >= GAME_CONSTANTS.VICTORY_POINTS_TO_WIN;
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Получить доступные вершины для строительства поселения
 * INPUTS:
 *   - playerId: string - ID игрока
 *   - gameState: GameState - состояние игры
 * OUTPUTS: string[] - массив ID доступных вершин
 * SIDE_EFFECTS: None
 * KEYWORDS: available positions, settlement placement
 */
export function getAvailableSettlementPositions(
  playerId: string,
  gameState: GameState
): string[] {
  const availableVertices: string[] = [];

  // START_BLOCK_FILTER_VERTICES
  // Описание: Фильтрация вершин по правилам строительства

  gameState.vertices.forEach((vertex) => {
    // Должна быть свободна
    if (vertex.building !== null) return;

    // Distance rule - соседи должны быть свободны
    const hasAdjacentBuilding = vertex.neighborVertexIds.some((neighborId) => {
      const neighbor = gameState.vertices.find((v) => v.id === neighborId);
      return neighbor?.building !== null;
    });
    if (hasAdjacentBuilding) return;

    // Должна примыкать к дороге игрока
    const hasAdjacentRoad = vertex.neighborEdgeIds.some((edgeId) => {
      const edge = gameState.edges.find((e) => e.id === edgeId);
      return edge?.road?.playerId === playerId;
    });
    if (!hasAdjacentRoad) return;

    availableVertices.push(vertex.id);
  });
  // END_BLOCK_FILTER_VERTICES

  return availableVertices;
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Получить доступные ребра для строительства дороги
 * INPUTS:
 *   - playerId: string - ID игрока
 *   - gameState: GameState - состояние игры
 * OUTPUTS: string[] - массив ID доступных ребер
 * SIDE_EFFECTS: None
 * KEYWORDS: available positions, road placement
 */
export function getAvailableRoadPositions(
  playerId: string,
  gameState: GameState
): string[] {
  const availableEdges: string[] = [];

  // START_BLOCK_FILTER_EDGES
  // Описание: Фильтрация ребер по правилам строительства

  gameState.edges.forEach((edge) => {
    // Должно быть свободно
    if (edge.road !== null) return;

    // Должно примыкать к дороге или постройке игрока
    const isAdjacent = edge.vertexIds.some((vertexId) => {
      const vertex = gameState.vertices.find((v) => v.id === vertexId);
      if (!vertex) return false;

      // Проверка постройки
      if (vertex.building?.playerId === playerId) return true;

      // Проверка соседних дорог
      return vertex.neighborEdgeIds.some((neighborEdgeId) => {
        const neighborEdge = gameState.edges.find((e) => e.id === neighborEdgeId);
        return neighborEdge?.road?.playerId === playerId;
      });
    });

    if (isAdjacent) {
      availableEdges.push(edge.id);
    }
  });
  // END_BLOCK_FILTER_EDGES

  return availableEdges;
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Распределить ресурсы игрокам на основе броска кубиков
 * INPUTS:
 *   - diceSum: number - сумма броска кубиков (2-12)
 *   - gameState: GameState - текущее состояние игры
 * OUTPUTS: GameState - новое состояние с обновленными ресурсами игроков
 * SIDE_EFFECTS: None
 * KEYWORDS: resource distribution, dice roll
 */
export function distributeResources(diceSum: number, gameState: GameState): GameState {
  console.log('[GameUtils][distributeResources][START]', { diceSum });

  // START_BLOCK_ACTIVE_HEXES_FILTER
  // Описание: Найти все гексагоны с номером равным diceSum (без разбойника)

  const activeHexes = gameState.hexes.filter(
    (hex) => hex.number === diceSum && !hex.hasRobber
  );

  if (activeHexes.length === 0) {
    console.log('[GameUtils][distributeResources][INFO]', {
      message: 'No active hexes for this roll',
    });
    return gameState;
  }
  // END_BLOCK_ACTIVE_HEXES_FILTER

  // START_BLOCK_RESOURCE_COLLECTION
  // Описание: Для каждого активного гексагона найти постройки на вершинах и добавить ресурсы

  const updatedPlayers = [...gameState.players];

  activeHexes.forEach((hex) => {
    const resource = TERRAIN_TO_RESOURCE[hex.terrain];
    if (!resource) return; // Пустыня не дает ресурсов

    // Найти вершины этого гексагона
    hex.vertexIds.forEach((vertexId) => {
      const vertex = gameState.vertices.find((v) => v.id === vertexId);
      if (!vertex || !vertex.building) return;

      // Найти игрока-владельца постройки
      const playerIndex = updatedPlayers.findIndex(
        (p) => p.id === vertex.building!.playerId
      );
      if (playerIndex === -1) return;

      // Определить количество ресурсов (поселение = 1, город = 2)
      const resourceCount =
        vertex.building.type === BuildingType.SETTLEMENT ? 1 : 2;

      // Добавить ресурсы игроку (immutable update)
      updatedPlayers[playerIndex] = {
        ...updatedPlayers[playerIndex],
        resources: {
          ...updatedPlayers[playerIndex].resources,
          [resource]:
            updatedPlayers[playerIndex].resources[resource] + resourceCount,
        },
      };

      console.log('[GameUtils][distributeResources][RESOURCE_ADDED]', {
        playerId: vertex.building.playerId,
        resource,
        amount: resourceCount,
        hexId: hex.id,
      });
    });
  });
  // END_BLOCK_RESOURCE_COLLECTION

  console.log('[GameUtils][distributeResources][SUCCESS]', {
    activeHexCount: activeHexes.length,
  });

  return {
    ...gameState,
    players: updatedPlayers,
  };
}

/**
 * END_MODULE_gameUtils
 */
