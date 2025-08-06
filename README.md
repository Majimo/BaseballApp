# API de Gestion de Tournois de Baseball

Cette application est une API RESTful construite avec Deno et le framework Oak. Elle permet de gérer des tournois de baseball, incluant la création de tournois, la gestion des équipes et des joueurs, et la génération automatique de calendriers de matchs en round-robin.

L'application utilise Drizzle ORM pour l'interaction avec une base de données SQLite, et est entièrement dockerisée pour un déploiement et un partage faciles.

## Fonctionnalités

- **Gestion des Tournois :** CRUD complet pour les tournois.
- **Génération Automatique de Calendrier :** Crée automatiquement tous les matchs lors de la création d'un tournoi.
- **Gestion des Équipes et Joueurs :** Opérations CRUD pour les équipes et les joueurs.
- **Persistance des Données :** Utilise une base de données SQLite, avec un schéma portable vers PostgreSQL.
- **Documentation d'API :** Fournit une interface Swagger UI pour explorer et tester les endpoints.
- **Dockerisée :** Prête à être déployée et partagée avec Docker et Docker Compose.

## Prérequis

Pour lancer ce projet, vous avez deux options :

### Option 1 : Avec Docker (Recommandé)

C'est la méthode la plus simple. Vous n'avez **pas besoin d'installer Deno** sur votre machine.

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Option 2 : Développement Local (Sans Docker)

Si vous souhaitez développer directement sur votre machine, vous aurez besoin de :

- [Deno](https://deno.land/manual/getting_started/installation) (version 2.4.2 ou supérieure)

## Lancement avec Docker (Méthode Recommandée)

C'est la manière la plus simple et la plus fiable de lancer l'application, que ce soit pour le développement ou pour la production.

### 1. Construire et Lancer le Conteneur

À la racine du projet, exécutez la commande suivante. La première exécution peut prendre quelques minutes le temps de télécharger les images et de construire l'application.

```bash
docker-compose up --build
```

Cette commande va construire l'image Docker et démarrer le conteneur de l'API en arrière-plan.

### 2. Lancer les Migrations de la Base de Données

Avec le conteneur qui tourne, ouvrez un **second terminal** et exécutez la commande suivante pour initialiser le schéma de la base de données. **Vous ne devez faire cela que la première fois**, ou lorsque de nouvelles migrations sont ajoutées.

```bash
docker-compose exec api deno task migrate
```

### 3. Accéder à l'Application

Une fois les migrations terminées, l'application est prête !

- **API :** L'API est accessible à l'adresse `http://localhost:8000`.
- **Documentation Swagger UI :** Vous pouvez explorer et tester tous les endpoints via l'interface Swagger à l'adresse `http://localhost:8000/api-docs`.

### Arrêter l'Application

Pour arrêter le conteneur, retournez dans le premier terminal (où vous avez lancé `docker-compose up`) et appuyez sur `Ctrl + C`.

## Développement Local (Sans Docker)

Si vous préférez travailler sans Docker, vous pouvez lancer l'application directement avec Deno.

### 1. Générer les Migrations

Si vous avez modifié le schéma dans `api/db/schema.ts`, vous devez générer un nouveau fichier de migration SQL :

```bash
deno task drizzle:generate
```

### 2. Appliquer les Migrations

Pour appliquer les migrations à votre base de données locale (`baseball.db`) :

```bash
deno task migrate
```

### 3. Lancer le Serveur

Pour démarrer le serveur de l'API :

```bash
deno task start
```

L'API sera alors accessible à `http://localhost:8000`.

## Structure du Projet

```
.
├── api/
│   ├── controllers/    # Logique métier des endpoints
│   ├── db/
│   │   ├── migrations/ # Fichiers de migration SQL générés par Drizzle
│   │   ├── database.ts # Configuration de la connexion à la base de données
│   │   ├── migrate.ts  # Script pour exécuter les migrations
│   │   └── schema.ts   # Définition des tables de la base de données (schéma Drizzle)
│   ├── models/         # Interfaces TypeScript pour les objets de l'API
│   ├── routes/         # Définition des routes de l'API (endpoints)
│   ├── services/       # Logique de services (ex: génération de calendrier)
│   ├── main.ts         # Point d'entrée de l'application Deno
│   └── openapi.json    # Spécification OpenAPI pour Swagger
├── .dockerignore       # Fichiers à ignorer par Docker
├── .gitignore          # Fichiers à ignorer par Git
├── deno.json           # Fichier de configuration Deno (tâches, imports)
├── drizzle.config.ts   # Fichier de configuration pour Drizzle Kit
├── Dockerfile          # Instructions pour construire l'image Docker
└── docker-compose.yml  # Fichier pour orchestrer le conteneur Docker
```
