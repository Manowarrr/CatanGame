/**
 * START_MODULE_ui.monopoly_modal
 *
 * MODULE_CONTRACT:
 * PURPOSE: Модальное окно для карты Monopoly (выбор типа ресурса)
 * SCOPE: UI компонент для выбора ресурса
 * KEYWORDS: React, modal, monopoly, resource
 * LINKS_TO_MODULE: types/game.types.ts
 */

'use client';

import React, { useState } from 'react';
import { ResourceType } from '@/types/game.types';
import { Button } from './Button';

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Модальное окно для выбора ресурса для монополии
 * INPUTS:
 *   - onConfirm: (resource: ResourceType) => void - callback для подтверждения
 *   - onCancel: () => void - callback для отмены
 * OUTPUTS: React.ReactElement - модальное окно
 * SIDE_EFFECTS: None
 * KEYWORDS: modal, monopoly, resource
 */

interface MonopolyModalProps {
  onConfirm: (resource: ResourceType) => void;
  onCancel: () => void;
}

export function MonopolyModal({ onConfirm, onCancel }: MonopolyModalProps) {
  // START_BLOCK_STATE
  // Описание: Состояние выбранного ресурса

  const [selectedResource, setSelectedResource] = useState<ResourceType | null>(null);
  // END_BLOCK_STATE

  const resourceOptions: ResourceType[] = [
    ResourceType.WOOD,
    ResourceType.BRICK,
    ResourceType.SHEEP,
    ResourceType.WHEAT,
    ResourceType.ORE,
  ];

  const resourceColors: Record<ResourceType, string> = {
    [ResourceType.WOOD]: 'bg-green-700',
    [ResourceType.BRICK]: 'bg-red-700',
    [ResourceType.SHEEP]: 'bg-lime-600',
    [ResourceType.WHEAT]: 'bg-yellow-600',
    [ResourceType.ORE]: 'bg-gray-600',
  };

  const handleConfirm = () => {
    if (selectedResource) {
      onConfirm(selectedResource);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border-2 border-purple-500">
        {/* START_BLOCK_HEADER */}
        <h2 className="text-2xl font-bold text-white mb-2">Monopoly</h2>
        <p className="text-gray-300 mb-4">
          Choose a resource type. All other players must give you all their cards of that
          type!
        </p>
        {selectedResource && (
          <p className="text-purple-400 mb-4">
            Selected: <span className="font-bold capitalize">{selectedResource.toLowerCase()}</span>
          </p>
        )}
        {/* END_BLOCK_HEADER */}

        {/* START_BLOCK_RESOURCE_OPTIONS */}
        <div className="space-y-2 mb-6">
          <h3 className="text-white font-bold">Choose Resource:</h3>
          <div className="grid grid-cols-2 gap-2">
            {resourceOptions.map((resource) => (
              <button
                key={resource}
                onClick={() => setSelectedResource(resource)}
                className={`${resourceColors[resource]} ${
                  selectedResource === resource ? 'ring-4 ring-white' : ''
                } hover:opacity-80 text-white font-bold py-3 px-4 rounded capitalize`}
              >
                {resource.toLowerCase()}
              </button>
            ))}
          </div>
        </div>
        {/* END_BLOCK_RESOURCE_OPTIONS */}

        {/* START_BLOCK_ACTIONS */}
        <div className="flex gap-2">
          <Button
            onClick={handleConfirm}
            disabled={!selectedResource}
            className="flex-1"
          >
            Confirm
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
 * END_MODULE_ui.monopoly_modal
 */
