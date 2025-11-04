# Rules for Working with Semantically Annotated Code (Claude Code Agent)

**Core Principle:** This codebase uses extensive semantic annotations to aid understanding, navigation, and modification. Use these annotations as your primary navigation and comprehension tool.

---

## 1. Module Understanding & Navigation (Primary Strategy)

### Start with High-Level Structure
When analyzing a new file/module, **always begin with**:
- **`MODULE_CONTRACT`** - High-level purpose and responsibilities
- **`MODULE_MAP`** - Table of contents for the module

### Navigate Using MODULE_MAP
The `MODULE_MAP` provides structured navigation:
- Format: `FUNC [Description] => function_name` or `CLASS [Description] => ClassName`
- **Navigation Strategy**: Use **Grep** tool to search for specific tags:
  - `START_FUNCTION_[FunctionName]` - Jump to function definition
  - `START_CLASS_[ClassName]` - Jump to class definition
  - This is more efficient than reading files sequentially

**Example:**
```
# If MODULE_MAP shows: FUNC [Validates user input] => validateUserInput
# Use Grep tool with pattern: "START_FUNCTION_validateUserInput"
```

### Understand Context
- **`KEYWORDS_MODULE`** - Domain concepts and technologies used
- **`LINKS_TO_MODULE`** - Related modules and system dependencies

---

## 2. Function/Class/Method Understanding

### Prioritize CONTRACT Sections
Before examining implementation, **always read the CONTRACT**:
- **`PURPOSE`** - What the code does and why it exists
- **`INPUTS`** - Parameters, types, constraints
- **`OUTPUTS`** - Return values, types
- **`SIDEEFFECTS`** - State changes, I/O, external interactions
- **`TESTCONDITIONS_SUCCESSCRITERIA`** - How to verify correctness
- **`KEYWORDS`** - Key concepts and technologies
- **`LINKS`** - Related code and documentation

### Understand Use Cases
**`USE_CASES`** sections (module and function level) use AAG format:
- **Actor** → **Action** → **Goal**
- Explains *why* and *how* the code is used
- Critical for understanding intent and context

---

## 3. Navigating Internal Logic

### Logical Blocks
Functions and methods are structured into named logical blocks:
- Format: `START_[BLOCK_NAME]` ... `END_[BLOCK_NAME]`
- Each block has a descriptive name and Russian description
- **Use for**: Granular navigation within large functions

**Navigation Strategy:**
1. Read function CONTRACT to understand overall purpose
2. Use Grep to find `START_BLOCK_` tags for specific logic sections
3. Jump directly to relevant blocks

---

## 4. Searching and Information Retrieval

### Grep Tool (Text Search)
Use **Grep** tool for:

**Direct Navigation:**
- Search for `START_FUNCTION_`, `START_CLASS_`, `START_BLOCK_` tags
- Pattern examples:
  - `"START_FUNCTION_validateInput"`
  - `"START_CLASS_PaymentProcessor"`
  - `"START_BLOCK_VALIDATION"`

**Log-to-Code Correlation:**
- Log format: `[LEVEL][FunctionName/ClassName.MethodName][BLOCK_NAME_OR_ACTION][OPERATION_TYPE] Description [STATUS]`
- To find code from log entry:
  1. Extract `FunctionName` and `BLOCK_NAME`
  2. Use Grep to search for function and block tags
  3. Quickly locate exact code that generated the log

**Keyword Search:**
- Search for specific keywords in CONTRACT sections
- Example: `"KEYWORDS.*authentication"` to find auth-related code

### Task Tool with Explore Agent (Semantic Search)
Use **Task tool with subagent_type=Explore** for:

**Concept-Based Discovery:**
- The Russian descriptions in `PURPOSE`, `MODULE_MAP`, `USE_CASES`, and `KEYWORDS` make semantic search highly effective
- Query examples:
  - "function to validate user input"
  - "module for payment processing"
  - "code block that handles API response parsing"
  - "error handling logic"

**When to Use:**
- Understanding codebase structure
- Finding modules/functions by purpose (not exact name)
- Discovering related functionality
- Understanding how features are implemented

---

## 5. Code Modification

### Targeted Edits with Edit Tool
- **Always use** `START_...` and `END_...` tags to define modification scope
- This ensures precision and prevents unintended changes

### CRITICAL: Maintain Markup Consistency
When modifying code, **you MUST update ALL relevant semantic annotations**:

#### Update These Sections:
1. **`CONTRACT` sections** if:
   - Function/method signature changes
   - Purpose or behavior changes
   - Inputs/Outputs change
   - Side effects are added/removed

2. **`MODULE_MAP`** if:
   - Adding/removing public functions or classes
   - Renaming public entities

