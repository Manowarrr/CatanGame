/**
 * START_MODULE_ui.dev_card_panel
 *
 * MODULE_CONTRACT:
 * PURPOSE: Панель для отображения и игры карт развития
 * SCOPE: UI компонент для карт развития игрока
 * KEYWORDS: React, development cards, UI
 * LINKS_TO_MODULE: types/game.types.ts
 */

'use client';

import React from 'react';
import { DevCardType, Player } from '@/types/game.types';
import { Button } from './Button';

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Панель карт развития с возможностью игры
 * INPUTS:
 *   - player: Player - игрок
 *   - onPlayCard: (cardType: DevCardType) => void - callback для игры карты
 *   - canPlayCards: boolean - можно ли играть карты
 * OUTPUTS: React.ReactElement - панель карт
 * SIDE_EFFECTS: None
 * KEYWORDS: development cards, panel, UI
 */

interface DevCardPanelProps {
  player: Player;
  onPlayCard: (cardType: DevCardType) => void;
  canPlayCards: boolean;
}

export function DevCardPanel({ player, onPlayCard, canPlayCards }: DevCardPanelProps) {
  // START_BLOCK_CARD_COUNTS
  // Описание: Подсчет количества каждого типа карт

  const cardCounts: Record<DevCardType, number> = {
    [DevCardType.KNIGHT]: 0,
    [DevCardType.ROAD_BUILDING]: 0,
    [DevCardType.YEAR_OF_PLENTY]: 0,
    [DevCardType.MONOPOLY]: 0,
    [DevCardType.VICTORY_POINT]: 0,
  };

  player.devCards.forEach((card) => {
    cardCounts[card]++;
  });
  // END_BLOCK_CARD_COUNTS

  // START_BLOCK_CARD_INFO
  // Описание: Информация о каждой карте

  const cardInfo: Record<
    DevCardType,
    { name: string; description: string; color: string }
  > = {
    [DevCardType.KNIGHT]: {
      name: 'Knight',
      description: 'Move robber and steal',
      color: 'bg-red-700',
    },
    [DevCardType.ROAD_BUILDING]: {
      name: 'Road Building',
      description: 'Build 2 free roads',
      color: 'bg-orange-700',
    },
    [DevCardType.YEAR_OF_PLENTY]: {
      name: 'Year of Plenty',
      description: 'Take 2 resources',
      color: 'bg-green-700',
    },
    [DevCardType.MONOPOLY]: {
      name: 'Monopoly',
      description: 'Take all of 1 resource',
      color: 'bg-purple-700',
    },
    [DevCardType.VICTORY_POINT]: {
      name: 'Victory Point',
      description: '+1 Victory Point',
      color: 'bg-yellow-700',
    },
  };
  // END_BLOCK_CARD_INFO

  const totalCards = player.devCards.length;

  if (totalCards === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-2 text-white">Development Cards</h2>
        <p className="text-gray-400">No cards</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-2 text-white">
        Development Cards ({totalCards})
      </h2>

      <div className="space-y-2">
        {Object.entries(cardCounts).map(([cardType, count]) => {
          if (count === 0) return null;

          const card = cardInfo[cardType as DevCardType];
          const isVictoryPoint = cardType === DevCardType.VICTORY_POINT;

          return (
            <div
              key={cardType}
              className="bg-gray-700 rounded p-3 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${card.color}`} />
                  <span className="text-white font-bold">{card.name}</span>
                  <span className="text-gray-400">({count})</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{card.description}</p>
              </div>

              {!isVictoryPoint && (
                <Button
                  onClick={() => onPlayCard(cardType as DevCardType)}
                  disabled={!canPlayCards}
                  className="ml-2"
                >
                  Play
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-700">
        <p className="text-sm text-gray-400">
          Knights played: {player.knightsPlayed}
          {player.hasLargestArmy && ' (Largest Army +2VP)'}
        </p>
      </div>
    </div>
  );
}

/**
 * END_MODULE_ui.dev_card_panel
 */
