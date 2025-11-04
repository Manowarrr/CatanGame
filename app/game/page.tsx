/**
 * START_MODULE_game.page
 *
 * MODULE_CONTRACT:
 * PURPOSE: Страница игрового процесса Catan
 * SCOPE: Основной игровой экран с доской, панелями игроков, действиями и кубиками
 * KEYWORDS: React, Next.js, game screen, Zustand
 * LINKS_TO_MODULE: store/gameStore.ts, components/board/Board, components/game/*
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Board } from '@/components/board/Board';
import { PlayerPanel } from '@/components/ui/PlayerPanel';
import { GamePhase, DevCardType } from '@/types/game.types';
import {
  isCurrentPlayerAI,
  chooseInitialSettlement,
  chooseInitialRoad,
  decideMainGameAction,
  chooseRobberTarget,
} from '@/lib/ai/basicAI';
import {
  getPlayersToStealFrom,
  needsToDiscardResources,
  calculateDiscardAmount,
} from '@/lib/game-logic/robberHandlers';
import { DiscardResourcesModal } from '@/components/ui/DiscardResourcesModal';
import { YearOfPlentyModal } from '@/components/ui/YearOfPlentyModal';
import { MonopolyModal } from '@/components/ui/MonopolyModal';
import { RoadBuildingModal } from '@/components/ui/RoadBuildingModal';
import { DevCardPanel } from '@/components/ui/DevCardPanel';
import { ResourceType } from '@/types/game.types';

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Главная страница игрового процесса
 * OUTPUTS: React.ReactElement - страница с игровым интерфейсом
 * SIDE_EFFECTS: Инициализирует игру при монтировании
 * KEYWORDS: game page, Next.js page
 */
