# Taiga Search

A simple dashboard for taiga providing you with:
- an overview of
  - your tickets
  - watched tickets
  - the teams unassigned tickets
  - tickets with due date
  - -> each of these will display the ticket count and a diff to the last day the dashboard was opened (diff information is kept in local storage)
- a simple text search in all tickets of all projects
- persistent filters that can be set via a dialog
- non-persistent filters that can be applied directly via the text search (there is a list of available options in the filters dialog)

Supports logging in to taiga via keycloak or the taiga api (configurable via `.env` file).

Taiga Search should be deployed on the same domain as taiga itself, as it assumes the taiga instance is at the same location.

## Getting Started

### Prerequisites

No matter how you deploy or develop taiga-search, you at least need to have a running taiga instance and
a `.env` file matching your setup.  
You can find an `.env.example` file in the root directory of the repository.
Simply adapt it to your needs and rename it to `.env`.  
If you intend to run a development and production environment you can simply add a `.env.production` for your production setup.

### Using NPM

In order to use the taiga-search dashboard locally using npm, you need to install the dependencies
and start the dev server as follows:

```bash
npm install
npm run dev
```

### Using Docker

In order to use the taiga-search dashboard locally using Docker, you have to build a docker dev-image and
start it with the following commands:

```bash
docker build --target dev -t taiga-search:dev .
docker run -p 5173:5173 --name taiga-search-dev -d taiga-search:dev
```

You should now be able to access the dashboard on http://localhost:5173

A production image can be built and started with the following commands:

```bash
docker build --target prod -t taiga-search:prod .
docker run -p 5173:5173 --name taiga-search-prod -d taiga-search:prod
```