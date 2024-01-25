# Taiga Search

A simple dashboard for taiga providing you with:
- an overview of your tickets, watched tickets, the teams unassigned tickets and tickets with due date
- a simple text search in all tickets of all projects

## Getting Started

In order to use the taiga-search dashboard locally you have to build a docker dev-image and
start it with the following commands:
```bash
docker build --target dev -t taiga-search:dev .
docker run -p 5173:5173 --name taiga-search-dev -d taiga-search:dev
```
You should now be able to access the dashboard on http://100.64.0.2:5173
