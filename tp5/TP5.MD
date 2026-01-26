# TP5 — WebSockets

## Part 1 — Raw WebSockets

### Objectif
Mettre en place un mini chat en **WebSocket brut** (lib `ws`) avec :
- un **backend** WebSocket (broadcast des messages)
- un **frontend** HTML qui se connecte au backend
- un **compteur d'utilisateurs connectés** synchronisé en temps réel
- un **packaging Docker** en dev avec hot-reload

---

## Arborescence
- `tp5/part1/backend/` : serveur WebSocket Node.js
- `tp5/part1/frontend/` : page HTML servie en dev
- `tp5/part1/compose.yml` : lance 2 conteneurs (front + back)
- `tp5/part1/.env` : ports exposés

---

## Démarrage

Depuis `tp5/part1` :

```bash
docker compose up --build
```

### Accès
- Frontend (HTTP) : `http://localhost:8081`
- Backend (WebSocket) : `ws://localhost:8080`

> Le frontend se connecte volontairement à `localhost` (navigateur sur le PC). Le backend est donc exposé via un mapping de port Docker.

---

## Fonctionnement WebSocket (format JSON)

Tous les messages échangés sont en JSON :

- Message de chat
```json
{ "type": "message", "value": "hello" }
```

- Compteur de users
```json
{ "type": "user_count", "value": 3 }
```

---

## Preuves attendues (à mettre dans le rendu)

### 1) Logs côté backend (obligatoire)
Dans un terminal, afficher :

```bash
docker compose logs -f backend
```

À capturer (copier/coller ou screenshot) :
- une ligne **"Client connected"**
- une ligne **"WS message received: ..."** quand un message est envoyé
- une ligne **"Client disconnected"**

### 2) Logs côté frontend (obligatoire)
Ouvrir la page, puis ouvrir la console du navigateur (F12).

À capturer (copier/coller ou screenshot) :
- une ligne **"[frontend] Connected"**
- une ligne **"[frontend] Message received:"** quand un message arrive

### 3) Compteur d'utilisateurs (feature)
À capturer (gif/screenshot ou description) :
- ouvrir **2 onglets** sur `http://localhost:8081`
- vérifier que **Users connected** passe à 2
- fermer 1 onglet, vérifier que ça redescend à 1

---

## Notes Docker / Dev
- Le `compose.yml` monte les dossiers en bind-mount + un volume `node_modules` pour permettre le hot-reload.
- Un `npm install` est exécuté au démarrage du conteneur en dev pour éviter les soucis de dépendances lors du premier `up`.

---

## Commandes utiles

Stopper :
```bash
docker compose down
```

Rebuild complet :
```bash
docker compose build --no-cache
```

État des conteneurs :
```bash
docker compose ps
```

---

## Remarque (audit)
Le frontend utilise `live-server` (dépendance de dev) et `npm audit` peut remonter des vulnérabilités transitoires. Ça n'impacte pas le fonctionnement du TP en local.

---

## Part 2 — socket.io

### Objectif
Reproduire le chat de la partie 1 mais avec **Socket.io**, en ajoutant :
- compteur d'utilisateurs via l'event `user_count`
- gestion de **3 rooms**

---

## Arborescence
- `tp5/part2/backend/` : serveur Socket.io
- `tp5/part2/frontend/` : page HTML + `client.js`
- `tp5/part2/compose.yml` : lance 2 conteneurs (front + back)
- `tp5/part2/.env` : ports exposés

---

## Démarrage

Depuis `tp5/part2` :

```bash
docker compose up --build
```

### Accès
- Frontend (HTTP) : `http://localhost:8083`
- Backend (Socket.io) : `http://localhost:8082`

> Les ports hôte sont configurés dans `tp5/part2/.env` (par défaut 8082/8083 pour éviter conflit avec la partie 1).

---

## Fonctionnalités

