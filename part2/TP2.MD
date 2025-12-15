
🌞 Construire l'image shitty_app à partir de ce Dockerfile :

PC@DESKTOP-TQF20R1 MINGW64 ~/Documents/tp_conteneur/part2/1 (main)
$ docker build -t shitty_app:1.0 .
#0 building with "desktop-linux" instance using docker driver

#1 [internal] load build definition from Dockerfile
#1 transferring dockerfile: 918B 0.0s done
#1 DONE 0.0s

#2 [internal] load metadata for docker.io/library/node:latest
#2 DONE 2.6s

#3 [internal] load .dockerignore
#3 transferring context: 2B done
#3 DONE 0.1s

#4 [internal] load build context
#4 transferring context: 1.52kB 0.0s done
#4 DONE 0.1s

🌞 Lancer l'application avec une commande docker run, cette commande :

PC@DESKTOP-TQF20R1 MINGW64 ~/Documents/tp_conteneur/part2/1 (main)
$ Docker run -d -p 3000:3000 --name shitty_app shitty_app:1.0
e7825c3fe07cce60851683bd403e73caa9e8212fbf4ab29220c552849c2fac2d


🌞 Prouvez que ça tourne, dans le compte-rendu, vous me mettez :

PC@DESKTOP-TQF20R1 MINGW64 ~/Documents/tp_conteneur/part2/1 (main)
$ docker ps
CONTAINER ID   IMAGE            COMMAND                  CREATED         STATUS         PORTS                                         NAMES
e7825c3fe07c   shitty_app:1.0   "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes   0.0.0.0:3000->80/tcp, [::]:3000->80/tcp       shitty_app

PC@DESKTOP-TQF20R1 MINGW64 ~/Documents/tp_conteneur/part2/1 (main)
$ docker logs shitty_app

> Shitty webapp for B3 Dev TP1@1.0.0 dev
> nodemon -L src/app.js

[nodemon] 3.1.11
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node src/app.js`
Server running at http://localhost:3000

PC@DESKTOP-TQF20R1 MINGW64 ~/Documents/tp_conteneur/part2/1 (main)
$ curl http://localhost:3000
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0


🌞 Lancer un nouveau conteneur à partir de l'image shitty_app

PC@DESKTOP-TQF20R1 MINGW64 ~/Documents/tp_conteneur/part2/1 (main)
$ Docker run -d -p 3000:3000 -v "C:\Users\PC\Documents\tp_conteneur\part2\1\src:/app/src" shitty_app:1.0
a6725d4e6074bac3be9d13b3de0b97613696257011641ac4860101fb2736ada3

🌞 Vérifier que ça fonctionne

PC@DESKTOP-TQF20R1 MINGW64 ~/Documents/tp_conteneur/part2/1 (main)
$ docker logs 3f9 -f

> Shitty webapp for B3 Dev TP1@1.0.0 dev
> nodemon -L src/app.js

[nodemon] 3.1.11
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node src/app.js`
Server running at http://localhost:3000


[nodemon] restarting due to changes...
[nodemon] starting `node src/app.js`
Server running at http://localhost:3000

4. Compose please

🌞 Transformer ce docker run en compose.yml

services:
  app:
    image: shitty_app:1.0
    ports:
      - "3000:3000"
    volumes:
      - ./src:/app/src

5. DB please

🌞 Créer un compose.yml

services:
  db:
    image: mysql:8.4
    environment:
      - MYSQL_ROOT_PASSWORD=root
    volumes:
      - db_data:/var/lib/mysql

  phpmyadmin:
    image: phpmyadmin
    ports:
      - "8080:80"

  volumes:
   db_data: 

    app: 
    image: shitty_app:1.0
    ports:
      - "3000:3000"
    volumes:
      - ./src:/app/src    

  environment:
  - DB_HOST=db # en supposant que vous avez bien déclaré votre conteneur MySQL avec le nom "db"
  - DB_USER=root
  - DB_PASSWORD=root
  - DB_NAME=shitty_app_db
  - DB_PORT=3306
  - PORT=3000      


🌞 Allumer la stack et prouver que ça fonctionne

