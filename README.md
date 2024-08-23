## Запуск проекта

```bash
  # Создать и настроить файл .env
  cp .env.example .env
```

### Запуск проекта в Docker

#### Билд приложения

```bash
  make build
```

#### Запуск приложения

```bash
  make start_watch
```

#### Выключить проект

```bash
  make down
```

## Запуск тестов

#### Запустить приложение с тестовой средой

```bash
  make start_watch_with_testing
```

```bash
  npm run test
```

## Документация API

[API DOC Swagger](http://localhost:3000/docs/)