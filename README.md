# Учебный проект Messenger
## Описание

Messenger — SPA-приложение, построенное на собственной компонентной архитектуре с использованием шаблонизатора Handlebars. Приложение реализует полноценный мессенджер с авторизацией, чатами и обменом сообщениями в реальном времени через WebSocket.

## Страницы приложения

- [Вход](https://messenger-app-praktikum.netlify.app) - страница входа
- [Регистрация](https://messenger-app-praktikum.netlify.app/sign-up) - страница регистрации
- [Чат](https://messenger-app-praktikum.netlify.app/messenger) - страница с мессенджером (со списком чатов и диалоговым окном)
- [Профиль](https://messenger-app-praktikum.netlify.app/settings) - страница управления профилем юзера
- [Ошибка 404](https://messenger-app-praktikum.netlify.app/404) - страница обработки ошибки 404
- [Ошибка 500](https://messenger-app-praktikum.netlify.app/500) - страница обработки ошибки 500

## Функциональность

### Компонентная архитектура
- Базовый класс `Block` с полным жизненным циклом (init, componentDidMount, componentDidUpdate, render)
- Реактивное обновление компонентов через Proxy и EventBus
- Поддержка вложенных компонентов и списков

### Роутинг
- Собственный SPA-роутер с History API
- Защищённые маршруты
- Обработка 404 ошибок

### Авторизация
- Регистрация и вход пользователей
- Сохранение сессии через cookies
- Автоматический редирект при отсутствии авторизации

### Чаты и сообщения
- Создание, удаление чатов
- Добавление/удаление пользователей в чат
- Обмен сообщениями в реальном времени через WebSocket
- Отправка изображений
- Подгрузка истории сообщений

### Профиль
- Редактирование данных пользователя
- Смена аватара
- Изменение пароля

### Валидация форм
- Проверка полей: имя, фамилия, логин, email, пароль, телефон
- Отображение ошибок валидации

### Обработка ошибок
- Типизированные ошибки API (UnauthorizedError, NotFoundError, ValidationError и др.)
- Централизованная обработка через errorHandler
- Редирект на страницу 500 при серверных ошибках

## Стек технологий

- **TypeScript** — типизация
- **Handlebars** — шаблонизатор
- **Vite** — сборщик
- **PostCSS** — стили с вложенностью
- **ESLint** — линтинг кода
- **Stylelint** — линтинг стилей

## Структура проекта

```
src/
├── api/                      # Работа с API
│   ├── auth/                 # Авторизация (signIn, signUp, logout, getUser)
│   ├── http/                 # HTTP-транспорт и типизированные ошибки
│   ├── messenger/            # Чаты и сообщения
│   ├── profile/              # Профиль пользователя
│   ├── resources/            # Загрузка файлов
│   ├── user/                 # Поиск пользователей
│   └── websocket/            # WebSocket-транспорт
│
├── components/               # Переиспользуемые компоненты
│   ├── common/               # Button, Input
│   ├── Form/                 # Форма авторизации/регистрации
│   └── Modal/                # Модальное окно
│
├── core/                     # Ядро приложения
│   ├── Block.ts              # Базовый класс компонентов
│   ├── EventBus.ts           # Шина событий
│   └── Router.ts             # SPA-роутер
│
├── pages/                    # Страницы
│   ├── LoginPage/            # Вход
│   ├── SignupPage/           # Регистрация
│   ├── ChatPage/             # Мессенджер
│   ├── ProfilePage/          # Профиль
│   └── ErrorPage/            # Страницы ошибок
│
├── utils/                    # Утилиты
│   ├── errorHandler/         # Обработка ошибок
│   ├── validation/           # Валидация форм
│   └── helpers/              # Вспомогательные функции
│
├── assets/                   # Статика (шрифты, иконки, изображения)
├── styles/                   # Глобальные стили
└── types/                    # Общие типы TypeScript
```

## Установка и запуск

### Установка зависимостей

```bash
npm install
```

### Запуск проекта

```bash
npm run start
```
Собирает проект и запускает на порту 3000

### Запуск dev-сервера

```bash
npm run dev
```

### Сборка проекта

```bash
npm run build
```

### Предпросмотр production сборки

```bash
npm run preview
```

### Линтинг и проверка типов

```bash
npm run lint
npm run lint:fix
npm run typecheck
npm run stylelint
npm run stylelint:fix 
```

## Ссылки

- [Макет в Figma](https://www.figma.com/design/jF5fFFzgGOxQeB4CmKWTiE/Chat_external_link?node-id=1-537&t=bmTTWnQznrmOVH6m-0) - дизайн-макет проекта
- [Деплой проекта](https://messenger-app-praktikum.netlify.app) - ссылка на развёрнутую версию приложения
