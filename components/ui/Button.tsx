/**
 * START_MODULE_ui.button
 *
 * MODULE_CONTRACT:
 * PURPOSE: Переиспользуемый компонент кнопки с вариантами стилей
 * SCOPE: UI компонент для всех действий в игре
 * KEYWORDS: React, button, UI component, Tailwind CSS
 */

import React from 'react';

/**
 * FUNCTION_CONTRACT:
 * PURPOSE: Переиспользуемая кнопка с различными вариантами стилей
 * INPUTS:
 *   - onClick: () => void - обработчик клика
 *   - children: React.ReactNode - содержимое кнопки
 *   - disabled: boolean (optional) - отключена ли кнопка
 *   - variant: 'primary' | 'secondary' | 'danger' (optional) - вариант стиля
 *   - className: string (optional) - дополнительные CSS классы
 * OUTPUTS: React.ReactElement - JSX элемент кнопки
 * SIDE_EFFECTS: None
 * KEYWORDS: button, UI
 */

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}

export function Button({
  onClick,
  children,
  disabled = false,
  variant = 'primary',
  className = '',
}: ButtonProps) {
  // START_BLOCK_STYLE_CALCULATION
  // Описание: Вычисление CSS классов на основе variant

  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`.trim();
  // END_BLOCK_STYLE_CALCULATION

  return (
    <button onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}

/**
 * END_MODULE_ui.button
 */
