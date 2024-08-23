# Запуск приложения в фон
start:
	docker compose -f docker-compose.shared.yml up -d
	docker compose up -d

# Запуск приложения c активным процессом
start_watch:
	docker compose -f docker-compose.shared.yml up -d
	docker compose up

# Выключение приложения
down:
	docker compose down
	docker compose -f docker-compose.shared.yml down
	docker compose -f docker-compose.test.yml down

# Пересобрать node контейнер
build:
	docker compose build

# Запуск приложения с активным процессом и контейнером для теста
start_watch_with_testing:
	docker compose -f docker-compose.shared.yml up -d
	docker compose -f docker-compose.test.yml up -d
	docker compose up