### Compteur d'utilisateurs
Le backend émet un event `user_count` à chaque connexion/déconnexion.

### Rooms
3 rooms : `cats`, `dogs`, `foxes`.

Le frontend propose des boutons pour changer de room. Les messages `chat` sont alors broadcast uniquement aux clients de la room.

---

## Preuves attendues (à mettre dans le rendu)

### 1) Logs côté backend
```bash
docker compose logs -f backend
```

À capturer :
- connexion/déconnexion avec l'ID socket
- un log quand un message `chat` est reçu
- un log quand un client join une room

### 2) Logs côté frontend
Console navigateur (F12) :
- `Connected with id: ...`
- `Chat received: ...`
- `User count: ...`

### 3) Rooms
- ouvrir 2 onglets
- mettre un onglet dans `cats` et l'autre dans `dogs`
- vérifier qu'un message envoyé dans une room n'apparaît pas dans l'autre

---

## Part 3 — pub/sub avec Redis

### Objectif
Reprendre la Part 2 et ajouter **Redis** pour que Socket.io gère ses événements via **pub/sub** (adapter Redis).

---

## Arborescence
- `tp5/part3/backend/` : serveur Socket.io + Redis adapter
- `tp5/part3/frontend/` : page HTML + `client.js`
- `tp5/part3/compose.yml` : lance 3 conteneurs (redis + front + back)
- `tp5/part3/.env` : ports exposés

---

## Démarrage

Depuis `tp5/part3` :

```bash
docker compose up --build
```

### Accès
- Frontend : `http://localhost:8085`
- Backend : `http://localhost:8084`

> Redis n'est pas exposé sur la machine hôte. Le backend s'y connecte via `redis://redis:6379` (nom du service dans le compose).

---

## Preuves attendues (à mettre dans le rendu)

### 1) Compose avec Redis
- montrer qu'un service `redis` existe dans `compose.yml`
- montrer qu'il n'y a pas de mapping de port pour Redis

### 2) Logs backend (adapter Redis actif)
```bash
docker compose logs -f backend
```

À capturer :
- une ligne qui indique que Redis adapter est activé (ou que Redis est connecté)
- connexion/déconnexion + rooms + chat comme en Part 2

### 3) Fonctionnel
- rooms OK
- compteur users OK

---

## Part 4 — Traefik haz things for u

### Objectif
Ajouter **Traefik** comme reverse-proxy pour avoir **une URL unique** (plus de CORS) :
- le backend Socket.io est servi sur **`/socket/`**
- le frontend reste servi sur `/`
- Traefik route `/socket` -> backend, le reste -> frontend

---

## Arborescence
- `tp5/part4/compose.yml` : traefik + redis + backend + frontend
- `tp5/part4/backend/src/server.js` : Socket.io avec `path: "/socket/"`
- `tp5/part4/frontend/public/client.js` : client Socket.io avec `path: "/socket/"`

---

## Démarrage

Depuis `tp5/part4` :

```bash
docker compose up --build
```

### Accès
- App : `http://localhost/`
- Dashboard Traefik : `http://localhost:8080/`

> Important : seul Traefik expose des ports vers l'hôte.

---

## Preuves attendues (à mettre dans le rendu)

### 1) Refacto /socket/
- montrer `path: "/socket/"` côté backend
- montrer `path: "/socket/"` + `transports: ["websocket"]` côté frontend

### 2) Traefik dans le compose
- service `traefik` + montage `docker.sock`
- labels backend : router `PathPrefix(`/socket`)`
- labels frontend : router `PathPrefix(`/`)`

### 3) Fonctionnel
- la page marche sur `http://localhost/`
- le chat marche (websocket via `/socket/`)

---

## MAKE IT SCALE

Depuis `tp5/part4` :

```bash
docker compose up --build --scale backend=5 --scale frontend=5
```

Traefik load-balance sur les réplicas, et Redis centralise les events (Socket.io adapter).
