/**
 * START_MODULE_mapGenerator
 *
 * MODULE_CONTRACT:
 * PURPOSE: Генерация игровой карты Catan (гексагоны, вершины, ребра)
 * SCOPE: Создание 19 гексагонов, 54 вершин, 72 ребер с правильными связями
 * KEYWORDS: map generation, hexagonal grid, graph structure
 * LINKS_TO_MODULE: types/game.types.ts, lib/constants/game.constants.ts
 */

import { Hex, Vertex, Edge, TerrainType } from '@/types/game.types';
import {
  TERRAIN_DISTRIBUTION,
  NUMBER_TOKENS,
  HEX_GRID_ROWS,
} from '@/lib/constants/game.constants';

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Сгенерировать полную игровую карту с гексагонами, вершинами и ребрами
 * INPUTS: None
 * OUTPUTS: { hexes: Hex[], vertices: Vertex[], edges: Edge[] } - полная карта
 * SIDE_EFFECTS: None (чистая функция, использует Math.random для shuffle)
 * KEYWORDS: map generation, hexagonal grid
 * LINKS: TechSpecification.md -> LOGIC_BLOCK_MAP_GENERATION
 */
export function generateMap(): { hexes: Hex[]; vertices: Vertex[]; edges: Edge[] } {
  console.log('[MapGenerator][generateMap][START]');

  // START_BLOCK_HEX_GENERATION
  // Описание: Создание базовых гексагонов с координатами

  const hexes = generateHexGrid();
  console.log('[MapGenerator][generateMap][HEX_GENERATION][SUCCESS]', {
    hexCount: hexes.length,
  });
  // END_BLOCK_HEX_GENERATION

  // START_BLOCK_TERRAIN_ASSIGNMENT
  // Описание: Назначение типов местности гексагонам

  assignTerrains(hexes);
  console.log('[MapGenerator][generateMap][TERRAIN_ASSIGNMENT][SUCCESS]');
  // END_BLOCK_TERRAIN_ASSIGNMENT

  // START_BLOCK_NUMBER_ASSIGNMENT
  // Описание: Назначение номеров токенов гексагонам

  assignNumbers(hexes);
  console.log('[MapGenerator][generateMap][NUMBER_ASSIGNMENT][SUCCESS]');
  // END_BLOCK_NUMBER_ASSIGNMENT

  // START_BLOCK_VERTEX_GENERATION
  // Описание: Создание вершин на основе гексагонов

  const vertices = generateVertices(hexes);
  console.log('[MapGenerator][generateMap][VERTEX_GENERATION][SUCCESS]', {
    vertexCount: vertices.length,
  });
  // END_BLOCK_VERTEX_GENERATION

  // START_BLOCK_EDGE_GENERATION
  // Описание: Создание ребер на основе вершин

  const edges = generateEdges(hexes, vertices);
  console.log('[MapGenerator][generateMap][EDGE_GENERATION][SUCCESS]', {
    edgeCount: edges.length,
  });
  // END_BLOCK_EDGE_GENERATION

  // START_BLOCK_NEIGHBOR_CALCULATION
  // Описание: Вычисление соседей для вершин

  calculateNeighbors(vertices, edges);
  console.log('[MapGenerator][generateMap][NEIGHBOR_CALCULATION][SUCCESS]');
  // END_BLOCK_NEIGHBOR_CALCULATION

  console.log('[MapGenerator][generateMap][SUCCESS]', {
    hexes: hexes.length,
    vertices: vertices.length,
    edges: edges.length,
  });

  return { hexes, vertices, edges };
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Создать сетку из 19 гексагонов в формате offset grid
 * INPUTS: None
 * OUTPUTS: Hex[] - массив гексагонов с координатами и пустыми полями
 * SIDE_EFFECTS: None
 * KEYWORDS: hexagonal grid, offset grid
 */
function generateHexGrid(): Hex[] {
  const hexes: Hex[] = [];
  let hexId = 0;

  // START_BLOCK_OFFSET_GRID_GENERATION
  // Описание: Создание offset grid (3-4-5-4-3 гексагонов в рядах)

  HEX_GRID_ROWS.forEach((hexCount, rowIndex) => {
    for (let colIndex = 0; colIndex < hexCount; colIndex++) {
      const hex: Hex = {
        id: `hex-${hexId}`,
        terrain: TerrainType.DESERT, // Временно, будет переназначено
        number: null,
        hasRobber: false,
        vertexIds: [],
        edgeIds: [],
      };

      hexes.push(hex);
      hexId++;
    }
  });
  // END_BLOCK_OFFSET_GRID_GENERATION

  return hexes;
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Назначить типы местности гексагонам случайным образом
 * INPUTS:
 *   - hexes: Hex[] - массив гексагонов
 * OUTPUTS: void (модифицирует массив in-place)
 * SIDE_EFFECTS: Модифицирует массив hexes, использует Math.random
 * KEYWORDS: terrain assignment, randomization
 */
function assignTerrains(hexes: Hex[]): void {
  // START_BLOCK_TERRAIN_DECK_CREATION
  // Описание: Создание колоды местностей на основе распределения

  const terrainDeck: TerrainType[] = [];

  TERRAIN_DISTRIBUTION.forEach(({ terrain, count }) => {
    for (let i = 0; i < count; i++) {
      terrainDeck.push(terrain);
    }
  });
  // END_BLOCK_TERRAIN_DECK_CREATION

  // START_BLOCK_SHUFFLE_AND_ASSIGN
  // Описание: Перемешивание и назначение местностей

  const shuffledTerrains = shuffleArray(terrainDeck);

  hexes.forEach((hex, index) => {
    hex.terrain = shuffledTerrains[index];
  });
  // END_BLOCK_SHUFFLE_AND_ASSIGN
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Назначить номера токенов гексагонам (исключая пустыню)
 * INPUTS:
 *   - hexes: Hex[] - массив гексагонов
 * OUTPUTS: void (модифицирует массив in-place)
 * SIDE_EFFECTS: Модифицирует массив hexes, использует Math.random
 * KEYWORDS: number tokens, randomization
 */
function assignNumbers(hexes: Hex[]): void {
  // START_BLOCK_NUMBER_TOKEN_SHUFFLE
  // Описание: Перемешивание номеров токенов

  const shuffledNumbers = shuffleArray([...NUMBER_TOKENS]);
  let numberIndex = 0;
  // END_BLOCK_NUMBER_TOKEN_SHUFFLE

  // START_BLOCK_NUMBER_ASSIGNMENT
  // Описание: Назначение номеров всем гексам кроме пустыни

  hexes.forEach((hex) => {
    if (hex.terrain === TerrainType.DESERT) {
      hex.number = null;
      hex.hasRobber = true; // Разбойник стартует на пустыне
    } else {
      hex.number = shuffledNumbers[numberIndex];
      numberIndex++;
    }
  });
  // END_BLOCK_NUMBER_ASSIGNMENT
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Создать вершины для всех гексагонов
 * INPUTS:
 *   - hexes: Hex[] - массив гексагонов
 * OUTPUTS: Vertex[] - массив вершин
 * SIDE_EFFECTS: None
 * KEYWORDS: vertices, graph structure
 */
function generateVertices(hexes: Hex[]): Vertex[] {
  const vertices: Vertex[] = [];
  const vertexMap = new Map<string, Vertex>();
  let vertexId = 0;

  // START_BLOCK_VERTEX_CREATION
  // Описание: Создание 6 вершин для каждого гексагона

  hexes.forEach((hex, hexIndex) => {
    const hexVertices: string[] = [];

    // Каждый гексагон имеет 6 вершин
    for (let i = 0; i < 6; i++) {
      // Вычисление "координаты" вершины для dedupe
      const vertexKey = `${hexIndex}-${i}`;

      // Проверка существующей вершины
      let vertex = vertexMap.get(vertexKey);

      if (!vertex) {
        vertex = {
          id: `vertex-${vertexId}`,
          hexIds: [hex.id],
          building: null,
          neighborVertexIds: [],
          neighborEdgeIds: [],
        };

        vertices.push(vertex);
        vertexMap.set(vertexKey, vertex);
        vertexId++;
      } else {
        // Добавить гекс к существующей вершине
        vertex.hexIds.push(hex.id);
      }

      hexVertices.push(vertex.id);
    }

    hex.vertexIds = hexVertices;
  });
  // END_BLOCK_VERTEX_CREATION

  return vertices;
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Создать ребра на основе вершин
 * INPUTS:
 *   - hexes: Hex[] - массив гексагонов
 *   - vertices: Vertex[] - массив вершин
 * OUTPUTS: Edge[] - массив ребер
 * SIDE_EFFECTS: Модифицирует hexes (добавляет edgeIds)
 * KEYWORDS: edges, graph structure
 */
function generateEdges(hexes: Hex[], vertices: Vertex[]): Edge[] {
  const edges: Edge[] = [];
  const edgeMap = new Map<string, Edge>();
  let edgeId = 0;

  // START_BLOCK_EDGE_CREATION
  // Описание: Создание ребер между соседними вершинами каждого гексагона

  hexes.forEach((hex) => {
    const hexEdges: string[] = [];

    // Каждый гексагон имеет 6 ребер (соединяющих соседние вершины)
    for (let i = 0; i < 6; i++) {
      const v1Id = hex.vertexIds[i];
      const v2Id = hex.vertexIds[(i + 1) % 6];

      // Создать уникальный ключ для ребра (сортировка для dedupe)
      const edgeKey = [v1Id, v2Id].sort().join('-');

      let edge = edgeMap.get(edgeKey);

      if (!edge) {
        edge = {
          id: `edge-${edgeId}`,
          vertexIds: [v1Id, v2Id],
          hexIds: [hex.id],
          road: null,
        };

        edges.push(edge);
        edgeMap.set(edgeKey, edge);
        edgeId++;
      } else {
        // Добавить гекс к существующему ребру
        edge.hexIds.push(hex.id);
      }

      hexEdges.push(edge.id);
    }

    hex.edgeIds = hexEdges;
  });
  // END_BLOCK_EDGE_CREATION

  return edges;
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Вычислить соседей для каждой вершины
 * INPUTS:
 *   - vertices: Vertex[] - массив вершин
 *   - edges: Edge[] - массив ребер
 * OUTPUTS: void (модифицирует vertices in-place)
 * SIDE_EFFECTS: Модифицирует массив vertices
 * KEYWORDS: neighbors, graph traversal
 */
function calculateNeighbors(vertices: Vertex[], edges: Edge[]): void {
  // START_BLOCK_NEIGHBOR_EDGES
  // Описание: Определение соседних ребер для каждой вершины

  vertices.forEach((vertex) => {
    const neighborEdges = edges.filter((edge) =>
      edge.vertexIds.includes(vertex.id)
    );

    vertex.neighborEdgeIds = neighborEdges.map((e) => e.id);
  });
  // END_BLOCK_NEIGHBOR_EDGES

  // START_BLOCK_NEIGHBOR_VERTICES
  // Описание: Определение соседних вершин через ребра

  vertices.forEach((vertex) => {
    const neighborVertexIds = new Set<string>();

    vertex.neighborEdgeIds.forEach((edgeId) => {
      const edge = edges.find((e) => e.id === edgeId);
      if (edge) {
        edge.vertexIds.forEach((vId) => {
          if (vId !== vertex.id) {
            neighborVertexIds.add(vId);
          }
        });
      }
    });

    vertex.neighborVertexIds = Array.from(neighborVertexIds);
  });
  // END_BLOCK_NEIGHBOR_VERTICES
}

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Перемешать массив случайным образом (Fisher-Yates shuffle)
 * INPUTS:
 *   - array: T[] - массив для перемешивания
 * OUTPUTS: T[] - перемешанный массив
 * SIDE_EFFECTS: None (создает новый массив)
 * KEYWORDS: shuffle, randomization, Fisher-Yates
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];

  // START_BLOCK_FISHER_YATES_SHUFFLE
  // Описание: Алгоритм Fisher-Yates для случайного перемешивания

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  // END_BLOCK_FISHER_YATES_SHUFFLE

  return result;
}

/**
 * END_MODULE_mapGenerator
 */
