# Quotes

[![Build Status](https://travis-ci.com/gary-lgy/cs3219-otot-task-b-backend.svg?branch=main)](https://travis-ci.com/gary-lgy/cs3219-otot-task-b-backend)
[![Coverage Status](https://coveralls.io/repos/github/gary-lgy/cs3219-otot-task-b-backend/badge.svg?branch=main)](https://coveralls.io/github/gary-lgy/cs3219-otot-task-b-backend?branch=main)

Quotes is a web app that allows users to view, create, edit, and delete quotes.

This is part of my submission for AY2020/21 Sem1 CS3219 "OTOT" Task B.

This repository contains:

- REST API
- ORM code to work with the database
- configurations for Travis CI/CD
- configurations for deploying to AWS Lambda

The frontend repository can be found [here](https://www.github.com/gary-lgy/cs3219-otot-task-b-frontend/).

## Development setup

### Clone the repository

```bash
git clone git@github.com:gary-lgy/cs3219-otot-task-b-backend.git
```

### Install dependencies

```bash
cd cs3219-otot-task-b-backend
npm install
```

### Start Postgres server

Install PostgreSQL server (tested to work on v12.4).

Start the Postgres server and create a database called `cs3219-otot-task-b-dev` (or any name you like).

Sample SQL command:

```sql
CREATE DATABASE cs3219-otot-task-b-dev;
```

### Configure the environment variables

First, create a `.env` file from the template.

```bash
cp .env.example .env
```

Then, modify `.env` to change the configuration options. In particular, you will need to change the development database URL.
Remember to use the database name that you created in the previous step.

### Build and run the project

```bash
npm run dev
```

This will let `nodemon` observe file changes and automatically recompile the server as you modify the files (live reload).

You might also be interested in other `npm` scripts. Take a look at `package.json`.