PC@DESKTOP-TQF20R1 MINGW64 ~/Documents/tp_conteneur/part2/5 (main)
$ docker ps
CONTAINER ID   IMAGE            COMMAND                  CREATED          STATUS         PORTS                                         NAMES
2c3e5a6c0975   mysql:8.4        "docker-entrypoint.s…"   41 seconds ago   Up 5 seconds   3306/tcp, 33060/tcp                           5-db-1
2a39de55945e   shitty_app:1.0   "docker-entrypoint.s…"   41 seconds ago   Up 5 seconds   0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp   5-app-1
aefee6848c47   phpmyadmin       "/docker-entrypoint.…"   3 minutes ago    Up 5 seconds   0.0.0.0:8080->80/tcp, [::]:8080->80/tcp       5-phpmyadmin-1

PC@DESKTOP-TQF20R1 MINGW64 ~/Documents/tp_conteneur/part2/5 (main)
$ docker compose logs
db-1          | 2025-12-15 14:50:03+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 8.4.7-1.el9 started.
phpmyadmin-1  | AH00558: apache2: Could not reliably determine the server's fully qualified domain name, using 172.21.0.2. Set the 'ServerName' directive globally to suppress this message
app-1         |
db-1          | 2025-12-15 14:50:04+00:00 [Note] [Entrypoint]: Switching to dedicated user 'mysql'
db-1          | 2025-12-15 14:50:04+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 8.4.7-1.el9 started.
app-1         | > Shitty webapp for B3 Dev TP1@1.0.0 dev
phpmyadmin-1  | AH00558: apache2: Could not reliably determine the server's fully qualified domain name, using 172.21.0.2. Set the 'ServerName' directive globally to suppress this message
app-1         | > nodemon -L src/app.js
phpmyadmin-1  | [Mon Dec 15 14:50:03.973604 2025] [mpm_prefork:notice] [pid 1:tid 1] AH00163: Apache/2.4.65 (Debian) PHP/8.3.28 configured -- resuming normal operations
db-1          | '/var/lib/mysql/mysql.sock' -> '/var/run/mysqld/mysqld.sock'
phpmyadmin-1  | [Mon Dec 15 14:50:03.973667 2025] [core:notice] [pid 1:tid 1] AH00094: Command line: 'apache2 -D FOREGROUND'
phpmyadmin-1  | [Mon Dec 15 14:50:33.568526 2025] [mpm_prefork:notice] [pid 1:tid 1] AH00170: caught SIGWINCH, shutting down gracefully
app-1         |
phpmyadmin-1  | AH00558: apache2: Could not reliably determine the server's fully qualified domain name, using 172.21.0.2. Set the 'ServerName' directive globally to suppress this message
app-1         | [nodemon] 3.1.11
app-1         | [nodemon] to restart at any time, enter `rs`
app-1         | [nodemon] watching path(s): *.*
phpmyadmin-1  | AH00558: apache2: Could not reliably determine the server's fully qualified domain name, using 172.21.0.2. Set the 'ServerName' directive globally to suppress this message
db-1          | 2025-12-15T14:50:04.242075Z 0 [System] [MY-015015] [Server] MySQL Server - start.
app-1         | [nodemon] watching extensions: js,mjs,cjs,json
phpmyadmin-1  | [Mon Dec 15 14:50:38.416931 2025] [mpm_prefork:notice] [pid 1:tid 1] AH00163: Apache/2.4.65 (Debian) PHP/8.3.28 configured -- resuming normal operations
phpmyadmin-1  | [Mon Dec 15 14:50:38.416999 2025] [core:notice] [pid 1:tid 1] AH00094: Command line: 'apache2 -D FOREGROUND'
app-1         | [nodemon] starting `node src/app.js`
app-1         | node:internal/modules/cjs/loader:1423
db-1          | 2025-12-15T14:50:04.494650Z 0 [System] [MY-010116] [Server] /usr/sbin/mysqld (mysqld 8.4.7) starting as process 1
app-1         |   throw err;
app-1         |   ^
db-1          | 2025-12-15T14:50:04.502471Z 1 [System] [MY-013576] [InnoDB] InnoDB initialization has started.
db-1          | 2025-12-15T14:50:05.153524Z 1 [System] [MY-013577] [InnoDB] InnoDB initialization has ended.
db-1          | 2025-12-15T14:50:05.334557Z 0 [System] [MY-010229] [Server] Starting XA crash recovery...
db-1          | 2025-12-15T14:50:05.347858Z 0 [System] [MY-010232] [Server] XA crash recovery finished.
app-1         |
db-1          | 2025-12-15T14:50:05.433938Z 0 [Warning] [MY-010068] [Server] CA certificate ca.pem is self signed.
db-1          | 2025-12-15T14:50:05.433988Z 0 [System] [MY-013602] [Server] Channel mysql_main configured to support TLS. Encrypted connections are now supported for this channel.
db-1          | 2025-12-15T14:50:05.437089Z 0 [Warning] [MY-011810] [Server] Insecure configuration for --pid-file: Location '/var/run/mysqld' in the path is accessible to all OS users. Consider choosing a different directory.
app-1         | Error: Cannot find module 'mysql2/promise'
app-1         | Require stack:
app-1         | - /app/src/app.js
db-1          | 2025-12-15T14:50:05.460104Z 0 [System] [MY-011323] [Server] X Plugin ready for connections. Bind-address: '::' port: 33060, socket: /var/run/mysqld/mysqlx.sock
db-1          | 2025-12-15T14:50:05.460334Z 0 [System] [MY-010931] [Server] /usr/sbin/mysqld: ready for connections. Version: '8.4.7'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server - GPL.
db-1          | 2025-12-15T14:50:33.558785Z 0 [System] [MY-013172] [Server] Received SHUTDOWN from user <via user signal>. Shutting down mysqld (Version: 8.4.7).
db-1          | 2025-12-15T14:50:34.828815Z 0 [System] [MY-010910] [Server] /usr/sbin/mysqld: Shutdown complete (mysqld 8.4.7)  MySQL Community Server - GPL.
db-1          | 2025-12-15T14:50:34.828856Z 0 [System] [MY-015016] [Server] MySQL Server - end.
db-1          | 2025-12-15 14:50:38+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 8.4.7-1.el9 started.
db-1          | 2025-12-15 14:50:38+00:00 [Note] [Entrypoint]: Switching to dedicated user 'mysql'
db-1          | 2025-12-15 14:50:38+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 8.4.7-1.el9 started.
db-1          | '/var/lib/mysql/mysql.sock' -> '/var/run/mysqld/mysqld.sock'
db-1          | 2025-12-15T14:50:38.960453Z 0 [System] [MY-015015] [Server] MySQL Server - start.
db-1          | 2025-12-15T14:50:39.199027Z 0 [System] [MY-010116] [Server] /usr/sbin/mysqld (mysqld 8.4.7) starting as process 1
app-1         |     at Module._resolveFilename (node:internal/modules/cjs/loader:1420:15)
app-1         |     at defaultResolveImpl (node:internal/modules/cjs/loader:1058:19)
db-1          | 2025-12-15T14:50:39.205724Z 1 [System] [MY-013576] [InnoDB] InnoDB initialization has started.
db-1          | 2025-12-15T14:50:39.506993Z 1 [System] [MY-013577] [InnoDB] InnoDB initialization has ended.
app-1         |     at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1063:22)
app-1         |     at Module._load (node:internal/modules/cjs/loader:1226:37)
app-1         |     at TracingChannel.traceSync (node:diagnostics_channel:328:14)
app-1         |     at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
app-1         |     at Module.require (node:internal/modules/cjs/loader:1503:12)
db-1          | 2025-12-15T14:50:39.768640Z 0 [Warning] [MY-010068] [Server] CA certificate ca.pem is self signed.
db-1          | 2025-12-15T14:50:39.768701Z 0 [System] [MY-013602] [Server] Channel mysql_main configured to support TLS. Encrypted connections are now supported for this channel.
db-1          | 2025-12-15T14:50:39.771296Z 0 [Warning] [MY-011810] [Server] Insecure configuration for --pid-file: Location '/var/run/mysqld' in the path is accessible to all OS users. Consider choosing a different directory.
app-1         |     at require (node:internal/modules/helpers:152:16)
db-1          | 2025-12-15T14:50:39.812086Z 0 [System] [MY-011323] [Server] X Plugin ready for connections. Bind-address: '::' port: 33060, socket: /var/run/mysqld/mysqlx.sock
app-1         |     at Object.<anonymous> (/app/src/app.js:2:15)
db-1          | 2025-12-15T14:50:39.812275Z 0 [System] [MY-010931] [Server] /usr/sbin/mysqld: ready for connections. Version: '8.4.7'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server - GPL.
app-1         |     at Module._compile (node:internal/modules/cjs/loader:1760:14) {
app-1         |   code: 'MODULE_NOT_FOUND',
app-1         |   requireStack: [ '/app/src/app.js' ]
app-1         | }
app-1         |
app-1         | Node.js v25.2.1
app-1         | [nodemon] app crashed - waiting for file changes before starting...
app-1         | npm error path /app
app-1         | npm error command failed
app-1         | npm error signal SIGTERM
app-1         | npm error command sh -c nodemon -L src/app.js
app-1         | npm error A complete log of this run can be found in: /root/.npm/_logs/2025-12-15T14_50_03_842Z-debug-0.log
app-1         |
app-1         | > Shitty webapp for B3 Dev TP1@1.0.0 dev
app-1         | > nodemon -L src/app.js
app-1         |
app-1         | [nodemon] 3.1.11
app-1         | [nodemon] to restart at any time, enter `rs`
app-1         | [nodemon] watching path(s): *.*
app-1         | [nodemon] watching extensions: js,mjs,cjs,json
app-1         | [nodemon] starting `node src/app.js`
app-1         | node:internal/modules/cjs/loader:1423
app-1         |   throw err;
app-1         |   ^
app-1         |
app-1         | Error: Cannot find module 'mysql2/promise'
app-1         | Require stack:
app-1         | - /app/src/app.js
app-1         |     at Module._resolveFilename (node:internal/modules/cjs/loader:1420:15)
app-1         |     at defaultResolveImpl (node:internal/modules/cjs/loader:1058:19)
app-1         |     at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1063:22)
app-1         |     at Module._load (node:internal/modules/cjs/loader:1226:37)
app-1         |     at TracingChannel.traceSync (node:diagnostics_channel:328:14)
app-1         |     at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
app-1         |     at Module.require (node:internal/modules/cjs/loader:1503:12)
app-1         |     at require (node:internal/modules/helpers:152:16)
app-1         |     at Object.<anonymous> (/app/src/app.js:2:15)
app-1         |     at Module._compile (node:internal/modules/cjs/loader:1760:14) {
app-1         |   code: 'MODULE_NOT_FOUND',
app-1         |   requireStack: [ '/app/src/app.js' ]
app-1         | }
app-1         |
app-1         | Node.js v25.2.1
app-1         | [nodemon] app crashed - waiting for file changes before starting...

PC@DESKTOP-TQF20R1 MINGW64 ~/Documents/tp_conteneur/part2/5 (main)
$ curl http://localhost:8080
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0


PC@DESKTOP-TQF20R1 MINGW64 ~/Documents/tp_conteneur/part2/5 (main)
$ curl http://localhost:3000
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0




C. Données persistantes


🌞 Mettre en place des données persistentes pour la db

services:
  db:
    image: mysql:8.4
    environment:
      - MYSQL_ROOT_PASSWORD=root
    volumes:
      - db_data:/var/lib/mysql

  phpmyadmin:
    image: phpmyadmin
    ports:
      - "8080:80"

  app: 
    image: shitty_app:1.0
    ports:
      - "3000:3000"
    volumes:
      - ./src:/app/src
    environment:
      - DB_HOST=db # en supposant que vous avez bien déclaré votre conteneur MySQL avec le nom "db"
      - DB_USER=root
      - DB_PASSWORD=root
      - DB_NAME=shitty_app_db
      - DB_PORT=3306
      - PORT=3000    

volumes:
  db_data:
   - "/my/own/datadir:/var/lib/mysql"