# TP5 — Part 2 — socket.io

Cette partie implémente un mini chat avec :
- Socket.io (backend)
- Frontend HTML + `client.js`
- Compteur d'utilisateurs (event `user_count`)
- 3 rooms (choisies côté client)
- Docker en dev avec hot-reload

## Démarrage

Depuis `tp5/part2` :

```bash
docker compose up --build
```

## Accès

- Frontend : http://localhost:8083
- Backend : http://localhost:8082 (Socket.io)

## Rooms

3 rooms sont proposées : `cats`, `dogs`, `foxes`.

## Notes

- Le frontend se connecte à `localhost` (navigateur sur le PC) via le port exposé.
- Le port backend par défaut est `8082` (modifiable avec `?backendPort=XXXX`).
