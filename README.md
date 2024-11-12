---
# NeuroDialogue
---
Представляем Вашему вниманию чат, позволяющий использовать модели искусственного интеллекта нескольких видов.

![](example/chat.png)

В проекте используются следующие модели:
- [nougat-ocr](https://github.com/facebookresearch/nougat) - модель извлечения текста из формата pdf в формат markdown(версия 0.1.0-base)
- [vosk-model-tts-ru](https://github.com/alphacep/vosk-tts?tab=readme-ov-file) - модель преобразования текста в речь(**TTS - text to speech**)(версия 0.7-multi)
- [stabilityai/stable-video-diffusion-img2vid-xt](https://huggingface.co/stabilityai/stable-video-diffusion-img2vid-xt) - модель преобразования изображения в видео

## Локальное развёртывание
---
Выполните ниже перечисленные указания, чтобы локально запустить собственный экземпляр пользовательского интерфейса чат-бота.

### 1. Клонировать репозиторий

```shell
git clone https://github.com/CitizenFourCF4/NeuroDialogue.git
```

Клонированный проект состоит из 4-х сервисов:
- Сервис регистрации / логина (Keycloak)
- Frontend (React)
- Backend (Django)
- Database (PostgreSQL)

Структура директорий клонированного проекта:

```
NeuroDialogue
├── backend
├── frontend
└── keycloack
```

В каждой из директорий требуется последовательно запустить сервисы. Последовательность запуска указана ниже.
### 2. Keycloak

Средство авторизации в проекте.

1. Для начала работы необходимо [скачать](https://www.keycloak.org/downloads) актуальную версию (26.0.5) в корень проекта
2. Подготовить `realm` с именем `react-realm`, `clientId` с именем `react-client` [здесь](https://blog.logrocket.com/implement-keycloak-authentication-react/) указан способ.
3. Запустить сервис командой

- На linux

```shell
./bin/kc.sh start-dev
```

- На windows

```shell
./bin/kc.bat start-dev
```

Сервер будет развернут по адресу `http://localhost:8080`

### 3. Backend

Для запуска необходимо установить требуемые библиотеки командой

```shell
pip install -r requirements.txt
```

Файл `requirements.txt` лежит в папке `backend`
1. Необходимо загрузить модели так, как указано в туториале (появится позднее)
2. Запустить PostgreSQL и создать базу данных (вводим только её название)
3. Создать в директории `backend` .env файл. В нем должны быть следующие поля:

- `DJANGO_SECRET_KEY` - случайная последовательность символов, начинающаяся с @
- `DATABASE_NAME` - имя созданной базы данных
- `DATABASE_USER` - по умолчанию = `postgres`
- `DATABASE_PASSWORD`
- `SERVER_URL` - укажите 'http://localhost:8000'

4. Соединить Django с PostgreSQL при помощи команд

```shell
python manage.py makemigrations 
python manage.py makemigrations base
python manage.py migrate
```

5. Запустить сервер командой

```shell
python manage.py runserver
```

Сервер будет развернут по адресу `http://localhost:8000`

### 4. Frontend

Представляет из себя чат. Запросы на сервер отправляются через `axios`. Для запуска приложения необходимо:

1. [Установить](https://nodejs.org/en) `node.js` актуальной версии 
2. [Установить](https://classic.yarnpkg.com/lang/en/docs/install) менеджер пакетов `yarn` актуальной версии 
3. Перейти в директорию `frontend` проекта
4. Установить зависимости командой

```shell
yarn install   
```

5. Запустить проект командой

```shell
yarn dev
```

После этого ваше React-приложение должно запуститься по адресу `http://localhost:5173`