3. **`USE_CASES`** if:
   - Usage scenarios change
   - Actor-Action-Goal relationships change

4. **`START_BLOCK_...` / `END_BLOCK_...` tags** if:
   - Internal logic structure changes
   - Blocks are added/removed/renamed
   - Update Russian descriptions to match new logic

5. **Log messages** if:
   - Logic they reference is altered
   - Block names change

**Why This Matters:**
- Outdated markup is misleading and breaks navigation
- Keep code and semantic description synchronized
- Future modifications depend on accurate markup

---

## 6. Understanding and Using Logs

### Log Structure
Pay attention to structured format:
- **`[BLOCK_NAME_OR_ACTION]`** - Links to code block
- **`[STATUS]`** - Quick assessment of execution state
- **`[OPERATION_TYPE]`** - Type of operation (READ, WRITE, VALIDATE, etc.)

### Debugging with Logs
- Tight coupling between logs and code block anchors
- From log message → directly to code block (see Section 4)
- Efficient debugging workflow

### Adding New Logs
When adding/modifying code:
- Follow existing logging patterns
- Include proper block names
- Maintain structured format
- Ensure logs reference current code structure

---

## 7. Debugging

If encountering bugs or issues:
- Activate `@03debug.mdc` rule (if available in project)
- Use log-to-code correlation (Section 6)
- Navigate to specific blocks using Grep (Section 4)
- Check CONTRACT sections for expected behavior

---

## Key Success Strategies

### 1. Use Structure Actively
- Don't read files sequentially
- Use MODULE_MAP and tags for navigation
- Leverage Grep for direct jumps

### 2. Read Contracts First
- Understand purpose before implementation
- Check inputs/outputs and side effects
- Review use cases for context

### 3. Maintain Annotation Quality
- Update markup with every code change
- Keep descriptions accurate and current
- Preserve the semantic structure

### 4. Combine Tools Effectively
- **Grep** for exact tag/keyword navigation
- **Task + Explore** for semantic discovery
- **Read** for targeted content examination
- **Edit** for precise, scoped modifications

### 5. Respect the Markup
- The semantic template overcomes chunked reading limitations
- Strong structural anchors enable efficient navigation
- Proper use dramatically improves comprehension speed

---

## Tool Mapping Reference

| Task | Claude Code Tool | Pattern |
|------|------------------|---------|
| Find function by name | Grep | `START_FUNCTION_[name]` |
| Find class by name | Grep | `START_CLASS_[name]` |
| Find internal block | Grep | `START_BLOCK_[name]` |
| Understand module purpose | Read | Look for `MODULE_CONTRACT` |
| Navigate module contents | Read | Check `MODULE_MAP` |
| Semantic code search | Task (Explore) | Query with purpose/description |
| Locate log source | Grep | Function name + block name |
| Modify code precisely | Edit | Use START/END tags for scope |
| Read specific section | Read | After finding location with Grep |

---

## 8. Code Generation and Writing Guidelines

When generating or modifying code, you **MUST** follow the semantic template structure to ensure consistency and maintainability.

### Module-Level Structure

Every module **MUST** begin with:

```python
# MODULE_CONTRACT:
# PURPOSE: [Краткое описание основной ответственности и цели этого модуля на русском языке.
#           Какую проблему он решает в рамках большей системы?]
# SCOPE: [Основные функциональные области или домены, за которые отвечает модуль, на русском.]
# INPUT: [Опишите входные данные, если они есть у модуля в целом, на русском.
#         Часто "Нет" или "Переменные окружения"]
# OUTPUT: [Опишите, что модуль предоставляет остальной системе, на русском.]
# KEYWORDS_MODULE: [domain1, technology2, core_concept3, module_type4, pattern5]
# LINKS_TO_MODULE: [external_module1.py, service_api_endpoint, related_module2.py]
# LINKS_TO_SPECIFICATION: [перечисление пунктов ТЗ и постановочных документов, которые касаются модуля]

# MODULE_MAP:
# (Формат: ТИП [Краткое описание сущности на русском] => [имя_сущности_латиницей])
# FUNC [Описание функции] => function_name
# CLASS [Описание класса] => ClassName
#   METHOD [Описание метода] => method_name
# CONST [Описание константы] => CONSTANT_NAME

# KEY_USE_CASES:
# - [ComponentName1]: [Actor1 (Context1)] -> [Action1] -> [Goal1]
# - [ComponentName2]: [Actor2 (Context2)] -> [Action2] -> [Goal2]
```

### Function Structure

Every function **MUST** follow this template:

