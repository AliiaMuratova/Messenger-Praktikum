# Учебный проект Messenger
## Описание

Messenger — SPA-приложение, построенное на собственной компонентной архитектуре с использованием шаблонизатора Handlebars.

Список страниц:

- [Навигация](https://messenger-app-praktikum.netlify.app) - главная страница с навигацией
- [Вход](https://messenger-app-praktikum.netlify.app/login) - страница входа
- [Регистрация](https://messenger-app-praktikum.netlify.app/signup) - страница регистрации
- [Чат](https://messenger-app-praktikum.netlify.app/chat) - страница с мессенджером (со списком чатов и диалоговым окном)
- [Профиль](https://messenger-app-praktikum.netlify.app/profile) - страница управления профилем юзера
- [Ошибка 404](https://messenger-app-praktikum.netlify.app/error404) - страница обработки ошибки 404
- [Ошибка 500](https://messenger-app-praktikum.netlify.app/error500) - страница обработки ошибки 500

## Функциональность

- **Компонентная архитектура** — все UI-элементы построены на базовом классе `Block` с жизненным циклом (init, componentDidMount, componentDidUpdate, render)
- **Реактивность** — автоматическое обновление компонентов при изменении props через Proxy и EventBus
- **Валидация форм** — проверка полей (first_name, second_name, login, email, password, phone, message) с отображением ошибок
- **Модальное окно** — загрузка аватара

## Стек технологий

- **TypeScript**
- **Handlebars**
- **Vite**
- **PostCSS**
- **ESLint**
- **Stylelint**


## Структура проекта

```
src/core/                  # Ядро приложения
    Block.ts               # Базовый класс компонентов
    EventBus.ts            # Шина событий

src/pages/                 # Страницы приложения
    NavigationPage/        # Навигация по страницам проекта
    LoginPage/             # Страница входа
    SignupPage/            # Страница регистрации
    ChatPage/              # Страница чата с лентой диалогов и диалоговым окном
    ProfilePage/           # Страница профиля юзера
    ErrorPage/             # Страница ошибок

src/assets/                # Статические файлы(fonts, icons, images)
src/api/                   # HTTP-транспорт

src/components/            # Переиспользуемые компоненты
    common/                # Общие переиспользуемые компоненты (Button, Input)
    Form/                  # Компонент формы для страницы Входа и Регистрации
    Modal/                 # Компонент модального окна

src/utils/                 # Утилиты
    validation/            # Валидация полей форм

src/styles/                # Глобальные стили
src/types                  # Общие типы
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
Команда собирает проект и запускает его на 3000 порту

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
