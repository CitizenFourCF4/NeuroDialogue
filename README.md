Данный проект состоит из 4 сервисов:
- Frontend (React) 
- Backend (Django)
- Database (PostgreSQL)
- Сервис регистрации / логина (Keycloak)

#### Frontend
Представляет из себя чат. Запросы на сервер отправляются через `axios`. 
Для запуска приложения необходимо:
1) Установить `node.js` актуальной версии
2) Установить менеджер пакетов `yarn` актуальной версии
3) Установить зависимости командой 
```bash
yarn install   
```
4) Запустить проект командой 
```
yarn dev
```
После этого ваше React-приложение должно запуститься по адресу `http://localhost:5173`.

#### Backend
Для запуска необходимо установить требуемые библиотеки командой 
```bash
pip install -r requirements.txt
```

1) Необходимо загрузить модели так, как указано в туториале (появится позднее)
2) Запустить PostgreSQL
3) Создать .env файл. В нем должны быть следующие поля
- DJANGO_SECRET_KEY
- DATABASE_NAME
- DATABASE_USER
- DATABASE_PASSWORD
- SERVER_URL
4) Соединить Django с PostgreSQL при помощи команд
```bash
python manage.py makemigrations
python manage.py migrate
```
5) Запустить сервер командой 
```bash
python manage.py runserver
```
Сервер будет развернут по адресу `http://localhost:8000`

#### Keycloak
Средство авторизации в проекте. 
1) Для начала работы необходимо скачать актуальную версию (у меня - 25.0.5) https://www.keycloak.org/archive/downloads-25.0.5.html
2) Подготовить `realm` с именем `react-realm`, `clientId` с именем `react-client` здесь указан способ https://blog.logrocket.com/implement-keycloak-authentication-react/
3) Запустить сервис командой 
```bash
./bin/kc.sh start-dev
```
Сервер будет развернут по адресу  `http://localhost:8080`
