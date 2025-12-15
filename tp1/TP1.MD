🌞 Lancez un conteneur mysql en version 8.4 : 

PC@DESKTOP-TQF20R1 MINGW64 ~
$ docker run --name mysql mysql:8.4
Unable to find image 'mysql:8.4' locally
8.4: Pulling from library/mysql

🌞 Vérifier que le conteneur est actif :

$ docker ps -a
CONTAINER ID   IMAGE                             COMMAND                  CREATED                                       PORTS     NAMES
e479bcc6602b   mysql:8.4                         "docker-entrypoint.s…"   About a minute ago   (1) About a minute ago             mysql

🌞 Consulter les logs du conteneur : 

PC@DESKTOP-TQF20R1 MINGW64 ~
$ docker logs mysql
2025-12-15 09:31:48+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 8.4.7-1.el9 started.
2025-12-15 09:31:49+00:00 [Note] [Entrypoint]: Switching to dedicated user 'mysql'
2025-12-15 09:31:49+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 8.4.7-1.el9 started.
2025-12-15 09:31:49+00:00 [ERROR] [Entrypoint]: Database is uninitialized and password option is not specified
    You need to specify one of the following as an environment variable:
    - MYSQL_ROOT_PASSWORD
    - MYSQL_ALLOW_EMPTY_PASSWORD
    - MYSQL_RANDOM_ROOT_PASSWORD

🌞 Supprimer le conteneur inactif

$ docker rm mysql
mysql

🌞 Lancer un nouveau conteneur MySQL, vous devez définir un mot de passe pour l'utilisateur root du serveur MySQL

