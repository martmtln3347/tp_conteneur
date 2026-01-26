# TP5 — Part 4 — Traefik haz things for u

Cette partie reprend la Part 3 (Socket.io + Redis) et ajoute **Traefik** comme reverse-proxy.

Objectifs :
- **Une seule URL** pour le frontend et le backend (plus de CORS)
- Socket.io servi sur l'URI **`/socket/`**
- Traefik fait le reverse-proxy + load-balancing
- La stack peut **scale** (stateless + Redis + LB)

## Démarrage

Depuis `tp5/part4` :

```bash
docker compose up --build
```

### Accès
- App (frontend + websocket) : `http://localhost/`
- Dashboard Traefik : `http://localhost:8080/`

> Si tu as déjà quelque chose qui utilise le port `8080` sur ta machine (ex: la Part 1), coupe l’autre stack avant de lancer la Part 4.

## Scale

```bash
docker compose up --build --scale backend=5 --scale frontend=5
```

## Notes
- Seul Traefik expose des ports vers l’hôte.
- Redis n’est pas exposé : accessible uniquement depuis le backend.
