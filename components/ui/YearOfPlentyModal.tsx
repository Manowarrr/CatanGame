/**
 * START_MODULE_ui.year_of_plenty_modal
 *
 * MODULE_CONTRACT:
 * PURPOSE: Модальное окно для карты Year of Plenty (выбор 2 ресурсов)
 * SCOPE: UI компонент для выбора ресурсов
 * KEYWORDS: React, modal, year of plenty, resources
 * LINKS_TO_MODULE: types/game.types.ts
 */

'use client';

import React, { useState } from 'react';
import { ResourceType } from '@/types/game.types';
import { Button } from './Button';

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Модальное окно для выбора 2 ресурсов
 * INPUTS:
 *   - onConfirm: (resources: ResourceType[]) => void - callback для подтверждения
 *   - onCancel: () => void - callback для отмены
 * OUTPUTS: React.ReactElement - модальное окно
 * SIDE_EFFECTS: None
 * KEYWORDS: modal, year of plenty, resources
 */

interface YearOfPlentyModalProps {
  onConfirm: (resources: ResourceType[]) => void;
  onCancel: () => void;
}

export function YearOfPlentyModal({ onConfirm, onCancel }: YearOfPlentyModalProps) {
  // START_BLOCK_STATE
  // Описание: Состояние выбранных ресурсов

  const [selectedResources, setSelectedResources] = useState<ResourceType[]>([]);
  // END_BLOCK_STATE

  // START_BLOCK_HANDLERS
  // Описание: Обработчики выбора ресурсов

  const handleResourceClick = (resource: ResourceType) => {
    if (selectedResources.length < 2) {
      setSelectedResources([...selectedResources, resource]);
    }
  };

  const handleRemove = (index: number) => {
    const newResources = selectedResources.filter((_, i) => i !== index);
    setSelectedResources(newResources);
  };

  const handleConfirm = () => {
    if (selectedResources.length === 2) {
      onConfirm(selectedResources);
    }
  };
  // END_BLOCK_HANDLERS

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border-2 border-blue-500">
        {/* START_BLOCK_HEADER */}
        <h2 className="text-2xl font-bold text-white mb-2">Year of Plenty</h2>
        <p className="text-gray-300 mb-4">
          Choose 2 resources from the bank
        </p>
        <p className="text-blue-400 mb-4">
          Selected: {selectedResources.length} / 2
        </p>
        {/* END_BLOCK_HEADER */}

        {/* START_BLOCK_SELECTED_RESOURCES */}
        <div className="mb-4">
          <h3 className="text-white font-bold mb-2">Your Selection:</h3>
          <div className="flex gap-2 min-h-[50px] items-center">
            {selectedResources.length === 0 && (
              <span className="text-gray-500 italic">No resources selected</span>
            )}
            {selectedResources.map((resource, index) => (
              <div
                key={index}
                className={`${resourceColors[resource]} px-4 py-2 rounded text-white font-bold flex items-center gap-2`}
              >
                <span className="capitalize">{resource.toLowerCase()}</span>
                <button
                  onClick={() => handleRemove(index)}
                  className="text-white hover:text-red-300"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* END_BLOCK_SELECTED_RESOURCES */}

        {/* START_BLOCK_RESOURCE_OPTIONS */}
        <div className="space-y-2 mb-6">
          <h3 className="text-white font-bold">Choose Resources:</h3>
          <div className="grid grid-cols-2 gap-2">
            {resourceOptions.map((resource) => (
              <button
                key={resource}
                onClick={() => handleResourceClick(resource)}
                disabled={selectedResources.length >= 2}
                className={`${resourceColors[resource]} hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded capitalize`}
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
            disabled={selectedResources.length !== 2}
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
 * END_MODULE_ui.year_of_plenty_modal
 */
