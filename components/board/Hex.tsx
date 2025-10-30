/**
 * START_MODULE_board.hex
 *
 * MODULE_CONTRACT:
 * PURPOSE: Компонент гексагона игрового поля
 * SCOPE: Отрисовка гексагона, отображение местности, номера токена, разбойника
 * KEYWORDS: React, SVG, hexagon, game board
 * LINKS_TO_MODULE: types/game.types.ts
 */

'use client';

import React from 'react';
import { Hex as HexType, TerrainType } from '@/types/game.types';

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Отрисовка одного гексагона на игровом поле
 * INPUTS:
 *   - hex: HexType - данные гексагона
 *   - onClick: (hexId: string) => void (optional) - обработчик клика
 *   - highlight: boolean (optional) - подсветить ли гексагон
 * OUTPUTS: React.ReactElement - SVG элемент гексагона
 * SIDE_EFFECTS: None
 * KEYWORDS: hexagon, SVG, terrain
 */

interface HexProps {
  hex: HexType;
  onClick?: (hexId: string) => void;
  highlight?: boolean;
}

export function Hex({ hex, onClick, highlight = false }: HexProps) {
  // START_BLOCK_COLOR_CALCULATION
  // Описание: Определение цвета гексагона на основе типа местности

  const terrainColors: Record<TerrainType, string> = {
    [TerrainType.FOREST]: '#8B4513',
    [TerrainType.HILLS]: '#CD5C5C',
    [TerrainType.PASTURE]: '#90EE90',
    [TerrainType.FIELDS]: '#FFD700',
    [TerrainType.MOUNTAINS]: '#708090',
    [TerrainType.DESERT]: '#F4A460',
  };

  const fillColor = terrainColors[hex.terrain];
  // END_BLOCK_COLOR_CALCULATION

  // START_BLOCK_CLICK_HANDLER
  // Описание: Обработка клика на гексагон

  const handleClick = () => {
    if (onClick) {
      onClick(hex.id);
    }
  };
  // END_BLOCK_CLICK_HANDLER

  return (
    <g
      onClick={handleClick}
      className={`hex ${highlight ? 'highlighted' : ''}`}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Polygon - тело гексагона */}
      <polygon
        points="0,-80 69,-40 69,40 0,80 -69,40 -69,-40"
        fill={fillColor}
        stroke="#333"
        strokeWidth="2"
      />

      {/* Номер токена (если не пустыня) */}
      {hex.number !== null && (
        <text
          x="0"
          y="5"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="32"
          fontWeight="bold"
          fill="#000"
        >
          {hex.number}
        </text>
      )}

      {/* Иконка разбойника */}
      {hex.hasRobber && (
        <circle cx="0" cy="-30" r="15" fill="#000" stroke="#fff" strokeWidth="2" />
      )}
    </g>
  );
}

/**
 * END_MODULE_board.hex
 */
