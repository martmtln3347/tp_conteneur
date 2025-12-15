
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

