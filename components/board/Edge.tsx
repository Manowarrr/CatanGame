/**
 * START_MODULE_board.edge
 *
 * MODULE_CONTRACT:
 * PURPOSE: Компонент ребра (место для дороги)
 * SCOPE: Отрисовка ребра и дороги игрока
 * KEYWORDS: React, SVG, edge, road
 * LINKS_TO_MODULE: types/game.types.ts
 */

'use client';

import React from 'react';
import { Edge as EdgeType } from '@/types/game.types';

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Отрисовка ребра между двумя вершинами
 * INPUTS:
 *   - edge: EdgeType - данные ребра
 *   - x1: number - X координата первой вершины
 *   - y1: number - Y координата первой вершины
 *   - x2: number - X координата второй вершины
 *   - y2: number - Y координата второй вершины
 *   - onClick: (edgeId: string) => void (optional) - обработчик клика
 *   - highlight: boolean (optional) - подсветить ли ребро
 * OUTPUTS: React.ReactElement - SVG линия
 * SIDE_EFFECTS: None
 * KEYWORDS: edge, road, line
 */

interface EdgeProps {
  edge: EdgeType;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  onClick?: (edgeId: string) => void;
  highlight?: boolean;
}

export function Edge({ edge, x1, y1, x2, y2, onClick, highlight = false }: EdgeProps) {
  // START_BLOCK_CLICK_HANDLER
  // Описание: Обработка клика на ребро

  const handleClick = () => {
    if (onClick) {
      onClick(edge.id);
    }
  };
  // END_BLOCK_CLICK_HANDLER

  // START_BLOCK_ROAD_RENDER
  // Описание: Определение цвета и стиля дороги

  const hasRoad = edge.road !== null;
  const roadColor = edge.road?.playerId || '#888'; // Цвет будет передаваться из Board
  const strokeWidth = hasRoad ? 8 : 4;
  const opacity = hasRoad ? 1 : (highlight ? 0.8 : 0.3);
  // END_BLOCK_ROAD_RENDER

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={hasRoad ? roadColor : '#ccc'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      opacity={opacity}
      onClick={handleClick}
      className={`edge ${hasRoad ? 'has-road' : ''} ${highlight ? 'highlighted' : ''}`}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    />
  );
}

/**
 * END_MODULE_board.edge
 */
