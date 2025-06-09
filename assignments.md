## REST service: Containerization and Database (PostgreSQL) & ORM

## Basic Scope

# 2) Database (PostgreSQL) & ORM

- **+20** `Users` data is stored in **PostgreSQL** database and `typeorm` interacts with the database to manipulate data.  
- **+20** `Artists` data is stored in **PostgreSQL** database and `typeorm` interacts with the database to manipulate data.
- **+20** `Albums` data is stored in **PostgreSQL** database and `typeorm` interacts with the database to manipulate data.
- **+20** `Tracks` data is stored in **PostgreSQL** database and `typeorm` interacts with the database to manipulate data.
- **+20** `Favorites` data is stored in **PostgreSQL** database and `typeorm` interacts with the database to manipulate data.


# 2) Database & ORM

- **+30** Migrations are used to create database entities 
- **+10** Variables used for connection to database to be stored in `.env`
- **+10** `typeorm` [decorators](https://typeorm.io/#/relations) relations create relations between entities
- **+30** Local **PostgreSQL** installation is not required for task check, connection is implemented to database stored in `docker` container  (on the basis of the previous task)

## Forfeits

- **-20** In case specific image is not used (it is required to use images like `postgres` and `node`, but not `ubuntu` with installation of `node` or `postgres`)
- **-20** Postgres container is not configured as dependency for application container
- **-10** for each failing test with `npm run test` 
- **-20** `docker-compose.yml` contains hardcoded variables
- **-30% of total task score** Commits after deadline, except commits that affect only Readme.md, .gitignore, etc.
- **-40** No Pull Request created  
- **-20** PR description is incorrect
- **-40** No separate development branch
- **-20** Less than 3 commits in the development branch, not taking into account commits, making changes only in `Readme.md` or similar files (`tsconfig.json`, `.gitignore`, `.prettierrc.json`, etc.)
- **-10 points** for each error either on `npm run lint` on the basis of the **local config** or for compilation errors on the basis of the **local tsconfig** (`errors` not `warnings`).
