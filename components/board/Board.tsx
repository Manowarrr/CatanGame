/**
 * START_MODULE_board.main
 *
 * MODULE_CONTRACT:
 * PURPOSE: Главный компонент игрового поля, компонует гексагоны, вершины и ребра
 * SCOPE: SVG canvas с offset grid layout для гексагонов
 * KEYWORDS: React, SVG, game board, hexagonal grid
 * LINKS_TO_MODULE: types/game.types.ts, components/board/Hex, components/board/Vertex, components/board/Edge
 */

'use client';

import { useMemo } from 'react';
import { GameState } from '@/types/game.types';
import { Hex } from './Hex';
import { Vertex } from './Vertex';
import { Edge } from './Edge';
import { HEX_GRID_ROWS, PLAYER_COLORS } from '@/lib/constants/game.constants';

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Отрисовка игрового поля с гексагонами, вершинами и ребрами
 * INPUTS:
 *   - gameState: GameState - текущее состояние игры
 *   - onHexClick: (hexId: string) => void (optional) - обработчик клика на гексагон
 *   - onVertexClick: (vertexId: string) => void (optional) - обработчик клика на вершину
 *   - onEdgeClick: (edgeId: string) => void (optional) - обработчик клика на ребро
 *   - highlightedVertices: string[] (optional) - ID подсвеченных вершин
 *   - highlightedEdges: string[] (optional) - ID подсвеченных ребер
 *   - highlightedHexes: string[] (optional) - ID подсвеченных гексагонов
 * OUTPUTS: React.ReactElement - SVG игровое поле
 * SIDE_EFFECTS: None
 * KEYWORDS: game board, SVG, rendering
 */

interface BoardProps {
  gameState: GameState;
  onHexClick?: (hexId: string) => void;
  onVertexClick?: (vertexId: string) => void;
  onEdgeClick?: (edgeId: string) => void;
  highlightedVertices?: string[];
  highlightedEdges?: string[];
  highlightedHexes?: string[];
}

