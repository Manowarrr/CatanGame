/**
 * START_MODULE_ui.discard_resources_modal
 *
 * MODULE_CONTRACT:
 * PURPOSE: Модальное окно для сброса ресурсов при выпадении 7
 * SCOPE: UI компонент для выбора ресурсов для сброса
 * KEYWORDS: React, modal, discard, resources, robber
 * LINKS_TO_MODULE: types/game.types.ts, store/gameStore.ts
 */

'use client';

import React, { useState } from 'react';
import { Player, ResourceType } from '@/types/game.types';
import { Button } from './Button';

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Модальное окно для сброса ресурсов
 * INPUTS:
 *   - player: Player - игрок, который должен сбросить ресурсы
 *   - discardAmount: number - количество ресурсов для сброса
 *   - onDiscard: (resources: Partial<Record<ResourceType, number>>) => void - callback для сброса
 * OUTPUTS: React.ReactElement - модальное окно
 * SIDE_EFFECTS: None
 * KEYWORDS: modal, discard, resources
 */

interface DiscardResourcesModalProps {
  player: Player;
  discardAmount: number;
  onDiscard: (resources: Partial<Record<ResourceType, number>>) => void;
}

export function DiscardResourcesModal({
  player,
  discardAmount,
  onDiscard,
}: DiscardResourcesModalProps) {
  // START_BLOCK_STATE
  // Описание: Состояние выбранных ресурсов для сброса

  const [selectedResources, setSelectedResources] = useState<
    Partial<Record<ResourceType, number>>
  >({});
  // END_BLOCK_STATE

  // START_BLOCK_CALCULATION
  // Описание: Вычисление текущего количества выбранных ресурсов

  const totalSelected = Object.values(selectedResources).reduce(
    (sum, count) => sum + (count || 0),
    0
  );

  const canConfirm = totalSelected === discardAmount;
  // END_BLOCK_CALCULATION

  // START_BLOCK_HANDLERS
  // Описание: Обработчики изменения количества ресурсов

  const handleIncrement = (resource: ResourceType) => {
    const currentAmount = selectedResources[resource] || 0;
    const maxAmount = player.resources[resource];

    if (currentAmount < maxAmount && totalSelected < discardAmount) {
      setSelectedResources({
        ...selectedResources,
        [resource]: currentAmount + 1,
      });
    }
  };

  const handleDecrement = (resource: ResourceType) => {
    const currentAmount = selectedResources[resource] || 0;

    if (currentAmount > 0) {
      setSelectedResources({
        ...selectedResources,
        [resource]: currentAmount - 1,
      });
    }
  };

  const handleConfirm = () => {
    if (canConfirm) {
      onDiscard(selectedResources);
    }
  };
  // END_BLOCK_HANDLERS

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border-2 border-yellow-500">
        {/* START_BLOCK_HEADER */}
        <h2 className="text-2xl font-bold text-white mb-2">Discard Resources</h2>
        <p className="text-gray-300 mb-4">
          You have more than 7 resources. You must discard {discardAmount}{' '}
          resource{discardAmount !== 1 ? 's' : ''}.
        </p>
        <p className="text-yellow-400 mb-4">
          Selected: {totalSelected} / {discardAmount}
        </p>
        {/* END_BLOCK_HEADER */}

        {/* START_BLOCK_RESOURCES */}
        <div className="space-y-3 mb-6">
          {Object.entries(player.resources).map(([resource, amount]) => {
            const resourceType = resource as ResourceType;
            const selected = selectedResources[resourceType] || 0;

            if (amount === 0) return null;

            return (
              <div
                key={resource}
                className="flex items-center justify-between bg-gray-700 p-3 rounded"
              >
                <div className="flex-1">
                  <span className="text-white capitalize">{resource.toLowerCase()}</span>
                  <span className="text-gray-400 ml-2">
                    (have: {amount})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDecrement(resourceType)}
                    disabled={selected === 0}
                    className="w-8 h-8 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded font-bold"
                  >
                    -
                  </button>
                  <span className="text-white font-bold w-8 text-center">
                    {selected}
                  </span>
                  <button
                    onClick={() => handleIncrement(resourceType)}
                    disabled={selected >= amount || totalSelected >= discardAmount}
                    className="w-8 h-8 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {/* END_BLOCK_RESOURCES */}

        {/* START_BLOCK_CONFIRM */}
        <Button
          onClick={handleConfirm}
          disabled={!canConfirm}
          className="w-full"
        >
          Confirm Discard
        </Button>
        {/* END_BLOCK_CONFIRM */}
      </div>
    </div>
  );
}

/**
 * END_MODULE_ui.discard_resources_modal
 */
