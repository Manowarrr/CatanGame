/**
 * START_MODULE_board.vertex
 *
 * MODULE_CONTRACT:
 * PURPOSE: Компонент вершины (место для поселения/города)
 * SCOPE: Отрисовка вершины, отображение построек игроков
 * KEYWORDS: React, SVG, vertex, settlement, city
 * LINKS_TO_MODULE: types/game.types.ts
 */

'use client';

import React from 'react';
import { Vertex as VertexType, BuildingType } from '@/types/game.types';

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Отрисовка вершины с возможной постройкой
 * INPUTS:
 *   - vertex: VertexType - данные вершины
 *   - onClick: (vertexId: string) => void (optional) - обработчик клика
 *   - highlight: boolean (optional) - подсветить ли вершину
 * OUTPUTS: React.ReactElement - SVG элемент вершины
 * SIDE_EFFECTS: None
 * KEYWORDS: vertex, settlement, city, building
 */

interface VertexProps {
  vertex: VertexType;
  onClick?: (vertexId: string) => void;
  highlight?: boolean;
}

export function Vertex({ vertex, onClick, highlight = false }: VertexProps) {
  // START_BLOCK_CLICK_HANDLER
  // Описание: Обработка клика на вершину

  const handleClick = () => {
    if (onClick) {
      onClick(vertex.id);
    }
  };
  // END_BLOCK_CLICK_HANDLER

  // START_BLOCK_BUILDING_RENDER
  // Описание: Рендеринг постройки в зависимости от типа

  if (vertex.building) {
    const playerColor = vertex.building.playerId; // Цвет будет передаваться из Board

    if (vertex.building.type === BuildingType.SETTLEMENT) {
      // Поселение - домик (треугольник на квадрате)
      return (
        <g
          onClick={handleClick}
          className={`vertex has-settlement ${highlight ? 'highlighted' : ''}`}
          style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
          {/* Основание домика */}
          <rect
            x="-8"
            y="-4"
            width="16"
            height="12"
            fill={playerColor}
            stroke="#333"
            strokeWidth="2"
          />
          {/* Крыша домика */}
          <polygon
            points="0,-10 -10,-4 10,-4"
            fill={playerColor}
            stroke="#333"
            strokeWidth="2"
          />
        </g>
      );
    } else if (vertex.building.type === BuildingType.CITY) {
      // Город - большой квадрат с башнями
      return (
        <g
          onClick={handleClick}
          className={`vertex has-city ${highlight ? 'highlighted' : ''}`}
          style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
          {/* Основное здание */}
          <rect
            x="-12"
            y="-12"
            width="24"
            height="24"
            fill={playerColor}
            stroke="#333"
            strokeWidth="2"
          />
          {/* Башня */}
          <rect
            x="4"
            y="-16"
            width="8"
            height="8"
            fill={playerColor}
            stroke="#333"
            strokeWidth="2"
          />
        </g>
      );
    }
  }
  // END_BLOCK_BUILDING_RENDER

  // START_BLOCK_EMPTY_VERTEX_RENDER
  // Описание: Рендеринг пустой вершины

  return (
    <g
      onClick={handleClick}
      className={`vertex ${highlight ? 'highlighted' : ''}`}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <circle
        cx="0"
        cy="0"
        r="8"
        fill="#ccc"
        stroke="#333"
        strokeWidth="2"
        opacity={highlight ? 1 : 0.6}
      />
    </g>
  );
  // END_BLOCK_EMPTY_VERTEX_RENDER
}

/**
 * END_MODULE_board.vertex
 */