export function Board({
  gameState,
  onHexClick,
  onVertexClick,
  onEdgeClick,
  highlightedVertices = [],
  highlightedEdges = [],
  highlightedHexes = [],
}: BoardProps) {
  // START_BLOCK_HEX_POSITIONS_CALCULATION
  // Описание: Вычисление позиций гексагонов на основе offset grid

  const hexPositions = useMemo(() => {
    const positions: Array<{ hexId: string; x: number; y: number }> = [];
    let hexIndex = 0;

    const hexWidth = 138; // 2 * 69 (ширина гексагона)
    const hexHeight = 160; // Высота гексагона
    const maxHexCount = Math.max(...HEX_GRID_ROWS); // 5 - максимальное количество гексов в ряду

    HEX_GRID_ROWS.forEach((hexCount, rowIndex) => {
      // Центрирование ряда относительно самого длинного ряда
      const centeringOffset = ((maxHexCount - hexCount) * hexWidth) / 2;

      // Вертикальная позиция с учетом stagger
      const rowY = rowIndex * hexHeight * 0.75;

      for (let colIndex = 0; colIndex < hexCount; colIndex++) {
        const x = colIndex * hexWidth + centeringOffset;
        const y = rowY;

        positions.push({
          hexId: `hex-${hexIndex}`,
          x,
          y,
        });
        hexIndex++;
      }
    });

    return positions;
  }, []);
  // END_BLOCK_HEX_POSITIONS_CALCULATION

  // START_BLOCK_VERTEX_POSITIONS_CALCULATION
  // Описание: Вычисление позиций вершин для каждого гексагона

  const vertexPositions = useMemo(() => {
    const positions = new Map<string, { x: number; y: number }>();

    hexPositions.forEach(({ hexId, x, y }) => {
      const hex = gameState.hexes.find((h) => h.id === hexId);
      if (!hex) return;

      // 6 вершин гексагона (начиная с верхней, по часовой стрелке)
      const angles = [0, 60, 120, 180, 240, 300];
      const radius = 80;

      hex.vertexIds.forEach((vertexId, index) => {
        if (!positions.has(vertexId)) {
          const angle = (angles[index] - 90) * (Math.PI / 180);
          const vx = x + radius * Math.cos(angle);
          const vy = y + radius * Math.sin(angle);
          positions.set(vertexId, { x: vx, y: vy });
        }
      });
    });

    return positions;
  }, [hexPositions, gameState.hexes]);
  // END_BLOCK_VERTEX_POSITIONS_CALCULATION

  // START_BLOCK_PLAYER_COLOR_MAP
  // Описание: Маппинг ID игрока на цвет

  const playerColorMap = useMemo(() => {
    const map = new Map<string, string>();
    gameState.players.forEach((player, index) => {
      map.set(player.id, player.color || PLAYER_COLORS[index]);
    });
    return map;
  }, [gameState.players]);
  // END_BLOCK_PLAYER_COLOR_MAP

  return (
    <div className="flex items-center justify-center p-8">
      <svg
        width="800"
        height="700"
        viewBox="0 0 800 700"
        className="border border-gray-600"
        style={{ maxHeight: '80vh', maxWidth: '100%' }}
      >
        {/* START_BLOCK_HEX_RENDERING */}
        {/* Описание: Рендеринг всех гексагонов */}
        <g id="hexes">
          {hexPositions.map(({ hexId, x, y }) => {
            const hex = gameState.hexes.find((h) => h.id === hexId);
            if (!hex) return null;

            const isHighlighted = highlightedHexes.includes(hexId);
            const hasRobber = hex.hasRobber;

            return (
              <g key={hexId} transform={`translate(${x + 100}, ${y + 100})`}>
                <Hex
                  hex={hex}
                  onClick={onHexClick}
                  highlight={isHighlighted || (onHexClick && !hasRobber)}
                />
              </g>
            );
          })}
        </g>
        {/* END_BLOCK_HEX_RENDERING */}

        {/* START_BLOCK_EDGE_RENDERING */}
        {/* Описание: Рендеринг всех ребер */}
        <g id="edges">
          {gameState.edges.map((edge) => {
            const [v1Id, v2Id] = edge.vertexIds;
            const v1Pos = vertexPositions.get(v1Id);
            const v2Pos = vertexPositions.get(v2Id);

            if (!v1Pos || !v2Pos) return null;

            const playerColor = edge.road
              ? playerColorMap.get(edge.road.playerId) || '#888'
              : '#ccc';

            return (
              <Edge
                key={edge.id}
                edge={{ ...edge, road: edge.road ? { playerId: playerColor } : null }}
                x1={v1Pos.x + 100}
                y1={v1Pos.y + 100}
                x2={v2Pos.x + 100}
                y2={v2Pos.y + 100}
                onClick={onEdgeClick}
                highlight={highlightedEdges.includes(edge.id)}
              />
            );
          })}
        </g>
        {/* END_BLOCK_EDGE_RENDERING */}

        {/* START_BLOCK_VERTEX_RENDERING */}
        {/* Описание: Рендеринг всех вершин */}
        <g id="vertices">
          {gameState.vertices.map((vertex) => {
            const pos = vertexPositions.get(vertex.id);
            if (!pos) return null;

            const playerColor = vertex.building
              ? playerColorMap.get(vertex.building.playerId) || '#888'
              : '#ccc';

            return (
              <g key={vertex.id} transform={`translate(${pos.x + 100}, ${pos.y + 100})`}>
                <Vertex
                  vertex={{
                    ...vertex,
                    building: vertex.building
                      ? { ...vertex.building, playerId: playerColor }
                      : null,
                  }}
                  onClick={onVertexClick}
                  highlight={highlightedVertices.includes(vertex.id)}
                />
              </g>
            );
          })}
        </g>
        {/* END_BLOCK_VERTEX_RENDERING */}
      </svg>
    </div>
  );
}

/**
 * END_MODULE_board.main
 */
