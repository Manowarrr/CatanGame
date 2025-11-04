# ПЛАН РАЗРАБОТКИ
## Проект: Catan (Колонизаторы)

**Версия документа:** 1.0
**Дата создания:** 2025-10-30
**Связанные документы:**
- [Техническое задание](./TechSpecification.md)
- [Обоснование технологического стека](./TechStackRationale.md)

---

## СОДЕРЖАНИЕ

1. [Анализ вариантов решения](#раздел-1-анализ-вариантов-решения)
2. [Семантический граф функций](#раздел-2-семантический-граф-функций)
3. [Описание алгоритма step-by-step](#раздел-3-описание-алгоритма-step-by-step)

---

## РАЗДЕЛ 1: АНАЛИЗ ВАРИАНТОВ РЕШЕНИЯ

### BEGIN_ANALYSIS_SECTION_ARCHITECTURE

#### START_ANALYSIS_ARCHITECTURE_APPROACHES
**Назначение:** Анализ различных архитектурных подходов к реализации игры.

### ПОДХОД 1: Монолитный компонент (Single Component Architecture)

**Описание:**
Вся игровая логика и UI находятся в одном большом компоненте с внутренним состоянием.

**Структура:**
```
app/
  page.tsx (весь код игры)
  globals.css
```

**За:**
- ✅ Максимальная простота начального setup
- ✅ Все в одном месте (легко найти код)
- ✅ Нет необходимости передавать props между компонентами
- ✅ Быстрый старт разработки

**Против:**
- ❌ Огромный файл (5000+ строк кода)
- ❌ Невозможно переиспользовать компоненты
- ❌ Сложно тестировать отдельные части
- ❌ Плохая читаемость и поддержка
- ❌ Невозможно работать над разными частями параллельно
- ❌ Семантическая разметка будет перегружена
- ❌ ИИ-агенты будут путаться в большом файле

**Оценка:**
- Простота реализации: ⭐⭐⭐⭐⭐ (5/5)
- Поддерживаемость: ⭐ (1/5)
- Масштабируемость: ⭐ (1/5)
- Соответствие методологии: ⭐ (1/5) - компонентный подход обязателен

**Вердикт:** ❌ **НЕ РЕКОМЕНДУЕТСЯ** - слишком плохая поддержка, не соответствует методологии

---

### ПОДХОД 2: Компонентная архитектура с локальным состоянием

**Описание:**
Разбиение на компоненты, состояние хранится в родительском компоненте и передается через props.

**Структура:**
```
app/
  page.tsx (корневой компонент с useState)
components/
  GameBoard.tsx
  PlayerPanel.tsx
  ActionPanel.tsx
  DiceRoll.tsx
  TradeModal.tsx
  ...
```

**За:**
- ✅ Разделение на переиспользуемые компоненты
- ✅ Проще читать и поддерживать код
- ✅ Каждый компонент можно тестировать отдельно
- ✅ Понятная иерархия компонентов

**Против:**
- ❌ Props drilling (передача props через много уровней)
- ❌ Сложно управлять большим состоянием в одном месте
- ❌ При изменении состояния могут ре-рендериться все дочерние компоненты
- ❌ Сложно добавлять новые features (нужно прокидывать props)

**Оценка:**
- Простота реализации: ⭐⭐⭐⭐ (4/5)
- Поддерживаемость: ⭐⭐⭐ (3/5)
- Масштабируемость: ⭐⭐ (2/5)
- Соответствие методологии: ⭐⭐⭐ (3/5)

**Вердикт:** ⚠️ **ПРИЕМЛЕМО, НО НЕ ОПТИМАЛЬНО** - хорошо для маленьких проектов, но для игры с большим состоянием не лучший выбор

---

### ПОДХОД 3: Компонентная архитектура с Zustand Store

**Описание:**
Компоненты + централизованное состояние в Zustand store. Компоненты подписываются только на нужные части состояния.

**Структура:**
```
app/
  page.tsx (корневой компонент, минимальная логика)
  layout.tsx
components/
  game-board/
    GameBoard.tsx
    Hex.tsx
    Vertex.tsx
    Edge.tsx
  player-panel/
    PlayerPanel.tsx
    ResourceDisplay.tsx
    DevelopmentCards.tsx
  action-panel/
    ActionPanel.tsx
    BuildButtons.tsx
  modals/
    TradeModal.tsx
    DiscardCardsModal.tsx
    RobberModal.tsx
  ui/ (переиспользуемые UI компоненты)
    Button.tsx
    Modal.tsx
store/
  gameStore.ts (Zustand store)
  slices/ (опционально, разделение store)
lib/
  game-logic/
    board-generator.ts
    validation.ts
    dice.ts
    resource-distribution.ts
    longest-road.ts
    ai-strategy.ts
types/
  game.types.ts
  player.types.ts
  board.types.ts
```

**За:**
- ✅ Централизованное состояние (легко отслеживать изменения)
- ✅ Нет props drilling
- ✅ Оптимальные ре-рендеры (компоненты обновляются только при изменении нужной части состояния)
- ✅ Легко добавлять новые features
- ✅ Отделение логики от UI (чистые функции в lib/)
- ✅ Хорошая структура для семантической разметки
- ✅ ИИ-агенты легко навигируют по файлам
- ✅ Соответствует методологии
- ✅ Можно легко добавить middleware для логирования/отладки
- ✅ Легко писать тесты (логика отделена от UI)

**Против:**
- ❌ Чуть сложнее начальная настройка (нужно создать store)
- ❌ Больше файлов (но лучше организация)

**Оценка:**
- Простота реализации: ⭐⭐⭐ (3/5)
- Поддерживаемость: ⭐⭐⭐⭐⭐ (5/5)
- Масштабируемость: ⭐⭐⭐⭐⭐ (5/5)
- Соответствие методологии: ⭐⭐⭐⭐⭐ (5/5)

**Вердикт:** ✅ **РЕКОМЕНДУЕТСЯ** - оптимальный баланс, лучший выбор для проекта

---

### ПОДХОД 4: Feature-based архитектура (по фичам)

**Описание:**
Группировка кода по функциональным возможностям (features), а не по типу файла.

**Структура:**
```
app/
features/
  board/
    components/
    hooks/
    store/
    utils/
  players/
    components/
    hooks/
    store/
    utils/
  trading/
    components/
    hooks/
    store/
    utils/
  development-cards/
    components/
    hooks/
    store/
    utils/
shared/
  components/
  hooks/
  utils/
```

**За:**
- ✅ Высокая модульность
- ✅ Легко найти все относящееся к одной фиче
- ✅ Можно легко удалить/добавить features
- ✅ Хорошо для больших команд

**Против:**
- ❌ Избыточная сложность для одного разработчика
- ❌ Сложнее понять общую структуру проекта
- ❌ Много вложенности
- ❌ Дублирование типов между features

**Оценка:**
- Простота реализации: ⭐⭐ (2/5)
- Поддерживаемость: ⭐⭐⭐⭐ (4/5)
- Масштабируемость: ⭐⭐⭐⭐⭐ (5/5)
- Соответствие методологии: ⭐⭐⭐ (3/5)

**Вердикт:** ❌ **ИЗБЫТОЧНО** - слишком сложно для MVP и одного разработчика

---

### ИТОГОВОЕ РЕШЕНИЕ: ПОДХОД 3 (Компонентная архитектура + Zustand)

**Обоснование:**
1. **Оптимальный баланс** простоты и масштабируемости
2. **Соответствует методологии** (компонентный подход + управление состоянием)
3. **Хорошая структура для семантической разметки** (четкое разделение на файлы)
4. **ИИ-агенты легко навигируют** по файлам и понимают связи
5. **Легко тестировать** (логика отделена от UI)
6. **Нет технического долга** (не придется рефакторить в будущем)

**Ключевые принципы архитектуры:**
- Разделение UI и бизнес-логики
- Компоненты отвечают только за отображение
- Вся игровая логика в lib/game-logic
- Централизованное состояние в Zustand
- Типизация через TypeScript
- Семантическая разметка в каждом файле

**END_ANALYSIS_ARCHITECTURE_APPROACHES**

---

**END_ANALYSIS_SECTION_ARCHITECTURE**

---

## РАЗДЕЛ 2: СЕМАНТИЧЕСКИЙ ГРАФ ФУНКЦИЙ

### BEGIN_SEMANTIC_GRAPH_SECTION

**Назначение:** Определение семантических связей между функциями, компонентами и модулями системы.

**Формат:** XML-граф с указанием зависимостей, входов, выходов и связей.

```xml
<SemanticFunctionGraph project="Catan">
  <metadata>
    <version>1.0</version>
    <date>2025-10-30</date>
    <description>Семантический граф функций игры Catan для навигации ИИ-агентов</description>
  </metadata>

  <!-- ========================================
       УРОВЕНЬ 1: КОРНЕВОЙ КОМПОНЕНТ
       ======================================== -->

  <Component id="ROOT_APP" type="page">
    <name>RootGamePage</name>
    <path>app/page.tsx</path>
    <purpose>Корневой компонент приложения, координирует все части игры</purpose>
    <dependencies>
      <dep ref="COMP_SETUP_SCREEN" condition="gameState === null"/>
      <dep ref="COMP_MAIN_GAME" condition="gameState !== null && !gameOver"/>
      <dep ref="COMP_END_SCREEN" condition="gameOver"/>
      <dep ref="STORE_GAME" type="state"/>
    </dependencies>
    <outputs>JSX (отрисовка текущего экрана)</outputs>
    <implements>START_LOGIC_BLOCK_UI_SETUP_SCREEN, START_LOGIC_BLOCK_UI_MAIN_GAME_SCREEN, START_LOGIC_BLOCK_UI_END_GAME_SCREEN</implements>
  </Component>

  <!-- ========================================
       УРОВЕНЬ 2: ГЛАВНЫЕ ЭКРАНЫ
       ======================================== -->

  <Component id="COMP_SETUP_SCREEN" type="screen">
    <name>SetupScreen</name>
    <path>components/screens/SetupScreen.tsx</path>
    <purpose>Экран настройки новой игры (выбор параметров)</purpose>
    <inputs>
      <input name="onStartGame" type="(config: GameConfig) => void"/>
    </inputs>
    <state>
      <field name="playerName" type="string"/>
      <field name="playerColor" type="PlayerColor"/>
      <field name="playerCount" type="2 | 3 | 4"/>
    </state>
    <outputs>JSX (форма настройки)</outputs>
    <actions>
      <action name="handleStartGame" triggers="FUNC_INIT_GAME"/>
    </actions>
    <implements>START_LOGIC_BLOCK_UI_SETUP_SCREEN</implements>
    <keywords>setup, configuration, player-input</keywords>
  </Component>

  <Component id="COMP_MAIN_GAME" type="screen">
    <name>MainGameScreen</name>
    <path>components/screens/MainGameScreen.tsx</path>
    <purpose>Главный экран игры с полем, панелями и действиями</purpose>
    <dependencies>
      <dep ref="COMP_GAME_BOARD"/>
      <dep ref="COMP_PLAYER_PANELS"/>
      <dep ref="COMP_ACTION_PANEL"/>
      <dep ref="COMP_GAME_LOG"/>
      <dep ref="STORE_GAME" type="state"/>
    </dependencies>
    <outputs>JSX (компоновка игрового экрана)</outputs>
    <implements>START_LOGIC_BLOCK_UI_MAIN_GAME_SCREEN</implements>
    <keywords>main-screen, game-layout</keywords>
  </Component>

  <Component id="COMP_END_SCREEN" type="screen">
    <name>EndGameScreen</name>
    <path>components/screens/EndGameScreen.tsx</path>
    <purpose>Экран окончания игры с результатами</purpose>
    <inputs>
      <input name="winner" type="Player"/>
      <input name="players" type="Player[]"/>
      <input name="onNewGame" type="() => void"/>
      <input name="onExit" type="() => void"/>
    </inputs>
    <outputs>JSX (таблица результатов + кнопки)</outputs>
    <implements>START_LOGIC_BLOCK_UI_END_GAME_SCREEN</implements>
    <keywords>end-screen, results, statistics</keywords>
  </Component>

  <!-- ========================================
       УРОВЕНЬ 3: ИГРОВЫЕ КОМПОНЕНТЫ
       ======================================== -->

  <Component id="COMP_GAME_BOARD" type="display">
    <name>GameBoard</name>
    <path>components/game-board/GameBoard.tsx</path>
    <purpose>Отображение игрового поля с гексами, дорогами, поселениями</purpose>
    <dependencies>
      <dep ref="COMP_HEX" quantity="19"/>
      <dep ref="COMP_VERTEX" quantity="54"/>
      <dep ref="COMP_EDGE" quantity="72"/>
      <dep ref="COMP_ROBBER"/>
      <dep ref="STORE_GAME" type="state" fields="board"/>
    </dependencies>
    <outputs>JSX (SVG или HTML с гексами и постройками)</outputs>
    <implements>START_LOGIC_BLOCK_UI_MAIN_GAME_SCREEN (игровое поле)</implements>
    <keywords>game-board, hexes, rendering</keywords>
  </Component>

  <Component id="COMP_HEX" type="display-unit">
    <name>Hex</name>
    <path>components/game-board/Hex.tsx</path>
    <purpose>Отображение одного гекса с ресурсом и числом</purpose>
    <inputs>
      <input name="hex" type="HexData"/>
      <input name="isHighlighted" type="boolean"/>
      <input name="onClick" type="() => void"/>
    </inputs>
    <outputs>JSX (один гекс)</outputs>
    <keywords>hex, resource-tile, visual-element</keywords>
  </Component>

  <Component id="COMP_VERTEX" type="display-unit">
    <name>Vertex</name>
    <path>components/game-board/Vertex.tsx</path>
    <purpose>Отображение вершины (перекрестка) с поселением/городом</purpose>
    <inputs>
      <input name="vertex" type="VertexData"/>
      <input name="isAvailable" type="boolean"/>
      <input name="onClick" type="() => void"/>
    </inputs>
    <outputs>JSX (точка пересечения + иконка постройки)</outputs>
    <keywords>vertex, settlement, city, intersection</keywords>
  </Component>

  <Component id="COMP_EDGE" type="display-unit">
    <name>Edge</name>
    <path>components/game-board/Edge.tsx</path>
    <purpose>Отображение ребра с дорогой</purpose>
    <inputs>
      <input name="edge" type="EdgeData"/>
      <input name="isAvailable" type="boolean"/>
      <input name="onClick" type="() => void"/>
    </inputs>
    <outputs>JSX (линия + дорога если есть)</outputs>
    <keywords>edge, road, connection</keywords>
  </Component>

  <Component id="COMP_ROBBER" type="display-unit">
    <name>Robber</name>
    <path>components/game-board/Robber.tsx</path>
    <purpose>Отображение разбойника на гексе</purpose>
    <inputs>
      <input name="hexId" type="string"/>
      <input name="position" type="{x: number, y: number}"/>
    </inputs>
    <outputs>JSX (иконка разбойника)</outputs>
    <keywords>robber, icon, hex-overlay</keywords>
  </Component>

  <Component id="COMP_PLAYER_PANELS" type="display">
    <name>PlayerPanels</name>
    <path>components/player-panel/PlayerPanels.tsx</path>
    <purpose>Контейнер для панелей всех игроков</purpose>
    <dependencies>
      <dep ref="COMP_PLAYER_PANEL" quantity="2-4"/>
      <dep ref="STORE_GAME" type="state" fields="players, currentPlayerIndex"/>
    </dependencies>
    <outputs>JSX (4 панели игроков)</outputs>
    <keywords>player-panels, container</keywords>
  </Component>

  <Component id="COMP_PLAYER_PANEL" type="display">
    <name>PlayerPanel</name>
    <path>components/player-panel/PlayerPanel.tsx</path>
    <purpose>Панель одного игрока с ресурсами, картами, ОП</purpose>
    <inputs>
      <input name="player" type="Player"/>
      <input name="isActive" type="boolean"/>
      <input name="isCurrentUser" type="boolean"/>
    </inputs>
    <dependencies>
      <dep ref="COMP_RESOURCE_DISPLAY"/>
      <dep ref="COMP_DEV_CARDS_DISPLAY"/>
    </dependencies>
    <outputs>JSX (панель игрока)</outputs>
    <implements>START_LOGIC_BLOCK_UI_MAIN_GAME_SCREEN (панели игроков)</implements>
    <keywords>player-panel, resources, victory-points</keywords>
  </Component>

  <Component id="COMP_RESOURCE_DISPLAY" type="display">
    <name>ResourceDisplay</name>
    <path>components/player-panel/ResourceDisplay.tsx</path>
    <purpose>Отображение ресурсов игрока</purpose>
    <inputs>
      <input name="resources" type="ResourceCards"/>
      <input name="detailed" type="boolean"/>
    </inputs>
    <outputs>JSX (иконки ресурсов + количество)</outputs>
    <keywords>resources, icons, display</keywords>
  </Component>

  <Component id="COMP_DEV_CARDS_DISPLAY" type="display">
    <name>DevelopmentCardsDisplay</name>
    <path>components/player-panel/DevelopmentCardsDisplay.tsx</path>
    <purpose>Отображение карт развития игрока</purpose>
    <inputs>
      <input name="cards" type="DevelopmentCard[]"/>
      <input name="onPlayCard" type="(card: DevelopmentCard) => void"/>
    </inputs>
    <outputs>JSX (список карт)</outputs>
    <implements>START_LOGIC_BLOCK_UI_DEVELOPMENT_CARD_INTERFACE</implements>
    <keywords>development-cards, hand, playable-cards</keywords>
  </Component>

  <Component id="COMP_ACTION_PANEL" type="interactive">
    <name>ActionPanel</name>
    <path>components/action-panel/ActionPanel.tsx</path>
    <purpose>Панель доступных действий для активного игрока</purpose>
    <dependencies>
      <dep ref="STORE_GAME" type="state"/>
      <dep ref="STORE_GAME" type="actions" methods="rollDice, buildRoad, buildSettlement, ..."/>
    </dependencies>
    <state>
      <field name="availableActions" type="GameAction[]"/>
    </state>
    <outputs>JSX (кнопки действий)</outputs>
    <implements>START_LOGIC_BLOCK_UI_MAIN_GAME_SCREEN (панель действий)</implements>
    <keywords>action-panel, buttons, player-actions</keywords>
  </Component>

  <Component id="COMP_GAME_LOG" type="display">
    <name>GameLog</name>
    <path>components/game-log/GameLog.tsx</path>
    <purpose>Журнал событий игры</purpose>
    <dependencies>
      <dep ref="STORE_GAME" type="state" fields="gameLog"/>
    </dependencies>
    <outputs>JSX (прокручиваемый список событий)</outputs>
    <implements>START_LOGIC_BLOCK_UI_GAME_LOG</implements>
    <keywords>game-log, events, history</keywords>
  </Component>

  <!-- ========================================
       УРОВЕНЬ 4: МОДАЛЬНЫЕ ОКНА
       ======================================== -->

  <Component id="COMP_TRADE_MODAL" type="modal">
    <name>TradeModal</name>
    <path>components/modals/TradeModal.tsx</path>
    <purpose>Интерфейс торговли с банком</purpose>
    <inputs>
      <input name="isOpen" type="boolean"/>
      <input name="onClose" type="() => void"/>
      <input name="playerResources" type="ResourceCards"/>
      <input name="availablePorts" type="Port[]"/>
    </inputs>
    <dependencies>
      <dep ref="FUNC_TRADE_BANK" type="action"/>
      <dep ref="FUNC_GET_BEST_TRADE_RATE" type="helper"/>
    </dependencies>
    <outputs>JSX (модальное окно торговли)</outputs>
    <implements>START_LOGIC_BLOCK_UI_TRADE_INTERFACE</implements>
    <keywords>trade-modal, bank-trade, resource-exchange</keywords>
  </Component>

  <Component id="COMP_DISCARD_MODAL" type="modal">
    <name>DiscardCardsModal</name>
    <path>components/modals/DiscardCardsModal.tsx</path>
    <purpose>Интерфейс сброса карт при выпадении 7</purpose>
    <inputs>
      <input name="isOpen" type="boolean"/>
      <input name="playerResources" type="ResourceCards"/>
      <input name="discardCount" type="number"/>
      <input name="onConfirm" type="(selected: ResourceCards) => void"/>
    </inputs>
    <state>
      <field name="selectedCards" type="ResourceCards"/>
    </state>
    <outputs>JSX (интерфейс выбора карт)</outputs>
    <implements>START_LOGIC_BLOCK_UI_DISCARD_CARDS_INTERFACE</implements>
    <keywords>discard-modal, seven-rolled, card-selection</keywords>
  </Component>

  <Component id="COMP_ROBBER_MODAL" type="modal">
    <name>RobberPlacementModal</name>
    <path>components/modals/RobberPlacementModal.tsx</path>
    <purpose>Интерфейс перемещения разбойника и выбора жертвы</purpose>
    <inputs>
      <input name="isOpen" type="boolean"/>
      <input name="victims" type="Player[]"/>
      <input name="onSelectVictim" type="(playerId: string) => void"/>
    </inputs>
    <outputs>JSX (список жертв для кражи)</outputs>
    <implements>START_LOGIC_BLOCK_UI_ROBBER_MOVEMENT_INTERFACE</implements>
    <keywords>robber-modal, victim-selection, steal-card</keywords>
  </Component>

  <!-- ========================================
       УРОВЕНЬ 5: ZUSTAND STORE
       ======================================== -->

  <Store id="STORE_GAME" type="zustand">
    <name>GameStore</name>
    <path>store/gameStore.ts</path>
    <purpose>Централизованное хранилище состояния игры</purpose>
    <state>
      <field name="board" type="Board" description="Игровое поле (гексы, вершины, ребра)"/>
      <field name="players" type="Player[]" description="Массив игроков"/>
      <field name="currentPlayerIndex" type="number" description="Индекс активного игрока"/>
      <field name="turnPhase" type="TurnPhase" description="Текущая фаза хода"/>
      <field name="diceRoll" type="DiceRoll | null" description="Результат броска кубиков"/>
      <field name="developmentDeck" type="DevelopmentCard[]" description="Колода карт развития"/>
      <field name="longestRoadHolder" type="string | null" description="ID держателя самой длинной дороги"/>
      <field name="largestArmyHolder" type="string | null" description="ID держателя самой большой армии"/>
      <field name="winner" type="string | null" description="ID победителя"/>
      <field name="gameLog" type="string[]" description="Массив событий игры"/>
    </state>
    <actions>
      <action name="initGame" params="(config: GameConfig)" triggers="FUNC_INIT_GAME"/>
      <action name="rollDice" params="()" triggers="FUNC_ROLL_DICE"/>
      <action name="buildRoad" params="(edgeId: string)" triggers="FUNC_BUILD_ROAD"/>
      <action name="buildSettlement" params="(vertexId: string)" triggers="FUNC_BUILD_SETTLEMENT"/>
      <action name="upgradeToCity" params="(vertexId: string)" triggers="FUNC_UPGRADE_TO_CITY"/>
      <action name="buyDevelopmentCard" params="()" triggers="FUNC_BUY_DEV_CARD"/>
      <action name="playKnight" params="()" triggers="FUNC_PLAY_KNIGHT"/>
      <action name="playMonopoly" params="(resource: ResourceType)" triggers="FUNC_PLAY_MONOPOLY"/>
      <action name="playRoadBuilding" params="()" triggers="FUNC_PLAY_ROAD_BUILDING"/>
      <action name="playYearOfPlenty" params="(resources: [ResourceType, ResourceType])" triggers="FUNC_PLAY_YEAR_OF_PLENTY"/>
      <action name="tradeBankе" params="(give: ResourceCards, get: ResourceType)" triggers="FUNC_TRADE_BANK"/>
      <action name="moveRobber" params="(hexId: string)" triggers="FUNC_MOVE_ROBBER"/>
      <action name="stealCard" params="(victimId: string)" triggers="FUNC_STEAL_CARD"/>
      <action name="endTurn" params="()" triggers="FUNC_END_TURN"/>
      <action name="addLog" params="(message: string)" description="Добавить запись в журнал"/>
    </actions>
    <keywords>state-management, zustand, game-state, actions</keywords>
  </Store>

  <!-- ========================================
       УРОВЕНЬ 6: CORE GAME LOGIC
       ======================================== -->

  <Function id="FUNC_INIT_GAME" type="initialization">
    <name>initializeGame</name>
    <path>lib/game-logic/initialization.ts</path>
    <purpose>Инициализация новой игры (генерация поля, создание игроков)</purpose>
    <inputs>
      <input name="config" type="GameConfig"/>
    </inputs>
    <dependencies>
      <dep ref="FUNC_GENERATE_BOARD"/>
      <dep ref="FUNC_CREATE_PLAYERS"/>
      <dep ref="FUNC_INIT_DEV_DECK"/>
    </dependencies>
    <outputs>
      <output type="GameState"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_PLAYER_INIT, START_LOGIC_BLOCK_BOARD_GENERATION</implements>
    <keywords>initialization, setup, game-start</keywords>
  </Function>

  <Function id="FUNC_GENERATE_BOARD" type="generator">
    <name>generateBoard</name>
    <path>lib/game-logic/board-generator.ts</path>
    <purpose>Генерация игрового поля (гексы, числа, порты, граф)</purpose>
    <inputs>
      <input name="config" type="BoardConfig" optional="true"/>
    </inputs>
    <dependencies>
      <dep ref="FUNC_CREATE_HEXES"/>
      <dep ref="FUNC_PLACE_NUMBERS"/>
      <dep ref="FUNC_PLACE_PORTS"/>
      <dep ref="FUNC_BUILD_GRAPH"/>
    </dependencies>
    <outputs>
      <output type="Board"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_BOARD_GENERATION, START_LOGIC_BLOCK_GRAPH_STRUCTURE, START_LOGIC_BLOCK_PORT_PLACEMENT</implements>
    <keywords>board-generation, hexes, graph, ports</keywords>
  </Function>

  <Function id="FUNC_CREATE_HEXES" type="generator">
    <name>createHexes</name>
    <path>lib/game-logic/board-generator.ts</path>
    <purpose>Создание 19 гексов с типами ресурсов</purpose>
    <outputs>
      <output type="Hex[]"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_BOARD_GENERATION</implements>
    <keywords>hexes, resource-types, standard-configuration</keywords>
  </Function>

  <Function id="FUNC_PLACE_NUMBERS" type="generator">
    <name>placeNumberTokens</name>
    <path>lib/game-logic/board-generator.ts</path>
    <purpose>Размещение числовых жетонов на гексах</purpose>
    <inputs>
      <input name="hexes" type="Hex[]"/>
    </inputs>
    <outputs>
      <output type="Hex[]" description="Гексы с числами"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_BOARD_GENERATION</implements>
    <keywords>number-tokens, probability, placement</keywords>
  </Function>

  <Function id="FUNC_PLACE_PORTS" type="generator">
    <name>placePorts</name>
    <path>lib/game-logic/board-generator.ts</path>
    <purpose>Размещение портов на краях поля</purpose>
    <inputs>
      <input name="vertices" type="Vertex[]"/>
    </inputs>
    <outputs>
      <output type="Vertex[]" description="Вершины с портами"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_PORT_PLACEMENT</implements>
    <keywords>ports, trade-ratios, placement</keywords>
  </Function>

  <Function id="FUNC_BUILD_GRAPH" type="generator">
    <name>buildGraphStructure</name>
    <path>lib/game-logic/board-generator.ts</path>
    <purpose>Построение графовой структуры (вершины, ребра, связи)</purpose>
    <inputs>
      <input name="hexes" type="Hex[]"/>
    </inputs>
    <outputs>
      <output type="{vertices: Vertex[], edges: Edge[]}"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_GRAPH_STRUCTURE</implements>
    <keywords>graph, vertices, edges, adjacency</keywords>
  </Function>

  <Function id="FUNC_CREATE_PLAYERS" type="generator">
    <name>createPlayers</name>
    <path>lib/game-logic/player-setup.ts</path>
    <purpose>Создание объектов игроков</purpose>
    <inputs>
      <input name="config" type="GameConfig"/>
    </inputs>
    <outputs>
      <output type="Player[]"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_PLAYER_INIT</implements>
    <keywords>players, initialization, human-ai</keywords>
  </Function>

  <Function id="FUNC_INIT_DEV_DECK" type="generator">
    <name>initializeDevelopmentDeck</name>
    <path>lib/game-logic/development-cards.ts</path>
    <purpose>Создание и перемешивание колоды карт развития</purpose>
    <outputs>
      <output type="DevelopmentCard[]"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_DEVELOPMENT_DECK_INIT</implements>
    <keywords>development-deck, cards, shuffle</keywords>
  </Function>

  <!-- ========================================
       УРОВЕНЬ 7: TURN CYCLE FUNCTIONS
       ======================================== -->

  <Function id="FUNC_ROLL_DICE" type="action">
    <name>rollDice</name>
    <path>lib/game-logic/dice.ts</path>
    <purpose>Генерация броска кубиков</purpose>
    <outputs>
      <output type="DiceRoll" fields="{dice1: number, dice2: number, sum: number}"/>
    </outputs>
    <sideEffects>
      <effect>Если сумма === 7, вызывает FUNC_ACTIVATE_ROBBER</effect>
      <effect>Если сумма !== 7, вызывает FUNC_DISTRIBUTE_RESOURCES</effect>
    </sideEffects>
    <implements>START_LOGIC_BLOCK_DICE_ROLL</implements>
    <keywords>dice-roll, random, turn-start</keywords>
  </Function>

  <Function id="FUNC_DISTRIBUTE_RESOURCES" type="action">
    <name>distributeResources</name>
    <path>lib/game-logic/resource-distribution.ts</path>
    <purpose>Распределение ресурсов после броска кубиков</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
      <input name="diceSum" type="number"/>
    </inputs>
    <outputs>
      <output type="GameState" description="Обновленное состояние с новыми ресурсами"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_RESOURCE_DISTRIBUTION</implements>
    <keywords>resource-distribution, hex-activation, settlements-cities</keywords>
  </Function>

  <Function id="FUNC_ACTIVATE_ROBBER" type="action">
    <name>activateRobber</name>
    <path>lib/game-logic/robber.ts</path>
    <purpose>Обработка выпадения 7 (сброс карт, перемещение разбойника)</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
    </inputs>
    <dependencies>
      <dep ref="FUNC_DISCARD_CARDS"/>
      <dep ref="FUNC_MOVE_ROBBER"/>
    </dependencies>
    <outputs>
      <output type="GameState"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_ROBBER_ACTIVATION</implements>
    <keywords>robber, seven-rolled, discard, steal</keywords>
  </Function>

  <Function id="FUNC_DISCARD_CARDS" type="action">
    <name>discardCards</name>
    <path>lib/game-logic/robber.ts</path>
    <purpose>Сброс половины карт у игроков с >7 картами</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
      <input name="playerId" type="string"/>
      <input name="cardsToDiscard" type="ResourceCards"/>
    </inputs>
    <outputs>
      <output type="GameState"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_ROBBER_ACTIVATION (сброс карт)</implements>
    <keywords>discard, seven, resource-loss</keywords>
  </Function>

  <Function id="FUNC_MOVE_ROBBER" type="action">
    <name>moveRobber</name>
    <path>lib/game-logic/robber.ts</path>
    <purpose>Перемещение разбойника на новый гекс</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
      <input name="hexId" type="string"/>
    </inputs>
    <outputs>
      <output type="GameState"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_ROBBER_ACTIVATION (перемещение)</implements>
    <keywords>robber-movement, hex-blocking</keywords>
  </Function>

  <Function id="FUNC_STEAL_CARD" type="action">
    <name>stealCard</name>
    <path>lib/game-logic/robber.ts</path>
    <purpose>Кража случайной карты у выбранного игрока</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
      <input name="thiefId" type="string"/>
      <input name="victimId" type="string"/>
    </inputs>
    <outputs>
      <output type="GameState"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_ROBBER_ACTIVATION (кража)</implements>
    <keywords>steal-card, robber-effect, random-card</keywords>
  </Function>

  <Function id="FUNC_END_TURN" type="action">
    <name>endTurn</name>
    <path>lib/game-logic/turn-management.ts</path>
    <purpose>Завершение хода и передача следующему игроку</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
    </inputs>
    <outputs>
      <output type="GameState"/>
    </outputs>
    <sideEffects>
      <effect>Если следующий игрок - ИИ, вызывает FUNC_AI_TAKE_TURN</effect>
    </sideEffects>
    <implements>START_LOGIC_BLOCK_END_TURN</implements>
    <keywords>end-turn, turn-order, next-player</keywords>
  </Function>

  <!-- ========================================
       УРОВЕНЬ 8: BUILDING FUNCTIONS
       ======================================== -->

  <Function id="FUNC_BUILD_ROAD" type="action">
    <name>buildRoad</name>
    <path>lib/game-logic/building.ts</path>
    <purpose>Строительство дороги</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
      <input name="playerId" type="string"/>
      <input name="edgeId" type="string"/>
    </inputs>
    <dependencies>
      <dep ref="FUNC_VALIDATE_ROAD_PLACEMENT"/>
      <dep ref="FUNC_CHECK_RESOURCES"/>
      <dep ref="FUNC_RECALCULATE_LONGEST_ROAD"/>
    </dependencies>
    <outputs>
      <output type="GameState"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_BUILD_ROAD</implements>
    <keywords>build-road, construction, resource-cost</keywords>
  </Function>

  <Function id="FUNC_BUILD_SETTLEMENT" type="action">
    <name>buildSettlement</name>
    <path>lib/game-logic/building.ts</path>
    <purpose>Строительство поселения</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
      <input name="playerId" type="string"/>
      <input name="vertexId" type="string"/>
    </inputs>
    <dependencies>
      <dep ref="FUNC_VALIDATE_SETTLEMENT_PLACEMENT"/>
      <dep ref="FUNC_CHECK_RESOURCES"/>
      <dep ref="FUNC_ADD_VICTORY_POINTS"/>
      <dep ref="FUNC_CHECK_WIN_CONDITION"/>
    </dependencies>
    <outputs>
      <output type="GameState"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_BUILD_SETTLEMENT</implements>
    <keywords>build-settlement, construction, victory-points</keywords>
  </Function>

  <Function id="FUNC_UPGRADE_TO_CITY" type="action">
    <name>upgradeToCity</name>
    <path>lib/game-logic/building.ts</path>
    <purpose>Улучшение поселения до города</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
      <input name="playerId" type="string"/>
      <input name="vertexId" type="string"/>
    </inputs>
    <dependencies>
      <dep ref="FUNC_CHECK_RESOURCES"/>
      <dep ref="FUNC_ADD_VICTORY_POINTS"/>
      <dep ref="FUNC_CHECK_WIN_CONDITION"/>
    </dependencies>
    <outputs>
      <output type="GameState"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_UPGRADE_TO_CITY</implements>
    <keywords>upgrade-city, construction, victory-points</keywords>
  </Function>

  <!-- ========================================
       УРОВЕНЬ 9: VALIDATION FUNCTIONS
       ======================================== -->

  <Function id="FUNC_VALIDATE_ROAD_PLACEMENT" type="validation">
    <name>validateRoadPlacement</name>
    <path>lib/game-logic/validation.ts</path>
    <purpose>Проверка корректности размещения дороги</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
      <input name="playerId" type="string"/>
      <input name="edgeId" type="string"/>
    </inputs>
    <outputs>
      <output type="boolean"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_PLACEMENT_VALIDATION (дороги)</implements>
    <keywords>validation, road-placement, connectivity</keywords>
  </Function>

  <Function id="FUNC_VALIDATE_SETTLEMENT_PLACEMENT" type="validation">
    <name>validateSettlementPlacement</name>
    <path>lib/game-logic/validation.ts</path>
    <purpose>Проверка правила расстояния для поселения</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
      <input name="playerId" type="string"/>
      <input name="vertexId" type="string"/>
    </inputs>
    <outputs>
      <output type="boolean"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_PLACEMENT_VALIDATION (поселения)</implements>
    <keywords>validation, settlement-placement, distance-rule</keywords>
  </Function>

  <Function id="FUNC_CHECK_RESOURCES" type="validation">
    <name>checkResourceAvailability</name>
    <path>lib/game-logic/validation.ts</path>
    <purpose>Проверка наличия достаточных ресурсов</purpose>
    <inputs>
      <input name="player" type="Player"/>
      <input name="cost" type="ResourceCards"/>
    </inputs>
    <outputs>
      <output type="boolean"/>
    </outputs>
    <keywords>validation, resources, cost-check</keywords>
  </Function>

  <!-- ========================================
       УРОВЕНЬ 10: TRADING FUNCTIONS
       ======================================== -->

  <Function id="FUNC_TRADE_BANK" type="action">
    <name>tradeWithBank</name>
    <path>lib/game-logic/trading.ts</path>
    <purpose>Обмен ресурсов с банком</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
      <input name="playerId" type="string"/>
      <input name="give" type="ResourceCards"/>
      <input name="get" type="ResourceType"/>
    </inputs>
    <dependencies>
      <dep ref="FUNC_GET_BEST_TRADE_RATE"/>
      <dep ref="FUNC_VALIDATE_TRADE"/>
    </dependencies>
    <outputs>
      <output type="GameState"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_TRADE_BANK_4_TO_1, START_LOGIC_BLOCK_TRADE_PORT_3_TO_1, START_LOGIC_BLOCK_TRADE_PORT_2_TO_1</implements>
    <keywords>trade, bank, resource-exchange</keywords>
  </Function>

  <Function id="FUNC_GET_BEST_TRADE_RATE" type="helper">
    <name>getBestTradeRate</name>
    <path>lib/game-logic/trading.ts</path>
    <purpose>Определение лучшего доступного курса обмена</purpose>
    <inputs>
      <input name="player" type="Player"/>
      <input name="resourceType" type="ResourceType"/>
    </inputs>
    <outputs>
      <output type="2 | 3 | 4"/>
    </outputs>
    <keywords>trade-rate, ports, optimization</keywords>
  </Function>

  <Function id="FUNC_VALIDATE_TRADE" type="validation">
    <name>validateTrade</name>
    <path>lib/game-logic/trading.ts</path>
    <purpose>Проверка корректности обмена</purpose>
    <inputs>
      <input name="player" type="Player"/>
      <input name="give" type="ResourceCards"/>
      <input name="rate" type="number"/>
    </inputs>
    <outputs>
      <output type="boolean"/>
    </outputs>
    <keywords>validation, trade, resource-check</keywords>
  </Function>

  <!-- ========================================
       УРОВЕНЬ 11: DEVELOPMENT CARDS FUNCTIONS
       ======================================== -->

  <Function id="FUNC_BUY_DEV_CARD" type="action">
    <name>buyDevelopmentCard</name>
    <path>lib/game-logic/development-cards.ts</path>
    <purpose>Покупка карты развития из колоды</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
      <input name="playerId" type="string"/>
    </inputs>
    <outputs>
      <output type="GameState"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_BUY_DEVELOPMENT_CARD</implements>
    <keywords>buy-card, development-deck, random-draw</keywords>
  </Function>

  <Function id="FUNC_PLAY_KNIGHT" type="action">
    <name>playKnight</name>
    <path>lib/game-logic/development-cards.ts</path>
    <purpose>Разыгрывание карты рыцаря</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
      <input name="playerId" type="string"/>
    </inputs>
    <dependencies>
      <dep ref="FUNC_MOVE_ROBBER"/>
      <dep ref="FUNC_CHECK_LARGEST_ARMY"/>
    </dependencies>
    <outputs>
      <output type="GameState"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_PLAY_KNIGHT</implements>
    <keywords>knight-card, robber, largest-army</keywords>
  </Function>

  <Function id="FUNC_PLAY_MONOPOLY" type="action">
    <name>playMonopoly</name>
    <path>lib/game-logic/development-cards.ts</path>
    <purpose>Разыгрывание карты монополии</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
      <input name="playerId" type="string"/>
      <input name="resourceType" type="ResourceType"/>
    </inputs>
    <outputs>
      <output type="GameState"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_PLAY_MONOPOLY</implements>
    <keywords>monopoly-card, resource-collection, all-players</keywords>
  </Function>

  <Function id="FUNC_PLAY_ROAD_BUILDING" type="action">
    <name>playRoadBuilding</name>
    <path>lib/game-logic/development-cards.ts</path>
    <purpose>Разыгрывание карты строительства дорог</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
      <input name="playerId" type="string"/>
      <input name="edgeIds" type="[string, string]"/>
    </inputs>
    <dependencies>
      <dep ref="FUNC_BUILD_ROAD"/>
      <dep ref="FUNC_RECALCULATE_LONGEST_ROAD"/>
    </dependencies>
    <outputs>
      <output type="GameState"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_PLAY_ROAD_BUILDING</implements>
    <keywords>road-building-card, free-roads, placement</keywords>
  </Function>

  <Function id="FUNC_PLAY_YEAR_OF_PLENTY" type="action">
    <name>playYearOfPlenty</name>
    <path>lib/game-logic/development-cards.ts</path>
    <purpose>Разыгрывание карты изобретения</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
      <input name="playerId" type="string"/>
      <input name="resources" type="[ResourceType, ResourceType]"/>
    </inputs>
    <outputs>
      <output type="GameState"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_PLAY_YEAR_OF_PLENTY</implements>
    <keywords>year-of-plenty-card, free-resources, selection</keywords>
  </Function>

  <!-- ========================================
       УРОВЕНЬ 12: ACHIEVEMENTS FUNCTIONS
       ======================================== -->

  <Function id="FUNC_RECALCULATE_LONGEST_ROAD" type="calculation">
    <name>recalculateLongestRoad</name>
    <path>lib/game-logic/longest-road.ts</path>
    <purpose>Пересчет длины самой длинной дороги и определение держателя титула</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
      <input name="playerId" type="string"/>
    </inputs>
    <dependencies>
      <dep ref="FUNC_FIND_LONGEST_PATH"/>
      <dep ref="FUNC_TRANSFER_LONGEST_ROAD_TITLE"/>
    </dependencies>
    <outputs>
      <output type="GameState"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_LONGEST_ROAD</implements>
    <keywords>longest-road, path-finding, title-transfer</keywords>
  </Function>

  <Function id="FUNC_FIND_LONGEST_PATH" type="algorithm">
    <name>findLongestPath</name>
    <path>lib/game-logic/longest-road.ts</path>
    <purpose>Поиск длиннейшего пути в графе дорог игрока</purpose>
    <inputs>
      <input name="edges" type="Edge[]"/>
      <input name="vertices" type="Vertex[]"/>
      <input name="playerId" type="string"/>
    </inputs>
    <outputs>
      <output type="number" description="Длина самой длинной дороги"/>
    </outputs>
    <algorithm>DFS (Depth-First Search) с учетом разветвлений</algorithm>
    <implements>START_LOGIC_BLOCK_LONGEST_ROAD (алгоритм)</implements>
    <keywords>longest-path, DFS, graph-traversal, branching</keywords>
  </Function>

  <Function id="FUNC_TRANSFER_LONGEST_ROAD_TITLE" type="action">
    <name>transferLongestRoadTitle</name>
    <path>lib/game-logic/longest-road.ts</path>
    <purpose>Передача титула "Самая длинная дорога"</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
      <input name="newHolderId" type="string"/>
      <input name="roadLength" type="number"/>
    </inputs>
    <outputs>
      <output type="GameState"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_LONGEST_ROAD (передача титула)</implements>
    <keywords>title-transfer, victory-points, longest-road</keywords>
  </Function>

  <Function id="FUNC_CHECK_LARGEST_ARMY" type="calculation">
    <name>checkLargestArmy</name>
    <path>lib/game-logic/largest-army.ts</path>
    <purpose>Проверка и передача титула "Самая большая армия"</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
      <input name="playerId" type="string"/>
    </inputs>
    <outputs>
      <output type="GameState"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_LARGEST_ARMY</implements>
    <keywords>largest-army, knight-count, title-transfer</keywords>
  </Function>

  <Function id="FUNC_ADD_VICTORY_POINTS" type="action">
    <name>addVictoryPoints</name>
    <path>lib/game-logic/victory-points.ts</path>
    <purpose>Добавление победных очков игроку</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
      <input name="playerId" type="string"/>
      <input name="points" type="number"/>
    </inputs>
    <outputs>
      <output type="GameState"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_CALCULATE_VICTORY_POINTS</implements>
    <keywords>victory-points, scoring, player-progress</keywords>
  </Function>

  <Function id="FUNC_CALCULATE_VICTORY_POINTS" type="calculation">
    <name>calculateVictoryPoints</name>
    <path>lib/game-logic/victory-points.ts</path>
    <purpose>Полный пересчет победных очков игрока</purpose>
    <inputs>
      <input name="player" type="Player"/>
      <input name="gameState" type="GameState"/>
    </inputs>
    <outputs>
      <output type="number" description="Общее количество ОП"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_CALCULATE_VICTORY_POINTS</implements>
    <keywords>victory-points-calculation, settlements, cities, titles, cards</keywords>
  </Function>

  <Function id="FUNC_CHECK_WIN_CONDITION" type="validation">
    <name>checkWinCondition</name>
    <path>lib/game-logic/victory-points.ts</path>
    <purpose>Проверка условия победы (10 ОП)</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
      <input name="playerId" type="string"/>
    </inputs>
    <outputs>
      <output type="boolean"/>
    </outputs>
    <sideEffects>
      <effect>Если победа достигнута, устанавливает winner в gameState</effect>
    </sideEffects>
    <implements>START_LOGIC_BLOCK_CHECK_WIN_CONDITION</implements>
    <keywords>win-condition, 10-points, game-end</keywords>
  </Function>

  <!-- ========================================
       УРОВЕНЬ 13: AI FUNCTIONS
       ======================================== -->

  <Function id="FUNC_AI_TAKE_TURN" type="ai-controller">
    <name>aiTakeTurn</name>
    <path>lib/game-logic/ai/ai-controller.ts</path>
    <purpose>Управление ходом ИИ (координация всех действий)</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
      <input name="aiPlayerId" type="string"/>
    </inputs>
    <dependencies>
      <dep ref="FUNC_AI_ROLL_DICE"/>
      <dep ref="FUNC_AI_DECIDE_ACTIONS"/>
      <dep ref="FUNC_END_TURN"/>
    </dependencies>
    <outputs>
      <output type="GameState"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_AI_TURN_FLOW</implements>
    <keywords>ai-turn, automation, decision-flow</keywords>
  </Function>

  <Function id="FUNC_AI_ROLL_DICE" type="ai-action">
    <name>aiRollDice</name>
    <path>lib/game-logic/ai/ai-controller.ts</path>
    <purpose>ИИ автоматически бросает кубики</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
    </inputs>
    <dependencies>
      <dep ref="FUNC_ROLL_DICE"/>
    </dependencies>
    <outputs>
      <output type="GameState"/>
    </outputs>
    <keywords>ai-dice, automation</keywords>
  </Function>

  <Function id="FUNC_AI_DECIDE_ACTIONS" type="ai-strategy">
    <name>aiDecideActions</name>
    <path>lib/game-logic/ai/ai-strategy.ts</path>
    <purpose>Принятие решений ИИ о действиях во время хода</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
      <input name="aiPlayerId" type="string"/>
    </inputs>
    <dependencies>
      <dep ref="FUNC_AI_EVALUATE_ACTIONS"/>
      <dep ref="FUNC_AI_PRIORITIZE_ACTIONS"/>
      <dep ref="FUNC_AI_EXECUTE_ACTION"/>
    </dependencies>
    <outputs>
      <output type="GameState"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_AI_DECISION_MAKING</implements>
    <keywords>ai-strategy, decision-making, priorities</keywords>
  </Function>

  <Function id="FUNC_AI_EVALUATE_ACTIONS" type="ai-strategy">
    <name>aiEvaluateActions</name>
    <path>lib/game-logic/ai/ai-strategy.ts</path>
    <purpose>Оценка доступных действий ИИ</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
      <input name="aiPlayer" type="Player"/>
    </inputs>
    <outputs>
      <output type="ActionEvaluation[]"/>
    </outputs>
    <keywords>ai-evaluation, heuristics, scoring</keywords>
  </Function>

  <Function id="FUNC_AI_PRIORITIZE_ACTIONS" type="ai-strategy">
    <name>aiPrioritizeActions</name>
    <path>lib/game-logic/ai/ai-strategy.ts</path>
    <purpose>Приоритизация действий ИИ</purpose>
    <inputs>
      <input name="evaluations" type="ActionEvaluation[]"/>
    </inputs>
    <outputs>
      <output type="ActionPriority[]" description="Отсортированный список действий"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_AI_DECISION_MAKING (приоритеты)</implements>
    <keywords>ai-priorities, action-ordering, strategy</keywords>
  </Function>

  <Function id="FUNC_AI_EXECUTE_ACTION" type="ai-action">
    <name>aiExecuteAction</name>
    <path>lib/game-logic/ai/ai-strategy.ts</path>
    <purpose>Выполнение выбранного действия ИИ</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
      <input name="action" type="GameAction"/>
    </inputs>
    <outputs>
      <output type="GameState"/>
    </outputs>
    <keywords>ai-execution, action-dispatch</keywords>
  </Function>

  <Function id="FUNC_AI_INITIAL_PLACEMENT" type="ai-strategy">
    <name>aiInitialPlacement</name>
    <path>lib/game-logic/ai/ai-initial-placement.ts</path>
    <purpose>Стратегия ИИ для начальной расстановки</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
      <input name="aiPlayerId" type="string"/>
    </inputs>
    <dependencies>
      <dep ref="FUNC_AI_EVALUATE_VERTICES"/>
      <dep ref="FUNC_AI_SELECT_BEST_VERTEX"/>
    </dependencies>
    <outputs>
      <output type="{vertexId: string, edgeId: string}"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_AI_INITIAL_PLACEMENT</implements>
    <keywords>ai-placement, vertex-evaluation, probability-heuristic</keywords>
  </Function>

  <Function id="FUNC_AI_EVALUATE_VERTICES" type="ai-strategy">
    <name>aiEvaluateVertices</name>
    <path>lib/game-logic/ai/ai-initial-placement.ts</path>
    <purpose>Оценка вершин для начальной расстановки</purpose>
    <inputs>
      <input name="board" type="Board"/>
      <input name="availableVertices" type="Vertex[]"/>
    </inputs>
    <outputs>
      <output type="VertexEvaluation[]"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_AI_INITIAL_PLACEMENT (оценка)</implements>
    <keywords>vertex-evaluation, probability-calculation, resource-diversity</keywords>
  </Function>

  <Function id="FUNC_AI_SELECT_BEST_VERTEX" type="ai-strategy">
    <name>aiSelectBestVertex</name>
    <path>lib/game-logic/ai/ai-initial-placement.ts</path>
    <purpose>Выбор лучшей вершины из оцененных</purpose>
    <inputs>
      <input name="evaluations" type="VertexEvaluation[]"/>
    </inputs>
    <outputs>
      <output type="string" description="vertexId"/>
    </outputs>
    <keywords>vertex-selection, max-score, placement</keywords>
  </Function>

  <Function id="FUNC_AI_PLACE_ROBBER" type="ai-strategy">
    <name>aiPlaceRobber</name>
    <path>lib/game-logic/ai/ai-robber.ts</path>
    <purpose>Стратегия ИИ для размещения разбойника</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
      <input name="aiPlayerId" type="string"/>
    </inputs>
    <dependencies>
      <dep ref="FUNC_AI_EVALUATE_HEXES"/>
      <dep ref="FUNC_AI_SELECT_VICTIM"/>
    </dependencies>
    <outputs>
      <output type="{hexId: string, victimId: string | null}"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_AI_ROBBER_PLACEMENT</implements>
    <keywords>ai-robber, hex-evaluation, victim-selection</keywords>
  </Function>

  <Function id="FUNC_AI_EVALUATE_HEXES" type="ai-strategy">
    <name>aiEvaluateHexes</name>
    <path>lib/game-logic/ai/ai-robber.ts</path>
    <purpose>Оценка гексов для размещения разбойника</purpose>
    <inputs>
      <input name="gameState" type="GameState"/>
      <input name="aiPlayerId" type="string"/>
    </inputs>
    <outputs>
      <output type="HexEvaluation[]"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_AI_ROBBER_PLACEMENT (оценка гексов)</implements>
    <keywords>hex-evaluation, opponent-targeting, probability-weighting</keywords>
  </Function>

  <Function id="FUNC_AI_SELECT_VICTIM" type="ai-strategy">
    <name>aiSelectVictim</name>
    <path>lib/game-logic/ai/ai-robber.ts</path>
    <purpose>Выбор жертвы для кражи карты</purpose>
    <inputs>
      <input name="possibleVictims" type="Player[]"/>
    </inputs>
    <outputs>
      <output type="string" description="victimId"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_AI_ROBBER_PLACEMENT (выбор жертвы)</implements>
    <keywords>victim-selection, target-strongest, strategy</keywords>
  </Function>

  <Function id="FUNC_AI_DISCARD_CARDS" type="ai-strategy">
    <name>aiDiscardCards</name>
    <path>lib/game-logic/ai/ai-discard.ts</path>
    <purpose>Стратегия ИИ для сброса карт при 7</purpose>
    <inputs>
      <input name="aiPlayer" type="Player"/>
      <input name="discardCount" type="number"/>
    </inputs>
    <outputs>
      <output type="ResourceCards" description="Карты для сброса"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_AI_CARD_DISCARD</implements>
    <keywords>ai-discard, resource-value, loss-minimization</keywords>
  </Function>

  <!-- ========================================
       УРОВЕНЬ 14: HELPER UTILITIES
       ======================================== -->

  <Function id="FUNC_GET_ADJACENT_ELEMENTS" type="utility">
    <name>getAdjacentElements</name>
    <path>lib/utils/graph-utils.ts</path>
    <purpose>Получение смежных элементов в графе</purpose>
    <inputs>
      <input name="elementId" type="string"/>
      <input name="elementType" type="'hex' | 'vertex' | 'edge'"/>
      <input name="board" type="Board"/>
    </inputs>
    <outputs>
      <output type="GraphElement[]"/>
    </outputs>
    <keywords>graph-traversal, adjacency, navigation</keywords>
  </Function>

  <Function id="FUNC_CALCULATE_PROBABILITY" type="utility">
    <name>calculateDiceProbability</name>
    <path>lib/utils/probability.ts</path>
    <purpose>Расчет вероятности выпадения числа на кубиках</purpose>
    <inputs>
      <input name="number" type="number"/>
    </inputs>
    <outputs>
      <output type="number" description="Вероятность (0-1)"/>
    </outputs>
    <keywords>probability, dice, mathematics</keywords>
  </Function>

  <Function id="FUNC_LOG_EVENT" type="utility">
    <name>logGameEvent</name>
    <path>lib/utils/logger.ts</path>
    <purpose>Добавление события в журнал игры</purpose>
    <inputs>
      <input name="eventType" type="GameEventType"/>
      <input name="data" type="any"/>
    </inputs>
    <outputs>
      <output type="string" description="Отформатированное сообщение"/>
    </outputs>
    <implements>START_LOGIC_BLOCK_UI_GAME_LOG</implements>
    <keywords>logging, game-log, events</keywords>
  </Function>

  <!-- ========================================
       SEMANTIC LINKS (Связи между функциями)
       ======================================== -->

  <SemanticLinks>
    <!-- Связи инициализации -->
    <Link from="FUNC_INIT_GAME" to="FUNC_GENERATE_BOARD" type="CALLS" strength="10"/>
    <Link from="FUNC_INIT_GAME" to="FUNC_CREATE_PLAYERS" type="CALLS" strength="10"/>
    <Link from="FUNC_INIT_GAME" to="FUNC_INIT_DEV_DECK" type="CALLS" strength="10"/>
    <Link from="FUNC_GENERATE_BOARD" to="FUNC_CREATE_HEXES" type="CALLS" strength="10"/>
    <Link from="FUNC_GENERATE_BOARD" to="FUNC_PLACE_NUMBERS" type="CALLS" strength="10"/>
    <Link from="FUNC_GENERATE_BOARD" to="FUNC_PLACE_PORTS" type="CALLS" strength="10"/>
    <Link from="FUNC_GENERATE_BOARD" to="FUNC_BUILD_GRAPH" type="CALLS" strength="10"/>

    <!-- Связи игрового цикла -->
    <Link from="FUNC_ROLL_DICE" to="FUNC_DISTRIBUTE_RESOURCES" type="TRIGGERS_IF" strength="9" condition="sum !== 7"/>
    <Link from="FUNC_ROLL_DICE" to="FUNC_ACTIVATE_ROBBER" type="TRIGGERS_IF" strength="9" condition="sum === 7"/>
    <Link from="FUNC_ACTIVATE_ROBBER" to="FUNC_DISCARD_CARDS" type="CALLS" strength="9"/>
    <Link from="FUNC_ACTIVATE_ROBBER" to="FUNC_MOVE_ROBBER" type="CALLS" strength="9"/>
    <Link from="FUNC_MOVE_ROBBER" to="FUNC_STEAL_CARD" type="CALLS" strength="8"/>

    <!-- Связи строительства -->
    <Link from="FUNC_BUILD_ROAD" to="FUNC_VALIDATE_ROAD_PLACEMENT" type="CALLS" strength="10"/>
    <Link from="FUNC_BUILD_ROAD" to="FUNC_CHECK_RESOURCES" type="CALLS" strength="10"/>
    <Link from="FUNC_BUILD_ROAD" to="FUNC_RECALCULATE_LONGEST_ROAD" type="TRIGGERS" strength="9"/>
    <Link from="FUNC_BUILD_SETTLEMENT" to="FUNC_VALIDATE_SETTLEMENT_PLACEMENT" type="CALLS" strength="10"/>
    <Link from="FUNC_BUILD_SETTLEMENT" to="FUNC_CHECK_RESOURCES" type="CALLS" strength="10"/>
    <Link from="FUNC_BUILD_SETTLEMENT" to="FUNC_ADD_VICTORY_POINTS" type="CALLS" strength="10"/>
    <Link from="FUNC_BUILD_SETTLEMENT" to="FUNC_CHECK_WIN_CONDITION" type="CALLS" strength="9"/>
    <Link from="FUNC_UPGRADE_TO_CITY" to="FUNC_CHECK_RESOURCES" type="CALLS" strength="10"/>
    <Link from="FUNC_UPGRADE_TO_CITY" to="FUNC_ADD_VICTORY_POINTS" type="CALLS" strength="10"/>
    <Link from="FUNC_UPGRADE_TO_CITY" to="FUNC_CHECK_WIN_CONDITION" type="CALLS" strength="9"/>

    <!-- Связи достижений -->
    <Link from="FUNC_RECALCULATE_LONGEST_ROAD" to="FUNC_FIND_LONGEST_PATH" type="CALLS" strength="10"/>
    <Link from="FUNC_RECALCULATE_LONGEST_ROAD" to="FUNC_TRANSFER_LONGEST_ROAD_TITLE" type="CALLS" strength="9"/>
    <Link from="FUNC_PLAY_KNIGHT" to="FUNC_CHECK_LARGEST_ARMY" type="TRIGGERS" strength="9"/>
    <Link from="FUNC_CHECK_LARGEST_ARMY" to="FUNC_ADD_VICTORY_POINTS" type="CALLS" strength="9"/>

    <!-- Связи карт развития -->
    <Link from="FUNC_PLAY_KNIGHT" to="FUNC_MOVE_ROBBER" type="CALLS" strength="10"/>
    <Link from="FUNC_PLAY_ROAD_BUILDING" to="FUNC_BUILD_ROAD" type="CALLS" strength="10" quantity="2"/>
    <Link from="FUNC_PLAY_ROAD_BUILDING" to="FUNC_RECALCULATE_LONGEST_ROAD" type="TRIGGERS" strength="9"/>

    <!-- Связи ИИ -->
    <Link from="FUNC_AI_TAKE_TURN" to="FUNC_AI_ROLL_DICE" type="CALLS" strength="10"/>
    <Link from="FUNC_AI_TAKE_TURN" to="FUNC_AI_DECIDE_ACTIONS" type="CALLS" strength="10"/>
    <Link from="FUNC_AI_TAKE_TURN" to="FUNC_END_TURN" type="CALLS" strength="10"/>
    <Link from="FUNC_AI_DECIDE_ACTIONS" to="FUNC_AI_EVALUATE_ACTIONS" type="CALLS" strength="10"/>
    <Link from="FUNC_AI_DECIDE_ACTIONS" to="FUNC_AI_PRIORITIZE_ACTIONS" type="CALLS" strength="10"/>
    <Link from="FUNC_AI_DECIDE_ACTIONS" to="FUNC_AI_EXECUTE_ACTION" type="CALLS" strength="10"/>
    <Link from="FUNC_AI_INITIAL_PLACEMENT" to="FUNC_AI_EVALUATE_VERTICES" type="CALLS" strength="10"/>
    <Link from="FUNC_AI_INITIAL_PLACEMENT" to="FUNC_AI_SELECT_BEST_VERTEX" type="CALLS" strength="10"/>
    <Link from="FUNC_AI_PLACE_ROBBER" to="FUNC_AI_EVALUATE_HEXES" type="CALLS" strength="10"/>
    <Link from="FUNC_AI_PLACE_ROBBER" to="FUNC_AI_SELECT_VICTIM" type="CALLS" strength="9"/>

    <!-- Связи компонентов и store -->
    <Link from="COMP_SETUP_SCREEN" to="FUNC_INIT_GAME" type="TRIGGERS_ACTION" strength="10"/>
    <Link from="COMP_ACTION_PANEL" to="STORE_GAME" type="USES_STATE" strength="10"/>
    <Link from="COMP_ACTION_PANEL" to="STORE_GAME" type="CALLS_ACTIONS" strength="10"/>
    <Link from="COMP_GAME_BOARD" to="STORE_GAME" type="SUBSCRIBES_TO" strength="10" fields="board"/>
    <Link from="COMP_PLAYER_PANELS" to="STORE_GAME" type="SUBSCRIBES_TO" strength="10" fields="players"/>
    <Link from="COMP_GAME_LOG" to="STORE_GAME" type="SUBSCRIBES_TO" strength="10" fields="gameLog"/>
    <Link from="STORE_GAME" to="FUNC_INIT_GAME" type="ACTION_CALLS" strength="10"/>
    <Link from="STORE_GAME" to="FUNC_ROLL_DICE" type="ACTION_CALLS" strength="10"/>
    <Link from="STORE_GAME" to="FUNC_BUILD_ROAD" type="ACTION_CALLS" strength="10"/>
    <Link from="STORE_GAME" to="FUNC_BUILD_SETTLEMENT" type="ACTION_CALLS" strength="10"/>
    <Link from="STORE_GAME" to="FUNC_UPGRADE_TO_CITY" type="ACTION_CALLS" strength="10"/>
    <Link from="STORE_GAME" to="FUNC_TRADE_BANK" type="ACTION_CALLS" strength="10"/>
    <Link from="STORE_GAME" to="FUNC_END_TURN" type="ACTION_CALLS" strength="10"/>
  </SemanticLinks>

  <!-- ========================================
       DATA FLOW (Потоки данных)
       ======================================== -->

  <DataFlows>
    <Flow name="Initialization Flow">
      <step>User inputs config -> COMP_SETUP_SCREEN</step>
      <step>COMP_SETUP_SCREEN -> STORE_GAME.initGame(config)</step>
      <step>STORE_GAME -> FUNC_INIT_GAME(config)</step>
      <step>FUNC_INIT_GAME -> FUNC_GENERATE_BOARD()</step>
      <step>FUNC_GENERATE_BOARD -> Board object</step>
      <step>FUNC_INIT_GAME -> FUNC_CREATE_PLAYERS(config)</step>
      <step>FUNC_CREATE_PLAYERS -> Player[] array</step>
      <step>FUNC_INIT_GAME -> GameState object</step>
      <step>GameState -> STORE_GAME.state</step>
      <step>STORE_GAME.state -> COMP_MAIN_GAME (subscribed components)</step>
    </Flow>

    <Flow name="Dice Roll Flow">
      <step>Player clicks "Roll Dice" -> COMP_ACTION_PANEL</step>
      <step>COMP_ACTION_PANEL -> STORE_GAME.rollDice()</step>
      <step>STORE_GAME -> FUNC_ROLL_DICE()</step>
      <step>FUNC_ROLL_DICE -> DiceRoll {dice1, dice2, sum}</step>
      <step>If sum !== 7 -> FUNC_DISTRIBUTE_RESOURCES(gameState, sum)</step>
      <step>FUNC_DISTRIBUTE_RESOURCES -> Updated GameState</step>
      <step>Updated GameState -> STORE_GAME.state</step>
      <step>STORE_GAME.state -> COMP_PLAYER_PANELS (updated resources)</step>
      <step>STORE_GAME.state -> COMP_GAME_LOG (new event)</step>
    </Flow>

    <Flow name="Build Road Flow">
      <step>Player clicks "Build Road" -> COMP_ACTION_PANEL</step>
      <step>COMP_ACTION_PANEL -> Enter placement mode</step>
      <step>Player clicks edge -> COMP_EDGE</step>
      <step>COMP_EDGE -> STORE_GAME.buildRoad(edgeId)</step>
      <step>STORE_GAME -> FUNC_BUILD_ROAD(gameState, playerId, edgeId)</step>
      <step>FUNC_BUILD_ROAD -> FUNC_VALIDATE_ROAD_PLACEMENT()</step>
      <step>If valid -> FUNC_CHECK_RESOURCES()</step>
      <step>If has resources -> Place road on edge</step>
      <step>FUNC_BUILD_ROAD -> FUNC_RECALCULATE_LONGEST_ROAD()</step>
      <step>FUNC_RECALCULATE_LONGEST_ROAD -> FUNC_FIND_LONGEST_PATH()</step>
      <step>If title changes -> FUNC_TRANSFER_LONGEST_ROAD_TITLE()</step>
      <step>Updated GameState -> STORE_GAME.state</step>
      <step>STORE_GAME.state -> COMP_GAME_BOARD (new road visible)</step>
      <step>STORE_GAME.state -> COMP_PLAYER_PANEL (updated resources, ОП)</step>
    </Flow>

    <Flow name="AI Turn Flow">
      <step>FUNC_END_TURN detects next player is AI</step>
      <step>FUNC_END_TURN -> FUNC_AI_TAKE_TURN(gameState, aiPlayerId)</step>
      <step>FUNC_AI_TAKE_TURN -> FUNC_AI_ROLL_DICE()</step>
      <step>FUNC_AI_ROLL_DICE -> FUNC_ROLL_DICE() -> Resources distributed</step>
      <step>FUNC_AI_TAKE_TURN -> FUNC_AI_DECIDE_ACTIONS()</step>
      <step>FUNC_AI_DECIDE_ACTIONS -> FUNC_AI_EVALUATE_ACTIONS()</step>
      <step>FUNC_AI_EVALUATE_ACTIONS -> ActionEvaluation[]</step>
      <step>FUNC_AI_DECIDE_ACTIONS -> FUNC_AI_PRIORITIZE_ACTIONS(evaluations)</step>
      <step>FUNC_AI_PRIORITIZE_ACTIONS -> Sorted ActionPriority[]</step>
      <step>For each action -> FUNC_AI_EXECUTE_ACTION(gameState, action)</step>
      <step>FUNC_AI_EXECUTE_ACTION -> Calls appropriate game function (buildRoad, etc.)</step>
      <step>After all actions -> FUNC_END_TURN()</step>
      <step>Updated GameState -> STORE_GAME.state -> UI updates</step>
    </Flow>
  </DataFlows>

</SemanticFunctionGraph>
```

**END_SEMANTIC_GRAPH_SECTION**

---

## РАЗДЕЛ 3: ОПИСАНИЕ АЛГОРИТМА STEP-BY-STEP

### BEGIN_ALGORITHM_SECTION

**Назначение:** Пошаговое описание ключевых алгоритмов игры словами (без кода).

---

### АЛГОРИТМ 1: Инициализация игры

#### START_ALGORITHM_GAME_INITIALIZATION

**Цель:** Создать начальное состояние игры с полем, игроками и настройками.

**Входные данные:**
- Конфигурация игры (количество игроков, имя человека, цвет человека)

**Шаги:**

1. **Создание игрового поля**
   - Шаг 1.1: Создать массив из 19 гексов
     - Распределить типы ресурсов: 4 леса, 4 поля, 4 пастбища, 3 горы, 3 холма, 1 пустыня
     - Разместить гексы в стандартной шестиугольной форме
     - Присвоить каждому гексу уникальный идентификатор и координаты для рендеринга

   - Шаг 1.2: Разместить числовые жетоны на гексах
     - Создать набор жетонов: 1×2, 2×3, 2×4, 2×5, 2×6, 2×8, 2×9, 2×10, 2×11, 1×12
     - Разместить жетоны на гексы спирально или по стандартной схеме
     - Пустыня остается без жетона
     - Для каждого жетона рассчитать вероятность выпадения (например, 6 и 8 = 5/36)

   - Шаг 1.3: Построить графовую структуру
     - Для каждого гекса определить 6 вершин (углов)
     - Объединить вершины, общие для нескольких гексов
     - Всего должно получиться 54 уникальные вершины
     - Для каждой пары смежных вершин создать ребро
     - Всего должно получиться 72 уникальных ребра
     - Для каждого элемента (гекс, вершина, ребро) сохранить список смежных элементов

   - Шаг 1.4: Разместить порты
     - Разместить 9 портов на краях поля (ребра, граничащие с водой)
     - 4 общих порта (3:1 для любого ресурса)
     - 5 специализированных портов (2:1 для конкретного ресурса: дерево, глина, шерсть, зерно, руда)
     - Для каждого порта связать с 2 смежными вершинами

   - Шаг 1.5: Инициализировать разбойника
     - Разместить разбойника на гексе пустыни
     - Сохранить текущую позицию разбойника в состоянии

2. **Создание игроков**
   - Шаг 2.1: Создать игрока-человека
     - Установить имя из конфигурации
     - Установить цвет из конфигурации
     - Пометить как человека (isAI = false)
     - Инициализировать ресурсы: все типы = 0
     - Инициализировать карты развития: пустой массив
     - Инициализировать счетчики: ОП = 0, рыцари = 0, длина дороги = 0
     - Инициализировать доступные фишки: дороги = 15, поселения = 5, города = 4
     - Инициализировать порты: пустой массив
     - Инициализировать титулы: hasLongestRoad = false, hasLargestArmy = false

   - Шаг 2.2: Создать компьютерных игроков
     - Количество = (общее количество игроков из конфигурации) - 1
     - Для каждого ИИ-игрока:
       - Установить имя "Компьютер 1", "Компьютер 2", и т.д.
       - Назначить уникальный цвет из оставшихся (красный, синий, белый, оранжевый)
       - Пометить как ИИ (isAI = true)
       - Инициализировать все счетчики и ресурсы аналогично человеку

   - Шаг 2.3: Определить порядок ходов
     - Перемешать массив игроков случайным образом
     - Установить индекс текущего игрока = 0 (первый в массиве)

3. **Инициализация колоды карт развития**
   - Шаг 3.1: Создать 25 карт
     - 14 карт "Рыцарь"
     - 2 карты "Монополия"
     - 2 карты "Строительство дорог"
     - 2 карты "Изобретение"
     - 5 карт победных очков:
       - 1 "Университет"
       - 1 "Библиотека"
       - 1 "Рыночная площадь"
       - 1 "Большой зал"
       - 1 "Часовня"

   - Шаг 3.2: Перемешать колоду случайным образом

4. **Установка начального состояния**
   - Установить фазу игры = "initial_placement_1" (первый раунд начальной расстановки)
   - Установить бросок кубиков = null
   - Установить держателей титулов = null (никто пока не имеет)
   - Установить победителя = null
   - Инициализировать журнал игры пустым массивом
   - Добавить первую запись в журнал: "Игра началась. Первый ход: [Имя игрока]"

5. **Возврат начального состояния**
   - Вернуть объект GameState со всеми инициализированными данными

**Выходные данные:**
- Объект GameState, готовый для начала игры

**Связь с ТЗ:** START_LOGIC_BLOCK_BOARD_GENERATION, START_LOGIC_BLOCK_PLAYER_INIT

**END_ALGORITHM_GAME_INITIALIZATION**

---

### АЛГОРИТМ 2: Начальная расстановка

#### START_ALGORITHM_INITIAL_PLACEMENT

**Цель:** Разместить начальные поселения и дороги всех игроков в два раунда.

**Входные данные:**
- Текущее состояние игры
- Идентификатор игрока
- Выбранная вершина и ребро

**Шаги:**

1. **Первый раунд (прямой порядок)**
   - Шаг 1.1: Определить текущего игрока по индексу (0, 1, 2, 3...)

   - Шаг 1.2: Если игрок - человек:
     - Показать доступные вершины на UI (подсветить зеленым)
     - Доступная вершина = свободная вершина, соблюдающая правило расстояния
     - Правило расстояния: на смежных вершинах (расстояние 1 ребро) нет поселений
     - Ждать выбора игрока (клик на вершину)

   - Шаг 1.3: Если игрок - ИИ:
     - Для каждой доступной вершины вычислить оценку:
       - Найти 3 смежных гекса
       - Для каждого гекса получить вероятность выпадения его числа
       - Суммировать вероятности всех смежных гексов
       - Добавить бонус за разнообразие ресурсов (если 3 разных типа ресурсов)
       - Добавить бонус за близость к портам
     - Выбрать вершину с наивысшей оценкой

   - Шаг 1.4: Разместить поселение на выбранной вершине
     - Создать объект постройки {type: 'settlement', playerId}
     - Присвоить постройку выбранной вершине
     - Уменьшить счетчик доступных поселений игрока на 1

   - Шаг 1.5: Разместить дорогу
     - Показать 3 смежных ребра от только что размещенного поселения
     - Если игрок - человек: ждать выбора ребра
     - Если игрок - ИИ: выбрать случайное ребро или ребро в направлении к центру поля
     - Создать объект дороги {playerId}
     - Присвоить дорогу выбранному ребру
     - Уменьшить счетчик доступных дорог игрока на 1

   - Шаг 1.6: Добавить запись в журнал игры
     - "[Имя игрока] разместил поселение и дорогу"

   - Шаг 1.7: Переход к следующему игроку
     - Увеличить индекс текущего игрока на 1
     - Если индекс < количество игроков: повторить шаги 1.1-1.7
     - Если индекс == количество игроков: перейти ко второму раунду

2. **Второй раунд (обратный порядок)**
   - Шаг 2.1: Определить текущего игрока в обратном порядке (3, 2, 1, 0...)
   - Индекс = (количество игроков - 1) на первой итерации, затем уменьшать

   - Шаг 2.2: Повторить шаги 1.2-1.5 (выбор вершины, размещение поселения и дороги)

   - Шаг 2.3: Выдать стартовые ресурсы
     - Найти 3 смежных гекса только что размещенного поселения
     - Для каждого гекса (кроме пустыни):
       - Получить тип ресурса гекса
       - Добавить 1 карту этого ресурса в руку игрока
     - Гекс с разбойником (пустыня) не дает ресурсы
     - Добавить запись в журнал: "[Имя игрока] получил стартовые ресурсы: [список]"

   - Шаг 2.4: Переход к предыдущему игроку
     - Уменьшить индекс на 1
     - Если индекс >= 0: повторить шаги 2.1-2.4
     - Если индекс < 0: завершить начальную расстановку

3. **Завершение начальной расстановки**
   - Шаг 3.1: Для каждого игрока добавить 2 победных очка (за 2 поселения)

   - Шаг 3.2: Установить фазу игры = "roll_dice"

   - Шаг 3.3: Установить индекс текущего игрока = 0 (первый игрок начинает основную игру)

   - Шаг 3.4: Добавить запись в журнал: "--- Основная игра началась. Ход игрока [Имя] ---"

   - Шаг 3.5: Если текущий игрок - ИИ, автоматически запустить его ход

**Выходные данные:**
- Обновленное состояние игры с размещенными постройками и стартовыми ресурсами

**Связь с ТЗ:** START_LOGIC_BLOCK_INITIAL_SETTLEMENT_ROUND_1, START_LOGIC_BLOCK_INITIAL_SETTLEMENT_ROUND_2

**END_ALGORITHM_INITIAL_PLACEMENT**

---

### АЛГОРИТМ 3: Бросок кубиков и распределение ресурсов

#### START_ALGORITHM_DICE_AND_RESOURCES

**Цель:** Сгенерировать случайный бросок кубиков и распределить ресурсы игрокам.

**Входные данные:**
- Текущее состояние игры

**Шаги:**

1. **Генерация броска кубиков**
   - Шаг 1.1: Сгенерировать первое случайное число от 1 до 6
   - Шаг 1.2: Сгенерировать второе случайное число от 1 до 6
   - Шаг 1.3: Вычислить сумму двух чисел
   - Шаг 1.4: Сохранить результат в объект {dice1, dice2, sum}
   - Шаг 1.5: Добавить запись в журнал: "[Имя игрока] бросил кубики: [сумма]"

2. **Проверка суммы**
   - Шаг 2.1: Если сумма == 7:
     - Перейти к алгоритму "Активация разбойника" (см. ниже)
     - Завершить текущий алгоритм

   - Шаг 2.2: Если сумма != 7:
     - Продолжить к распределению ресурсов

3. **Распределение ресурсов (если сумма != 7)**
   - Шаг 3.1: Найти все гексы с числовым жетоном == сумме кубиков
     - Создать пустой массив activeHexes
     - Для каждого гекса на поле:
       - Если гекс.number == сумма кубиков
       - И на гексе НЕ находится разбойник
       - Добавить гекс в activeHexes

   - Шаг 3.2: Для каждого активного гекса:
     - Найти 6 смежных вершин гекса
     - Для каждой вершины:
       - Проверить, есть ли на вершине постройка (поселение или город)
       - Если есть:
         - Получить владельца постройки (playerId)
         - Получить тип ресурса гекса
         - Если постройка == поселение: добавить 1 карту ресурса владельцу
         - Если постройка == город: добавить 2 карты ресурса владельцу
         - Сохранить информацию о получателе для логирования

   - Шаг 3.3: Для каждого игрока, получившего ресурсы:
     - Обновить количество карт ресурсов в руке игрока
     - Добавить запись в журнал: "[Имя игрока] получил: [X дерева, Y глины, ...]"

   - Шаг 3.4: Если никто не получил ресурсов (редкий случай):
     - Добавить запись в журнал: "Никто не получил ресурсы"

4. **Переход к фазе действий**
   - Шаг 4.1: Установить фазу игры = "action_phase"
   - Шаг 4.2: Разрешить игроку выполнять действия (строительство, торговля и т.д.)

**Выходные данные:**
- Обновленное состояние игры с результатом броска и распределенными ресурсами

**Связь с ТЗ:** START_LOGIC_BLOCK_DICE_ROLL, START_LOGIC_BLOCK_RESOURCE_DISTRIBUTION

**END_ALGORITHM_DICE_AND_RESOURCES**

---

### АЛГОРИТМ 4: Активация разбойника (при выпадении 7)

#### START_ALGORITHM_ROBBER_ACTIVATION

**Цель:** Обработать выпадение 7 (сброс карт, перемещение разбойника, кража).

**Входные данные:**
- Текущее состояние игры

**Шаги:**

1. **Сброс карт у игроков с >7 картами**
   - Шаг 1.1: Для каждого игрока:
     - Подсчитать общее количество карт ресурсов в руке
     - Сумма = дерево + глина + шерсть + зерно + руда

   - Шаг 1.2: Для каждого игрока, у которого сумма > 7:
     - Вычислить количество карт для сброса = floor(сумма / 2)
     - Если игрок - человек:
       - Открыть модальное окно "Сброс карт"
       - Показать ресурсы игрока с возможностью выбора
       - Игрок выбирает, какие карты сбросить (с помощью кнопок +/-)
       - Отображать счетчик "Выбрано: X / требуется: Y"
       - Кнопка "Подтвердить" активна, когда выбрано ровно нужное количество
       - Ждать подтверждения игрока
     - Если игрок - ИИ:
       - Для каждого типа ресурса оценить ценность:
         - Высокая ценность: ресурсы, нужные для приоритетных построек
         - Низкая ценность: избыточные ресурсы (которых много)
       - Выбрать карты с наименьшей ценностью для сброса
       - Если несколько карт одного типа, сбрасывать избыточные
     - Удалить выбранные карты из руки игрока
     - Добавить запись в журнал: "[Имя игрока] сбросил [количество] карт"

   - Шаг 1.3: Дождаться сброса карт у всех игроков с >7 картами

2. **Перемещение разбойника**
   - Шаг 2.1: Определить текущего игрока (тот, кто бросил 7)

   - Шаг 2.2: Если игрок - человек:
     - Показать сообщение "Переместите разбойника"
     - Изменить курсор на иконку разбойника
     - Подсветить все гексы, кроме текущего (где стоит разбойник) зеленым
     - Текущий гекс подсветить красным (недоступен)
     - Ждать клика на гекс

   - Шаг 2.3: Если игрок - ИИ:
     - Для каждого гекса (кроме текущего с разбойником):
       - Найти все смежные вершины гекса
       - Подсчитать количество поселений противников (не своих) на этих вершинах
       - Подсчитать количество городов противников (весят больше)
       - Получить вероятность выпадения числа гекса
       - Вычислить оценку гекса = (количество построек противников) × (вероятность) - (количество своих построек)
       - Штрафовать гексы, смежные с собственными постройками
     - Выбрать гекс с наивысшей оценкой

   - Шаг 2.4: Переместить разбойника на выбранный гекс
     - Убрать флаг robber = true с текущего гекса
     - Установить флаг robber = true на новом гексе
     - Добавить запись в журнал: "[Имя игрока] переместил разбойника на [тип гекса с числом]"

3. **Кража карты**
   - Шаг 3.1: Найти все вершины, смежные с новым гексом разбойника

   - Шаг 3.2: Для каждой вершины:
     - Проверить, есть ли на вершине постройка
     - Если есть, получить владельца
     - Если владелец != текущий игрок (не красть у себя)
     - Добавить владельца в список потенциальных жертв

   - Шаг 3.3: Для каждой потенциальной жертвы:
     - Подсчитать количество карт ресурсов в руке
     - Если количество == 0, исключить из списка жертв

   - Шаг 3.4: Если список жертв пуст:
     - Добавить запись в журнал: "Нет игроков для кражи"
     - Завершить активацию разбойника

   - Шаг 3.5: Если одна жертва:
     - Автоматически выбрать эту жертву
     - Перейти к шагу 3.7

   - Шаг 3.6: Если несколько жертв:
     - Если игрок - человек:
       - Открыть модальное окно "Выбор жертвы"
       - Показать список игроков с именем, цветом и количеством карт
       - Ждать выбора игрока
     - Если игрок - ИИ:
       - Выбрать жертву с наибольшим количеством карт
       - Или выбрать лидера по победным очкам

   - Шаг 3.7: Украсть случайную карту у выбранной жертвы
     - Получить все карты ресурсов жертвы
     - Создать массив всех карт (с повторениями): [wood, wood, brick, ...]
     - Выбрать случайный индекс в массиве
     - Получить тип украденного ресурса
     - Уменьшить количество этого ресурса у жертвы на 1
     - Увеличить количество этого ресурса у текущего игрока на 1
     - Добавить запись в журнал: "[Имя игрока] украл карту у [Имя жертвы]"
     - НЕ указывать тип украденного ресурса в журнале (секрет для других игроков)

4. **Завершение активации разбойника**
   - Шаг 4.1: Установить фазу игры = "action_phase"
   - Шаг 4.2: Разрешить игроку выполнять действия

**Выходные данные:**
- Обновленное состояние игры с перемещенным разбойником и измененными ресурсами

**Связь с ТЗ:** START_LOGIC_BLOCK_ROBBER_ACTIVATION

**END_ALGORITHM_ROBBER_ACTIVATION**

---

### АЛГОРИТМ 5: Строительство дороги

#### START_ALGORITHM_BUILD_ROAD

**Цель:** Разместить дорогу игрока на выбранном ребре.

**Входные данные:**
- Текущее состояние игры
- Идентификатор игрока
- Идентификатор ребра

**Шаги:**

1. **Проверка ресурсов**
   - Шаг 1.1: Получить руку игрока (карты ресурсов)
   - Шаг 1.2: Проверить, что игрок имеет минимум:
     - 1 карту дерева
     - 1 карту глины
   - Шаг 1.3: Если ресурсов недостаточно:
     - Вернуть ошибку "Недостаточно ресурсов"
     - Показать сообщение пользователю
     - Завершить алгоритм

2. **Проверка доступных фишек**
   - Шаг 2.1: Получить счетчик доступных дорог игрока
   - Шаг 2.2: Если счетчик == 0:
     - Вернуть ошибку "Все дороги построены"
     - Завершить алгоритм

3. **Валидация позиции**
   - Шаг 3.1: Получить ребро по идентификатору
   - Шаг 3.2: Проверить, что ребро свободно (нет дороги)
     - Если ребро занято: вернуть ошибку "Позиция занята"

   - Шаг 3.3: Проверить связность ребра с постройками игрока
     - Получить 2 смежные вершины ребра
     - Для каждой вершины:
       - Проверить, есть ли на вершине поселение/город игрока
       - Если да: связность подтверждена, перейти к шагу 3.4
     - Получить все смежные ребра данного ребра
     - Для каждого смежного ребра:
       - Проверить, есть ли на нем дорога игрока
       - Если да: связность подтверждена, перейти к шагу 3.4
     - Если связность не подтверждена:
       - Вернуть ошибку "Дорога должна быть связана с вашими постройками"

   - Шаг 3.4: Валидация пройдена

4. **Размещение дороги**
   - Шаг 4.1: Списать ресурсы у игрока
     - Уменьшить количество дерева на 1
     - Уменьшить количество глины на 1

   - Шаг 4.2: Разместить дорогу на ребре
     - Установить ребро.road = {playerId}

   - Шаг 4.3: Уменьшить счетчик доступных дорог игрока на 1

   - Шаг 4.4: Добавить запись в журнал: "[Имя игрока] построил дорогу"

5. **Пересчет самой длинной дороги**
   - Шаг 5.1: Вызвать алгоритм "Пересчет самой длинной дороги" (см. ниже)
   - Этот алгоритм может изменить держателя титула и добавить/убрать 2 ОП

6. **Проверка условия победы**
   - Шаг 6.1: Если победные очки игрока >= 10:
     - Установить winner = playerId
     - Установить фазу игры = "game_over"
     - Добавить запись в журнал: "[Имя игрока] победил!"

**Выходные данные:**
- Обновленное состояние игры с новой дорогой

**Связь с ТЗ:** START_LOGIC_BLOCK_BUILD_ROAD

**END_ALGORITHM_BUILD_ROAD**

---

### АЛГОРИТМ 6: Строительство поселения

#### START_ALGORITHM_BUILD_SETTLEMENT

**Цель:** Разместить поселение игрока на выбранной вершине.

**Входные данные:**
- Текущее состояние игры
- Идентификатор игрока
- Идентификатор вершины

**Шаги:**

1. **Проверка ресурсов**
   - Шаг 1.1: Проверить, что игрок имеет минимум:
     - 1 карту дерева
     - 1 карту глины
     - 1 карту шерсти
     - 1 карту зерна
   - Если недостаточно: вернуть ошибку

2. **Проверка доступных фишек**
   - Шаг 2.1: Проверить счетчик доступных поселений игрока
   - Если == 0: вернуть ошибку "Все поселения построены"

3. **Валидация позиции**
   - Шаг 3.1: Получить вершину по идентификатору
   - Шаг 3.2: Проверить, что вершина свободна (нет постройки)

   - Шаг 3.3: Проверить правило расстояния
     - Получить все смежные вершины (расстояние 1 ребро)
     - Для каждой смежной вершины:
       - Проверить, есть ли на ней постройка (любого игрока)
       - Если есть: вернуть ошибку "Слишком близко к другому поселению"

   - Шаг 3.4: Проверить связность с дорогами игрока
     - Получить все смежные ребра вершины
     - Для каждого ребра:
       - Проверить, есть ли на нем дорога игрока
       - Если да: связность подтверждена
     - Если связность не подтверждена:
       - Вернуть ошибку "Поселение должно быть связано с вашей дорогой"

4. **Размещение поселения**
   - Шаг 4.1: Списать ресурсы (1 дерево, 1 глина, 1 шерсть, 1 зерно)

   - Шаг 4.2: Разместить поселение на вершине
     - Установить вершина.building = {type: 'settlement', playerId}

   - Шаг 4.3: Уменьшить счетчик доступных поселений игрока на 1

   - Шаг 4.4: Добавить 1 победное очко игроку

   - Шаг 4.5: Проверить доступ к порту
     - Если вершина имеет порт (вершина.port !== null):
       - Добавить порт в список портов игрока
       - Игрок теперь может использовать курс этого порта

   - Шаг 4.6: Добавить запись в журнал: "[Имя игрока] построил поселение"

5. **Проверка условия победы**
   - Если ОП игрока >= 10: объявить победу

**Выходные данные:**
- Обновленное состояние игры с новым поселением

**Связь с ТЗ:** START_LOGIC_BLOCK_BUILD_SETTLEMENT

**END_ALGORITHM_BUILD_SETTLEMENT**

---

### АЛГОРИТМ 7: Улучшение до города

#### START_ALGORITHM_UPGRADE_CITY

**Цель:** Улучшить поселение игрока до города.

**Входные данные:**
- Текущее состояние игры
- Идентификатор игрока
- Идентификатор вершины (где стоит поселение)

**Шаги:**

1. **Проверка ресурсов**
   - Проверить, что игрок имеет:
     - 3 карты руды
     - 2 карты зерна
   - Если недостаточно: вернуть ошибку

2. **Проверка доступных фишек**
   - Проверить счетчик доступных городов игрока
   - Если == 0: вернуть ошибку "Все города построены"

3. **Валидация**
   - Шаг 3.1: Получить вершину по идентификатору
   - Шаг 3.2: Проверить, что на вершине есть постройка
   - Шаг 3.3: Проверить, что постройка == поселение
   - Шаг 3.4: Проверить, что поселение принадлежит игроку
   - Если любая проверка провалена: вернуть ошибку

4. **Улучшение**
   - Шаг 4.1: Списать ресурсы (3 руды, 2 зерна)

   - Шаг 4.2: Заменить поселение на город
     - Изменить вершина.building.type = 'city'

   - Шаг 4.3: Увеличить счетчик доступных поселений на 1 (фишка возвращается)

   - Шаг 4.4: Уменьшить счетчик доступных городов на 1

   - Шаг 4.5: Добавить 1 победное очко игроку (теперь вершина дает 2 ОП вместо 1)

   - Шаг 4.6: Добавить запись в журнал: "[Имя игрока] улучшил поселение до города"

5. **Проверка условия победы**
   - Если ОП игрока >= 10: объявить победу

**Выходные данные:**
- Обновленное состояние с городом вместо поселения

**Связь с ТЗ:** START_LOGIC_BLOCK_UPGRADE_TO_CITY

**END_ALGORITHM_UPGRADE_CITY**

---

### АЛГОРИТМ 8: Торговля с банком

#### START_ALGORITHM_TRADE_BANK

**Цель:** Обменять ресурсы игрока с банком по доступному курсу.

**Входные данные:**
- Текущее состояние игры
- Идентификатор игрока
- Отдаваемые ресурсы (тип и количество)
- Получаемый ресурс (тип)

**Шаги:**

1. **Определение доступного курса**
   - Шаг 1.1: Получить тип отдаваемого ресурса

   - Шаг 1.2: Проверить порты игрока
     - Для каждого порта в списке портов игрока:
       - Если порт специализированный (2:1) И тип ресурса совпадает с портом:
         - Установить курс = 2
         - Завершить поиск курса
       - Если порт общий (3:1):
         - Установить курс = 3 (если еще не нашли лучший)
     - Если не нашли порт: установить курс = 4 (базовый)

   - Шаг 1.3: Сохранить лучший курс

2. **Валидация обмена**
   - Шаг 2.1: Проверить, что количество отдаваемых карт кратно курсу
     - Например, при курсе 3:1 игрок должен отдать 3, 6, 9, ... карт
     - Если не кратно: вернуть ошибку "Неверное количество карт"

   - Шаг 2.2: Проверить, что у игрока достаточно карт отдаваемого ресурса
     - Если недостаточно: вернуть ошибку "Недостаточно ресурсов"

   - Шаг 2.3: Проверить, что отдаваемый и получаемый ресурсы разные
     - Если одинаковые: вернуть ошибку "Нельзя обменять ресурс на себя"

3. **Выполнение обмена**
   - Шаг 3.1: Вычислить количество получаемых карт
     - количество = (количество отдаваемых) / курс
     - Например, 6 карт при курсе 3:1 = 2 получаемые карты

   - Шаг 3.2: Списать отдаваемые карты у игрока
     - Уменьшить количество отдаваемого ресурса на соответствующее число

   - Шаг 3.3: Добавить получаемые карты игроку
     - Увеличить количество получаемого ресурса на вычисленное число

   - Шаг 3.4: Добавить запись в журнал
     - "[Имя игрока] обменял [X ресурса] на [Y ресурса] (курс [курс]:1)"

**Выходные данные:**
- Обновленное состояние с измененными ресурсами игрока

**Связь с ТЗ:** START_LOGIC_BLOCK_TRADE_BANK_4_TO_1, START_LOGIC_BLOCK_TRADE_PORT_3_TO_1, START_LOGIC_BLOCK_TRADE_PORT_2_TO_1

**END_ALGORITHM_TRADE_BANK**

---

### АЛГОРИТМ 9: Покупка карты развития

#### START_ALGORITHM_BUY_DEV_CARD

**Цель:** Купить случайную карту из колоды развития.

**Входные данные:**
- Текущее состояние игры
- Идентификатор игрока

**Шаги:**

1. **Проверка ресурсов**
   - Проверить, что игрок имеет:
     - 1 карту шерсти
     - 1 карту зерна
     - 1 карту руды
   - Если недостаточно: вернуть ошибку

2. **Проверка колоды**
   - Получить колоду карт развития
   - Проверить, что колода не пуста (length > 0)
   - Если пуста: вернуть ошибку "Карты развития закончились"

3. **Покупка карты**
   - Шаг 3.1: Списать ресурсы (1 шерсть, 1 зерно, 1 руда)

   - Шаг 3.2: Взять первую карту из колоды (или последнюю)
     - card = developmentDeck[0] (или [length-1])

   - Шаг 3.3: Удалить карту из колоды
     - developmentDeck.splice(0, 1)

   - Шаг 3.4: Добавить карту в руку игрока
     - Пометить карту как "куплена в этом ходу" (playedThisTurn = false, boughtThisTurn = true)
     - Добавить карту в массив developmentCards игрока

   - Шаг 3.5: Добавить запись в журнал
     - "[Имя игрока] купил карту развития"
     - НЕ указывать тип карты (секрет для других игроков)

**Выходные данные:**
- Обновленное состояние с купленной картой

**Связь с ТЗ:** START_LOGIC_BLOCK_BUY_DEVELOPMENT_CARD

**END_ALGORITHM_BUY_DEV_CARD**

---

### АЛГОРИТМ 10: Разыгрывание карты "Рыцарь"

#### START_ALGORITHM_PLAY_KNIGHT

**Цель:** Разыграть карту рыцаря (переместить разбойника, украсть карту, проверить армию).

**Входные данные:**
- Текущее состояние игры
- Идентификатор игрока

**Шаги:**

1. **Проверка возможности разыгрывания**
   - Шаг 1.1: Найти карту "Рыцарь" в руке игрока
   - Если не найдена: вернуть ошибку

   - Шаг 1.2: Проверить, что карта не была куплена в этом ходу
     - Если boughtThisTurn == true: вернуть ошибку "Нельзя разыграть карту в том же ходу"

2. **Удаление карты из руки**
   - Удалить карту "Рыцарь" из массива developmentCards игрока

3. **Увеличение счетчика рыцарей**
   - Увеличить player.knightsPlayed на 1

4. **Перемещение разбойника**
   - Выполнить шаги 2.2-2.4 из алгоритма "Активация разбойника"
   - (Выбор гекса, перемещение разбойника)

5. **Кража карты**
   - Выполнить шаги 3.1-3.7 из алгоритма "Активация разбойника"
   - (Выбор жертвы, кража случайной карты)

6. **Проверка "Самой большой армии"**
   - Шаг 6.1: Получить текущее количество рыцарей игрока

   - Шаг 6.2: Если количество < 3:
     - Титул недостижим, завершить проверку

   - Шаг 6.3: Получить текущего держателя титула "Самая большая армия"

   - Шаг 6.4: Если держатель == null (титул свободен):
     - Присвоить титул игроку
     - Установить gameState.largestArmyHolder = playerId
     - Установить player.hasLargestArmy = true
     - Добавить 2 победных очка игроку
     - Добавить запись в журнал: "[Имя игрока] получил титул 'Самая большая армия' ([X] рыцарей)"

   - Шаг 6.5: Если держатель != null (титул занят):
     - Получить количество рыцарей текущего держателя
     - Если количество рыцарей игрока строго больше (>):
       - Забрать титул у текущего держателя:
         - Установить currentHolder.hasLargestArmy = false
         - Вычесть 2 победных очка у текущего держателя
       - Присвоить титул игроку:
         - Установить gameState.largestArmyHolder = playerId
         - Установить player.hasLargestArmy = true
         - Добавить 2 победных очка игроку
       - Добавить запись в журнал: "[Имя игрока] забрал титул 'Самая большая армия' у [Имя держателя]"
     - Если количество равно или меньше:
       - Титул остается у текущего держателя

7. **Проверка условия победы**
   - Если ОП игрока >= 10: объявить победу

**Выходные данные:**
- Обновленное состояние с перемещенным разбойником, украденной картой и возможно измененным держателем армии

**Связь с ТЗ:** START_LOGIC_BLOCK_PLAY_KNIGHT, START_LOGIC_BLOCK_LARGEST_ARMY

**END_ALGORITHM_PLAY_KNIGHT**

---

### АЛГОРИТМ 11: Пересчет самой длинной дороги

#### START_ALGORITHM_LONGEST_ROAD

**Цель:** Найти длиннейший путь в дорогах игрока и определить держателя титула.

**Входные данные:**
- Текущее состояние игры
- Идентификатор игрока (кто только что построил дорогу)

**Шаги:**

1. **Поиск длиннейшего пути (DFS)**
   - Шаг 1.1: Получить все ребра с дорогами игрока
     - Создать массив playerRoads
     - Для каждого ребра на поле:
       - Если ребро.road.playerId == playerId
       - Добавить ребро в playerRoads

   - Шаг 1.2: Построить граф смежности для дорог игрока
     - Для каждого ребра в playerRoads:
       - Получить 2 смежные вершины ребра
       - Для каждой вершины:
         - Проверить, не разрывает ли постройка противника дорогу
         - Если на вершине есть постройка другого игрока (не текущего):
           - Эта вершина разрывает путь (не использовать ее для соединения)
         - Иначе:
           - Вершина может соединять дороги

   - Шаг 1.3: Для каждого ребра как стартовой точки:
     - Запустить DFS (поиск в глубину):
       - Начать с текущего ребра
       - Пометить ребро как посещенное
       - Установить текущую длину = 1
       - Для каждой смежной вершины ребра:
         - Если вершина не разрывает путь:
           - Найти все смежные ребра вершины (кроме текущего)
           - Для каждого смежного ребра:
             - Если ребро принадлежит игроку И не посещено:
               - Рекурсивно вызвать DFS для этого ребра
               - Текущая длина = 1 + длина из рекурсии
       - Если достигли конца пути (нет непосещенных смежных дорог):
         - Вернуть текущую длину
       - Если есть разветвление (несколько смежных дорог):
         - Запустить DFS для каждой ветви
         - Вернуть максимальную длину среди всех ветвей
     - Сохранить максимальную длину из всех стартовых точек

   - Шаг 1.4: Результат = максимальная длина непрерывной цепи дорог

   - Шаг 1.5: Сохранить длину в player.longestRoadLength

2. **Проверка условия для титула**
   - Шаг 2.1: Если длина < 5:
     - Титул недостижим для игрока
     - Если игрок был держателем:
       - Забрать титул (редкий случай - дорогу разорвали)
       - Вычесть 2 ОП
     - Завершить алгоритм

3. **Передача/получение титула**
   - Шаг 3.1: Получить текущего держателя титула "Самая длинная дорога"

   - Шаг 3.2: Если держатель == null (титул свободен):
     - Присвоить титул игроку
     - Установить gameState.longestRoadHolder = playerId
     - Установить player.hasLongestRoad = true
     - Добавить 2 победных очка игроку
     - Добавить запись в журнал: "[Имя игрока] получил титул 'Самая длинная дорога' (длина [X])"

   - Шаг 3.3: Если держатель != null:
     - Получить длину дороги текущего держателя
     - Если длина игрока строго больше (>):
       - Забрать титул у держателя:
         - Установить currentHolder.hasLongestRoad = false
         - Вычесть 2 ОП у держателя
       - Присвоить титул игроку:
         - Установить gameState.longestRoadHolder = playerId
         - Установить player.hasLongestRoad = true
         - Добавить 2 ОП игроку
       - Добавить запись в журнал: "[Имя игрока] забрал титул 'Самая длинная дорога' у [Имя держателя]"
     - Если длина равна или меньше:
       - Титул остается у текущего держателя

4. **Проверка условия победы**
   - Если ОП игрока >= 10: объявить победу

**Выходные данные:**
- Обновленное состояние с возможно измененным держателем титула

**Связь с ТЗ:** START_LOGIC_BLOCK_LONGEST_ROAD

**Примечание:** Алгоритм DFS сложен и критичен. Требуется тщательная реализация и тестирование.

**END_ALGORITHM_LONGEST_ROAD**

---

### АЛГОРИТМ 12: Ход ИИ-игрока

#### START_ALGORITHM_AI_TURN

**Цель:** Полностью автоматизировать ход компьютерного игрока.

**Входные данные:**
- Текущее состояние игры
- Идентификатор ИИ-игрока

**Шаги:**

1. **Задержка для имитации размышления**
   - Ждать 500-1000 миллисекунд
   - Это делает игру более естественной для человека

2. **Бросок кубиков**
   - Автоматически вызвать алгоритм "Бросок кубиков"
   - Обработать результат (распределение ресурсов или разбойник)

3. **Если выпала 7 - обработка разбойника**
   - Если нужно сбросить карты (>7):
     - Вызвать алгоритм "Сброс карт ИИ":
       - Оценить ценность каждого ресурса
       - Сбросить наименее ценные
   - Выбрать гекс для разбойника (алгоритм из "Активация разбойника", ИИ версия)
   - Выбрать жертву для кражи (предпочтительно лидера или с большим количеством карт)

4. **Фаза действий ИИ**
   - Шаг 4.1: Проверить возможность немедленной победы
     - Подсчитать текущие ОП
     - Симулировать, можно ли достичь 10 ОП на этом ходу
     - Если да: приоритизировать действия для победы

   - Шаг 4.2: Оценить все доступные действия
     - Создать список возможных действий:
       - Разыграть карту развития (если есть доступные)
       - Построить город (если есть ресурсы и поселения)
       - Построить поселение (если есть ресурсы и доступные позиции)
       - Купить карту развития (если есть ресурсы)
       - Построить дорогу (если нужна для будущего поселения или для титула)
       - Торговать с банком (если не хватает 1-2 ресурсов для важной постройки)

     - Для каждого действия вычислить оценку:
       - Город: высокая оценка (дает 2 ОП, увеличивает доход ресурсов)
       - Поселение: высокая оценка (дает 1 ОП, открывает новые ресурсы)
       - Карта развития: средняя оценка (шанс на рыцаря или карту ОП)
       - Дорога: низкая оценка (если не ведет к новому поселению)
       - Торговля: зависит от цели (высокая, если это приведет к постройке)

   - Шаг 4.3: Приоритизировать действия
     - Отсортировать действия по убыванию оценки
     - Учесть специальные условия:
       - Если близок к получению "Самой длинной дороги" (4 дороги): повысить приоритет строительства дорог
       - Если близок к "Самой большой армии" (2 рыцаря): повысить приоритет рыцаря
       - Если разбойник блокирует лучший гекс ИИ: разыграть рыцаря для его перемещения

   - Шаг 4.4: Выполнить действия по приоритетам
     - Для каждого действия в отсортированном списке:
       - Проверить, что действие все еще доступно (ресурсы не изменились)
       - Выполнить действие:
         - Для строительства: выбрать лучшую позицию (вершина/ребро с наивысшей оценкой)
         - Для торговли: обменять избыточные ресурсы на недостающие
         - Для карт: разыграть карту с наибольшей пользой
       - Добавить задержку 300-500 мс между действиями (для наглядности)
       - Обновить список доступных действий
     - Повторять, пока есть полезные действия

5. **Оценка позиций для строительства (если нужно)**
   - **Для поселения:**
     - Для каждой доступной вершины:
       - Найти смежные гексы
       - Суммировать вероятности ресурсов
       - Добавить бонус за разнообразие ресурсов
       - Добавить бонус за близость к портам
     - Выбрать вершину с наивысшей оценкой

   - **Для дороги:**
     - Если цель - новое поселение:
       - Найти путь к лучшей доступной вершине
       - Построить дорогу, ведущую в этом направлении
     - Если цель - титул "Самая длинная дорога":
       - Найти место, которое максимально удлинит текущую цепь дорог
     - Если нет четкой цели:
       - Построить дорогу, расширяющую территорию

6. **Завершение хода ИИ**
   - Шаг 6.1: Добавить запись в журнал: "[Имя ИИ] закончил ход"
   - Шаг 6.2: Вызвать алгоритм "Завершение хода"
   - Шаг 6.3: Передать управление следующему игроку

**Выходные данные:**
- Обновленное состояние игры после хода ИИ

**Связь с ТЗ:** START_LOGIC_BLOCK_AI_TURN_FLOW, START_LOGIC_BLOCK_AI_DECISION_MAKING

**Примечание:** Стратегия ИИ основана на простых эвристиках. Для более сильного ИИ можно использовать минимакс, MCTS или обучение с подкреплением (будущие версии).

**END_ALGORITHM_AI_TURN**

---

### АЛГОРИТМ 13: Завершение хода

#### START_ALGORITHM_END_TURN

**Цель:** Завершить текущий ход и передать управление следующему игроку.

**Входные данные:**
- Текущее состояние игры

**Шаги:**

1. **Сброс флагов текущего хода**
   - Шаг 1.1: Для всех карт развития текущего игрока:
     - Если boughtThisTurn == true:
       - Установить boughtThisTurn = false
       - Теперь карту можно разыгрывать в следующем ходу

2. **Переход к следующему игроку**
   - Шаг 2.1: Увеличить currentPlayerIndex на 1

   - Шаг 2.2: Если currentPlayerIndex >= количество игроков:
     - Установить currentPlayerIndex = 0 (цикл вернулся к первому игроку)

   - Шаг 2.3: Получить следующего игрока по новому индексу

3. **Сброс фазы хода**
   - Установить фазу игры = "roll_dice"
   - Установить diceRoll = null

4. **Добавление записи в журнал**
   - Добавить: "--- Ход [Имя следующего игрока] ---"

5. **Автоматический запуск хода ИИ (если нужно)**
   - Шаг 5.1: Если следующий игрок.isAI == true:
     - Добавить задержку 500 мс
     - Вызвать алгоритм "Ход ИИ-игрока"

   - Шаг 5.2: Если следующий игрок.isAI == false:
     - Ждать действий человека (кнопка "Бросить кубики")

**Выходные данные:**
- Обновленное состояние с активным следующим игроком

**Связь с ТЗ:** START_LOGIC_BLOCK_END_TURN

**END_ALGORITHM_END_TURN**

---

### АЛГОРИТМ 14: Проверка условия победы

#### START_ALGORITHM_CHECK_VICTORY

**Цель:** Проверить, достиг ли игрок 10 победных очков.

**Входные данные:**
- Текущее состояние игры
- Идентификатор игрока

**Шаги:**

1. **Подсчет победных очков**
   - Шаг 1.1: Инициализировать счетчик ОП = 0

   - Шаг 1.2: Подсчитать ОП от поселений
     - Для каждой вершины на поле:
       - Если есть постройка И владелец == игрок:
         - Если тип == поселение: добавить 1 ОП

   - Шаг 1.3: Подсчитать ОП от городов
     - Для каждой вершины на поле:
       - Если есть постройка И владелец == игрок:
         - Если тип == город: добавить 2 ОП

   - Шаг 1.4: Подсчитать ОП от карт развития
     - Для каждой карты в developmentCards игрока:
       - Если тип карты == победное очко:
         - Добавить 1 ОП

   - Шаг 1.5: Добавить ОП от титулов
     - Если player.hasLongestRoad == true: добавить 2 ОП
     - Если player.hasLargestArmy == true: добавить 2 ОП

   - Шаг 1.6: Сохранить общее количество в player.victoryPoints

2. **Проверка победы**
   - Шаг 2.1: Если victoryPoints >= 10:
     - Установить gameState.winner = playerId
     - Установить фазу игры = "game_over"
     - Добавить запись в журнал: "[Имя игрока] победил с [X] победными очками!"
     - Собрать финальную статистику всех игроков
     - Вернуть TRUE (победа достигнута)

   - Шаг 2.2: Если victoryPoints < 10:
     - Вернуть FALSE (игра продолжается)

**Выходные данные:**
- Boolean (победа или нет) + обновленное состояние

**Связь с ТЗ:** START_LOGIC_BLOCK_CHECK_WIN_CONDITION, START_LOGIC_BLOCK_CALCULATE_VICTORY_POINTS

**END_ALGORITHM_CHECK_VICTORY**

---

**END_ALGORITHM_SECTION**

---

## ЗАКЛЮЧЕНИЕ

Документ план разработки содержит:

1. **Анализ вариантов архитектуры** - выбрана компонентная архитектура с Zustand
2. **Семантический граф функций** - XML-структура с описанием всех компонентов, функций и связей
3. **Пошаговые алгоритмы** - детальное описание 14 ключевых алгоритмов словами

### Следующие шаги разработки:

1. Настройка проекта Next.js + TypeScript + Tailwind CSS
2. Создание базовой структуры папок согласно выбранной архитектуре
3. Реализация типов данных (Board, Player, GameState и т.д.)
4. Создание Zustand store с базовым состоянием
5. Реализация алгоритмов инициализации (генерация поля, создание игроков)
6. Разработка UI компонентов (GameBoard, PlayerPanel, ActionPanel)
7. Реализация игровой логики (бросок кубиков, строительство, торговля)
8. Реализация ИИ противника
9. Тестирование и отладка
10. Оптимизация производительности

---

**КОНЕЦ ПЛАНА РАЗРАБОТКИ**

*Документ подготовлен для проекта Catan (Колонизаторы)*
*Версия: 1.0 | Дата: 2025-10-30*
