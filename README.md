# TODO API — Документация проекта

REST API для управления задачами (TODO), построенное на **Express**, **TypeScript** с использованием архитектуры, основанной на принципах **Dependency Injection**.

---

## 📋 Оглавление

- [О проекте](#о-проекте)
- [Технологический стек](#технологический-стек)
- [Структура проекта](#структура-проекта)
- [Установка и запуск](#установка-и-запуск)
- [API Endpoints](#api-endpoints)
- [Архитектура](#архитектура)
- [Валидация данных](#валидация-данных)
- [Обработка ошибок](#обработка-ошибок)
- [Тестирование](#тестирование)

---

## 📖 О проекте

Проект представляет собой RESTful API для CRUD-операций с задачами (TODO). Каждая задача имеет:
- `id` — уникальный идентификатор (number)
- `title` — название задачи (string)
- `done` — статус выполнения (boolean)

### Основные возможности:
- ✅ Создание, чтение, обновление и удаление задач
- 🔍 Фильтрация задач по статусу (`done`) и поиску (`search`)
- ✔️ Валидация входных данных с помощью Zod
- 🧪 Интеграционные тесты на Vitest + Supertest
- 🏗️ Модульная архитектура с внедрением зависимостей

---

## 🛠 Технологический стек

| Категория | Технологии |
|-----------|------------|
| **Язык** | TypeScript |
| **Фреймворк** | Express 5.x |
| **Валидация** | Zod |
| **Тестирование** | Vitest, Supertest |
| **Сборка** | tsx, nodemon |
| **Типизация** | Строгая (strict mode) |

### Зависимости

**Основные:**
- `express` — веб-фреймворк
- `zod` — схема-валидация
- `better-sqlite3` — SQLite драйвер (подготовлен для использования)
- `bcrypt`, `jsonwebtoken`, `cookie-parser` — для будущей аутентификации
- `dotenv` — управление переменными окружения

**Dev-зависимости:**
- `typescript` — компилятор TS
- `vitest` — фреймворк для тестирования
- `supertest` — HTTP-ассерции для тестов
- `nodemon`, `tsx` — hot-reload и выполнение TS
- `vite-tsconfig-paths` — поддержка алиасов путей

---

## 📁 Структура проекта

```
/workspace
├── src/
│   ├── controllers/          # Контроллеры (обработка запросов)
│   │   └── todo.controller.ts
│   ├── middleware/           # Промежуточное ПО
│   │   ├── errorHandler.ts   # Глобальный обработчик ошибок
│   │   └── validate.ts       # Middleware для валидации Zod
│   ├── modules/              # Модули (DI-сборка)
│   │   └── todo/
│   │       └── todo.di.ts    # Сборка зависимостей модуля TODO
│   ├── repositories/         # Слой доступа к данным
│   │   ├── interfaces.ts     # Интерфейсы репозиториев
│   │   └── todo.repository.ts # Реализация репозитория TODO
│   ├── routes/               # Маршрутизация
│   │   └── todos.ts          # Роуты для TODO
│   ├── schemas/              # Zod-схемы валидации
│   │   └── todo.ts           # Схемы для CRUD операций
│   ├── services/             # Бизнес-логика
│   │   ├── todo.service.ts   # Сервис TODO
│   │   └── todo.service.test.ts # Юнит-тесты сервиса
│   ├── types/                # TypeScript типы
│   │   ├── express.d.ts      # Расширение типов Express
│   │   └── todo.ts           # Тип Todo
│   ├── utils/                # Утилиты
│   │   └── AppError.ts       # Класс операционных ошибок
│   └── server.ts             # Точка входа приложения
├── tests/                    # Интеграционные тесты
│   └── todos.integration.test.ts
├── package.json
├── tsconfig.json
└── vitest.config.mts
```

---

## 🚀 Установка и запуск

### Требования
- Node.js >= 18
- npm или yarn

### Установка зависимостей
```bash
npm install
```

### Команды скриптов

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск в режиме разработки с nodemon |
| `npm run build` | Компиляция TypeScript в JavaScript |
| `npm run start` | Запуск скомпилированного приложения |
| `npm test` | Запуск всех тестов |
| `npm run test:watch` | Запуск тестов в режиме наблюдения |

### Запуск сервера
```bash
# Режим разработки
npm run dev

# Продакшен
npm run build
npm run start
```

Сервер запустится на `http://localhost:3000`

---

## 🌐 API Endpoints

Базовый путь: `/todos`

### GET /todos
Получить список всех задач.

**Query параметры:**
| Параметр | Тип | Описание |
|----------|-----|----------|
| `done` | boolean | Фильтр по статусу выполнения |
| `search` | string | Поиск по названию задачи |

**Примеры:**
```bash
GET /todos
GET /todos?done=true
GET /todos?search=Express
```

**Ответ:** `200 OK`
```json
[
  { "id": 1, "title": "Изучить Express", "done": false },
  { "id": 2, "title": "Написать API", "done": true }
]
```

---

### GET /todos/:id
Получить задачу по ID.

**Параметры пути:**
| Параметр | Тип | Описание |
|----------|-----|----------|
| `id` | number | Положительное целое число |

**Пример:**
```bash
GET /todos/1
```

**Ответ:** `200 OK`
```json
{ "id": 1, "title": "Изучить Express", "done": false }
```

**Ошибки:**
- `400 Bad Request` — невалидный ID
- `404 Not Found` — задача не найдена

---

### POST /todos
Создать новую задачу.

**Тело запроса:**
```json
{
  "title": "string (1-100 символов)"
}
```

**Пример:**
```bash
POST /todos
Content-Type: application/json

{ "title": "Новая задача" }
```

**Ответ:** `201 Created`
```json
{ "id": 3, "title": "Новая задача", "done": false }
```

**Ошибки:**
- `400 Bad Request` — title отсутствует или пустой

---

### PUT /todos/:id
Обновить существующую задачу.

**Параметры пути:**
| Параметр | Тип | Описание |
|----------|-----|----------|
| `id` | number | ID задачи |

**Тело запроса (все поля опциональны):**
```json
{
  "title": "string (1-100 символов)",
  "done": boolean
}
```

**Пример:**
```bash
PUT /todos/1
Content-Type: application/json

{ "done": true }
```

**Ответ:** `200 OK`
```json
{ "id": 1, "title": "Изучить Express", "done": true }
```

**Ошибки:**
- `400 Bad Request` — пустой title
- `404 Not Found` — задача не найдена

---

### DELETE /todos/:id
Удалить задачу.

**Параметры пути:**
| Параметр | Тип | Описание |
|----------|-----|----------|
| `id` | number | ID задачи |

**Пример:**
```bash
DELETE /todos/1
```

**Ответ:** `204 No Content`

**Ошибки:**
- `404 Not Found` — задача не найдена

---

## 🏗 Архитектура

Проект следует многослойной архитектуре с четким разделением ответственности:

```
┌─────────────────┐
│   Controller    │ ← Обработка HTTP запросов/ответов
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Service      │ ← Бизнес-логика и правила
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Repository    │ ← Доступ к данным
└─────────────────┘
```

### Слои

#### 1. Controllers (`src/controllers/`)
- Обрабатывают входящие HTTP-запросы
- Извлекают данные из `req.body`, `req.params`, `req.query`
- Вызывают методы сервиса
- Формируют HTTP-ответы

#### 2. Services (`src/services/`)
- Содержат бизнес-логику
- Проверяют бизнес-правила (например, "title не может быть пустым")
- Работают с репозиториями
- Бросают `AppError` при операционных ошибках

#### 3. Repositories (`src/repositories/`)
- Абстракция над хранением данных
- Реализуют интерфейс `ITodoRepository`
- В текущей версии используют in-memory массив (легко заменяется на БД)

#### 4. Modules / DI (`src/modules/`)
- Собирают зависимости модуля
- Создают экземпляры repository → service → controller → router
- Обеспечивают слабую связанность компонентов

---

## ✅ Валидация данных

Валидация выполняется с помощью **Zod** на уровне middleware.

### Схемы (`src/schemas/todo.ts`)

| Схема | Назначение |
|-------|------------|
| `createTodoSchema` | Валидация тела POST-запроса |
| `updateTodoSchema` | Валидация тела PUT-запроса |
| `getTodoByIdSchema` | Валидация параметра `:id` |
| `getTodosQuerySchema` | Валидация query-параметров |

### Правила валидации

**Create:**
- `title`: строка, 1-100 символов, обязательное поле

**Update:**
- `title`: строка, 1-100 символов (опционально)
- `done`: boolean (опционально)

**ID параметр:**
- `id`: положительное целое число (автоматическое приведение типа)

**Query параметры:**
- `done`: boolean (приведение через `z.coerce`)
- `search`: строка (trim пробелов)

### Middleware валидации

```typescript
validate(schema, source?) // source: 'body' | 'params' | 'query'
```

При ошибке валидации возвращается `400 Bad Request` с детальным сообщением.

---

## ⚠️ Обработка ошибок

### Класс AppError

```typescript
class AppError extends Error {
  statusCode: number;
  isOperational: boolean; // отличает ожидаемые ошибки от багов
}
```

### Типы ошибок

| Статус | Описание | Пример |
|--------|----------|--------|
| 400 | Bad Request | Невалидные данные |
| 404 | Not Found | Ресурс не найден |
| 500 | Internal Server Error | Неожиданная ошибка |

### Глобальный обработчик

Middleware `errorHandler`:
- Логгирует неожиданные ошибки в консоль
- Возвращает клиенту только сообщение об операционных ошибках
- Скрывает детали внутренних ошибок (безопасность)

---

## 🧪 Тестирование

### Инструменты
- **Vitest** — фреймворк для тестов
- **Supertest** — HTTP-ассерции
- **cross-env** — переменные окружения для тестов

### Типы тестов

#### Интеграционные тесты (`tests/todos.integration.test.ts`)
Тестируют полный HTTP-цикл:
- Все CRUD операции
- Валидацию входных данных
- Фильтрацию и поиск
- Обработку ошибок (404, 400)

#### Юнит-тесты (`src/services/todo.service.test.ts`)
Тестируют бизнес-логику сервиса изолированно.

### Запуск тестов

```bash
# Однократный запуск
npm test

# Режим наблюдения
npm run test:watch
```

### Покрытие тестами

Тесты покрывают:
- ✅ Успешные сценарии всех endpoints
- ✅ Валидацию входных данных
- ✅ Обработку ошибок (404, 400)
- ✅ Фильтрацию и поиск

---

## 🔧 Конфигурация

### TypeScript (`tsconfig.json`)
- Target: ES2020
- Module: CommonJS
- Strict mode: включен
- Path aliases: `@/*` → `src/*`

### Vitest (`vitest.config.mts`)
- Globals: включены (`describe`, `it`, `expect`)
- Alias: `@` → `src`

---

## 📝 Примеры использования

### cURL

```bash
# Получить все задачи
curl http://localhost:3000/todos

# Получить задачу по ID
curl http://localhost:3000/todos/1

# Создать задачу
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Новая задача"}'

# Обновить задачу
curl -X PUT http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"done":true}'

# Удалить задачу
curl -X DELETE http://localhost:3000/todos/1
```

### JavaScript/TypeScript (fetch)

```typescript
// Получить все задачи
const response = await fetch('http://localhost:3000/todos');
const todos = await response.json();

// Создать задачу
const created = await fetch('http://localhost:3000/todos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Моя задача' })
});
```

---

## 🔄 Расширяемость

### Добавление нового модуля

1. Создать типы в `src/types/`
2. Определить Zod-схемы в `src/schemas/`
3. Реализовать репозиторий (интерфейс + класс)
4. Создать сервис с бизнес-логикой
5. Добавить контроллер
6. Настроить роуты
7. Собрать модуль в `src/modules/`

### Замена хранилища данных

Текущая реализация использует in-memory массив. Для подключения БД:
1. Реализовать `ITodoRepository` с использованием нужной БД
2. Обновить фабрику в `todo.di.ts`

---

## 📄 Лицензия

MIT
