# TP5 — Part 3 — pub/sub avec Redis

Cette partie reprend la Part 2 (Socket.io) et ajoute Redis pour gérer les événements Socket.io via pub/sub.

## Démarrage

Depuis `tp5/part3` :

```bash
docker compose up --build
```

## Accès
- Frontend : http://localhost:8085
- Backend : http://localhost:8084

## Notes
- Redis n'est pas exposé sur la machine hôte : seul le backend y accède via `redis://redis:6379` (nom de service docker compose).
- Les rooms et le compteur users fonctionnent comme en Part 2.
