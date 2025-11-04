/**
 * START_MODULE_game.store
 *
 * MODULE_CONTRACT:
 * PURPOSE: Centralized state management для игры Catan
 * SCOPE: Управление состоянием игры, actions для изменения состояния, UI state
 * KEYWORDS: Zustand, state management, game state, actions
 * LINKS_TO_MODULE: types/game.types.ts, lib/game-logic/*, lib/utils/gameUtils.ts
 */

import { create } from 'zustand';
import {
  GameState,
  PlayerType,
  GamePhase,
  TurnPhase,
  BuildingType,
  ResourceType,
} from '@/types/game.types';
import { generateMap } from '@/lib/game-logic/mapGenerator';
import {
  createPlayer,
  rollDice,
  createInitialGameState,
  distributeResources,
  getNextPlayer,
  getAvailableSettlementPositions,
  getAvailableRoadPositions,
} from '@/lib/utils/gameUtils';
import {
  handleBuildRoad,
  handleBuildSettlement,
  handleBuildCity,
} from '@/lib/game-logic/actionHandlers';
import {
  handleMoveRobber,
  handleStealResource,
  handleDiscardResources,
  needsToDiscardResources,
  calculateDiscardAmount,
  getPlayersToStealFrom,
} from '@/lib/game-logic/robberHandlers';
import { PLAYER_COLORS } from '@/lib/constants/game.constants';
import { calculateVictoryPoints } from '@/lib/game-logic/calculators';

/**
 * Интерфейс Zustand store
 */
interface GameStore {
  // Core game state
  gameState: GameState | null;

  // UI state
  selectedHex: string | null;
  selectedVertex: string | null;
  selectedEdge: string | null;
  highlightedVertices: string[];
  highlightedEdges: string[];
  highlightedHexes: string[];
  buildMode: 'road' | 'settlement' | 'city' | null;
  playersNeedingDiscard: string[]; // IDs игроков, которые должны сбросить ресурсы

  // Actions - Game management
  initializeGame: (playerNames: string[], aiCount: number) => void;
  rollDice: () => void;
  buildRoad: (edgeId: string) => void;
  buildSettlement: (vertexId: string) => void;
  buildCity: (vertexId: string) => void;
  endTurn: () => void;

  // Actions - Robber mechanics
  moveRobber: (hexId: string, stealFromPlayerId: string | null) => void;
  discardResources: (playerId: string, resources: Partial<Record<import('@/types/game.types').ResourceType, number>>) => void;

