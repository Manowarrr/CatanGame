/**
 * START_MODULE_ui.playerPanel
 *
 * MODULE_CONTRACT:
 * PURPOSE: Панель отображения информации об игроке
 * SCOPE: Показ ресурсов, очков победы, карт развития, badges
 * KEYWORDS: React, player info, resources, victory points
 * LINKS_TO_MODULE: types/game.types.ts
 */

'use client';

import React from 'react';
import { Player, ResourceType } from '@/types/game.types';

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Отображение информации об игроке
 * INPUTS:
 *   - player: Player - данные игрока
 *   - isCurrentPlayer: boolean - является ли игрок текущим
 * OUTPUTS: React.ReactElement - панель игрока
 * SIDE_EFFECTS: None
 * KEYWORDS: player panel, resources, score
 */

interface PlayerPanelProps {
  player: Player;
  isCurrentPlayer: boolean;
}

export function PlayerPanel({ player, isCurrentPlayer }: PlayerPanelProps) {
  // START_BLOCK_RESOURCE_ICONS
  // Описание: Маппинг типов ресурсов на эмодзи для отображения

  const resourceIcons: Record<ResourceType, string> = {
    [ResourceType.WOOD]: '🌲',
    [ResourceType.BRICK]: '🧱',
    [ResourceType.SHEEP]: '🐑',
    [ResourceType.WHEAT]: '🌾',
    [ResourceType.ORE]: '⛏️',
  };
  // END_BLOCK_RESOURCE_ICONS

  // START_BLOCK_TOTAL_RESOURCES
  // Описание: Подсчет общего количества ресурсов

  const totalResources = Object.values(player.resources).reduce(
    (sum, count) => sum + count,
    0
  );
  // END_BLOCK_TOTAL_RESOURCES

  return (
    <div
      className={`card ${isCurrentPlayer ? 'ring-4 ring-blue-500' : ''}`}
      style={{ borderLeft: `4px solid ${player.color}` }}
    >
      {/* START_BLOCK_PLAYER_HEADER */}
      {/* Описание: Заголовок с именем и статусом игрока */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold" style={{ color: player.color }}>
          {player.name}
          {isCurrentPlayer && ' (Your Turn)'}
        </h3>
        <div className="text-2xl font-bold">
          {player.victoryPoints} VP
        </div>
      </div>
      {/* END_BLOCK_PLAYER_HEADER */}

      {/* START_BLOCK_RESOURCES_DISPLAY */}
      {/* Описание: Отображение ресурсов игрока */}
      <div className="mb-3">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Resources ({totalResources}):
        </div>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(player.resources).map(([resource, count]) => (
            <div
              key={resource}
              className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
            >
              <span>{resourceIcons[resource as ResourceType]}</span>
              <span className="text-sm font-semibold">{count}</span>
            </div>
          ))}
        </div>
      </div>
      {/* END_BLOCK_RESOURCES_DISPLAY */}

      {/* START_BLOCK_BUILDINGS_DISPLAY */}
      {/* Описание: Отображение оставшихся построек */}
      <div className="mb-3">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Pieces left:
        </div>
        <div className="flex gap-3 text-sm">
          <span>🏠 {player.settlements}</span>
          <span>🏛️ {player.cities}</span>
          <span>🛣️ {player.roads}</span>
        </div>
      </div>
      {/* END_BLOCK_BUILDINGS_DISPLAY */}

      {/* START_BLOCK_DEV_CARDS_DISPLAY */}
      {/* Описание: Отображение карт развития */}
      <div className="mb-3">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Development Cards: {player.devCards.length}
        </div>
        {player.knightsPlayed > 0 && (
          <div className="text-sm">
            ⚔️ Knights played: {player.knightsPlayed}
          </div>
        )}
      </div>
      {/* END_BLOCK_DEV_CARDS_DISPLAY */}

      {/* START_BLOCK_BADGES_DISPLAY */}
      {/* Описание: Отображение достижений (badges) */}
      {(player.hasLongestRoad || player.hasLargestArmy) && (
        <div className="flex gap-2">
          {player.hasLongestRoad && (
            <div className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded text-sm">
              🛣️ Longest Road (+2 VP)
            </div>
          )}
          {player.hasLargestArmy && (
            <div className="bg-red-100 dark:bg-red-900 px-2 py-1 rounded text-sm">
              ⚔️ Largest Army (+2 VP)
            </div>
          )}
        </div>
      )}
      {/* END_BLOCK_BADGES_DISPLAY */}
    </div>
  );
}

/**
 * END_MODULE_ui.playerPanel
 */