export default function GamePage() {
  const gameState = useGameStore((state) => state.gameState);
  const initializeGame = useGameStore((state) => state.initializeGame);
  const rollDice = useGameStore((state) => state.rollDice);
  const buildRoad = useGameStore((state) => state.buildRoad);
  const buildSettlement = useGameStore((state) => state.buildSettlement);
  const buildCity = useGameStore((state) => state.buildCity);
  const endTurn = useGameStore((state) => state.endTurn);
  const moveRobber = useGameStore((state) => state.moveRobber);
  const buyDevCard = useGameStore((state) => state.buyDevCard);
  const playKnightCard = useGameStore((state) => state.playKnightCard);
  const playYearOfPlentyCard = useGameStore((state) => state.playYearOfPlentyCard);
  const playMonopolyCard = useGameStore((state) => state.playMonopolyCard);
  const playRoadBuildingCard = useGameStore((state) => state.playRoadBuildingCard);
  const highlightAvailablePositions = useGameStore(
    (state) => state.highlightAvailablePositions
  );
  const clearHighlights = useGameStore((state) => state.clearHighlights);
  const buildMode = useGameStore((state) => state.buildMode);
  const highlightedVertices = useGameStore((state) => state.highlightedVertices);
  const highlightedEdges = useGameStore((state) => state.highlightedEdges);
  const highlightedHexes = useGameStore((state) => state.highlightedHexes);
  const playersNeedingDiscard = useGameStore((state) => state.playersNeedingDiscard);
  const discardResources = useGameStore((state) => state.discardResources);

  // Local state for dev card modals
  const [activeDevCardModal, setActiveDevCardModal] = useState<DevCardType | null>(null);

  // Local state for road building card
  const [isRoadBuildingMode, setIsRoadBuildingMode] = useState(false);
  const [roadBuildingEdges, setRoadBuildingEdges] = useState<string[]>([]);

  // START_BLOCK_GAME_INITIALIZATION
  // Описание: Инициализация игры при монтировании компонента

  useEffect(() => {
    if (!gameState) {
      // Создаем игру с 1 игроком-человеком и 3 AI противниками
      initializeGame(['Player'], 3);
    }
  }, [gameState, initializeGame]);
  // END_BLOCK_GAME_INITIALIZATION

  // START_BLOCK_AUTO_HIGHLIGHT_INITIAL_PLACEMENT
  // Описание: Автоматическая подсветка доступных позиций при начальной расстановке

  useEffect(() => {
    if (
      gameState &&
      gameState.phase === GamePhase.INITIAL_PLACEMENT &&
      !buildMode &&
      highlightedVertices.length === 0
    ) {
      // Автоматически подсветить доступные вершины для первого поселения
      highlightAvailablePositions('settlement');
    }
  }, [gameState, buildMode, highlightedVertices.length, highlightAvailablePositions]);
  // END_BLOCK_AUTO_HIGHLIGHT_INITIAL_PLACEMENT

  // START_BLOCK_AI_INITIAL_PLACEMENT
  // Описание: AI автоматически делает ходы в начальной расстановке

  const aiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!gameState || gameState.phase !== GamePhase.INITIAL_PLACEMENT) return;
    if (!isCurrentPlayerAI(gameState)) return;

    // Очистить предыдущий таймер
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
    }

    // AI делает ход через 1 секунду (для видимости процесса)
    aiTimeoutRef.current = setTimeout(() => {
      if (buildMode === 'settlement' || !buildMode) {
        // Выбрать вершину для поселения
        const vertexId = chooseInitialSettlement(gameState);
        if (vertexId) {
          buildSettlement(vertexId);
        }
      } else if (buildMode === 'road' && highlightedEdges.length > 0) {
        // Выбрать ребро для дороги
        const lastSettlementVertex = gameState.vertices.find((v) =>
          v.building?.playerId === gameState.currentPlayerId
        );
        if (lastSettlementVertex) {
          const edgeId = chooseInitialRoad(gameState, lastSettlementVertex.id);
          if (edgeId) {
            buildRoad(edgeId);
          }
        }
      }
    }, 1000);

    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
      }
    };
  }, [gameState, buildMode, highlightedEdges, buildSettlement, buildRoad]);
  // END_BLOCK_AI_INITIAL_PLACEMENT

  // START_BLOCK_AI_MAIN_GAME
  // Описание: AI автоматически делает ходы в основной игре

  useEffect(() => {
    if (!gameState || gameState.phase !== GamePhase.MAIN_GAME) return;
    if (!isCurrentPlayerAI(gameState)) return;

    // Очистить предыдущий таймер
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
    }

    // START_BLOCK_AI_ROBBER_HANDLING
    // Описание: Обработка фазы разбойника для AI

    if (gameState.turnPhase === 'ROBBER_ACTIVATION') {
      aiTimeoutRef.current = setTimeout(() => {
        const robberTarget = chooseRobberTarget(gameState);
        if (robberTarget) {
          moveRobber(robberTarget.hexId, robberTarget.stealFromPlayerId);
        }
      }, 1500);

      return () => {
        if (aiTimeoutRef.current) {
          clearTimeout(aiTimeoutRef.current);
        }
      };
    }
    // END_BLOCK_AI_ROBBER_HANDLING

    // AI принимает решение через 1.5 секунды
    aiTimeoutRef.current = setTimeout(() => {
      const action = decideMainGameAction(gameState);
      if (action) {
        switch (action.type) {
          case 'ROLL_DICE':
            rollDice();
            break;
          case 'END_TURN':
            endTurn();
            break;
          case 'BUILD_ROAD':
            if (action.edgeId) buildRoad(action.edgeId);
            break;
          case 'BUILD_SETTLEMENT':
            if (action.vertexId) buildSettlement(action.vertexId);
            break;
          case 'BUILD_CITY':
            if (action.vertexId) buildCity(action.vertexId);
            break;
        }
      }
    }, 1500);

    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
      }
    };
  }, [gameState, rollDice, endTurn, buildRoad, buildSettlement, buildCity, moveRobber]);
  // END_BLOCK_AI_MAIN_GAME

  // START_BLOCK_AI_DISCARD_RESOURCES
  // Описание: AI автоматически сбрасывает ресурсы при выпадении 7

  useEffect(() => {
    if (!gameState || playersNeedingDiscard.length === 0) return;

    // Найти первого AI игрока, который должен сбросить ресурсы
    const aiPlayerToDiscard = playersNeedingDiscard.find((playerId) => {
      const player = gameState.players.find((p) => p.id === playerId);
      return player?.type === 'AI';
    });

    if (!aiPlayerToDiscard) return;

    // Очистить предыдущий таймер
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
    }

    // AI сбрасывает ресурсы через 1 секунду
    aiTimeoutRef.current = setTimeout(() => {
      const player = gameState.players.find((p) => p.id === aiPlayerToDiscard);
      if (!player) return;

      const discardAmount = calculateDiscardAmount(player);
      const resourcesToDiscard: Partial<Record<ResourceType, number>> = {};

      // Сбросить случайные ресурсы
      let remainingToDiscard = discardAmount;
      const availableResources: ResourceType[] = [];

      Object.entries(player.resources).forEach(([resource, count]) => {
        for (let i = 0; i < count; i++) {
          availableResources.push(resource as ResourceType);
        }
      });

      // Перемешать и взять нужное количество
      const shuffled = availableResources.sort(() => Math.random() - 0.5);
      shuffled.slice(0, remainingToDiscard).forEach((resource) => {
        resourcesToDiscard[resource] = (resourcesToDiscard[resource] || 0) + 1;
      });

      discardResources(aiPlayerToDiscard, resourcesToDiscard);
    }, 1000);

    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
      }
    };
  }, [gameState, playersNeedingDiscard, discardResources]);
  // END_BLOCK_AI_DISCARD_RESOURCES

  // START_BLOCK_LOADING_STATE
  // Описание: Показать загрузку если игра не инициализирована

  if (!gameState) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-2xl">Loading game...</div>
      </div>
    );
  }
  // END_BLOCK_LOADING_STATE

  // START_BLOCK_CURRENT_PLAYER_DATA
  // Описание: Получение данных текущего игрока

  const currentPlayer = gameState.players.find(
    (p) => p.id === gameState.currentPlayerId
  );

  if (!currentPlayer) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-2xl">Error: Current player not found</div>
      </div>
    );
  }
  // END_BLOCK_CURRENT_PLAYER_DATA

  // START_BLOCK_CLICK_HANDLERS
  // Описание: Обработчики кликов на элементы доски

  const handleVertexClick = (vertexId: string) => {
    if (buildMode === 'settlement') {
      buildSettlement(vertexId);
    } else if (buildMode === 'city') {
      buildCity(vertexId);
    }
  };

  const handleEdgeClick = (edgeId: string) => {
    if (isRoadBuildingMode) {
      // Road Building card mode - collect edges
      if (!roadBuildingEdges.includes(edgeId) && roadBuildingEdges.length < 2) {
        const newEdges = [...roadBuildingEdges, edgeId];
        setRoadBuildingEdges(newEdges);

        // Auto-confirm if 2 roads selected
        if (newEdges.length === 2) {
          playRoadBuildingCard(newEdges);
          setIsRoadBuildingMode(false);
          setRoadBuildingEdges([]);
          clearHighlights();
        }
      }
    } else if (buildMode === 'road') {
      buildRoad(edgeId);
    }
  };

  const handleHexClick = (hexId: string) => {
    // Перемещение разбойника при выпадении 7
    if (
      gameState.phase === GamePhase.MAIN_GAME &&
      gameState.turnPhase === 'ROBBER_ACTIVATION'
    ) {
      // Найти гекс
      const hex = gameState.hexes.find((h) => h.id === hexId);

      // Нельзя оставлять разбойника на том же месте
      if (hex?.hasRobber) {
        return;
      }

      // Получить список игроков для кражи
      const playersToStealFrom = getPlayersToStealFrom(gameState, hexId, gameState.currentPlayerId);

      // Если есть игроки для кражи - украсть у случайного
      const stealFromPlayerId = playersToStealFrom.length > 0
        ? playersToStealFrom[Math.floor(Math.random() * playersToStealFrom.length)]
        : null;

      moveRobber(hexId, stealFromPlayerId);
    }
  };
  // END_BLOCK_CLICK_HANDLERS

  // START_BLOCK_DEV_CARD_HANDLERS
  // Описание: Обработчики для карт развития

  const handlePlayDevCard = (cardType: DevCardType) => {
    if (cardType === DevCardType.KNIGHT) {
      // Для Knight нужно выбрать гекс (TODO: добавить UI для выбора)
      // Пока используем простую логику - перемещаем на случайный гекс
      const hexesWithoutRobber = gameState!.hexes.filter((h) => !h.hasRobber);
      const randomHex = hexesWithoutRobber[Math.floor(Math.random() * hexesWithoutRobber.length)];
      const playersToSteal = getPlayersToStealFrom(gameState!, randomHex.id, gameState!.currentPlayerId);
      const stealFrom = playersToSteal.length > 0 ? playersToSteal[Math.floor(Math.random() * playersToSteal.length)] : null;
      playKnightCard(randomHex.id, stealFrom);
    } else if (cardType === DevCardType.YEAR_OF_PLENTY) {
      setActiveDevCardModal(DevCardType.YEAR_OF_PLENTY);
    } else if (cardType === DevCardType.MONOPOLY) {
      setActiveDevCardModal(DevCardType.MONOPOLY);
    } else if (cardType === DevCardType.ROAD_BUILDING) {
      setActiveDevCardModal(DevCardType.ROAD_BUILDING);
    }
  };

  const handleYearOfPlentyConfirm = (resources: ResourceType[]) => {
    playYearOfPlentyCard(resources);
    setActiveDevCardModal(null);
  };

  const handleMonopolyConfirm = (resourceType: ResourceType) => {
    playMonopolyCard(resourceType);
    setActiveDevCardModal(null);
  };

  const handleRoadBuildingStart = () => {
    setActiveDevCardModal(null);
    setIsRoadBuildingMode(true);
    setRoadBuildingEdges([]);
    // Highlight available road positions
    if (gameState) {
      const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayerId);
      if (currentPlayer) {
        highlightAvailablePositions('road');
      }
    }
  };

  const handleRoadBuildingConfirm = () => {
    if (roadBuildingEdges.length > 0) {
      playRoadBuildingCard(roadBuildingEdges);
      setIsRoadBuildingMode(false);
      setRoadBuildingEdges([]);
      clearHighlights();
    }
  };

  const handleRoadBuildingCancel = () => {
    setIsRoadBuildingMode(false);
    setRoadBuildingEdges([]);
    clearHighlights();
  };
  // END_BLOCK_DEV_CARD_HANDLERS

  // START_BLOCK_PHASE_INSTRUCTION
  // Описание: Инструкции для текущей фазы игры

  let phaseInstruction = '';

  if (isRoadBuildingMode) {
    phaseInstruction = `${currentPlayer.name}: Road Building - Select edges (${roadBuildingEdges.length}/2)`;
  } else if (gameState.phase === GamePhase.INITIAL_PLACEMENT) {
    if (buildMode === 'settlement') {
      phaseInstruction = `${currentPlayer.name}: Place your ${
        gameState.initialPlacementRound === 1 ? 'first' : 'second'
      } settlement`;
    } else if (buildMode === 'road') {
      phaseInstruction = `${currentPlayer.name}: Place your ${
        gameState.initialPlacementRound === 1 ? 'first' : 'second'
      } road`;
    } else {
      phaseInstruction = `${currentPlayer.name}: Click to place settlement`;
    }
  } else if (gameState.phase === GamePhase.MAIN_GAME) {
    if (gameState.turnPhase === 'DICE_ROLL') {
      phaseInstruction = `${currentPlayer.name}: Roll the dice`;
    } else if (gameState.turnPhase === 'ACTIONS') {
      phaseInstruction = `${currentPlayer.name}: Choose your action`;
    } else if (gameState.turnPhase === 'ROBBER_ACTIVATION') {
      phaseInstruction = `${currentPlayer.name}: Move the robber (7 rolled!)`;
    }
  } else if (gameState.phase === GamePhase.GAME_OVER) {
    const winner = gameState.players.find((p) => p.id === gameState.winner);
    phaseInstruction = winner
      ? `🎉 ${winner.name} wins with ${winner.victoryPoints} victory points!`
      : 'Game Over';
  }
  // END_BLOCK_PHASE_INSTRUCTION

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* START_BLOCK_HEADER */}
      {/* Описание: Заголовок с инструкциями */}
      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold mb-2">Catan Game</h1>
        <p className="text-xl text-yellow-400">{phaseInstruction}</p>
      </div>
      {/* END_BLOCK_HEADER */}

      <div className="grid grid-cols-12 gap-4">
        {/* START_BLOCK_LEFT_PANEL */}
        {/* Описание: Левая панель с информацией об игроках */}
        <div className="col-span-3 space-y-4">
          <h2 className="text-xl font-bold mb-2">Players</h2>
          {gameState.players.map((player) => (
            <PlayerPanel
              key={player.id}
              player={player}
              isCurrentPlayer={player.id === gameState.currentPlayerId}
            />
          ))}
        </div>
        {/* END_BLOCK_LEFT_PANEL */}

        {/* START_BLOCK_BOARD */}
        {/* Описание: Центральная панель с игровой доской */}
        <div className="col-span-6 flex items-center justify-center">
          <Board
            gameState={gameState}
            onVertexClick={handleVertexClick}
            onEdgeClick={handleEdgeClick}
            onHexClick={handleHexClick}
            highlightedVertices={highlightedVertices}
            highlightedEdges={highlightedEdges}
            highlightedHexes={highlightedHexes}
          />
        </div>
        {/* END_BLOCK_BOARD */}

        {/* START_BLOCK_RIGHT_PANEL */}
        {/* Описание: Правая панель с кубиками и действиями */}
        <div className="col-span-3 space-y-4">
          {/* START_BLOCK_DICE_PANEL */}
          {/* Описание: Панель с кубиками */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-2">Dice</h2>
            {gameState.lastDiceRoll ? (
              <div className="flex gap-2 mb-4">
                <div className="w-16 h-16 bg-white text-black rounded-lg flex items-center justify-center text-3xl font-bold">
                  {gameState.lastDiceRoll[0]}
                </div>
                <div className="w-16 h-16 bg-white text-black rounded-lg flex items-center justify-center text-3xl font-bold">
                  {gameState.lastDiceRoll[1]}
                </div>
                <div className="flex items-center ml-2">
                  <span className="text-2xl">
                    = {gameState.lastDiceRoll[0] + gameState.lastDiceRoll[1]}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 mb-4">No roll yet</p>
            )}

            {gameState.phase === GamePhase.MAIN_GAME &&
              gameState.turnPhase === 'DICE_ROLL' && (
                <button
                  onClick={rollDice}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Roll Dice
                </button>
              )}
          </div>
          {/* END_BLOCK_DICE_PANEL */}

          {/* START_BLOCK_ACTION_PANEL */}
          {/* Описание: Панель с действиями */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-2">Actions</h2>

            {isRoadBuildingMode && (
              <div className="space-y-2">
                <p className="text-yellow-400 font-bold">
                  Road Building Active
                </p>
                <p className="text-gray-300 text-sm">
                  Roads selected: {roadBuildingEdges.length}/2
                </p>
                <button
                  onClick={handleRoadBuildingConfirm}
                  disabled={roadBuildingEdges.length === 0}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded"
                >
                  Confirm ({roadBuildingEdges.length} roads)
                </button>
                <button
                  onClick={handleRoadBuildingCancel}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            )}

            {!isRoadBuildingMode &&
              gameState.phase === GamePhase.MAIN_GAME &&
              gameState.turnPhase === 'ACTIONS' && (
                <div className="space-y-2">
                  <button
                    onClick={() => highlightAvailablePositions('road')}
                    className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-2 px-4 rounded"
                  >
                    Build Road
                  </button>
                  <button
                    onClick={() => highlightAvailablePositions('settlement')}
                    className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded"
                  >
                    Build Settlement
                  </button>
                  <button
                    onClick={() => highlightAvailablePositions('city')}
                    className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded"
                  >
                    Build City
                  </button>
                  <button
                    onClick={buyDevCard}
                    className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded"
                  >
                    Buy Dev Card
                  </button>
                  <button
                    onClick={clearHighlights}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                  <hr className="my-2 border-gray-700" />
                  <button
                    onClick={endTurn}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    End Turn
                  </button>
                </div>
              )}

            {gameState.phase === GamePhase.INITIAL_PLACEMENT && buildMode && (
              <p className="text-gray-400 text-sm">
                {buildMode === 'settlement'
                  ? 'Click on a highlighted vertex to place settlement'
                  : 'Click on a highlighted edge to place road'}
              </p>
            )}

            {gameState.phase === GamePhase.GAME_OVER && (
              <p className="text-green-400 text-lg font-bold">Game Over!</p>
            )}
          </div>
          {/* END_BLOCK_ACTION_PANEL */}

          {/* START_BLOCK_DEV_CARD_PANEL */}
          {/* Описание: Панель с картами развития */}
          {gameState.phase === GamePhase.MAIN_GAME && (
            <DevCardPanel
              player={currentPlayer}
              onPlayCard={handlePlayDevCard}
              canPlayCards={gameState.turnPhase === 'ACTIONS'}
            />
          )}
          {/* END_BLOCK_DEV_CARD_PANEL */}

          {/* START_BLOCK_CURRENT_PLAYER_INFO */}
          {/* Описание: Информация о текущем игроке */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-2">Your Resources</h2>
            <div className="space-y-1">
              {Object.entries(currentPlayer.resources).map(([resource, amount]) => (
                <div key={resource} className="flex justify-between">
                  <span className="capitalize">{resource.toLowerCase()}:</span>
                  <span className="font-bold">{amount}</span>
                </div>
              ))}
            </div>
            <hr className="my-2 border-gray-700" />
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Settlements left:</span>
                <span className="font-bold">{currentPlayer.settlements}</span>
              </div>
              <div className="flex justify-between">
                <span>Cities left:</span>
                <span className="font-bold">{currentPlayer.cities}</span>
              </div>
              <div className="flex justify-between">
                <span>Roads left:</span>
                <span className="font-bold">{currentPlayer.roads}</span>
              </div>
            </div>
          </div>
          {/* END_BLOCK_CURRENT_PLAYER_INFO */}
        </div>
        {/* END_BLOCK_RIGHT_PANEL */}
      </div>

      {/* START_BLOCK_DISCARD_MODAL */}
      {/* Описание: Модальное окно для сброса ресурсов */}
      {playersNeedingDiscard.length > 0 &&
        playersNeedingDiscard.map((playerId) => {
          const player = gameState.players.find((p) => p.id === playerId);
          if (!player || player.type === 'AI') return null;

          const discardAmount = calculateDiscardAmount(player);

          return (
            <DiscardResourcesModal
              key={playerId}
              player={player}
              discardAmount={discardAmount}
              onDiscard={(resources) => discardResources(playerId, resources)}
            />
          );
        })}
      {/* END_BLOCK_DISCARD_MODAL */}

      {/* START_BLOCK_DEV_CARD_MODALS */}
      {/* Описание: Модальные окна для карт развития */}
      {activeDevCardModal === DevCardType.YEAR_OF_PLENTY && (
        <YearOfPlentyModal
          onConfirm={handleYearOfPlentyConfirm}
          onCancel={() => setActiveDevCardModal(null)}
        />
      )}

      {activeDevCardModal === DevCardType.MONOPOLY && (
        <MonopolyModal
          onConfirm={handleMonopolyConfirm}
          onCancel={() => setActiveDevCardModal(null)}
        />
      )}

      {activeDevCardModal === DevCardType.ROAD_BUILDING && (
        <RoadBuildingModal
          onStart={handleRoadBuildingStart}
          onCancel={() => setActiveDevCardModal(null)}
        />
      )}
      {/* END_BLOCK_DEV_CARD_MODALS */}
    </div>
  );
}

/**
 * END_MODULE_game.page
 */
