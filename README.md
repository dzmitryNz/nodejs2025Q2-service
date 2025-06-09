# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker and Docker Compose - [Download & Install Docker](https://docs.docker.com/get-docker/)

## Downloading

```
git clone {repository URL}
```

## Running application

1. Copy a `.env` file in the project root directory:

```bash
cp .env.examle .env
```

# Docker Instructions

## Creating and Running the Container

2. Build and run the containers:

```bash
docker-compose up --build
```

## Checking Container Size

To check the size of the built image:

```bash
docker images | grep nodejs2025q2-service
```
## Useful Commands

- Stop containers:

```bash
docker-compose down
```

- View running containers:

```bash
docker ps
```

````

### Manual Installation

1. Installing NPM modules:
```bash
npm install
````

2. Running application:

```bash
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Security

The project includes several npm scripts for security checks:

- Check for vulnerabilities:

```bash
npm run security:audit
```

- Fix vulnerabilities (safe mode):

```bash
npm run security:fix
```

- Force fix vulnerabilities (may include major updates):

```bash
npm run security:fix-force
```

- Check for vulnerabilities and outdated packages:

```bash
npm run security:check

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```

npm run test

```

To run only one of all test suites

```

npm run test -- <path to suite>

```

To run all test with authorization

```

npm run test:auth

```

To run only specific test suite with authorization

```

npm run test:auth -- <path to suite>

```

### Auto-fix and format

```

npm run lint

```

```

npm run format

```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
```
