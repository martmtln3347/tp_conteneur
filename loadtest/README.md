But: fournir un test de charge contrôlé (pas d'attaque).

Prérequis :
- Testez uniquement sur des systèmes que vous possédez ou sur des environnements de staging.
- Installer `k6` (https://k6.io) ou utiliser l'image Docker `loadimpact/k6`.

Fichiers créés :
- `loadtest/k6-script.js` — script k6 paramétrable.

Exemples d'utilisation :

1) Avec k6 installé localement :

```bash
# envoyer 1000 requêtes réparties sur 50 VUs
TARGET_URL=http://localhost:3000/ VUS=50 ITERATIONS=1000 k6 run loadtest/k6-script.js
```

2) Avec Docker (pratique si k6 non installé) :

```bash
# depuis le dossier du projet
docker run --rm -i \
  -e TARGET_URL=http://host.docker.internal:3000/ \
  -e VUS=50 -e ITERATIONS=1000 \
  -v "${PWD}:/scripts" \
  loadimpact/k6 run /scripts/loadtest/k6-script.js
```