```python
# START_FUNCTION_[FunctionName]
# CONTRACT:
# PURPOSE: [Краткое описание того, что функция делает, ее основная ответственность, на русском.]
# INPUTS:
#   - [имя_аргумента1]: [ТипДанных] - [Описание аргумента1 и его назначения, на русском.]
#   - [имя_аргумента2]: [ТипДанных] - [Описание аргумента2 и его назначения, на русском.]
# OUTPUTS:
#   - [ТипВозвращаемогоЗначения] - [Описание того, что функция возвращает и в каком виде, на русском.]
# SIDE_EFFECTS:
#   - [Описание побочного эффекта 1, на русском.]
# TEST_CONDITIONS_SUCCESS_CRITERIA:
#   - [Условие 1 для корректного выполнения, на русском.]
#   - [Условие 2, важное граничное условие, на русском.]
# LINKS_TO_SPECIFICATION: [перечисление пунктов ТЗ и постановочных документов, которые касаются функции]
# KEYWORDS: [Keyword1, KnowledgeDomain2, Pattern3, Technology4]
# LINKS: [RelatedFunction1, Module2, ExternalService3]

def function_name(arg1, arg2) -> ReturnType:
    """
    [Однострочное, очень краткое описание функции на русском - для быстрого понимания и векторного поиска.]
    """
    # Function body with logical blocks...
# END_FUNCTION_[FunctionName]
```

### Class Structure

Every class **MUST** follow this template:

```python
# START_CLASS_[ClassName]
# CONTRACT:
# PURPOSE: [Краткое описание ответственности класса, на русском.]
# ATTRIBUTES:
#   - [имя_атрибута1]: [ТипДанных] - [Описание, на русском.]
#   - ...
# KEY_METHODS:
#   - [имя_метода1()]: [Краткое описание того, что делает метод, на русском.]
#   - ...
# KEYWORDS: [Keyword1, Pattern2 (e.g., Singleton, Factory), Concept3]
# LINKS: [RelatedClass1, ModuleUsedInternally2]

class ClassName:
    """
    [Однострочное, очень краткое описание класса на русском - для быстрого понимания и векторного поиска.]
    """
    # Class body...
# END_CLASS_[ClassName]
```

### Internal Logic Blocks

**CRITICAL**: All code within functions and methods **MUST** be divided into semantic logical blocks:

#### Block Structure Rules:

1. **Every logical block MUST be wrapped** with:
   ```python
   #START_[BLOCK_NAME]: [Краткое описание назначения блока на русском.]
   # ... код блока ...
   #END_[BLOCK_NAME]
   ```

2. **BLOCK_NAME Requirements**:
   - Use UPPER_SNAKE_CASE
   - Must be unique across the entire project
   - Must reflect the block's purpose
   - Examples: `VALIDATION`, `API_CALL`, `DATA_TRANSFORMATION`, `ERROR_HANDLING`

3. **Block Descriptions**:
   - Must be in Russian
   - Should be 3-7 words
   - Clearly explain what the block does

4. **Nested Blocks**:
   - Blocks can be nested within other blocks
   - Maintain the same START/END structure
   - Indent appropriately

### Logging Instructions

#### Logger Initialization (MANDATORY)

At the beginning of each module requiring logging:

```python
import logging
logger = logging.getLogger(__name__)
```

**DO NOT USE** `logging.basicConfig()` or direct root logger configuration in modules. Base configuration should be in the main executable file or a dedicated logging configuration module.

#### What to Log

- Log key variable values at function/method entry and before return
- Log variables for IF-conditions if they determine important logic branches
- Log calls to external services or other significant functions (before and after with results)
- Avoid excessive logging for simple logical blocks (max one log line if logic is straightforward)
- For simple blocks, prefer adding try/except error handling with error logging

#### Structured Log Format (MANDATORY)

**Format:**
```python
f"[{LOG_LEVEL}][{FUNCTION_OR_METHOD_NAME}][{CURRENT_BLOCK_NAME}][{OPERATION_TYPE}] Description [STATUS]"
```

**Log Level Usage:**
- **DEBUG**: Detailed debugging information for developers analyzing specific blocks
- **INFO**: General informational messages about execution flow (start/stop operations, successful step results)
- **WARNING**: Potential problems or non-critical errors that don't stop block/function execution
- **ERROR**: Errors that prevented current operation completion in the block, but function/application can continue
- **CRITICAL**: Very serious errors that may lead to application shutdown

**OPERATION_TYPE Examples:**
- `Params` - Parameter logging
- `ConditionCheck` - Condition evaluation
- `ReturnData` - Return value logging
- `CallExternal` - External call
- `StepComplete` - Step completion
- `ExceptionCaught` - Exception handling
- `Validation` - Validation operation
- `Transform` - Data transformation
- `Read` - Read operation
- `Write` - Write operation

