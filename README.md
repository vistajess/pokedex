# Angular(v13) Material Boilerplate

This boilerplate will help you to setup your angular application quickly and can start adding your components easily.


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.10.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.




# Angular 13 Dockerized Project

This guide explains how to build and run your Angular 13 project using Docker to ensure consistent environments and dependency management.

## Prerequisites
- [Docker](https://www.docker.com/) installed on your machine
- Docker Compose (optional, for managing multi-container setups)

## Building the Docker Image
To build the Docker image, run the following command:

```sh
docker build -t pokedex .
```

### Explanation
- `docker build` — Command to build the image
- `-t pokedex` — Assigns the tag `pokedex` to your image
- `.` — Refers to the current directory where the `Dockerfile` is located

## Running the Container
To start the Angular development server, run:

```sh
docker run -p 4200:4200 -v D:/Projects/pokedex:/app -v /app/node_modules --name pokedex-container --rm pokedex
```

### Explanation
- `docker run` — Command to run a container
- `-p 4200:4200` — Maps port 4200 in the container to port 4200 on your host machine
- `-v D:/Projects/pokedex:/app` — Mounts your local directory to the container's `/app` directory for hot-reloading support
- `-v /app/node_modules` — Ensures the container's `node_modules` is preserved, avoiding dependency issues
- `--name pokedex-container` — Assigns the container a custom name
- `--rm` — Automatically removes the container when it stops
- `pokedex` — Specifies the image to use

## Common Issues
### 1. **Port Already in Use**
If port 4200 is occupied, try changing the host port:
```sh
docker run -p 3000:4200 pokedex
```
Now, access the app at `http://localhost:3000`.

### 2. **Permission Issues on Unix Systems**
If you encounter permission errors, you may need to adjust your volume mount permissions:
```sh
docker run -it --user $(id -u):$(id -g) -v $(pwd):/app -p 4200:4200 pokedex
```

## Development Workflow
For efficient development:
- Mount your project folder with `-v` to enable live updates without rebuilding the container.
- Use `docker-compose` if you plan to extend this setup with other services (like Firebase, databases, etc.).

## Cleaning Up
To stop the running container:
```sh
docker ps # Find the container ID
docker stop <container_id>
```
To remove unused containers and images:
```sh
docker system prune -f
```

## Deployment
For production, consider adding:
- A multi-stage build for optimized images
- A dedicated `ng build` command for generating static assets