  // Actions - UI state
  setSelectedHex: (hexId: string | null) => void;
  setSelectedVertex: (vertexId: string | null) => void;
  setSelectedEdge: (edgeId: string | null) => void;
  setBuildMode: (mode: 'road' | 'settlement' | 'city' | null) => void;
  highlightAvailablePositions: (mode: 'road' | 'settlement' | 'city') => void;
  clearHighlights: () => void;
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Создать Zustand store для управления состоянием игры
 * OUTPUTS: GameStore - store с состоянием и actions
 * SIDE_EFFECTS: Создает глобальное состояние
 * KEYWORDS: Zustand, store, state
 */
export const useGameStore = create<GameStore>((set, get) => ({
  // ============================================================================
  // INITIAL STATE
  // ============================================================================

  gameState: null,
  selectedHex: null,
  selectedVertex: null,
  selectedEdge: null,
  highlightedVertices: [],
  highlightedEdges: [],
  highlightedHexes: [],
  buildMode: null,
  playersNeedingDiscard: [],

  // ============================================================================
  // GAME ACTIONS
  // ============================================================================

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
    console.log('[GameStore][initializeGame][START]', { playerNames, aiCount });

    // START_BLOCK_PLAYER_CREATION
    // Описание: Создание массива игроков (люди + AI)

    const players = [];

    playerNames.forEach((name, index) => {
      players.push(
        createPlayer(`player-${index}`, name, PLAYER_COLORS[index], PlayerType.HUMAN)
      );
    });

    for (let i = 0; i < aiCount; i++) {
      const index = playerNames.length + i;
      players.push(
        createPlayer(`ai-${i}`, `AI ${i + 1}`, PLAYER_COLORS[index], PlayerType.AI)
      );
    }
    // END_BLOCK_PLAYER_CREATION

    // START_BLOCK_MAP_GENERATION
    // Описание: Генерация игровой карты

    const { hexes, vertices, edges } = generateMap();
    console.log('[GameStore][initializeGame][MAP_GENERATION][SUCCESS]', {
      hexes: hexes.length,
      vertices: vertices.length,
      edges: edges.length,
    });
    // END_BLOCK_MAP_GENERATION

    // START_BLOCK_STATE_INITIALIZATION
    // Описание: Создание начального состояния игры

    const initialState = createInitialGameState(players, hexes, vertices, edges);

    set({ gameState: initialState });
    // END_BLOCK_STATE_INITIALIZATION

    console.log('[GameStore][initializeGame][SUCCESS]', {
      playerCount: players.length,
    });
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
    if (!state) {
      console.error('[GameStore][rollDice][ERROR]', { error: 'No game state' });
      return;
    }

    console.log('[GameStore][rollDice][START]');

    // START_BLOCK_DICE_ROLL
    // Описание: Бросок двух кубиков

    const dice = rollDice();
    const sum = dice[0] + dice[1];
    // END_BLOCK_DICE_ROLL

    // START_BLOCK_RESOURCE_DISTRIBUTION
    // Описание: Распределение ресурсов если не 7

    if (sum !== 7) {
      const updatedState = distributeResources(sum, state);
      set({
        gameState: {
          ...updatedState,
          lastDiceRoll: dice,
          turnPhase: TurnPhase.ACTIONS,
        },
      });
      console.log('[GameStore][rollDice][SUCCESS]', { dice, sum });
    } else {
      // Активация разбойника (Phase 5)
      // Проверить какие игроки должны сбросить ресурсы
      const playersToDiscard = state.players
        .filter((p) => needsToDiscardResources(p))
        .map((p) => p.id);

      set({
        gameState: {
          ...state,
          lastDiceRoll: dice,
          turnPhase: TurnPhase.ROBBER_ACTIVATION,
        },
        playersNeedingDiscard: playersToDiscard,
      });
      console.log('[GameStore][rollDice][ROBBER_ACTIVATED]', { dice, sum, playersToDiscard });
    }
    // END_BLOCK_RESOURCE_DISTRIBUTION
  },

  /**
   * FUNCTION_CONTRACT:
   * PURPOSE: Построить дорогу на выбранном ребре
   * INPUTS:
   *   - edgeId: string - ID ребра
   * OUTPUTS: void
   * SIDE_EFFECTS: Обновляет gameState, очищает highlights
   * KEYWORDS: build road, construction
   */
  buildRoad: (edgeId: string) => {
    const state = get().gameState;
    if (!state) return;

    console.log('[GameStore][buildRoad][START]', { edgeId });

    // START_BLOCK_BUILD_ROAD_HANDLER
    // Описание: Вызов обработчика строительства дороги

    const currentPlayer = state.players.find((p) => p.id === state.currentPlayerId);
    if (!currentPlayer) return;

    const isInitialPlacement = state.phase === GamePhase.INITIAL_PLACEMENT;
    const newState = handleBuildRoad(currentPlayer.id, edgeId, state, isInitialPlacement);

    // Проверка что начальная расстановка: если построили дорогу - переход к следующему игроку
    if (newState.phase === GamePhase.INITIAL_PLACEMENT) {
      const nextPlayer = getNextPlayer(newState);

      // Проверка завершения начальной расстановки
      const allPlayersPlaced = newState.vertices.filter(v => v.building !== null).length;
      const totalPlacementsNeeded = newState.players.length * 2;

      if (allPlayersPlaced >= totalPlacementsNeeded) {
        // Начальная расстановка завершена - переход к основной игре
        set({
          gameState: {
            ...newState,
            phase: GamePhase.MAIN_GAME,
            turnPhase: TurnPhase.DICE_ROLL,
            currentPlayerId: newState.players[0].id,
          },
          buildMode: null,
          highlightedEdges: [],
          highlightedVertices: [],
        });
        console.log('[GameStore][buildRoad][INITIAL_PLACEMENT_COMPLETE]');
      } else {
        // Проверка перехода ко второму кругу
        let updatedRound = newState.initialPlacementRound;
        if (
          newState.initialPlacementRound === 1 &&
          allPlayersPlaced === newState.players.length
        ) {
          updatedRound = 2;
        }

        set({
          gameState: {
            ...newState,
            currentPlayerId: nextPlayer.id,
            initialPlacementRound: updatedRound,
          },
          buildMode: null,
          highlightedEdges: [],
          highlightedVertices: [],
        });
      }
    } else {
      set({
        gameState: newState,
        buildMode: null,
        highlightedEdges: [],
      });
    }
    // END_BLOCK_BUILD_ROAD_HANDLER

    console.log('[GameStore][buildRoad][SUCCESS]', { edgeId });
  },

  /**
   * FUNCTION_CONTRACT:
   * PURPOSE: Построить поселение на выбранной вершине
   * INPUTS:
   *   - vertexId: string - ID вершины
   * OUTPUTS: void
   * SIDE_EFFECTS: Обновляет gameState, переключает на режим строительства дороги (для initial placement)
   * KEYWORDS: build settlement, construction
   */
  buildSettlement: (vertexId: string) => {
    const state = get().gameState;
    if (!state) return;

    console.log('[GameStore][buildSettlement][START]', { vertexId });

    // START_BLOCK_BUILD_SETTLEMENT_HANDLER
    // Описание: Вызов обработчика строительства поселения

    const currentPlayer = state.players.find((p) => p.id === state.currentPlayerId);
    if (!currentPlayer) return;

    const isInitialPlacement = state.phase === GamePhase.INITIAL_PLACEMENT;
    const newState = handleBuildSettlement(currentPlayer.id, vertexId, state, isInitialPlacement);

    // Начальная расстановка: после строительства поселения показать доступные ребра для дороги
    if (newState.phase === GamePhase.INITIAL_PLACEMENT) {
      const vertex = newState.vertices.find((v) => v.id === vertexId);
      if (vertex) {
        // Выделить соседние ребра вершины для строительства дороги
        const availableEdges = vertex.neighborEdgeIds.filter((edgeId) => {
          const edge = newState.edges.find((e) => e.id === edgeId);
          return edge?.road === null;
        });

        set({
          gameState: newState,
          buildMode: 'road',
          highlightedEdges: availableEdges,
          highlightedVertices: [],
        });

        console.log('[GameStore][buildSettlement][INITIAL_PLACEMENT_ROAD_PROMPT]', {
          availableEdges,
        });
      }
    } else {
      // Основная игра: просто обновить состояние
      set({
        gameState: newState,
        buildMode: null,
        highlightedVertices: [],
      });
    }
    // END_BLOCK_BUILD_SETTLEMENT_HANDLER

    console.log('[GameStore][buildSettlement][SUCCESS]', { vertexId });
  },

  /**
   * FUNCTION_CONTRACT:
   * PURPOSE: Улучшить поселение до города
   * INPUTS:
   *   - vertexId: string - ID вершины с поселением
   * OUTPUTS: void
   * SIDE_EFFECTS: Обновляет gameState, очищает highlights
   * KEYWORDS: build city, upgrade
   */
  buildCity: (vertexId: string) => {
    const state = get().gameState;
    if (!state) return;

    console.log('[GameStore][buildCity][START]', { vertexId });

    const currentPlayer = state.players.find((p) => p.id === state.currentPlayerId);
    if (!currentPlayer) return;

    const newState = handleBuildCity(currentPlayer.id, vertexId, state);

    set({
      gameState: newState,
      buildMode: null,
      highlightedVertices: [],
    });

    console.log('[GameStore][buildCity][SUCCESS]', { vertexId });
  },

  /**
   * FUNCTION_CONTRACT:
   * PURPOSE: Завершить ход текущего игрока
   * OUTPUTS: void
   * SIDE_EFFECTS: Обновляет currentPlayerId, turnPhase, пересчитывает VP
   * KEYWORDS: end turn, turn management
   */
  endTurn: () => {
    const state = get().gameState;
    if (!state) return;

    console.log('[GameStore][endTurn][START]');

    // START_BLOCK_VICTORY_POINTS_CALCULATION
    // Описание: Пересчет очков победы для всех игроков

    const updatedPlayers = state.players.map((player) => ({
      ...player,
      victoryPoints: calculateVictoryPoints(player, state),
    }));
    // END_BLOCK_VICTORY_POINTS_CALCULATION

    // START_BLOCK_VICTORY_CHECK
    // Описание: Проверка победителя

    const winner = updatedPlayers.find(
      (p) => p.victoryPoints >= 10
    );

    if (winner) {
      set({
        gameState: {
          ...state,
          players: updatedPlayers,
          phase: GamePhase.GAME_OVER,
          winner: winner.id,
        },
      });
      console.log('[GameStore][endTurn][GAME_OVER]', { winner: winner.name });
      return;
    }
    // END_BLOCK_VICTORY_CHECK

    // START_BLOCK_NEXT_PLAYER
    // Описание: Переход к следующему игроку

    const nextPlayer = getNextPlayer({ ...state, players: updatedPlayers });

    set({
      gameState: {
        ...state,
        players: updatedPlayers,
        currentPlayerId: nextPlayer.id,
        turnPhase: TurnPhase.DICE_ROLL,
        turnNumber: state.turnNumber + 1,
      },
      buildMode: null,
      highlightedVertices: [],
      highlightedEdges: [],
    });
    // END_BLOCK_NEXT_PLAYER

    console.log('[GameStore][endTurn][SUCCESS]', {
      nextPlayer: nextPlayer.name,
      turnNumber: state.turnNumber + 1,
    });
  },

  // ============================================================================
  // UI ACTIONS
  // ============================================================================

  /**
   * FUNCTION_CONTRACT:
   * PURPOSE: Установить выбранный гексагон
   * INPUTS:
   *   - hexId: string | null - ID гексагона
   * OUTPUTS: void
   * SIDE_EFFECTS: Обновляет selectedHex
   * KEYWORDS: UI state, selection
   */
  setSelectedHex: (hexId: string | null) => {
    set({ selectedHex: hexId });
  },

  /**
   * FUNCTION_CONTRACT:
   * PURPOSE: Установить выбранную вершину
   * INPUTS:
   *   - vertexId: string | null - ID вершины
   * OUTPUTS: void
   * SIDE_EFFECTS: Обновляет selectedVertex
   * KEYWORDS: UI state, selection
   */
  setSelectedVertex: (vertexId: string | null) => {
    set({ selectedVertex: vertexId });
  },

  /**
   * FUNCTION_CONTRACT:
   * PURPOSE: Установить выбранное ребро
   * INPUTS:
   *   - edgeId: string | null - ID ребра
   * OUTPUTS: void
   * SIDE_EFFECTS: Обновляет selectedEdge
   * KEYWORDS: UI state, selection
   */
  setSelectedEdge: (edgeId: string | null) => {
    set({ selectedEdge: edgeId });
  },

  /**
   * FUNCTION_CONTRACT:
   * PURPOSE: Установить режим строительства
   * INPUTS:
   *   - mode: 'road' | 'settlement' | 'city' | null - режим строительства
   * OUTPUTS: void
   * SIDE_EFFECTS: Обновляет buildMode
   * KEYWORDS: UI state, build mode
   */
  setBuildMode: (mode: 'road' | 'settlement' | 'city' | null) => {
    set({ buildMode: mode });
  },

  /**
   * FUNCTION_CONTRACT:
   * PURPOSE: Подсветить доступные позиции для строительства
   * INPUTS:
   *   - mode: 'road' | 'settlement' | 'city' - тип постройки
   * OUTPUTS: void
   * SIDE_EFFECTS: Обновляет highlightedVertices или highlightedEdges
   * KEYWORDS: UI state, highlights
   */
  highlightAvailablePositions: (mode: 'road' | 'settlement' | 'city') => {
    const state = get().gameState;
    if (!state) return;

    const currentPlayer = state.players.find((p) => p.id === state.currentPlayerId);
    if (!currentPlayer) return;

    // START_BLOCK_CALCULATE_AVAILABLE_POSITIONS
    // Описание: Вычисление доступных позиций на основе режима

    if (mode === 'road') {
      const availableEdges = getAvailableRoadPositions(currentPlayer.id, state);
      set({ highlightedEdges: availableEdges, highlightedVertices: [], buildMode: 'road' });
    } else if (mode === 'settlement') {
      // Для начальной расстановки - все свободные вершины с distance rule
      if (state.phase === GamePhase.INITIAL_PLACEMENT) {
        const availableVertices = state.vertices
          .filter((vertex) => {
            if (vertex.building !== null) return false;

            // Distance rule
            const hasAdjacentBuilding = vertex.neighborVertexIds.some((neighborId) => {
              const neighbor = state.vertices.find((v) => v.id === neighborId);
              return neighbor?.building !== null;
            });
            return !hasAdjacentBuilding;
          })
          .map((v) => v.id);

        set({
          highlightedVertices: availableVertices,
          highlightedEdges: [],
          buildMode: 'settlement',
        });
      } else {
        // Основная игра - нужна примыкающая дорога
        const availableVertices = getAvailableSettlementPositions(currentPlayer.id, state);
        set({
          highlightedVertices: availableVertices,
          highlightedEdges: [],
          buildMode: 'settlement',
        });
      }
    } else if (mode === 'city') {
      // Города можно строить только на своих поселениях
      const playerSettlements = state.vertices
        .filter(
          (v) =>
            v.building?.playerId === currentPlayer.id &&
            v.building.type === BuildingType.SETTLEMENT
        )
        .map((v) => v.id);

      set({
        highlightedVertices: playerSettlements,
        highlightedEdges: [],
        buildMode: 'city',
      });
    }
    // END_BLOCK_CALCULATE_AVAILABLE_POSITIONS
  },

  /**
   * FUNCTION_CONTRACT:
   * PURPOSE: Очистить все подсветки и режим строительства
   * OUTPUTS: void
   * SIDE_EFFECTS: Очищает highlights и buildMode
   * KEYWORDS: UI state, clear
   */
  clearHighlights: () => {
    set({
      highlightedVertices: [],
      highlightedEdges: [],
      highlightedHexes: [],
      buildMode: null,
    });
  },

  // ============================================================================
  // ROBBER ACTIONS
  // ============================================================================

  /**
   * FUNCTION_CONTRACT:
   * PURPOSE: Переместить разбойника и украсть ресурс
   * INPUTS:
   *   - hexId: string - ID гексагона для размещения разбойника
   *   - stealFromPlayerId: string | null - ID игрока для кражи ресурса
   * OUTPUTS: void
   * SIDE_EFFECTS: Обновляет gameState, очищает highlights
   * KEYWORDS: robber, move, steal
   */
  moveRobber: (hexId: string, stealFromPlayerId: string | null) => {
    const state = get().gameState;
    if (!state) return;

    console.log('[GameStore][moveRobber][START]', { hexId, stealFromPlayerId });

    // START_BLOCK_MOVE_ROBBER
    // Описание: Перемещение разбойника на новый гекс

    let newState = handleMoveRobber(state, hexId);
    // END_BLOCK_MOVE_ROBBER

    // START_BLOCK_STEAL_RESOURCE
    // Описание: Кража ресурса у выбранного игрока

    if (stealFromPlayerId) {
      newState = handleStealResource(
        newState,
        stealFromPlayerId,
        state.currentPlayerId
      );
    }
    // END_BLOCK_STEAL_RESOURCE

    set({
      gameState: {
        ...newState,
        turnPhase: TurnPhase.ACTIONS,
      },
      highlightedHexes: [],
    });

    console.log('[GameStore][moveRobber][SUCCESS]');
  },

  /**
   * FUNCTION_CONTRACT:
   * PURPOSE: Сбросить ресурсы игрока при выпадении 7
   * INPUTS:
   *   - playerId: string - ID игрока
   *   - resources: Partial<Record<ResourceType, number>> - ресурсы для сброса
   * OUTPUTS: void
   * SIDE_EFFECTS: Обновляет gameState
   * KEYWORDS: robber, discard, resources
   */
  discardResources: (
    playerId: string,
    resources: Partial<Record<ResourceType, number>>
  ) => {
    const state = get().gameState;
    if (!state) return;

    console.log('[GameStore][discardResources][START]', {
      playerId,
      resources,
    });

    const newState = handleDiscardResources(state, playerId, resources);

    // Убрать игрока из списка ожидающих сброса
    const remainingPlayers = get().playersNeedingDiscard.filter(id => id !== playerId);

    set({
      gameState: newState,
      playersNeedingDiscard: remainingPlayers,
    });

    console.log('[GameStore][discardResources][SUCCESS]', {
      remainingPlayers: remainingPlayers.length,
    });
  },
}));

/**
 * END_MODULE_game.store
 */
