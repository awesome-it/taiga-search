# Taiga Search

A simple dashboard for taiga providing you with:
- an overview of your tickets, watched tickets, the teams unassigned tickets and tickets with due date
- a simple text search in all tickets of all projects
- some filter options (mostly via search keywords)

Supports logging in to taiga via keycloak or the taiga api (configurable via `.env` file).

Taiga Search should be deployed on the same domain as taiga itself, as it assumes the taiga instance is at the same location.

## Getting Started

### Prerequisites

No matter how you deploy or develop taiga-search, you at least need to have a running taiga instance and
adapt the `.env` file to your setup. You can find an example `.env` file in the root directory of
the repository.

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

You should now be able to access the dashboard on http://100.64.0.2:5173