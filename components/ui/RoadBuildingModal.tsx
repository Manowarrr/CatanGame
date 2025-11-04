/**
 * START_MODULE_ui.road_building_modal
 *
 * MODULE_CONTRACT:
 * PURPOSE: Модальное окно для карты Road Building (выбор до 2 рёбер)
 * SCOPE: UI компонент для выбора рёбер для дорог
 * KEYWORDS: React, modal, road building, edges
 * LINKS_TO_MODULE: types/game.types.ts
 */

'use client';

import React from 'react';
import { Button } from './Button';

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Модальное окно с инструкциями для Road Building
 * INPUTS:
 *   - onStart: () => void - callback для начала выбора рёбер
 *   - onCancel: () => void - callback для отмены
 * OUTPUTS: React.ReactElement - модальное окно
 * SIDE_EFFECTS: None
 * KEYWORDS: modal, road building, instructions
 */

interface RoadBuildingModalProps {
  onStart: () => void;
  onCancel: () => void;
}

export function RoadBuildingModal({ onStart, onCancel }: RoadBuildingModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border-2 border-orange-500">
        {/* START_BLOCK_HEADER */}
        <h2 className="text-2xl font-bold text-white mb-2">Road Building</h2>
        <p className="text-gray-300 mb-4">
          Build up to 2 free roads
        </p>
        {/* END_BLOCK_HEADER */}

        {/* START_BLOCK_INSTRUCTIONS */}
        <div className="mb-6 bg-gray-700 rounded p-4">
          <h3 className="text-white font-bold mb-2">Instructions:</h3>
          <ul className="text-gray-300 space-y-1 text-sm list-disc list-inside">
            <li>Click on highlighted edges to build roads</li>
            <li>You can build up to 2 roads</li>
            <li>Roads must be connected to your existing roads or settlements</li>
            <li>Click "Confirm" when done (or after 2 roads)</li>
          </ul>
        </div>
        {/* END_BLOCK_INSTRUCTIONS */}

        {/* START_BLOCK_ACTIONS */}
        <div className="flex gap-2">
          <Button
            onClick={onStart}
            className="flex-1 bg-orange-600 hover:bg-orange-700"
          >
            Start Building
          </Button>
          <Button onClick={onCancel} className="flex-1 bg-gray-600 hover:bg-gray-700">
            Cancel
          </Button>
        </div>
        {/* END_BLOCK_ACTIONS */}
      </div>
    </div>
  );
}

/**
 * END_MODULE_ui.road_building_modal
 */
