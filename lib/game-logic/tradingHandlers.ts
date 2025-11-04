/**
 * START_MODULE_game_logic.trading_handlers
 *
 * MODULE_CONTRACT:
 * PURPOSE: Обработчики торговли (банк и игрок-игрок)
 * SCOPE: Функции для обмена ресурсами
 * KEYWORDS: trading, bank, player-to-player, resources
 * LINKS_TO_MODULE: types/game.types.ts, lib/constants/game.constants.ts
 */

import { GameState, ResourceType, PortType, TradeOffer } from '@/types/game.types';
import { GAME_CONSTANTS } from '@/lib/constants/game.constants';

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Получить доступные порты игрока
 * INPUTS:
 *   - playerId: string - ID игрока
 *   - gameState: GameState - состояние игры
 * OUTPUTS: PortType[] - массив доступных портов
 * SIDE_EFFECTS: None
 * KEYWORDS: ports, player, settlements
 */
export function getPlayerPorts(playerId: string, gameState: GameState): PortType[] {
  // START_BLOCK_FIND_PLAYER_SETTLEMENTS
  // Описание: Найти все вершины с поселениями игрока

  const playerVertices = gameState.vertices.filter(
    (v) => v.building !== null && v.building.playerId === playerId
  );
  // END_BLOCK_FIND_PLAYER_SETTLEMENTS

  // START_BLOCK_EXTRACT_PORTS
  // Описание: Извлечь уникальные порты из вершин

  const ports: PortType[] = [];
  playerVertices.forEach((vertex) => {
    if (vertex.port !== null && !ports.includes(vertex.port)) {
      ports.push(vertex.port);
    }
  });
  // END_BLOCK_EXTRACT_PORTS

  return ports;
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Получить торговый коэффициент для ресурса
 * INPUTS:
 *   - resourceType: ResourceType - тип ресурса
 *   - playerPorts: PortType[] - порты игрока
 * OUTPUTS: number - коэффициент обмена (4, 3, или 2)
 * SIDE_EFFECTS: None
 * KEYWORDS: trade ratio, ports
 */
export function getTradeRatio(
  resourceType: ResourceType,
  playerPorts: PortType[]
): number {
  // START_BLOCK_CHECK_RESOURCE_PORT
  // Описание: Проверить наличие специализированного порта (2:1)

  const resourcePortMap: Record<ResourceType, PortType> = {
    [ResourceType.WOOD]: PortType.WOOD,
    [ResourceType.BRICK]: PortType.BRICK,
    [ResourceType.SHEEP]: PortType.SHEEP,
    [ResourceType.WHEAT]: PortType.WHEAT,
    [ResourceType.ORE]: PortType.ORE,
  };

  if (playerPorts.includes(resourcePortMap[resourceType])) {
    return GAME_CONSTANTS.TRADE_RATIOS.RESOURCE_PORT; // 2:1
  }
  // END_BLOCK_CHECK_RESOURCE_PORT

  // START_BLOCK_CHECK_GENERIC_PORT
  // Описание: Проверить наличие универсального порта (3:1)

  if (playerPorts.includes(PortType.GENERIC)) {
    return GAME_CONSTANTS.TRADE_RATIOS.PORT; // 3:1
  }
  // END_BLOCK_CHECK_GENERIC_PORT

  // START_BLOCK_DEFAULT_RATIO
  // Описание: Стандартный коэффициент (4:1)

  return 4; // Без портов
  // END_BLOCK_DEFAULT_RATIO
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Обменять ресурсы с банком
 * INPUTS:
 *   - playerId: string - ID игрока
 *   - giving: ResourceType - отдаваемый ресурс
 *   - givingAmount: number - количество отдаваемого ресурса
 *   - receiving: ResourceType - получаемый ресурс
 *   - gameState: GameState - состояние игры
 * OUTPUTS: GameState - новое состояние игры
 * SIDE_EFFECTS: None (возвращает новое состояние)
 * KEYWORDS: bank trade, resources, exchange
 */
export function handleBankTrade(
  playerId: string,
  giving: ResourceType,
  givingAmount: number,
  receiving: ResourceType,
  gameState: GameState
): GameState {
  // START_BLOCK_FIND_PLAYER
  // Описание: Найти игрока и получить его порты

  const player = gameState.players.find((p) => p.id === playerId);
  if (!player) {
    console.error('[handleBankTrade] Player not found:', playerId);
    return gameState;
  }

  const playerPorts = getPlayerPorts(playerId, gameState);
  const tradeRatio = getTradeRatio(giving, playerPorts);
  // END_BLOCK_FIND_PLAYER

  // START_BLOCK_VALIDATE_TRADE
  // Описание: Проверить корректность обмена

  // Проверить что количество кратно коэффициенту
  if (givingAmount % tradeRatio !== 0) {
    console.error('[handleBankTrade] Invalid amount for trade ratio:', {
      givingAmount,
      tradeRatio,
    });
    return gameState;
  }

  const receivingAmount = givingAmount / tradeRatio;

  // Проверить что у игрока достаточно ресурсов
  if (player.resources[giving] < givingAmount) {
    console.error('[handleBankTrade] Not enough resources:', {
      has: player.resources[giving],
      needs: givingAmount,
    });
    return gameState;
  }
  // END_BLOCK_VALIDATE_TRADE

  // START_BLOCK_UPDATE_RESOURCES
  // Описание: Обновить ресурсы игрока

  const updatedPlayers = gameState.players.map((p) => {
    if (p.id !== playerId) return p;

    return {
      ...p,
      resources: {
        ...p.resources,
        [giving]: p.resources[giving] - givingAmount,
        [receiving]: p.resources[receiving] + receivingAmount,
      },
    };
  });
  // END_BLOCK_UPDATE_RESOURCES

  // START_BLOCK_RETURN_STATE
  // Описание: Вернуть обновленное состояние

  console.log('[handleBankTrade] Trade successful:', {
    player: player.name,
    gave: `${givingAmount}x ${giving}`,
    received: `${receivingAmount}x ${receiving}`,
    ratio: `${tradeRatio}:1`,
  });

  return {
    ...gameState,
    players: updatedPlayers,
  };
  // END_BLOCK_RETURN_STATE
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Создать предложение обмена между игроками
 * INPUTS:
 *   - playerId: string - ID игрока-инициатора
 *   - offering: Partial<Record<ResourceType, number>> - что предлагает
 *   - requesting: Partial<Record<ResourceType, number>> - что запрашивает
 *   - gameState: GameState - состояние игры
 * OUTPUTS: GameState - новое состояние с предложением обмена
 * SIDE_EFFECTS: None
 * KEYWORDS: player trade, trade offer
 */
export function handleCreateTradeOffer(
  playerId: string,
  offering: Partial<Record<ResourceType, number>>,
  requesting: Partial<Record<ResourceType, number>>,
  gameState: GameState
): GameState {
  // START_BLOCK_VALIDATE_RESOURCES
  // Описание: Проверить что у игрока есть предлагаемые ресурсы

  const player = gameState.players.find((p) => p.id === playerId);
  if (!player) return gameState;

  for (const [resource, amount] of Object.entries(offering)) {
    const resourceType = resource as ResourceType;
    if (player.resources[resourceType] < (amount || 0)) {
      console.error('[handleCreateTradeOffer] Not enough resources to offer');
      return gameState;
    }
  }
  // END_BLOCK_VALIDATE_RESOURCES

  // START_BLOCK_CREATE_OFFER
  // Описание: Создать предложение обмена

  const tradeOffer: TradeOffer = {
    playerId,
    offering,
    requesting,
  };

  console.log('[handleCreateTradeOffer] Trade offer created:', {
    from: player.name,
    offering,
    requesting,
  });

  return {
    ...gameState,
    currentTradeOffer: tradeOffer,
  };
  // END_BLOCK_CREATE_OFFER
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Принять предложение обмена
 * INPUTS:
 *   - acceptingPlayerId: string - ID игрока, принимающего обмен
 *   - gameState: GameState - состояние игры
 * OUTPUTS: GameState - новое состояние после обмена
 * SIDE_EFFECTS: None
 * KEYWORDS: accept trade, player exchange
 */
export function handleAcceptTrade(
  acceptingPlayerId: string,
  gameState: GameState
): GameState {
  // START_BLOCK_VALIDATE_TRADE_OFFER
  // Описание: Проверить наличие предложения

  if (!gameState.currentTradeOffer) {
    console.error('[handleAcceptTrade] No active trade offer');
    return gameState;
  }

  const offer = gameState.currentTradeOffer;
  const offeringPlayer = gameState.players.find((p) => p.id === offer.playerId);
  const acceptingPlayer = gameState.players.find((p) => p.id === acceptingPlayerId);

  if (!offeringPlayer || !acceptingPlayer) {
    console.error('[handleAcceptTrade] Player not found');
    return gameState;
  }

  // Проверить что принимающий - не предлагающий
  if (acceptingPlayerId === offer.playerId) {
    console.error('[handleAcceptTrade] Cannot accept own trade');
    return gameState;
  }
  // END_BLOCK_VALIDATE_TRADE_OFFER

  // START_BLOCK_VALIDATE_RESOURCES
  // Описание: Проверить наличие ресурсов у обоих игроков

  // Проверить ресурсы предлагающего игрока
  for (const [resource, amount] of Object.entries(offer.offering)) {
    const resourceType = resource as ResourceType;
    if (offeringPlayer.resources[resourceType] < (amount || 0)) {
      console.error('[handleAcceptTrade] Offering player lacks resources');
      return gameState;
    }
  }

  // Проверить ресурсы принимающего игрока
  for (const [resource, amount] of Object.entries(offer.requesting)) {
    const resourceType = resource as ResourceType;
    if (acceptingPlayer.resources[resourceType] < (amount || 0)) {
      console.error('[handleAcceptTrade] Accepting player lacks resources');
      return gameState;
    }
  }
  // END_BLOCK_VALIDATE_RESOURCES

  // START_BLOCK_EXECUTE_TRADE
  // Описание: Выполнить обмен ресурсами

  const updatedPlayers = gameState.players.map((p) => {
    if (p.id === offer.playerId) {
      // Предлагающий игрок: отдает offering, получает requesting
      const newResources = { ...p.resources };

      Object.entries(offer.offering).forEach(([resource, amount]) => {
        newResources[resource as ResourceType] -= amount || 0;
      });

      Object.entries(offer.requesting).forEach(([resource, amount]) => {
        newResources[resource as ResourceType] += amount || 0;
      });

      return { ...p, resources: newResources };
    } else if (p.id === acceptingPlayerId) {
      // Принимающий игрок: получает offering, отдает requesting
      const newResources = { ...p.resources };

      Object.entries(offer.offering).forEach(([resource, amount]) => {
        newResources[resource as ResourceType] += amount || 0;
      });

      Object.entries(offer.requesting).forEach(([resource, amount]) => {
        newResources[resource as ResourceType] -= amount || 0;
      });

      return { ...p, resources: newResources };
    }

    return p;
  });
  // END_BLOCK_EXECUTE_TRADE

  // START_BLOCK_CLEAR_OFFER
  // Описание: Очистить предложение обмена

  console.log('[handleAcceptTrade] Trade completed:', {
    offering: offeringPlayer.name,
    accepting: acceptingPlayer.name,
  });

  return {
    ...gameState,
    players: updatedPlayers,
    currentTradeOffer: undefined,
  };
  // END_BLOCK_CLEAR_OFFER
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Отклонить/отменить предложение обмена
 * INPUTS:
 *   - gameState: GameState - состояние игры
 * OUTPUTS: GameState - новое состояние без предложения
 * SIDE_EFFECTS: None
 * KEYWORDS: decline trade, cancel trade
 */
export function handleDeclineTrade(gameState: GameState): GameState {
  console.log('[handleDeclineTrade] Trade offer declined/cancelled');

  return {
    ...gameState,
    currentTradeOffer: undefined,
  };
}

/**
 * END_MODULE_game_logic.trading_handlers
 */
