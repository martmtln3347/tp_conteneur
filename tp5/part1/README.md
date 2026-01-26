# TP5 — Part 1 — Raw WebSockets

Ce dossier contient 2 apps :
- `backend/` : serveur WebSocket (lib `ws`), broadcast des messages + compteur d'utilisateurs
- `frontend/` : page HTML servie en dev (hot-reload) qui se connecte au WS

## Démarrage (Docker)

Depuis `tp5/part1` :

```bash
docker compose up --build
```

- Frontend : http://localhost:8081
- Backend WS : ws://localhost:8080

## Variables d'environnement

Voir `.env`.
- `BACKEND_PORT` : port exposé côté hôte pour le WS (par défaut 8080)
- `FRONTEND_PORT` : port exposé côté hôte pour le HTTP (par défaut 8081)

> Note : par consigne, le client WebSocket utilise `localhost` (navigateur sur le PC).

## Fonctionnement

Les messages WS sont en JSON :
- `{ "type": "message", "value": "..." }`
- `{ "type": "user_count", "value": 3 }`
