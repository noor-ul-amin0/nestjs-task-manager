# Todo List/Task Management App

A full Todo List/Task Management application built with NestJS, PostgreSQL, passport, passport-jwt, jsonwebtoken, Sequelize, and Sequelize-cli.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Technologies Used](#technologies-used)
- [License](#license)

## Features

### Auth/User Module

- User signup with correct email and password
- Verification email sent with a JWT token (expires in 2 hours)
- User signin with verified credentials
- Forgot password functionality with password reset email
- User password reset

### TodoLists Module

- Each user can have only one todo list

### Tasks Module

- Tasks belong to a todo list
- CRUD operations for tasks
- Mark tasks as complete
- Get similar tasks (Two tasks A and B are considered similar if all the words in task A exist in task B or vice versa)
  - Note: A user can add a maximum of 50 tasks.

### Reports Module

- Generate reports with separate endpoints:
  - Count of total tasks, completed tasks, and remaining tasks
  - Average number of tasks completed per day since creation of account
  - Count of tasks which could not be completed on time
  - Since time of account creation, on what date maximum number of tasks were completed in a single day
  - Since time of account creation, how many tasks are opened on every day of the week (Mon, Tue, Wed, ...)

## Installation

1. Clone the repository.
2. Install the dependencies using the following command:

```bash
$ npm install
```

3. Set up the PostgreSQL database.
4. Configure the database connection in the `.env` file.
5. Run database migrations using the following command:

```bash
$ npm run db:migrate
```

6. Start the application using the following command:

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Technologies Used

- NestJS
- Nest CLI
- PostgreSQL
- Passport
- Passport-JWT
- JSON Web Tokens (JWT)
- Sequelize
- Sequelize-cli

## License

This project is licensed under the [MIT License](LICENSE).