**STATUS Examples:**
- `SUCCESS` - Operation succeeded
- `FAIL` - Operation failed
- `ATTEMPT` - Operation attempt
- `INFO` - Informational status
- `VALUE` - Value indicator
- `ERROR_STATE` - Error state

#### Logging Examples

```python
# Example 1: Condition check
condition_result = (argument1 > 10)
logger.debug(f"[DEBUG][{function_name}][VALIDATION][ConditionCheck] Результат условия (argument1 > 10): {condition_result} [{'SUCCESS' if condition_result else 'FAIL'}]")

# Example 2: Function entry
logger.info(f"[INFO][{function_name}][PARAMS][Params] Входные параметры: arg1={arg1}, arg2={arg2} [INFO]")

# Example 3: Return value
logger.debug(f"[DEBUG][{function_name}][RETURN_BLOCK][ReturnData] Возвращаемое значение: {result_value} [VALUE]")

# Example 4: Block completion
logger.info(f"[INFO][{function_name}][NESTED_BLOCK_2_1][StepComplete] Вложенный блок выполнен успешно [SUCCESS]")

# Example 5: Error handling
try:
    # ... code ...
except Exception as e:
    logger.error(f"[ERROR][{function_name}][PROCESSING][ExceptionCaught] Ошибка обработки: {str(e)} [ERROR_STATE]")
```

### Complete Example

```python
# START_FUNCTION_validateUserInput
# CONTRACT:
# PURPOSE: Валидирует входные данные пользователя перед обработкой
# INPUTS:
#   - user_data: dict - Словарь с данными пользователя (email, age)
# OUTPUTS:
#   - bool - True если данные валидны, False иначе
# SIDE_EFFECTS:
#   - Логирует результаты валидации
# TEST_CONDITIONS_SUCCESS_CRITERIA:
#   - Email должен содержать символ @
#   - Возраст должен быть в диапазоне 18-120
# LINKS_TO_SPECIFICATION: [ТЗ п. 3.2.1 "Валидация пользовательских данных"]
# KEYWORDS: [validation, user_input, data_quality]
# LINKS: [processUserData, UserDataException]

def validateUserInput(user_data: dict) -> bool:
    """
    Валидирует входные данные пользователя перед обработкой
    """
    logger.info(f"[INFO][validateUserInput][PARAMS][Params] Входные данные: {user_data} [INFO]")

    #START_EMAIL_VALIDATION: Проверка корректности email
    email = user_data.get('email', '')
    is_email_valid = '@' in email and len(email) > 3
    logger.debug(f"[DEBUG][validateUserInput][EMAIL_VALIDATION][ConditionCheck] Email валиден: {is_email_valid} [{'SUCCESS' if is_email_valid else 'FAIL'}]")

    if not is_email_valid:
        logger.warning(f"[WARNING][validateUserInput][EMAIL_VALIDATION][Validation] Невалидный email: {email} [FAIL]")
        return False
    #END_EMAIL_VALIDATION

    #START_AGE_VALIDATION: Проверка возраста в допустимом диапазоне
    age = user_data.get('age', 0)
    is_age_valid = 18 <= age <= 120
    logger.debug(f"[DEBUG][validateUserInput][AGE_VALIDATION][ConditionCheck] Возраст валиден: {is_age_valid}, age={age} [{'SUCCESS' if is_age_valid else 'FAIL'}]")

    if not is_age_valid:
        logger.warning(f"[WARNING][validateUserInput][AGE_VALIDATION][Validation] Возраст вне диапазона: {age} [FAIL]")
        return False
    #END_AGE_VALIDATION

    #START_RETURN_RESULT: Возврат результата валидации
    result = True
    logger.info(f"[INFO][validateUserInput][RETURN_RESULT][ReturnData] Валидация успешна [SUCCESS]")
    #END_RETURN_RESULT

    return result
# END_FUNCTION_validateUserInput
```

### Code Generation Checklist

When writing or modifying code, ensure:

- [ ] Module has complete MODULE_CONTRACT and MODULE_MAP
- [ ] All functions have START_FUNCTION/END_FUNCTION tags
- [ ] All classes have START_CLASS/END_CLASS tags
- [ ] All functions/classes have complete CONTRACT sections
- [ ] All logic is divided into named blocks with START/END tags
- [ ] All blocks have Russian descriptions
- [ ] Logger is initialized with `logging.getLogger(__name__)`
- [ ] All logs follow the structured format
- [ ] Log messages reference correct block names
- [ ] All CONTRACT sections are accurate and up-to-date
- [ ] MODULE_MAP reflects all public functions and classes
- [ ] USE_CASES are documented in AAG format

---

**Remember:** This semantic markup system is designed for efficient navigation and comprehension. Use it actively, maintain it carefully, and your development velocity will significantly increase.
